param(
    [string]$LocalDir = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\dist",
    [string]$RemoteDir = "/domains/ktexstore.com/public_html",
    [string]$FtpHost = "31.220.110.252",
    [string]$User = "u959866192",
    [string]$Pass = "Wasay123@#$"
)

$ftpBase = "ftp://$FtpHost"
$files = Get-ChildItem -Path $LocalDir -Recurse -File

Write-Host "Total files: $($files.Count)" -ForegroundColor Cyan
$success = 0
$failed = 0

foreach ($file in $files) {
    $relPath = $file.FullName.Substring($LocalDir.Length).Replace("\", "/")
    $remoteUrl = "$ftpBase$RemoteDir$relPath"

    $exitCode = (Start-Process -FilePath "curl.exe" -ArgumentList "-T", "`"$($file.FullName)`"", "--ftp-create-dirs", "-u", "`"$User`:$Pass`"", "`"$remoteUrl`"" -NoNewWindow -Wait -PassThru).ExitCode

    if ($exitCode -eq 0) {
        $success++
        Write-Host "[OK] $($file.Name)" -ForegroundColor Green
    } else {
        $failed++
        Write-Host "[FAIL] $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nUploaded: $success | Failed: $failed" -ForegroundColor Cyan
