#!/bin/sh
serverless client deploy --no-confirm && serverless deploy --stage=prod -v
echo "$@"