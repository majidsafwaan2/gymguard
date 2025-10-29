#!/bin/bash

# Backup script for gymguard repository
# This will push the current code to the backup repository

echo "🔄 Starting backup to gymguard-main-backup..."

# Push to backup remote
git push backup main

# Check if successful
if [ $? -eq 0 ]; then
    echo "✅ Backup successful!"
    echo "📦 Repository backed up to: https://github.com/majidsafwaan2/gymguard-main-backup.git"
else
    echo "❌ Backup failed!"
    exit 1
fi

