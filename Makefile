.PHONY: help build

help:
	@echo "help"
	@echo "build"
build:
	@read -p "Enter application ame:" application; \
	aws cloudformation deploy --template template.yml --stack-name $$application
