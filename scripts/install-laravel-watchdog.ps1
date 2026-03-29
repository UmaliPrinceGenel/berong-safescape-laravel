param(
    [string]$TaskName = "SafeScape-Laravel-Watchdog"
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path "$PSScriptRoot\..").Path
$watchdogScript = Join-Path $projectRoot "scripts\laravel-watchdog.ps1"

if (-not (Test-Path $watchdogScript)) {
    throw "Watchdog script not found at $watchdogScript"
}

$startupFolder = [Environment]::GetFolderPath("Startup")
$launcherPath = Join-Path $startupFolder "$TaskName.cmd"
$escapedScript = $watchdogScript.Replace('"', '""')
$launcherContents = "@echo off`r`npowershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$escapedScript`"`r`n"

Set-Content -Path $launcherPath -Value $launcherContents -Encoding ASCII

Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-WindowStyle", "Hidden",
    "-File", $watchdogScript
) -WindowStyle Hidden

Write-Output "Installed startup launcher: $launcherPath"
Write-Output "Watchdog started."
