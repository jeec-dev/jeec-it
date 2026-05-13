#!/usr/bin/env bash

set -euo pipefail

echo "VERCEL_ENV=${VERCEL_ENV:-}"
echo "VERCEL_GIT_COMMIT_REF=${VERCEL_GIT_COMMIT_REF:-}"

if [ "${VERCEL_GIT_COMMIT_REF:-}" = "main" ]; then
  echo "✅ Build allowed for main"
  exit 1
fi

if [ "${VERCEL_GIT_COMMIT_REF:-}" = "staging" ]; then
  echo "✅ Build allowed for staging"
  exit 1
fi

echo "⏭️ Build skipped for branch ${VERCEL_GIT_COMMIT_REF:-unknown}"
exit 0
