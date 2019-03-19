package main

import (
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/bold-commerce/go-shopify"
	"os"
)

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	app := goshopify.App {
		ApiKey:      os.Getenv("SHOPIFY_API_KEY"),
		ApiSecret:   os.Getenv("SHOPIFY_API_SECRET_KEY"),
		RedirectUrl: fmt.Sprintf("%s/%s", os.Getenv("BASE_URL"), "auth/callback"),
		Scope:       os.Getenv("SHOPIFY_SCOPE"),
	}

	shopName := request.QueryStringParameters["shop"]
	authUrl := app.AuthorizeUrl(shopName, "state")

	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": authUrl,
		},
	}, nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}