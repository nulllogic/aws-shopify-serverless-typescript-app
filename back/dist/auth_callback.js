"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
const aws_sdk_1 = require("aws-sdk");
const https = require('https');
// Check that the shopDomain is a valid myshop.com domain. This is required by Shopify
function validateShopDomain(shopDomain) {
    return shopDomain.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) !== null;
}
// Validate the HMAC parameter
function validateHMAC(params) {
    const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;
    if (!shopifyApiSecret) {
        throw new Error("SHOPIFY_API_SECRET environment variable not set");
    }
    const p = [];
    Object.keys(params).forEach(key => {
        if (key !== "hmac") {
            p.push(key + "=" + params[key].toString());
        }
    });
    const message = p.sort().join("&");
    const digest = crypto_1.createHmac("SHA256", shopifyApiSecret).update(message).digest("hex");
    return (digest === params.hmac);
}
// Exchange the temporary code the permanent API token
async function exchangeToken(shop, code, fetch) {
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
async function getShopInformation(shop, code, fetch) {
    console.log(shop);
    const url = `https://${shop}/admin/shop.json`;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': code // access token
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
async function saveShopToken(shop, shopInfo, access_token) {
    let tableName = process.env.APP_NAME ? process.env.APP_NAME : '';
    const shopInfoData = {
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
    const dynamo = new aws_sdk_1.DynamoDB.DocumentClient();
    return await dynamo.put(shopInfoData).promise();
}
exports.handler = async (event, context, callback) => {
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
    const resp = await exchangeToken(event.queryStringParameters.shop, event.queryStringParameters.code, node_fetch_1.default);
    const accessToken = resp.access_token;
    if (accessToken === undefined) {
        throw new Error("resp[\"access_token\"] is undefined");
    }
    const shopInfoResponse = await getShopInformation(shop, accessToken, node_fetch_1.default);
    await saveShopToken(shop, shopInfoResponse, accessToken);
    return {
        statusCode: 301,
        headers: {
            Location: `${utils_1.getAPIurl(event.requestContext.apiId, process.env.AWS_REGION, event.requestContext.stage)}/?shop=${event.queryStringParameters.shop}`
        },
        body: JSON.stringify(event.requestContext)
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aF9jYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRoX2NhbGxiYWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDREQUFpRTtBQUNqRSxtQ0FBOEM7QUFFOUMsbUNBQWlDO0FBRWpDLHFDQUFpQztBQUVqQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFZL0Isc0ZBQXNGO0FBQ3RGLFNBQVMsa0JBQWtCLENBQUMsVUFBa0I7SUFDMUMsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLEtBQUssSUFBSSxDQUFDO0FBQzVFLENBQUM7QUFFRCw4QkFBOEI7QUFDOUIsU0FBUyxZQUFZLENBQUMsTUFBVztJQUM3QixNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7SUFFeEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztLQUN0RTtJQUVELE1BQU0sQ0FBQyxHQUFrQixFQUFFLENBQUM7SUFFNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUIsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO1lBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUM5QztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBR0gsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxNQUFNLE1BQU0sR0FBRyxtQkFBVSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxN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