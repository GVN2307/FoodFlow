@echo off
echo ⬆️ Uploading to GitHub...
git add .
set /p msg="Enter commit message (default: Update): " || set msg=Update
git commit -m "%msg%"
git push
echo ✅ Done!
pause
