@echo off
title MediStats - Empaquetador para Transferencia
color 0B
echo =======================================================
echo     PREPARANDO MEDISTATS PARA TRANSFERIR A OTRO PC
echo =======================================================
echo.

echo [+] Compilando el proyecto en su ultima version...
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo [ERR] Error al compilar el proyecto. Asegurate de no tener errores de TypeScript.
    pause
    exit /b %errorlevel%
)

echo.
echo [+] Creando carpeta limpia de produccion (medistats_produccion)...
if exist medistats_produccion (
    rd /s /q medistats_produccion
)
mkdir medistats_produccion

echo [+] Copiando archivos necesarios...
xcopy /E /I /Y dist medistats_produccion\dist > nul
copy /Y excel_manager.py medistats_produccion\ > nul
copy /Y .env medistats_produccion\ > nul
if exist "RHB2024 DEFINITIVA ESPINOZAa.xlsx" (
    copy /Y "RHB2024 DEFINITIVA ESPINOZAa.xlsx" medistats_produccion\ > nul
    echo [+] Copiado: Planilla de Excel
) else (
    echo [!] Advertencia: No se encontro "RHB2024 DEFINITIVA ESPINOZAa.xlsx" en la carpeta actual.
)

echo.
echo =======================================================
echo                     PROCESO COMPLETADO
echo =======================================================
echo Se ha creado la carpeta "medistats_produccion" en este mismo directorio.
echo.
echo SOLO necesitas hacer click derecho sobre esa carpeta, comprimirla
echo en un archivo ZIP (pesara menos de 1 MB) y enviartelo por correo.
echo.
echo En el otro PC, para iniciar la aplicacion:
echo 1. Descomprime el ZIP.
echo 2. Carga la subcarpeta "dist" como extension en Chrome.
echo 3. Abre una terminal en la carpeta descomprimida y ejecuta:
echo    node dist/server.cjs
echo =======================================================
echo.
pause
