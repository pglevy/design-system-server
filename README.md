# Design System MCP Server

This is a Model Context Protocol (MCP) server that provides access to design system documentation through GitHub repositories. It allows LLMs like Claude to query and explore design system components, layouts, and patterns.

## Features

- Browse design system categories (components, layouts, patterns)
- List components within a category
- Get detailed component information including guidance and code examples
- Search across all components by keyword

## Installation

1. Clone this repository (or fork it to your own GitHub account)
2. Copy the environment file and configure it:
   ```
   cp .env.example .env
   ```
3. Edit `.env` and update the values:
   - `GITHUB_TOKEN`: Your GitHub personal access token (generate at https://github.com/settings/tokens)
   - `GITHUB_OWNER`: Your GitHub username (the repository owner)
   - `GITHUB_REPO`: Your repository name (e.g., "design-system-docs")
4. Install dependencies:
   ```
   npm install
   ```
5. Build the server:
   ```
   npm run build
   ```

See [Getting Started](GETTING_STARTED.md) for more detailed instructions on setting up to use with Amazon Q.

## Usage with Claude Desktop

1. Make sure you have Claude Desktop installed and up to date
2. Edit the Claude Desktop configuration file:
   
   **MacOS:**
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```
   
   **Windows:**
   ```
   %AppData%\Claude\claude_desktop_config.json
   ```

3. Add the server configuration:
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
   (Replace `/ABSOLUTE/PATH/TO` with the actual path to this directory)

4. Restart Claude Desktop

## Tools

The server provides the following tools:

1. **list-categories**: Lists all available design system categories
2. **list-components**: Lists all components in a specific category
3. **get-component-details**: Gets detailed information about a specific component
4. **search-design-system**: Searches across all components by keyword

## Example Queries

Here are some example queries you can ask Claude:

- "What design system categories are available?"
- "Show me all components in the 'layouts' category"
- "Get details about the 'cards' component"
- "Search the design system for 'navigation'"

## Troubleshooting

If you encounter issues:

1. Check Claude Desktop logs:
   ```
   tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
   ```
2. Verify your server builds and runs without errors
3. Make sure the configuration path is absolute and correct
4. Restart Claude Desktop completely
