import {APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context, Handler} from "aws-lambda";
import {randomBytes, createHmac} from 'crypto'
import {getAPIurl} from './utils'

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {

    const shopifyApiKey = process.env.SHOPIFY_API_KEY;
    const shopifyScope = process.env.SHOPIFY_SCOPE;

    if (!shopifyApiKey) {
        callback(new Error("SHOPIFY_API_KEY environment variable not set"));
    }

    if (!shopifyScope) {
        callback(new Error("SHOPIFY_SCOPE environment variable not set"));
    }

    const shop = event.queryStringParameters ? event.queryStringParameters.shop : null;
    const nonce: string = Math.random().toString(36).slice(-10);

    return {
        statusCode: 301,
        headers: {
            "Location": `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPE}&redirect_uri=${getAPIurl(event.requestContext.apiId, process.env.AWS_REGION!, event.requestContext.stage)}/auth/callback&state=${nonce}`
        },
        body: ""
    };


}