import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback} from 'aws-lambda'
import fetch, {Request, RequestInit, Response} from "node-fetch";
import {randomBytes, createHmac} from 'crypto'

import {getAPIurl} from './utils'
import * as AWS from "aws-sdk";
import {DynamoDB} from "aws-sdk";

const https = require('https');


// The shape of the token exchange response from Shopify
interface IShopifyTokenResponse {
    error?: string;
    errors?: string;
    error_description?: string;
    access_token?: string;
    scope?: string;
}

// Check that the shopDomain is a valid myshop.com domain. This is required by Shopify
function validateShopDomain(shopDomain: string): boolean {
    return shopDomain.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) !== null;
}

// Validate the HMAC parameter
function validateHMAC(params: any): boolean {
    const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;

    if (!shopifyApiSecret) {
        throw new Error("SHOPIFY_API_SECRET environment variable not set");
    }

    const p: Array<string> = [];

    Object.keys(params).forEach(key => {
        if (key !== "hmac") {
            p.push(key + "=" + params[key].toString());
        }
    });


    const message = p.sort().join("&");
    const digest = createHmac("SHA256", shopifyApiSecret).update(message).digest("hex");

    return (digest === params.hmac);
}

// Exchange the temporary code the permanent API token
async function exchangeToken(
    shop: string,
    code: string,
    fetch: (url: string | Request, init?: RequestInit) => Promise<Response>,
): Promise<IShopifyTokenResponse> {
    const body = JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
    });

    const url = `https://${shop}/admin/oauth/access_token`;

    const res = await fetch(url, {
        body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
    });

    const json = await res.json();

    if ("error_description" in json || "error" in json || "errors" in json) {
        throw new Error(json.error_description || json.error || json.errors);
    }

    return json;
}

async function getShopInformation(
    shop: string | null,
    code: string,
    fetch: (url: string | Request, init?: RequestInit) => Promise<Response>,
): Promise<IShopifyTokenResponse> {

    console.log(shop);
    const url = `https://${shop}/admin/shop.json`;

    const res = await fetch(url, {
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'X-Shopify-Access-Token' : code // access token
        },
        method: "GET",
    });

    const json = await res.json();
    console.log(res);

    if ("error_description" in json || "error" in json || "errors" in json) {
        throw new Error(json.error_description || json.error || json.errors);
    }

    return json;
}

// Exchange the temporary code the permanent API token
async function saveShopToken(
    shop: string | null,
    shopInfo: any,
    access_token: string,
): Promise<any> {

    let tableName = process.env.APP_NAME ? process.env.APP_NAME : '';

    const shopInfoData: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: tableName,
        Item: {
            shopId: shopInfo.shop.id.toString(),
            name: shopInfo.shop.name,
            email: shopInfo.shop.email,
            domain: shopInfo.shop.myshopify_domain,
            shopPlan: shopInfo.shop.plan_name,
            shopOwner: shopInfo.shop.shop_owner,
            shopCountry: shopInfo.shop.country_code,
            shopCity: shopInfo.shop.city,
            shopTimezone: shopInfo.shop.iana_timezone,
            fullDomain: shopInfo.shop.domain || shopInfo.shop.myshopify_domain,
            accessToken: access_token,
            createdAt: shopInfo.shop.created_at,
            registeredAt: new Date()
        }
    };

    const dynamo = new DynamoDB.DocumentClient();

    return await dynamo.put(shopInfoData).promise();
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {

    const shop = event.queryStringParameters ? event.queryStringParameters.shop : null;

    if (!event.queryStringParameters) {
        return {
            statusCode: 500,
            body: JSON.stringify(new Error("No query string paramters found"))
        };
    }

    if (!validateShopDomain(event.queryStringParameters.shop)
        || !validateHMAC(event.queryStringParameters)) {

        return {
            statusCode: 500,
            body: "'shop' parameter missing"
        };
    }
    //

    const resp = await exchangeToken(event.queryStringParameters.shop, event.queryStringParameters.code, fetch);
    const accessToken = resp.access_token;

    if (accessToken === undefined) {
        throw new Error("resp[\"access_token\"] is undefined");
    }

    const shopInfoResponse = await getShopInformation(shop, accessToken, fetch);
    await saveShopToken(shop, shopInfoResponse, accessToken);


    return {
        statusCode: 301,
        headers: {
            Location: `${getAPIurl(event.requestContext.apiId, process.env.AWS_REGION!, event.requestContext.stage)}/?shop=${event.queryStringParameters.shop}`
        },
        body: JSON.stringify(event.requestContext)
    };

}