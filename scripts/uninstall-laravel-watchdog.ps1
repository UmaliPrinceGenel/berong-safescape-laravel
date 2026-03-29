param(
    [string]$TaskName = "SafeScape-Laravel-Watchdog"
)

$ErrorActionPreference = "Stop"

$startupFolder = [Environment]::GetFolderPath("Startup")
$launcherPath = Join-Path $startupFolder "$TaskName.cmd"

if (Test-Path $launcherPath) {
    Remove-Item -Path $launcherPath -Force
    Write-Output "Removed startup launcher: $launcherPath"
} else {
    Write-Output "Startup launcher not found: $launcherPath"
}

$watchdogProcesses = Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -like "*laravel-watchdog.ps1*" }

foreach ($process in $watchdogProcesses) {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Output "Stopped watchdog process id $($process.ProcessId)"
}
