#!/usr/bin/env bash
set -euo pipefail

aws s3 sync --acl public-read --delete "dist" "s3://${DEPLOY_BUCKET}" 
aws s3 cp --cache-control 'no-cache' --acl public-read "dist/index.html" "s3://${DEPLOY_BUCKET}"
