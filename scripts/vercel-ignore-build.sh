#!/usr/bin/env bash

echo "VERCEL_ENV: ${VERCEL_ENV}"
echo "VERCEL_GIT_COMMIT_REF: ${VERCEL_GIT_COMMIT_REF}"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" ]]; then
  echo "✅ Build allowed for branch: $VERCEL_GIT_COMMIT_REF"
  exit 1
fi

echo "🛑 Build ignored for branch: $VERCEL_GIT_COMMIT_REF"
exit 0
