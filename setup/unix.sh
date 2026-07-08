#!/bin/bash

if ! command -v git >/dev/null 2>&1; then
    echo "Sorryyyy, git is not installed.. pls install it first!!"
    exit 1
fi


if ! command -v bun >/dev/null 2>&1; then
    echo "Installing bun..."
    curl -fsSL https://bun.com/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    echo "Installed bun!!!"
fi

echo "Starting to copying the selfbot files to your desktop..."

if command -v xdg-user-dir >/dev/null 2>&1; then
    DESKTOP=$(xdg-user-dir DESKTOP)
else
    DESKTOP="$HOME/Desktop"
fi

if [ ! -d "$DESKTOP" ]; then
    DESKTOP="$HOME"
fi

cd "$DESKTOP" || exit 1
git clone https://github.com/Ereninki/Ereninkis-PC-Status-Selfbot.git || exit 1
cd ./Ereninkis-PC-Status-Selfbot || exit 1
echo "Finished copying the selfbot files to your desktop!!!!"

echo "Installing dependiencies..."
bun install
echo "Finished installing dependiencies!!!"