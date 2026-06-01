$ftp = "ftp://31.220.110.252"
$user = "u959866192"
$pass = "Wasay123@#$"
$localDir = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\dist"
$remoteDir = "/domains/ktexstore.com/public_html"

$files = Get-ChildItem -Path $localDir -Recurse -File

Write-Host "Uploading $($files.Count) files to $remoteDir..."

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($localDir.Length).Replace("\", "/")
    $remotePath = "$remoteDir$relativePath"
    $remoteParent = $remoteDir + "/" + $file.DirectoryName.Substring($localDir.Length).Replace("\", "/")

    # Create remote directory if needed
    $mkdirCmd = "curl.exe -s -Q `"RNFR $remoteParent`" -Q `"RNTO $remoteParent`" ftp://31.220.110.252 2>&1"

    # Try to create dir (ignore errors if exists)
    $null = Invoke-Expression "curl.exe -s --ftp-create-dirs -T `"$($file.FullName)`" -u `"$user`:$pass`" `"$ftp$remotePath`" 2>&1"

    # Upload file
    $result = & curl.exe -T "$($file.FullName)" -u "$user`:$pass" "$ftp$remotePath" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $($file.Name): $result" -ForegroundColor Red
    }
}

Write-Host "Done!"
