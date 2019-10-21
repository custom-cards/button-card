#!/usr/bin/env bash

set -euo pipefail

echo "Pre-Commit hooks running..."

npm run build
npm run update-version
git add src/version-const.ts
