# Manual Configuration Guide

If the setup script doesn't work correctly, you can manually configure Claude Desktop to use the Design System MCP Server by following these steps:

## 1. Locate Your Claude Desktop Configuration File

**On macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**On Windows:**
```
%AppData%\Claude\claude_desktop_config.json
```

## 2. Edit the Configuration File

1. If the file doesn't exist, create it
2. Add the following content (replace the path with the absolute path to your built server):

```json
{
  "mcpServers": {
    "design-system": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/design-system-server/build/index.js"
      ]
    }
  }
}
```

For example, if your server is at `/Users/philip.levy/Desktop/design-system-server`, the configuration would look like:

```json
{
  "mcpServers": {
    "design-system": {
      "command": "node",
      "args": [
        "/Users/philip.levy/Desktop/design-system-server/build/index.js"
      ]
    }
  }
}
```

## 3. Restart Claude Desktop

After saving the configuration file, completely close and restart Claude Desktop.

## 4. Verify the Server is Working

In Claude Desktop, try asking one of these questions:
- "What design system categories are available?"
- "Show me all components in the patterns category"
- "Tell me about the cards component"

If the server is working correctly, Claude will use the MCP tools to provide information about the design system.
