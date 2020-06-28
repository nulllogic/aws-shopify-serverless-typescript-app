#!/bin/bash
set -e

cd ./front
npm run build
cd ..
cd ./back
npm run build
cd ..
./node_modules/serverless/bin/serverless.js client deploy --no-confirm && ./node_modules/serverless/bin/serverless.js deploy -v