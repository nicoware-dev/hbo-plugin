# hermes-paths.ps1 — Resolve Hermes directories for HBO Plugin install/sync scripts.

$script:PluginName = if ($env:HBO_PLUGIN_NAME) { $env:HBO_PLUGIN_NAME } else { "hbo-plugin" }

function Get-HermesHome {
    if ($env:HERMES_HOME) { return $env:HERMES_HOME }
    if ($env:LOCALAPPDATA) { return Join-Path $env:LOCALAPPDATA "hermes" }
    return Join-Path $HOME ".hermes"
}

function Initialize-HermesPaths {
    $script:HermesHome = Get-HermesHome
    $script:UserPlugins = Join-Path $HermesHome "plugins"
    $script:BundledPlugins = Join-Path $HermesHome "hermes-agent\plugins"
    $script:UserPluginDir = Join-Path $UserPlugins $PluginName
    $script:BundledPluginLink = Join-Path $BundledPlugins $PluginName
}

function Require-HermesCli {
    if (-not (Get-Command hermes -ErrorAction SilentlyContinue)) {
        throw "hermes CLI not found in PATH"
    }
}

function Link-BundledPlugin {
    Initialize-HermesPaths
    if (-not (Test-Path $UserPluginDir)) {
        throw "User plugin not found at $UserPluginDir (sync or install first)"
    }
    New-Item -ItemType Directory -Force -Path $BundledPlugins | Out-Null
    if (Test-Path $BundledPluginLink) {
        Remove-Item -Recurse -Force $BundledPluginLink
    }
    if ($env:OS -eq "Windows_NT") {
        $proc = Start-Process -FilePath "cmd.exe" -ArgumentList @(
            "/c", "mklink", "/J", $BundledPluginLink, $UserPluginDir
        ) -Wait -PassThru -NoNewWindow
        if ($proc.ExitCode -ne 0) {
            throw "mklink /J failed (exit $($proc.ExitCode)). Run as Administrator or enable Developer Mode."
        }
    } else {
        New-Item -ItemType SymbolicLink -Path $BundledPluginLink -Target $UserPluginDir -Force | Out-Null
    }
    if (-not (Test-Path (Join-Path $BundledPluginLink "plugin.yaml"))) {
        throw "Bundled link created but plugin.yaml not found at $BundledPluginLink"
    }
    Write-Host "Bundled link: $BundledPluginLink -> $UserPluginDir"
}

function Test-BundledLinkOk {
    Initialize-HermesPaths
    if (-not (Test-Path (Join-Path $BundledPluginLink "plugin.yaml"))) { return $false }
    try {
        $item = Get-Item $BundledPluginLink -Force
        if ($item.LinkType -in @("SymbolicLink", "Junction")) {
            $userResolved = (Resolve-Path $UserPluginDir).Path
            foreach ($target in @($item.Target)) {
                if (-not $target) { continue }
                $targetResolved = (Resolve-Path $target -ErrorAction SilentlyContinue).Path
                if ($target -eq $UserPluginDir -or $target -eq $userResolved -or $targetResolved -eq $userResolved) {
                    return $true
                }
            }
            return $false
        }
    } catch {
        return $false
    }
    return $false
}
