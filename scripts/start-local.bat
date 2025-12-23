@echo off
REM Wrapper to run the PowerShell start-local script with execution bypass
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1" -OpenBrowser
