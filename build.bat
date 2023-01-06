cd site

:: remove destination folder
rmdir /S /Q "dist"

:: build site
call npm run build

:: move files from dist to chrome_extension
move .\dist\index.html ..\chrome_extension\site\index.html
move .\dist\assets\* ..\chrome_extension\assets

cd ..\popup

:: remove destination folder
rmdir /S /Q "dist"

:: build popup
call npm run build

:: move files from dist to chrome_extension
move .\dist\index.html ..\chrome_extension\popup.html
move .\dist\assets\* ..\chrome_extension\assets

cd ..

:: zip chrome extension
"C:\Program Files\7-Zip\7z.exe" a -tzip "chrome_extension.zip" "chrome_extension"