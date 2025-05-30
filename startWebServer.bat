
@echo off
REM Script Windows per eseguire main.py
REM Salva questo file come run_script.bat

cls

echo Esecuzione dello script Python...
echo.

REM Cambia directory alla cartella precedente
cd /d "%~dp0back"

REM Verifica se il file main.py esiste
if not exist "main.py" (
    echo ERRORE: Il file main.py non è stato trovato nella directory corrente.
    echo Directory corrente: %CD%
    echo.
    pause
    exit /b 1
)

REM Verifica se Python è installato
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRORE: Python non è installato o non è nel PATH di sistema.
    echo Installa Python da https://python.org
    echo.
    pause
    exit /b 1
)

echo Esecuzione di main.py...
echo.

REM Esegui lo script Python
python main.py

REM Controlla il codice di uscita
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo ERRORE: Si è verificato un errore durante l'esecuzione dello script Python.
    echo Codice di errore: %errorlevel%
    echo ========================================
    echo.
    pause
    exit /b %errorlevel%
) else (
    echo.
    echo ========================================
    echo SUCCESSO: Lo script è stato completato con successo.
    echo ========================================
    echo.
    pause
)

echo.
echo Premi un tasto per chiudere...
pause >nul