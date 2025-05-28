@echo off
REM Setup script for Design System MCP Server (Windows)

echo Setting up Design System MCP Server...

REM Install dependencies
echo Installing dependencies...
call npm install

REM Build the server
echo Building server...
call npm run build

REM Get absolute path of the current directory
set SERVER_PATH=%CD%
set BUILD_PATH=%SERVER_PATH%\build\index.js

REM Set config path for Windows
set CONFIG_DIR=%APPDATA%\Claude
set CONFIG_FILE=%CONFIG_DIR%\claude_desktop_config.json

REM Create config directory if it doesn't exist
if not exist "%CONFIG_DIR%" mkdir "%CONFIG_DIR%"

REM Check if config file exists
if exist "%CONFIG_FILE%" (
    echo Claude Desktop config file exists. Backing up...
    copy "%CONFIG_FILE%" "%CONFIG_FILE%.backup"
    
    REM Create new config file - simplistic approach
    echo Creating updated configuration...
    echo {> "%CONFIG_FILE%"
    echo   "mcpServers": {>> "%CONFIG_FILE%"
    echo     "design-system": {>> "%CONFIG_FILE%"
    echo       "command": "node",>> "%CONFIG_FILE%"
    echo       "args": [>> "%CONFIG_FILE%"
    echo         "%BUILD_PATH:\=\\%">> "%CONFIG_FILE%"
    echo       ]>> "%CONFIG_FILE%"
    echo     }>> "%CONFIG_FILE%"
    echo   }>> "%CONFIG_FILE%"
    echo }>> "%CONFIG_FILE%"
) else (
    echo Creating new Claude Desktop configuration...
    echo {> "%CONFIG_FILE%"
    echo   "mcpServers": {>> "%CONFIG_FILE%"
    echo     "design-system": {>> "%CONFIG_FILE%"
    echo       "command": "node",>> "%CONFIG_FILE%"
    echo       "args": [>> "%CONFIG_FILE%"
    echo         "%BUILD_PATH:\=\\%">> "%CONFIG_FILE%"
    echo       ]>> "%CONFIG_FILE%"
    echo     }>> "%CONFIG_FILE%"
    echo   }>> "%CONFIG_FILE%"
    echo }>> "%CONFIG_FILE%"
)

echo Setup complete! Please restart Claude Desktop to use the Design System MCP Server.
echo Server path: %BUILD_PATH%
echo Configuration file: %CONFIG_FILE%
