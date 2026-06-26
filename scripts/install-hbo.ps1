# install-hbo.ps1 — Install HBO Plugin system (plugin + bundled symlink + profiles)
# Usage: .\scripts\install-hbo.ps1 [-WithDemo] [-Build] [-SkipProfiles] [-SkipSymlink]

param(
    [switch]$WithDemo,
    [switch]$Build,
    [switch]$SkipProfiles,
    [switch]$SkipSymlink,
    [ValidateSet("local", "git")]
    [string]$PluginSource = "local",
    [string]$RepoUrl = "nicoware-dev/hbo-plugin/plugin/hbo-plugin",
    [string]$RepoRoot = ""
)

$ErrorActionPreference = "Stop"
$ScriptDir = $PSScriptRoot
if (-not $RepoRoot) { $RepoRoot = Split-Path -Parent $ScriptDir }
Set-Location $RepoRoot

. (Join-Path $ScriptDir "lib\hermes-paths.ps1")
Require-HermesCli
Initialize-HermesPaths

$PluginSrc = Join-Path $RepoRoot "plugin\hbo-plugin"
$Dist = Join-Path $PluginSrc "dashboard\dist\index.js"

Write-Host "=== HBO Plugin install ==="
Write-Host "Hermes home: $HermesHome"
hermes --version 2>$null | Select-Object -First 1

if ($Build -or -not (Test-Path $Dist)) {
    Write-Host "Building dashboard..."
    pnpm build:dashboard
}

if (-not (Test-Path (Join-Path $PluginSrc "plugin.yaml"))) {
    throw "plugin.yaml not found at $PluginSrc"
}

if ($PluginSource -eq "git") {
    Write-Host "Installing plugin via Hermes CLI from $RepoUrl ..."
    hermes plugins install $RepoUrl --enable --force
} else {
    Write-Host "Syncing plugin from repo..."
    & (Join-Path $ScriptDir "sync-plugin.cmd")
}

if (-not $SkipSymlink) {
    Link-BundledPlugin
} else {
    Write-Host "Skipped bundled symlink (--SkipSymlink) — dashboard API may 404" -ForegroundColor Yellow
}

Write-Host "Enabling plugin..."
hermes plugins enable hbo-plugin 2>$null

if (-not $SkipProfiles) {
    Write-Host "Installing profile distributions..."
    hermes profile install (Join-Path $RepoRoot "profiles\sales-ops-agent") --alias sales-ops -y
    hermes profile install (Join-Path $RepoRoot "profiles\growth-agent") --alias growth -y
    hermes profile install (Join-Path $RepoRoot "profiles\ops-lead-agent") --alias ops-lead -y
    Write-Host "Profiles: sales-ops, growth, ops-lead"
}

if ($WithDemo) {
    Write-Host "Loading demo data..."
    python (Join-Path $ScriptDir "demo_reset.py")
}

Write-Host ""
& (Join-Path $ScriptDir "verify-hbo.ps1")

Write-Host ""
Write-Host "=== Install complete ==="
Write-Host "Restart dashboard so API routes reload:"
Write-Host "  hermes dashboard --stop; hermes dashboard --no-open"
Write-Host "Then verify: curl http://127.0.0.1:9119/api/plugins/hbo-plugin/health"
