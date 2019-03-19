package main

import (
	//"errors"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"log"
	"os"
//	"github.com/bold-commerce/go-shopify"
//	"github.com/aws/aws-sdk-go/aws/session"
//	"github.com/aws/aws-sdk-go/service/dynamodb"
//	"os"
)

type Shop struct {
	Id string `json:"id"`
}

func HandleLambdaEvent(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	fmt.Println("Headers:")
	for key, value := range request.Headers {
		fmt.Printf("    %s: %s\n", key, value)
	}

	fmt.Println("Headers:")
	for key, value := range request.Headers {
		fmt.Printf("    %s: %s\n", key, value)
	}

	// If param is passed, when app is installing
	hmac, ok := request.QueryStringParameters["hmac"]

	if ok {
		log.Println("Url Param 'key' is missing")
		return events.APIGatewayProxyResponse{
			StatusCode: 301,
			Headers: map[string]string{
				"Location": "https://wephsgf82d.execute-api.eu-west-1.amazonaws.com/prod/auth?shop=" + request.QueryStringParameters["shop"],
			},
		}, nil
	}

	fmt.Printf("%s", hmac)

	// If param is passed, when app is installing
	hmac2, ok := request.QueryStringParameters["hmac2"]

	if !ok {
		log.Println("Url Param 'key' is missing")
		return events.APIGatewayProxyResponse{Body: `{"json" : ` + os.Getenv("BASE_URL") + `|| ` + hmac2 + `}`, StatusCode: 200}, nil
	}

	return events.APIGatewayProxyResponse{Body: `{"json" : "xyi"}`, StatusCode: 200}, nil

	// ?hmac=3a3a10d7e60553962acf09fc2e8ff5e85fea0e8ae92c08273b380e8057658db9&shop=demo-r1.myshopify.com&timestamp=1553020462

	//
	//// Initialize a session in us-west-2 that the SDK will use to load
	//// credentials from the shared credentials file ~/.aws/credentials.
	//sess, err := session.NewSession(&aws.Config{
	//	Region: aws.String("us-west-2")},
	//)
	//
	//// Create DynamoDB client
	//svc := dynamodb.New(sess)
	//
	//result, err := svc.GetItem(&dynamodb.GetItemInput{
	//	TableName: aws.String("Movies"),
	//	Key: map[string]*dynamodb.AttributeValue{
	//		"id": {
	//			S: aws.String("The Big New Movie"),
	//		},
	//	},
	//})
	//
	//if err != nil {
	//	fmt.Println(err.Error())
	//	return
	//}
	//
	//item := Item{}
	//
	//err = dynamodbattribute.UnmarshalMap(result.Item, &item)
	//
	//if err != nil {
	//	panic(fmt.Sprintf("Failed to unmarshal Record, %v", err))
	//}
	//
	//if item.Title == "" {
	//	fmt.Println("Could not find 'The Big New Movie' (2015)")
	//	return
	//}
	//
	//fmt.Println("Found item:")
	//fmt.Println("Year:  ", item.Year)
	//fmt.Println("Title: ", item.Title)
	//fmt.Println("Plot:  ", item.Info.Plot)
	//fmt.Println("Rating:", item.Info.Rating)
	//
	//hmac := request.QueryStringParameters["hmac"]
	//id := request.QueryStringParameters["shop"]
	//timestamp := request.QueryStringParameters["timestamp"]
	//
	//fmt.Printf("The date is %s\n", hmac)
	//fmt.Printf("The date is %s\n", id)
	//fmt.Printf("The date is %s\n", timestamp)
	//fmt.Printf("The date is %s\n", os.Getenv("DYNAMODB_TABLE"))
	//
	//return events.APIGatewayProxyResponse{
	//	StatusCode: 301,
	//	Headers: map[string]string{
	//		"Location": "https://sl92kqr8sc.execute-api.eu-west-1.amazonaws.com/prod/auth",
	//	},
	//}, errors.New("something went wrong!")
}

func main() {
	lambda.Start(HandleLambdaEvent)
}