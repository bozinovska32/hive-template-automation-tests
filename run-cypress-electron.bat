@echo off
setlocal

REM Always run from this script's directory
cd /d "%~dp0"

echo Running from: %CD%
echo Command: npx cypress run --headed --browser electron %*

npx cypress run --headed --browser electron %*
set EXIT_CODE=%ERRORLEVEL%

echo.
echo Cypress finished with exit code: %EXIT_CODE%
exit /b %EXIT_CODE%
