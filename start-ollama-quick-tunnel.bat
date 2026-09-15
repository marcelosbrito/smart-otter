@echo off
setlocal EnableExtensions EnableDelayedExpansion

title Smart Otter - Ollama Quick Tunnel

echo.
echo ==========================================
echo   Smart Otter - Ollama Quick Tunnel
echo ==========================================
echo.

echo [1/2] Starting Cloudflare Quick Tunnel...
echo.

REM Start cloudflared and capture its output.
for /f "tokens=*" %%A in ('cloudflared tunnel --url http://localhost:11434 --http-host-header="localhost:11434" 2^>^&1') do (
    set "line=%%A"
    echo !line!

    REM Extract the trycloudflare.com URL from the output.
    echo !line! | findstr /R /C:"https://.*\.trycloudflare\.com" >nul
    if not errorlevel 1 (
        for /f "tokens=2" %%B in ("!line!") do (
            set "url=%%B"
        )
        if defined url (
            echo !url! | findstr /C:"https://" >nul
            if not errorlevel 1 (
                echo.
                echo ==========================================
                echo   Quick Tunnel URL:
                echo   !url!
                echo ==========================================
                echo.
                echo [2/2] Copying URL to clipboard...
                echo !url! | clip
                echo URL copied to clipboard.
                echo.
            )
        )
    )
)

echo.
echo Tunnel stopped.
pause
