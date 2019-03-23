package main

import (
	//"errors"
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

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// Initialize a session in us-west-2 that the SDK will use to load
	// credentials from the shared credentials file ~/.aws/credentials.
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-west-1")},
	)

	// Create DynamoDB client
	svc := dynamodb.New(sess)

	item := Shop{
		ShopID: request.QueryStringParameters["shop"],
	}

	av, err := dynamodbattribute.MarshalMap(item)

	if err != nil {
		fmt.Println("Got error marshalling map:")
		fmt.Println(err.Error())
		return events.APIGatewayProxyResponse{}, err
	}

	input := &dynamodb.DeleteItemInput{
		Key:       av,
		TableName: aws.String(os.Getenv("DYNAMODB_TABLE")),
	}

	_, err = svc.DeleteItem(input)
	if err != nil {
		fmt.Println("Got error calling DeleteItem")
		fmt.Println(err.Error())
		return events.APIGatewayProxyResponse{}, err
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(""),
	}, nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}
