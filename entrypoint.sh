#!/bin/sh
serverless deploy --stage=prod -v && serverless client deploy --no-confirm
echo "$@"