"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const utils_1 = require("./utils");
exports.handler = async (event, context, callback) => {
    const shopifyApiKey = process.env.SHOPIFY_API_KEY;
    const shopifyScope = process.env.SHOPIFY_SCOPE;
    if (!shopifyApiKey) {
        callback(new Error("SHOPIFY_API_KEY environment variable not set"));
    }
    if (!shopifyScope) {
        callback(new Error("SHOPIFY_SCOPE environment variable not set"));
    }
    const shop = event.queryStringParameters ? event.queryStringParameters.shop : null;
    const nonce = Math.random().toString(36).slice(-10);
    return {
        statusCode: 301,
        headers: {
            "Location": `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPE}&redirect_uri=${utils_1.getAPIurl(event.requestContext.apiId, process.env.AWS_REGION, event.requestContext.stage)}/auth/callback&state=${nonce}`
        },
        body: ""
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFpQztBQUVwQixRQUFBLE9BQU8sR0FBWSxLQUFLLEVBQUUsS0FBMkIsRUFBRSxPQUFnQixFQUFFLFFBQWtCLEVBQWtDLEVBQUU7SUFFeEksTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7SUFDbEQsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFFL0MsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNoQixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFO0lBRUQsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUNmLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7S0FDckU7SUFFRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNuRixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTVELE9BQU87UUFDSCxVQUFVLEVBQUUsR0FBRztRQUNmLE9BQU8sRUFBRTtZQUNMLFVBQVUsRUFBRSxXQUFXLElBQUksb0NBQW9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxVQUFVLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxpQkFBaUIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVcsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsS0FBSyxFQUFFO1NBQzFRO1FBQ0QsSUFBSSxFQUFFLEVBQUU7S0FDWCxDQUFDO0FBR04sQ0FBQyxDQUFBIn0=