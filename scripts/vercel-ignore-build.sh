#!/usr/bin/env bash

echo "VERCEL_ENV: ${VERCEL_ENV}"
echo "VERCEL_GIT_COMMIT_REF: ${VERCEL_GIT_COMMIT_REF}"

if [[ "$VERCEL_ENV" == "production" && "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  echo "✅ Production build allowed for branch: main"
  exit 1
fi

if [[ "$VERCEL_ENV" == "preview" && "$VERCEL_GIT_COMMIT_REF" == "staging" ]]; then
  echo "✅ Preview build allowed for branch: staging"
  exit 1
fi

echo "🛑 Build ignored for env=${VERCEL_ENV}, branch=${VERCEL_GIT_COMMIT_REF}"
exit 0
