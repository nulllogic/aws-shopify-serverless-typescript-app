import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback} from 'aws-lambda'
import {createHmac} from 'crypto'
import {DynamoDB} from 'aws-sdk'

import {getAPIurl} from './utils'
import * as AWS from "aws-sdk";

// Exchange the temporary code the permanent API token
async function getShopToken(
    shop: string | null,
): Promise<any> {

    let tableName = process.env.APP_NAME ? process.env.APP_NAME : '';

    const shopInfo: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: "domain-index",
        KeyConditionExpression: "#domain = :domain",
        ExpressionAttributeNames:{
            "#domain": "domain"
        },
        ExpressionAttributeValues: {
            ":domain": shop
        },
        Limit: 1
    };

    const dynamo = new DynamoDB.DocumentClient();
    return await dynamo.query(shopInfo).promise();
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {

    const _app = process.env.APP_NAME ? process.env.APP_NAME : '';

    if (!event.queryStringParameters) {
        return {
            statusCode: 500,
            body: JSON.stringify(new Error("No query string paramters found"))
        };
    }

    const shop = event.queryStringParameters ? event.queryStringParameters.shop : null;

    if (shop === null) {
        return {
            statusCode: 500,
            body: JSON.stringify(new Error("shop' parameter missing"))
        };
    }

    if (!shop.match(/[a-z0-9][a-z0-9\-]*\.myshopify\.com/i)) {
        return {
            statusCode: 500,
            body: JSON.stringify(new Error("'shop' parameter must end with .myshopify.com and may only contain a-z, 0-9, - and ."))
        };
    }

    const result = await getShopToken(shop);

    if(result.Count > 0) {

        let token = result.Items[0].accessToken;

        // Do to S3 endpoint
        return {
            statusCode: 200,
            body: "hjgjhjgghj"
        };

    } else {

        // Do redirect to authentication endpoint
        return {
            statusCode: 301,
            headers: {
                Location: `${getAPIurl(event.requestContext.apiId, process.env.AWS_REGION!, event.requestContext.stage)}/auth?shop=${shop}`
            },
            body: ""
        };
    }
}