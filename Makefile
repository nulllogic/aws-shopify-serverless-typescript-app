.PHONY: help build

help:
	@echo "help"
	@echo "build - build the docker environment"
	@echo "install - build the docker environment"

build:
	@read -p "Enter application name:" application; \
	bucket=shopify$$(date +'%Y%m%d-%H%M%S') && \
	aws cloudformation package --template-file ./templates/template.yml --s3-bucket test-bucket-name --output-template-file packaged.yml
# 	aws cloudformation deploy --template ./packaged.yml --stack-name $$application && \
# 	aws s3 rb s3://$$bucket --force && \
# 	rm -rf ./packaged.yml

validate:


delete:
	@read -p "Enter application name:" application; \
	aws cloudformation delete-stack --stack-name $$application
