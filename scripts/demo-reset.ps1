# demo-reset.ps1 — Build, sync plugin, reset demo data
# Usage: .\scripts\demo-reset.ps1 [-Build]

param([switch]$Build)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$distPath = Join-Path $RepoRoot "plugin\hbo-plugin\dashboard\dist\index.js"
if ($Build -or -not (Test-Path $distPath)) {
    Write-Host "Building dashboard..."
    pnpm build:dashboard
}

Write-Host "Syncing plugin to Hermes..."
& (Join-Path $PSScriptRoot "sync-plugin.cmd")

Write-Host "Resetting demo data..."
python (Join-Path $PSScriptRoot "demo_reset.py")

Write-Host ""
Write-Host "Demo reset complete."
Write-Host "  Restart the Hermes dashboard to pick up API/plugin changes."
Write-Host "  Open Business Ops -> Setup to verify, or run hbo_load_demo_data in chat."
