package main

import (
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/bold-commerce/go-shopify"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

var db = dynamodb.New(session.New(), aws.NewConfig().WithRegion("eu-west-1"))

func get_shop(isbn string) (*book, error) {

	input := &dynamodb.GetItemInput{
		TableName: aws.String(os.Getenv("DYNAMODB_TABLE")),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(isbn),
			},
		},
	}

	result, err := db.GetItem(input)
	if err != nil {
		return nil, err
	}
	if result.Item == nil {
		return nil, nil
	}

	bk := new(book)
	err = dynamodbattribute.UnmarshalMap(result.Item, bk)
	if err != nil {
		return nil, err
	}

	return bk, nil
}

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// ?hmac=3a3a10d7e60553962acf09fc2e8ff5e85fea0e8ae92c08273b380e8057658db9&shop=demo-r1.myshopify.com&timestamp=1553020462

	hmac := request.QueryStringParameters["hmac"]
	id := request.QueryStringParameters["shop"]
	timestamp := request.QueryStringParameters["timestamp"]



	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": authUrl,
		},
	}, errors.New("something went wrong!")
}

func main() {
	lambda.Start(HandleLambdaEvent)
}