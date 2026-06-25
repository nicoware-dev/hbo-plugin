# One-time Windows setup: WSL Composio PATH + Windows composio command on PATH.
# Run from PowerShell: .\scripts\setup-composio-windows.ps1

$ErrorActionPreference = "Stop"
$distro = if ($env:COMPOSIO_WSL_DISTRO) { $env:COMPOSIO_WSL_DISTRO } else { "Ubuntu" }

function To-WslPath([string]$WindowsPath) {
    $resolved = (Resolve-Path $WindowsPath).Path
    $drive = $resolved.Substring(0, 1).ToLower()
    $rest = $resolved.Substring(2).Replace("\", "/")
    return "/mnt/$drive$rest"
}

Write-Host "1/3 Updating WSL ~/.profile for Composio PATH..."
$profileScript = To-WslPath (Join-Path $PSScriptRoot "wsl-composio-profile.sh")
wsl.exe -d $distro -- bash $profileScript

Write-Host "2/3 Adding scripts/ to Windows user PATH..."
& (Join-Path $PSScriptRoot "install-composio-windows-path.ps1")

Write-Host "3/3 Verifying composio..."
& (Join-Path $PSScriptRoot "composio.ps1") --version
& (Join-Path $PSScriptRoot "composio.ps1") whoami

Write-Host ""
Write-Host "Done. Open a new PowerShell window and run: composio whoami"
