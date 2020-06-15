"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const utils_1 = require("./utils");
// Exchange the temporary code the permanent API token
async function getShopToken(shop) {
    let tableName = process.env.APP_NAME ? process.env.APP_NAME : '';
    const shopInfo = {
        TableName: tableName,
        IndexName: "domain-index",
        KeyConditionExpression: "#domain = :domain",
        ExpressionAttributeNames: {
            "#domain": "domain"
        },
        ExpressionAttributeValues: {
            ":domain": shop
        },
        Limit: 1
    };
    const dynamo = new aws_sdk_1.DynamoDB.DocumentClient();
    return await dynamo.query(shopInfo).promise();
}
exports.handler = async (event, context, callback) => {
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
    if (result.Count > 0) {
        let token = result.Items[0].accessToken;
        //Redirect to shop app
        return {
            statusCode: 301,
            headers: {
                Location: `https://${shop}/admin/apps/${_app}`
            },
            body: ""
        };
    }
    else {
        // Do redirect to authentication endpoint
        return {
            statusCode: 301,
            headers: {
                Location: `${utils_1.getAPIurl(event.requestContext.apiId, process.env.AWS_REGION, event.requestContext.stage)}/auth?shop=${shop}`
            },
            body: ""
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEscUNBQWdDO0FBRWhDLG1DQUFpQztBQUdqQyxzREFBc0Q7QUFDdEQsS0FBSyxVQUFVLFlBQVksQ0FDdkIsSUFBbUI7SUFHbkIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFakUsTUFBTSxRQUFRLEdBQTJDO1FBQ3JELFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFNBQVMsRUFBRSxjQUFjO1FBQ3pCLHNCQUFzQixFQUFFLG1CQUFtQjtRQUMzQyx3QkFBd0IsRUFBRTtZQUN0QixTQUFTLEVBQUUsUUFBUTtTQUN0QjtRQUNELHlCQUF5QixFQUFFO1lBQ3ZCLFNBQVMsRUFBRSxJQUFJO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLENBQUM7S0FDWCxDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQkFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzdDLE9BQU8sTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xELENBQUM7QUFFWSxRQUFBLE9BQU8sR0FBWSxLQUFLLEVBQUUsS0FBMkIsRUFBRSxPQUFnQixFQUFFLFFBQWtCLEVBQWtDLEVBQUU7SUFFeEksTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFOUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3JFLENBQUM7S0FDTDtJQUVELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRW5GLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtRQUNmLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDN0QsQ0FBQztLQUNMO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsRUFBRTtRQUNyRCxPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxzRkFBc0YsQ0FBQyxDQUFDO1NBQzFILENBQUM7S0FDTDtJQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhDLElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7UUFFbEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFFeEMsc0JBQXNCO1FBQ3RCLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUUsV0FBVyxJQUFJLGVBQWUsSUFBSSxFQUFFO2FBQ2pEO1lBQ0QsSUFBSSxFQUFFLEVBQUU7U0FDWCxDQUFDO0tBRUw7U0FBTTtRQUVILHlDQUF5QztRQUN6QyxPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLEdBQUcsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVcsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksRUFBRTthQUM5SDtZQUNELElBQUksRUFBRSxFQUFFO1NBQ1gsQ0FBQztLQUNMO0FBQ0wsQ0FBQyxDQUFBIn0=