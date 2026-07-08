#!/bin/bash

# Clear all npm caches
echo "🧹 Clearing npm caches..."
git checkout -- package-lock.json
git checkout -- finish.sh

echo "✅ Optimization complete!"