package main

import (
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/bold-commerce/go-shopify"
	"os"
)

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	app := goshopify.App{
		ApiKey:      os.Getenv("SHOPIFY_API_KEY"),
		ApiSecret:   os.Getenv("SHOPIFY_API_SECRET_KEY"),
		RedirectUrl: "https://wephsgf82d.execute-api.eu-west-1.amazonaws.com/prod/auth/callback",
		Scope:       os.Getenv("SHOPIFY_SCOPE"),
	}

	shopName := request.QueryStringParameters["shop"]
	authUrl := app.AuthorizeUrl(shopName, "state")

	fmt.Printf("xyi %s", os.Getenv("SHOPIFY_API_KEY"))
	fmt.Printf("pizda %s", shopName)
	fmt.Printf("pizdec %s", os.Getenv("SHOPIFY_API_SECRET"))
	fmt.Printf("oxyet %s", os.Getenv("SHOPIFY_SCOPE"))
	fmt.Printf("\nurl %s", authUrl)

	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": authUrl,
		},
	}, nil // here should be nil, so it will process to another step in Shopify app install
}

func main() {
	lambda.Start(HandleLambdaEvent)
}
