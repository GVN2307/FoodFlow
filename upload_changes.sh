#!/bin/bash
echo "⬆️ Uploading to GitHub..."
git add .
read -p "Enter commit message (default: Update): " msg
msg=${msg:-Update}
git commit -m "$msg"
git push
echo "✅ Done!"
