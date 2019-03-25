#!/bin/sh
npm i --prefix /app/client/src && npm run --prefix /app/client/src build && rm -rf /app/client/src && serverless deploy --stage=prod -v && serverless client deploy --no-confirm
echo "$@"