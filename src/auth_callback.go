package main

import (
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"os"
)

type ShopInfo struct {
	Token string `json:"token"`
}

type Shop struct {
	ShopID string   `json:"shopid"`
	Info   ShopInfo `json:"info"`
}

func GetFuncURL(funcName string) string {
	return fmt.Sprintf("%s/%s", os.Getenv("BASE_URL"), funcName)
}

func installWebhook(client *goshopify.Client, url string, shop string) error {

	webhooks := []*goshopify.Webhook{
		{
			Topic:   "app/uninstalled",
			Format:  "json",
			Address: url + "/webhooks/uninstall?shop=" + shop,
		},
	}
	for _, webhook := range webhooks {
		if _, err := client.Webhook.Create(*webhook); err != nil {
			return err
		}
	}

	return nil
}

func getApiUrl(id string, location string, stage string) (string) {
	return "https://" + id + ".execute-api." + location + ".amazonaws.com/" + stage
}

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	url := getApiUrl(request.RequestContext.APIID, os.Getenv("AWS_REGION"), request.RequestContext.Stage)

	app := goshopify.App{
		ApiKey:      os.Getenv("SHOPIFY_API_KEY"),
		ApiSecret:   os.Getenv("SHOPIFY_API_SECRET"),
		RedirectUrl: url + "/?shop=" + request.QueryStringParameters["shop"],
		Scope:       os.Getenv("SHOPIFY_SCOPE"),
	}

	// get access token
	shopName := request.QueryStringParameters["shop"]
	code := request.QueryStringParameters["code"]

	shopifyAccessToken, err := app.GetAccessToken(shopName, code)

	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	// Initialize a session in us-west-2 that the SDK will use to load
	// credentials from the shared credentials file ~/.aws/credentials.
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION"))},
	)

	// Create DynamoDB client
	svc := dynamodb.New(sess)

	info := ShopInfo{
		Token: shopifyAccessToken,
	}

	item := Shop{
		ShopID: request.QueryStringParameters["shop"],
		Info:   info,
	}

	av, err := dynamodbattribute.MarshalMap(item)

	if err != nil {
		fmt.Println("Got error marshalling map:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	// Create item in table Movies
	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(os.Getenv("DYNAMODB_TABLE")),
	}

	_, err = svc.PutItem(input)

	if err != nil {
		fmt.Println("Got error calling PutItem:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	// create client
	client := goshopify.NewClient(app, shopName, shopifyAccessToken)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	// install webhook
	if err := installWebhook(client, url, request.QueryStringParameters["shop"]); err != nil && err.Error() != "address: for this topic has already been taken" {
		return events.APIGatewayProxyResponse{}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 301,
		Headers: map[string]string{
			"Location": url + "/?hmac2=123",
		},
	}, nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}
