@echo off
REM SmartHireLabs Docker Helper Script for Windows

setlocal enabledelayedexpansion

if "%1"=="" goto :help

if "%1"=="build" goto :build
if "%1"=="up" goto :up
if "%1"=="down" goto :down
if "%1"=="logs" goto :logs
if "%1"=="ps" goto :ps
if "%1"=="restart" goto :restart
if "%1"=="clean" goto :clean
if "%1"=="help" goto :help

echo Unknown command: %1
goto :help

:build
echo Building Docker image...
docker-compose build
goto :end

:up
echo Starting container...
docker-compose up -d
echo.
echo Application running at: http://localhost:5001
goto :end

:down
echo Stopping container...
docker-compose down
goto :end

:logs
echo Showing logs...
docker-compose logs -f app
goto :end

:ps
echo Container status:
docker-compose ps
goto :end

:restart
echo Restarting container...
docker-compose restart
goto :end

:clean
echo Removing containers, images, and volumes...
docker-compose down -v
goto :end

:help
echo SmartHireLabs Docker Helper
echo.
echo Usage: docker-helper.bat [command]
echo.
echo Commands:
echo   build       Build the Docker image
echo   up          Start the container
echo   down        Stop the container
echo   logs        View container logs
echo   ps          Show container status
echo   restart     Restart the container
echo   clean       Remove everything (containers, images, volumes)
echo   help        Show this help message
echo.
echo Examples:
echo   docker-helper.bat build
echo   docker-helper.bat up
echo   docker-helper.bat down
goto :end

:end
endlocal
