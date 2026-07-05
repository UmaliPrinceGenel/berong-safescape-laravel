$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) { $ProjectRoot = Get-Location }

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupZip = "$DesktopPath\berong_safescape_backup_$Timestamp.zip"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Berong SafeScape Dev Backup Script   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Parse .env for DB credentials
$envFilePath = Join-Path $ProjectRoot ".env"
$DbName = "berong_laravel"
$DbUser = "postgres"
$DbPassword = ""
$DbHost = "127.0.0.1"
$DbPort = "5432"

if (Test-Path $envFilePath) {
    Get-Content $envFilePath | Where-Object { $_ -match "^DB_" } | ForEach-Object {
        $parts = $_ -split '=', 2
        if ($parts.Count -eq 2) {
            $key = $parts[0]
            $val = $parts[1].Trim()
            switch ($key) {
                "DB_DATABASE" { $DbName = $val }
                "DB_USERNAME" { $DbUser = $val }
                "DB_PASSWORD" { $DbPassword = $val }
                "DB_HOST"     { $DbHost = $val }
                "DB_PORT"     { $DbPort = $val }
            }
        }
    }
}

$SqlDumpPath = Join-Path $ProjectRoot "database_backup.sql"

# 2. Find and run pg_dump
$pgDump = "pg_dump"
if (-not (Get-Command $pgDump -ErrorAction SilentlyContinue)) {
    $pgPaths = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin\pg_dump.exe" -ErrorAction SilentlyContinue
    if ($pgPaths) {
        $pgDump = $pgPaths[0].FullName
    }
}

if ($DbPassword) {
    $Env:PGPASSWORD = $DbPassword
}

Write-Host "`n[1/3] Dumping PostgreSQL Database ($DbName)..."
if (Get-Command $pgDump -ErrorAction SilentlyContinue) {
    & $pgDump -h $DbHost -p $DbPort -U $DbUser -f $SqlDumpPath $DbName
    if ($LASTEXITCODE -eq 0 -and (Test-Path $SqlDumpPath)) {
        Write-Host "Database dumped successfully." -ForegroundColor Green
    } else {
        Write-Host "Warning: pg_dump encountered an error. The database might not be backed up." -ForegroundColor Yellow
    }
} else {
    Write-Host "Warning: pg_dump not found. Please install PostgreSQL tools or add them to your PATH. Skipping DB dump." -ForegroundColor Yellow
}

# 3. Zip the project directory
Write-Host "`n[2/3] Compressing project to Desktop..."
Write-Host "This might take a few minutes because of large ML files..."
Set-Location $ProjectRoot
# Using Windows 10/11 built-in tar to create zip archive. Excludes bloat but KEEPS all ML files!
tar.exe -a -c -f $BackupZip --exclude=node_modules --exclude=vendor --exclude=.git --exclude=public/build --exclude=backup_dev.ps1 .

if (Test-Path $BackupZip) {
    Write-Host "Successfully created zip archive at:" -ForegroundColor Green
    Write-Host $BackupZip -ForegroundColor White
} else {
    Write-Host "Error: Failed to create zip archive." -ForegroundColor Red
}

# 4. Cleanup
Write-Host "`n[3/3] Cleaning up temporary files..."
if (Test-Path $SqlDumpPath) {
    Remove-Item $SqlDumpPath
}
Write-Host "Cleanup complete."

Write-Host "`nBackup Process Finished!" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
if ($Host.Name -match "Console") {
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Start-Sleep -Seconds 3
}
