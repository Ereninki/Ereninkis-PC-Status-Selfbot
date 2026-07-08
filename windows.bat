@echo off
echo "Installing dependeinces..."

bun install @slack/bolt @slack/web-api
npm install systeminformation

echo "Done!!"
pause