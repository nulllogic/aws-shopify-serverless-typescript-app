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
COPY src/uninstall.go ./src/

RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/index src/index.go
RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/auth src/auth.go
RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/auth_callback src/auth_callback.go

# Webhooks
RUN env GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o bin/uninstall src/uninstall.go

#--------------------------------

FROM node:latest as serverless

RUN npm install -g serverless --unsafe-perm=true
RUN npm install serverless-finch --unsafe-perm=true

RUN mkdir /app
WORKDIR /app

COPY --from=golang_build /go/bin/index .
COPY --from=golang_build /go/bin/auth .
COPY --from=golang_build /go/bin/auth_callback .
COPY --from=golang_build /go/bin/uninstall ./webhooks/uninstall

ADD client ./client
COPY serverless.yml .

ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]