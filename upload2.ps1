$ftp = "ftp://31.220.110.252"
$user = "u959866192.Wasay98"
$pass = "Wasay123@#$"
$localDir = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\dist"
$remoteDir = "/domains/ktexstore.com/public_html"

$files = Get-ChildItem -Path $localDir -Recurse -File
Write-Host "Uploading $($files.Count) files..."
$count = 0
$fail = 0

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($localDir.Length).Replace("\", "/")
    $remotePath = "$remoteDir$relativePath"

    $proc = Start-Process -FilePath "curl.exe" -ArgumentList "-s","-T","`"$($file.FullName)`"","--ftp-create-dirs","-u","`"$user`:$pass`"","`"$ftp$remotePath`"" -NoNewWindow -Wait -PassThru
    if ($proc.ExitCode -eq 0) {
        $count++
        Write-Host "[$count] $($file.Name)" -ForegroundColor Green
    } else {
        $fail++
        Write-Host "[FAIL] $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nUploaded: $count | Failed: $fail"
