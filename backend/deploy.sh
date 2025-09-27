#!/bin/bash
set -e  # stop if any command fails

echo "📥 Pulling latest code from GitHub..."
cd ~/DocXtract/DocXtract/backend

# Always reset local code to match GitHub main branch
git fetch origin
git reset --hard origin/main

echo "🐳 Rebuilding and restarting containers..."
docker compose down
docker compose up -d --build

echo "✅ Deployment complete!"
