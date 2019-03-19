FROM golang:1.10.1 as golang_build

RUN go get github.com/aws/aws-lambda-go/lambda \
    && go get github.com/aws/aws-lambda-go/events \
    && go get github.com/aws/aws-sdk-go \
    && go get github.com/aws/aws-sdk-go/aws \
    && go get github.com/aws/aws-sdk-go/aws/session \
    && go get github.com/aws/aws-sdk-go/service/dynamodb \
    && go get github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute \
    && go get github.com/tkeech1/golambda_helper \
    && go get github.com/tkeech1/goshopify

COPY install/oauth_install.go install/handler_types.go ./install/
COPY callback/oauth_callback.go callback/handler_types.go ./callback/
RUN env GOOS=linux go build -ldflags="-s -w" -o bin/oauth_install install/oauth_install.go install/handler_types.go
RUN env GOOS=linux go build -ldflags="-s -w" -o bin/oauth_callback callback/oauth_callback.go callback/handler_types.go

#--------------------------------

FROM node:9.11.1-alpine as serverless

RUN npm install -g serverless --unsafe-perm=true
RUN mkdir /app
WORKDIR /app
COPY --from=golang_build /go/bin/oauth_install .
COPY --from=golang_build /go/bin/oauth_callback .
COPY serverless.yml .