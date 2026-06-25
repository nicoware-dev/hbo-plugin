$scriptsPath = Join-Path $PSScriptRoot "."
$scriptsPath = (Resolve-Path $scriptsPath).Path
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($userPath -notlike "*$scriptsPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$scriptsPath;$userPath", "User")
    Write-Host "Added to user PATH: $scriptsPath"
} else {
    Write-Host "Already on user PATH: $scriptsPath"
}
