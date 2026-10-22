#!/usr/bin/env bash
# Stage only the files the site needs, then deploy to Cloudflare Pages.
# functions/ (the contact form) is picked up from the project root by wrangler.
set -e
cd "$(dirname "$0")"
rm -rf .deploy && mkdir -p .deploy
cp index.html styles.css script.js robots.txt sitemap.xml llms.txt _headers .deploy/
cp -r assets .deploy/assets
npx --yes wrangler@latest pages deploy --branch=main --commit-dirty=true
