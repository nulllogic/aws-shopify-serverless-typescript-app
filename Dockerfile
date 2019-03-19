FROM golang:latest as golang_build

RUN go get github.com/aws/aws-lambda-go/lambda \
    && go get github.com/aws/aws-lambda-go/events \
    && go get github.com/aws/aws-sdk-go \
    && go get github.com/aws/aws-sdk-go/aws \
    && go get github.com/aws/aws-sdk-go/aws/session \
    && go get github.com/aws/aws-sdk-go/service/dynamodb \
    && go get github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute \
    && go get github.com/bold-commerce/go-shopify

COPY src/index.go ./src/
COPY src/auth.go ./src/
COPY src/auth_callback.go ./src/

RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/index src/index.go
RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/auth src/auth.go
RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/auth_callback src/auth_callback.go

#--------------------------------

FROM node:latest as serverless

RUN npm install -g serverless --unsafe-perm=true
RUN mkdir /app
WORKDIR /app

COPY --from=golang_build /go/bin/index .
COPY --from=golang_build /go/bin/auth .
COPY --from=golang_build /go/bin/auth_callback .

COPY serverless.yml .