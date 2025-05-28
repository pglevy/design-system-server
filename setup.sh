#!/bin/bash

# Setup script for Design System MCP Server

echo "Setting up Design System MCP Server..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the server
echo "Building server..."
npm run build

# Get absolute path of the current directory
SERVER_PATH=$(pwd)
BUILD_PATH="$SERVER_PATH/build/index.js"

# Determine OS and config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    # Windows
    CONFIG_DIR="$APPDATA/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
else
    # Linux or other
    echo "Unsupported OS for automatic configuration. Please manually configure Claude Desktop."
    exit 1
fi

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Create the configuration content
CONFIG_CONTENT='{
  "mcpServers": {
    "design-system": {
      "command": "node",
      "args": [
        "'"$BUILD_PATH"'"
      ]
    }
  }
}'

# Check if config file exists
if [ -f "$CONFIG_FILE" ]; then
    echo "Claude Desktop config file exists. Backing up..."
    cp "$CONFIG_FILE" "${CONFIG_FILE}.backup"
    
    # Create a new config file
    echo "$CONFIG_CONTENT" > "$CONFIG_FILE"
    echo "Updated Claude Desktop configuration."
else
    echo "Creating new Claude Desktop configuration..."
    echo "$CONFIG_CONTENT" > "$CONFIG_FILE"
fi

echo "Setup complete! Please restart Claude Desktop to use the Design System MCP Server."
echo "Server path: $BUILD_PATH"
echo "Configuration file: $CONFIG_FILE"

# Provide instructions for manual configuration
echo ""
echo "If the automatic configuration didn't work, please manually edit your Claude Desktop configuration file:"
echo "1. Open $CONFIG_FILE in a text editor"
echo "2. Ensure it contains the following content (adjust as needed):"
echo "$CONFIG_CONTENT"
echo ""
echo "Then restart Claude Desktop."
