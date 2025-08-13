# Design System MCP Server

This is a Model Context Protocol (MCP) server that provides access to Appian's design system documentation through GitHub repositories. It supports both public and internal documentation sources, allowing LLMs like Claude to query and explore design system components, layouts, and patterns with appropriate access controls.

## Features

- **Multi-source support**: Access both public and internal documentation repositories
- **Source attribution**: Clear indication of content source (public/internal)
- **Priority-based merging**: Internal documentation overrides public when both exist
- **Access control**: Configurable access to internal documentation
- **Browse design system categories** (components, layouts, patterns, branding, etc.)
- **List components** within a category with source information
- **Get detailed component information** including guidance and code examples
- **Search across all components** by keyword with source filtering
- **Source management**: View source status and manually refresh content

## Installation

### Public Documentation Only

For access to public design system documentation only:

1. Clone this repository (or fork it to your own GitHub account)
2. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and update the values:
   - `GITHUB_TOKEN`: Your GitHub personal access token (generate at https://github.com/settings/tokens)
   - `GITHUB_OWNER`: Your GitHub username (the repository owner)
   - `GITHUB_REPO`: Your repository name (e.g., "design-system-docs")
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the server:
   ```bash
   npm run build
   ```

### Internal Documentation Access

For access to both public and internal documentation:

1. Follow the public documentation setup above
2. Configure internal documentation access:
   ```bash
   # Add to your .env file
   export ENABLE_INTERNAL_DOCS=true
   export INTERNAL_DOCS_TOKEN=your_github_token_for_private_repo
   ```
3. Optionally, create a `config.yml` file for advanced configuration:
   ```bash
   cp config.example.yml config.yml
   # Edit config.yml to customize source settings
   ```

### Advanced Configuration

For detailed configuration options, see [Configuration Guide](docs/CONFIGURATION.md).

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

The server provides the following tools with dual-source support:

### Source Management
1. **get-content-sources**: View available documentation sources and their status
2. **refresh-sources**: Manually refresh documentation sources and clear cache

### Content Access
3. **list-categories**: Lists all available design system categories
4. **list-components**: Lists all components in a specific category
5. **get-component-details**: Gets detailed information about a specific component with source attribution
   - `includeInternal`: Access internal documentation (default: false)
   - `sourceOnly`: Filter by specific source ("public", "internal", "all")
6. **search-design-system**: Searches across all components by keyword with source filtering
   - `includeInternal`: Include internal documentation in search
   - `sourceOnly`: Filter results by specific source

For detailed API documentation, see [API Guide](docs/API.md).

## Example Queries

### Basic Usage (Public Documentation)
- "What design system categories are available?"
- "Show me all components in the 'layouts' category"
- "Get details about the 'cards' component"
- "Search the design system for 'navigation'"

### Dual-Source Usage (Public + Internal)
- "Check the status of documentation sources"
- "Get details about the 'cards' component including internal documentation"
- "Search for 'internal' components in internal documentation only"
- "Show me all components, including internal ones"
- "Refresh the documentation sources"

### Advanced Filtering
```javascript
// Public users - default behavior
"Get details about the cards component"

// Internal users - access internal documentation
"Get details about the cards component with internal documentation included"

// Search only internal documentation
"Search for 'widget' in internal documentation only"

// Check what sources are available
"What documentation sources are available?"
```

## Troubleshooting

If you encounter issues:

1. Check Claude Desktop logs:
   ```
   tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
   ```
2. Verify your server builds and runs without errors
3. Make sure the configuration path is absolute and correct
4. Restart Claude Desktop completely
