
# Script de despliegue automático
$ErrorActionPreference = "Stop"

# Configuración FTP
$ftpHost = "ftp.aygloo.com"
$ftpUser = "info@aygloo.com"
$ftpPass = "Ayclick2021"
$ftpPort = 21

# Crear archivo de comandos FTP
$ftpCommands = @"
open $ftpHost $ftpPort
$ftpUser
$ftpPass
binary
cd public_html
lcd build
prompt
mput *.*
quit
"@

# Guardar comandos en archivo temporal
$ftpCommands | Out-File -FilePath "ftp_commands.txt" -Encoding ASCII

# Ejecutar comandos FTP
Write-Host "Iniciando despliegue..."
ftp -s:ftp_commands.txt

# Limpiar
Remove-Item "ftp_commands.txt"

Write-Host "¡Despliegue completado!" 
