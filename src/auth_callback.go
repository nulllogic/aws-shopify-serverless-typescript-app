package main

import (
	"errors"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"os"

	//"github.com/bold-commerce/go-shopify"
	//"os"
)

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	app := goshopify.App{
		ApiKey:      os.Getenv("SHOPIFY_API_KEY"),
		ApiSecret:   os.Getenv("SHOPIFY_API_SECRET_KEY"),
		RedirectUrl: "https://wephsgf82d.execute-api.eu-west-1.amazonaws.com/prod/auth/callback",
		Scope:       os.Getenv("SHOPIFY_SCOPE"),
	}

	shopName := request.QueryStringParameters["shop"]
	code := request.QueryStringParameters["code"]
	authUrl := app.AuthorizeUrl(shopName, "state")

	if err := verifyRequest(request, app); err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

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