@echo off
setlocal
set "DISTRO=Ubuntu"
if defined COMPOSIO_WSL_DISTRO set "DISTRO=%COMPOSIO_WSL_DISTRO%"
wsl.exe -d %DISTRO% -- bash -lc "composio %*"
