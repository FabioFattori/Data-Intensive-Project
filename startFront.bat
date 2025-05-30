@echo off
REM Script Windows per avviare il frontend
REM Salva questo file come run_frontend.bat

cls

echo ========================================
echo    AVVIO FRONTEND - AMBIENTE DI SVILUPPO
echo ========================================
echo.

REM Cambia directory alla cartella front
cd /d "%~dp0front"

REM Verifica se la directory front esiste
if not exist "%CD%" (
    echo ERRORE: La directory 'front' non è stata trovata.
    echo Directory corrente: %~dp0
    echo.
    pause
    exit /b 1
)

echo ----------------------------------------
echo Installazione dipendenze...
echo ----------------------------------------
echo.

REM Installa le dipendenze
npm install && npm run dev