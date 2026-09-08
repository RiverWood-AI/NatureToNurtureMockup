#!/usr/bin/env bash
# Stage only the files the site needs, then deploy to Cloudflare Pages.
set -e
cd "$(dirname "$0")"
rm -rf .deploy && mkdir -p .deploy
cp index.html styles.css script.js .deploy/
cp -r assets .deploy/assets
npx --yes wrangler@latest pages deploy --branch=main --commit-dirty=true
