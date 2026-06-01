param(
    [string]$FtpHost = "31.220.110.252",
    [string]$User = "u959866192",
    [string]$Pass = "Wasay123@#$",
    [string]$LocalDir = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\dist",
    [string]$RemoteBase = "/domains/ktexstore.com/public_html"
)

function Upload-FileOrDir {
    param($LocalPath, $RemotePath)

    $wc = New-Object System.Net.WebClient
    $wc.Credentials = New-Object System.Net.NetworkCredential($User, $Pass)
    $uri = "ftp://$FtpHost$RemotePath"

    try {
        $null = $wc.UploadFile($uri, "STOR", $LocalPath)
        return $true
    } catch {
        Write-Host "[ERR] $LocalPath -> $RemotePath : $($_.Exception.Message)" -Foreground Red
        return $false
    } finally {
        $wc.Dispose()
    }
}

function Create-RemoteDir {
    param($RemotePath)

    $wc = New-Object System.Net.WebClient
    $wc.Credentials = New-Object System.Net.NetworkCredential($User, $Pass)
    $uri = "ftp://$FtpHost$RemotePath"

    try {
        $null = $wc.UploadString($uri, "MKD", "")
        return $true
    } catch {
        return $false
    } finally {
        $wc.Dispose()
    }
}

$files = Get-ChildItem -Path $LocalDir -Recurse -File
Write-Host "Uploading $($files.Count) files..." -Foreground Cyan

$success = 0
$failed = 0

foreach ($file in $files) {
    $relPath = $file.FullName.Substring($LocalDir.Length).Replace("\", "/")
    $remotePath = "$RemoteBase$relPath"

    # Create directories
    $parts = $remotePath.Split("/")
    $currentPath = ""
    for ($i = 0; $i -lt $parts.Length - 1; $i++) {
        if ($parts[$i] -ne "") {
            $currentPath += "/" + $parts[$i]
            Create-RemoteDir $currentPath | Out-Null
        }
    }

    if (Upload-FileOrDir $file.FullName $remotePath) {
        $success++
        Write-Host "[$success] $($file.Name)" -Foreground Green
    } else {
        $failed++
    }
}

Write-Host "`nDone: $success OK | $failed Failed" -Foreground Cyan
