# verify-hbo.ps1 — Verify HBO Plugin install (symlink, enable, optional API health)
param([string]$HealthUrl = "http://127.0.0.1:9119/api/plugins/hbo-plugin/health")

$ErrorActionPreference = "Continue"
$ScriptDir = $PSScriptRoot
. (Join-Path $ScriptDir "lib\hermes-paths.ps1")
Initialize-HermesPaths

$Fail = 0
Write-Host "=== HBO Plugin verify ==="

if ((Test-Path $UserPluginDir) -and (Test-Path (Join-Path $UserPluginDir "plugin.yaml"))) {
    Write-Host "User plugin: $UserPluginDir"
} else {
    Write-Host "User plugin missing at $UserPluginDir" -ForegroundColor Red
    $Fail = 1
}

if (Test-BundledLinkOk) {
    Write-Host "Bundled symlink: $BundledPluginLink"
} else {
    Write-Host "Bundled symlink missing or wrong target" -ForegroundColor Red
    Write-Host "  Fix: .\scripts\install-hbo.ps1 or .\scripts\sync-plugin.cmd"
    $Fail = 1
}

$plugins = hermes plugins list 2>$null | Out-String
if ($plugins -match "hbo-plugin" -and $plugins -match "enabled") {
    Write-Host "Plugin enabled"
} elseif ($plugins -match "hbo-plugin") {
    Write-Host "hbo-plugin installed but may not be enabled" -ForegroundColor Yellow
} else {
    Write-Host "hbo-plugin not found in hermes plugins list" -ForegroundColor Red
    $Fail = 1
}

try {
    $resp = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 3
    if ($resp.StatusCode -eq 200) {
        Write-Host "API health: $HealthUrl"
    } else {
        Write-Host "API health returned HTTP $($resp.StatusCode)" -ForegroundColor Yellow
        $Fail = 1
    }
} catch {
    Write-Host "Dashboard not reachable - restart: hermes dashboard --no-open" -ForegroundColor Yellow
}

if ($Fail -ne 0) { exit 1 }
Write-Host "All checks passed."
