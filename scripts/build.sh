#!/usr/bin/env bash
set -euox pipefail

npm install
npm run build:prod

ls -l dist