@echo off

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Sorryyyyy, git is not installed.. pls install it first!!!
    pause
    exit /b 1
)


where bun >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing bun...
    powershell -c "irm bun.sh/install.ps1|iex"
    set PATH=%USERPROFILE%\.bun\bin;%PATH%
    echo bun installation finished!!
)

echo Starting to copying the selfbot files to your desktop...
cd "%USERPROFILE%\Desktop"
git clone https://github.com/Ereninki/Ereninkis-PC-Status-Selfbot.git
cd ./Ereninkis-PC-Status-Selfbot
echo Installed the selfbot files!!!

echo Installing dependiencies...
bun install
echo Installed dependiencies!!

echo Now you can start your selfbot by using start.bat for windows and start.sh for mac os and linux!!!!
pause