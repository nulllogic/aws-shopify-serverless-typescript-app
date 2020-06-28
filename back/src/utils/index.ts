import * as AWS from "aws-sdk";
import {DynamoDB} from "aws-sdk";

export const getAPIurl = (id: string, location: string, stage: string): string => {
    return "https://" + id + ".execute-api." + location + ".amazonaws.com/" + stage
};


/**
 This file is responsible for handling Lambda event at AWS, when user would like to install Shopify App.
 If we have token inside DynamoDB, then it will redirect to S3 bucket with code, otherwise it will redirect to next /auth Lambda event
 */

// Exchange the temporary code the permanent API token
export const getShopToken = async (
    shop: string | null,
): Promise<any> => {

    let tableName = process.env.APP_NAME ? process.env.APP_NAME : '';

    const shopInfo: AWS.DynamoDB.DocumentClient.QueryInput = {
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

    const dynamo = new DynamoDB.DocumentClient();
    return await dynamo.query(shopInfo).promise();
}