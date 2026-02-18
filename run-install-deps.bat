@echo off
setlocal

REM Always run from this script's directory
cd /d "%~dp0"

echo Running from: %CD%
echo Installing dependencies with npm install...

npm install
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE%==0 (
  echo Dependencies installed successfully.
) else (
  echo Dependency install failed with exit code: %EXIT_CODE%
)

exit /b %EXIT_CODE%
