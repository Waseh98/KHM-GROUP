param(
    [string]$FtpHost = "31.220.110.252",
    [string]$User = "u959866192",
    [string]$Pass = "Wasay123@#$",
    [string]$LocalDir = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\dist",
    [string]$RemoteBase = "/domains/ktexstore.com/public_html"
)

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
$uriBase = "ftp://$FtpHost$RemoteBase"

function Ensure-FtpDir {
    param([string]$remotePath)

    $parts = $remotePath.Trim('/').Split('/')
    $current = ""
    foreach ($part in $parts) {
        $current += "/" + $part
        $dirUri = "ftp://$FtpHost$current"
        try {
            $req = [System.Net.FtpWebRequest]::Create($dirUri)
            $req.Credentials = New-Object System.Net.NetworkCredential($User, $Pass)
            $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
            $req.UsePassive = $true
            $resp = $req.GetResponse()
            $resp.Close()
            Write-Host "  [MKD] $current" -Foreground Cyan
        } catch {
            # Directory exists or error - ignore
        }
    }
}

function Upload-FtpFile {
    param([string]$localPath, [string]$remotePath)

    try {
        $req = [System.Net.FtpWebRequest]::Create($remotePath)
        $req.Credentials = New-Object System.Net.NetworkCredential($User, $Pass)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $req.UsePassive = $true
        $req.ContentLength = (Get-Item $localPath).Length

        $fs = [System.IO.File]::OpenRead($localPath)
        $reqStream = $req.GetRequestStream()
        $fs.CopyTo($reqStream)
        $fs.Close()
        $reqStream.Close()

        $resp = $req.GetResponse()
        $status = $resp.StatusCode
        $resp.Close()
        return $true
    } catch {
        Write-Host "  [ERR] $($_.Exception.Message)" -Foreground Red
        return $false
    }
}

$files = Get-ChildItem -Path $LocalDir -Recurse -File
Write-Host "Uploading $($files.Count) files to $uriBase" -Foreground Cyan
$success = 0
$failed = 0

foreach ($file in $files) {
    $relPath = $file.FullName.Substring($LocalDir.Length).Replace("\", "/")
    $remotePath = "ftp://$FtpHost$RemoteBase$relPath"

    # Ensure directory exists
    $dirPath = $remotePath.Substring(0, $remotePath.LastIndexOf('/'))
    Ensure-FtpDir -remotePath $dirPath

    Write-Host "Uploading: $($file.Name) -> $relPath" -Foreground Yellow
    if (Upload-FtpFile -localPath $file.FullName -remotePath $remotePath) {
        $success++
        Write-Host "  [OK] $($file.Name)" -Foreground Green
    } else {
        $failed++
    }
}

Write-Host "`nDone: $success OK | $failed Failed" -Foreground Cyan
