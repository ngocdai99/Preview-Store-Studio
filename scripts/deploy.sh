#!/usr/bin/env bash
set -e

# Store Preview Studio · Marketing Deployment Script
echo "======================================================"
echo "  STORE PREVIEW STUDIO · DEPLOY MARKETING (VI/EN)"
echo "======================================================"

# 1. Build English marketing bundle
echo "-> [1/3] Bundling English marketing page..."
node scripts/build-marketing.js

# 2. Build Vietnamese marketing bundle & sync docs/index.html
echo "-> [2/3] Generating Vietnamese marketing & syncing docs/index.html..."
node scripts/build-marketing-vi.js

# 3. Deploy docs/ to Surge
echo "-> [3/3] Deploying docs/ to preview-studio-app-vi.surge.sh..."
npx surge docs preview-studio-app-vi.surge.sh

echo "======================================================"
echo "  DEPLOY COMPLETED SUCCESSFULLY!"
echo "  Live URL: https://preview-studio-app-vi.surge.sh"
echo "======================================================"
