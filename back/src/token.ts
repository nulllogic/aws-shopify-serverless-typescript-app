import {Handler, APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback} from 'aws-lambda'

import {getAPIurl, getShopToken} from './utils'

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {

    const _app = process.env.APP_NAME ? process.env.APP_NAME : '';


    if (event.body) {
        let body = JSON.parse(event.body)

        const shop = body.shop ? body.shop : null;

        if (shop !== null) {
            const result = await getShopToken(shop);

            if (result.Count > 0) {

                let token = result.Items[0].accessToken;

                // Get shop token
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({
                        redirect: false,
                        token: result.Items[0].accessToken
                    })
                };

            }
        }
    }

    // Redirect to Shopify App authorization
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            redirect: true
        })
    };

}