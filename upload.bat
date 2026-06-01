@echo off
set FTPHOST=31.220.110.252
set FTPUSER=u959866192
set FTPPASS=Wasay123@#$
set FTPDIR=/domains/ktexstore.com/public_html
set LOCALDIR=C:\Users\ARSHMAN LAPTOP\Desktop\KHM-Group-Final\dist

echo Starting FTP upload...
for /r "%LOCALDIR%" %%F in (*) do (
    set REMOTEPATH=%FTPDIR%%%~pF%%~nxF
    set REMOTEPATH=!REMOTEPATH:\=/!
    echo Uploading: %%~nxF
    curl -T "%%F" --ftp-create-dirs -u "%FTPUSER%:%FTPPASS%" "ftp://%FTPHOST%!REMOTEPATH!"
)
echo Done!
