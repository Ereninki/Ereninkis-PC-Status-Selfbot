#!/bin/bash

echo "Installing dependeinces..."
bun install @slack/bolt @slack/web-api
npm install systeminformation

ehcho "Done!!"