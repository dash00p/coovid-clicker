#!/usr/bin/env bash
set -euo pipefail

aws s3 sync --delete "dist" "s3://${DEPLOY_BUCKET}" 
aws s3 cp --cache-control 'no-cache' "dist/index.html" "s3://${DEPLOY_BUCKET}"
aws cloudfront create-invalidation --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" --paths '/*'
