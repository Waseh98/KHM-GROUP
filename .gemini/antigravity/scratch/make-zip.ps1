$source = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final"
$temp = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\temp-deploy"
$zipPath = "C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\ktexstore-deploy.zip"

Write-Host "Creating deployment package..."

# Clean up any existing temp or zip
if (Test-Path $temp) { Remove-Item -Recurse -Force $temp }
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

# Create folders
New-Item -ItemType Directory -Path $temp | Out-Null
New-Item -ItemType Directory -Path "$temp\ktex-backend" | Out-Null

# Copy files & directories
Copy-Item -Recurse "$source\dist" "$temp\"
Copy-Item "$source\package.json" "$temp\"
Copy-Item "$source\start.cjs" "$temp\"
Copy-Item "$source\.htaccess" "$temp\"
Copy-Item "$source\vite.config.js" "$temp\"
Copy-Item "$source\index.html" "$temp\"

# Copy ktex-backend except node_modules and public
Get-ChildItem "$source\ktex-backend" | Where-Object { $_.Name -ne "node_modules" -and $_.Name -ne "public" } | ForEach-Object {
    Copy-Item -Recurse $_.FullName "$temp\ktex-backend\"
}

# Create clean backend public/uploads structure
New-Item -ItemType Directory -Path "$temp\ktex-backend\public\uploads" -Force | Out-Null

# Compress to ZIP
Compress-Archive -Path "$temp\*" -DestinationPath $zipPath -Force

# Clean up temp folder
Remove-Item -Recurse -Force $temp
Write-Host "🎉 Success! ZIP Created at: $zipPath"
