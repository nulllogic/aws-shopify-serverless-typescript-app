package main

import (
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/bold-commerce/go-shopify"
	"os"
)

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	app := goshopify.App {
		ApiKey:      os.Getenv("SHOPIFY_API_KEY"),
		ApiSecret:   os.Getenv("SHOPIFY_API_SECRET_KEY"),
		RedirectUrl: "https://sl92kqr8sc.execute-api.eu-west-1.amazonaws.com/prod/auth/callback",
		Scope:       os.Getenv("SHOPIFY_SCOPE"),
	}

	shopName := request.QueryStringParameters["shop"]
	authUrl := app.AuthorizeUrl(shopName, "state")

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