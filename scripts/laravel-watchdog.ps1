param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path,
    [string]$BindHost = "127.0.0.1",
    [int]$Port = 8000,
    [int]$CheckIntervalSeconds = 10
)

$ErrorActionPreference = "Stop"

$mutex = New-Object System.Threading.Mutex($false, "Local\SafeScapeLaravelWatchdog")
if (-not $mutex.WaitOne(0, $false)) {
    exit 0
}

$logDir = Join-Path $ProjectRoot "storage\logs"
if (-not (Test-Path $logDir)) {
    New-Item -Path $logDir -ItemType Directory -Force | Out-Null
}

$watchdogLog = Join-Path $logDir "laravel-watchdog.log"
$serveLog = Join-Path $logDir "localhost-8000.out.log"

function Write-WatchdogLog {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $watchdogLog -Value "[$timestamp] $Message"
}

function Get-PhpExecutable {
    $runningPhp = Get-Process php -ErrorAction SilentlyContinue |
        Where-Object { $_.Path -and (Test-Path $_.Path) } |
        Select-Object -ExpandProperty Path -First 1

    if ($runningPhp) {
        return $runningPhp
    }

    $cmd = Get-Command php -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source -and (Test-Path $cmd.Source)) {
        return $cmd.Source
    }

    $wingetPhp = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter "php.exe" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -like "*PHP.PHP.*" } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -ExpandProperty FullName -First 1

    if ($wingetPhp) {
        return $wingetPhp
    }

    $candidates = @(
        "C:\xampp\php\php.exe",
        "C:\laragon\bin\php\php.exe",
        "C:\Program Files\PHP\php.exe"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    return $null
}

function Test-LocalhostUp {
    try {
        $response = Invoke-WebRequest -Uri "http://$BindHost`:$Port/login" -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    } catch {
        return $false
    }
}

function Start-LaravelServer {
    $phpExe = Get-PhpExecutable
    if (-not $phpExe) {
        Write-WatchdogLog "PHP executable not found. Retrying later."
        return
    }

    Start-Process -FilePath $phpExe -ArgumentList @(
        "artisan",
        "serve",
        "--host=$BindHost",
        "--port=$Port"
    ) -WorkingDirectory $ProjectRoot -WindowStyle Hidden

    Write-WatchdogLog "Started Laravel server using: $phpExe"
}

Write-WatchdogLog "Watchdog started. ProjectRoot=$ProjectRoot Host=$BindHost Port=$Port"

while ($true) {
    try {
        $isUp = Test-LocalhostUp

        if (-not $isUp) {
            Write-WatchdogLog "Endpoint unavailable. Attempting restart."
            Start-LaravelServer
            Start-Sleep -Seconds 2
        }
    } catch {
        Write-WatchdogLog "Watchdog error: $($_.Exception.Message)"
    }

    Start-Sleep -Seconds $CheckIntervalSeconds
}
