# Run Composio CLI (installed in WSL) from Windows PowerShell.
# Usage: composio whoami
# Requires: Ubuntu WSL + composio in ~/.composio (run scripts/wsl-composio-profile.sh once).

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ComposioArgs
)

$distro = if ($env:COMPOSIO_WSL_DISTRO) { $env:COMPOSIO_WSL_DISTRO } else { "Ubuntu" }

# Plain `wsl composio` skips ~/.bashrc; `bash -lc` loads ~/.profile (Composio PATH).
$argLine = ($ComposioArgs | ForEach-Object {
    "'" + ($_ -replace "'", "''") + "'"
}) -join " "

if ($argLine) {
    wsl.exe -d $distro -- bash -lc "composio $argLine"
} else {
    wsl.exe -d $distro -- bash -lc "composio"
}

exit $LASTEXITCODE
