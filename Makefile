GO_PACKAGE_NAME=shopify_app

test:
	go test ./...

build-docker:
	docker build -t ${GO_PACKAGE_NAME}:latest .

deploy: build-docker
	docker run -it --rm -v ${HOME}/.aws/credentials:/root/.aws/credentials -v ${HOME}/.aws/config:/root/.aws/config ${GO_PACKAGE_NAME}:latest serverless deploy --stage=prod -v ; serverless client deploy --no-confirm

remove: build-docker
	docker run -it --rm -v ${HOME}/.aws/credentials:/root/.aws/credentials -v ${HOME}/.aws/config:/root/.aws/config ${GO_PACKAGE_NAME}:latest serverless remove --stage=prod -v

updatecode-dev-auth: build-docker
	docker run -it --rm -v ${HOME}/.aws/credentials:/root/.aws/credentials -v ${HOME}/.aws/config:/root/.aws/config ${GO_PACKAGE_NAME}:latest serverless deploy function --function auth --stage=dev -v
