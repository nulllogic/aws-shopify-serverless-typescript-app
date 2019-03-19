package main

import (
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	//"github.com/bold-commerce/go-shopify"
	//"os"
)

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": "https://wephsgf82d.execute-api.eu-west-1.amazonaws.com/prod/?hmac2=test",
		},
	}, errors.New("something went wrong!")
}

func main() {
	lambda.Start(HandleLambdaEvent)
}