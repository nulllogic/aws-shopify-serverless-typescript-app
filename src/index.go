package main

import (
	"errors"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
//	"github.com/bold-commerce/go-shopify"
//	"github.com/aws/aws-sdk-go/aws/session"
//	"github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// ?hmac=3a3a10d7e60553962acf09fc2e8ff5e85fea0e8ae92c08273b380e8057658db9&shop=demo-r1.myshopify.com&timestamp=1553020462

	hmac := request.QueryStringParameters["hmac"]
	id := request.QueryStringParameters["shop"]
	timestamp := request.QueryStringParameters["timestamp"]

	fmt.Printf("The date is %s\n", hmac)
	fmt.Printf("The date is %s\n", id)
	fmt.Printf("The date is %s\n", timestamp)
	fmt.Printf("The date is %s\n", os.Getenv("DYNAMODB_TABLE"))

	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": "https://sl92kqr8sc.execute-api.eu-west-1.amazonaws.com/prod/auth",
		},
	}, errors.New("something went wrong!")
}

func main() {
	lambda.Start(HandleLambdaEvent)
}