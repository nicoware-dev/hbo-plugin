@echo off
REM sync-plugin.cmd — Sync HBO Plugin from repo to Hermes plugins directory (Windows)
REM Usage: scripts\sync-plugin.cmd
REM Also creates bundled symlink/junction for dashboard API routes.

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%.."
set "SRC=%REPO_ROOT%\plugin\hbo-plugin"

if not defined LOCALAPPDATA (
    echo ERROR: LOCALAPPDATA not set
    exit /b 1
)
set "DEST=%LOCALAPPDATA%\hermes\plugins\hbo-plugin"

if not exist "%SRC%" (
    echo ERROR: Plugin source not found at %SRC%
    exit /b 1
)

echo Syncing HBO Plugin...
echo   From: %SRC%
echo   To:   %DEST%

if not exist "%DEST%" mkdir "%DEST%"

xcopy /E /Y /I /EXCLUDE:scripts\sync-exclude.txt "%SRC%" "%DEST%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  ". '%SCRIPT_DIR%lib\hermes-paths.ps1'; Link-BundledPlugin"

echo.
echo Plugin synced to %DEST%
echo Restart Hermes dashboard: hermes dashboard --stop ^&^& hermes dashboard --no-open
