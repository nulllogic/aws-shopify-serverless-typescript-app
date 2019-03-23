package main

import (
	"os"

	//"fmt"
	//"errors"
	//"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	//"log"
	//"os"

//	"github.com/bold-commerce/go-shopify"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
//	"os"
)

type ShopInfo struct {
	Token string`json:"token"`
}

type Shop struct {
	ShopID string`json:"shopid"`
	Info ShopInfo`json:"info"`
}

func getApiUrl(id string, location string, stage string) (string) {
	return "https://" + id + ".execute-api." + location + ".amazonaws.com/" + stage
}

func getShop(shopURL string) (Shop, error) {
	var shop Shop

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-west-1")},
	)

	// Create DynamoDB client
	svc := dynamodb.New(sess)

	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(os.Getenv("DYNAMODB_TABLE")),
		Key: map[string]*dynamodb.AttributeValue{
			"shopid": {
				S: aws.String(shopURL),
			},
		},
	})

	err = dynamodbattribute.UnmarshalMap(result.Item, &shop)

	return shop, err
}

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	url := getApiUrl(request.RequestContext.APIID, os.Getenv("AWS_REGION"), request.RequestContext.Stage)

	shop, err := getShop(request.QueryStringParameters["shop"])

	// If ShopId not exist in database
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Body: "Database error",
		}, nil
	}

	// If shop is empty
	if (( Shop{}) == shop && request.QueryStringParameters["hmac2"] == "" ){

		return events.APIGatewayProxyResponse{
			StatusCode: 301,
			Headers: map[string]string{
				"Location": url + "/auth?shop=" + request.QueryStringParameters["shop"],
			},
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body: "<h1>gg</h1>",
	}, nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}