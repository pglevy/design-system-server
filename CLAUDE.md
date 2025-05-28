# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run build` - Compiles TypeScript to JavaScript in the `build/` directory and makes the output executable
- `tsc` - Run TypeScript compiler directly for type checking

### Installation and Setup
- `npm install` - Install dependencies
- `./setup.sh` (macOS/Linux) or `setup.bat` (Windows) - Automated Claude Desktop MCP configuration

## Architecture Overview

This is a **Model Context Protocol (MCP) server** that provides design system documentation access to Claude Desktop through GitHub Gists.

### Core Components

1. **MCP Server (`src/index.ts`)**: Main server implementation using `@modelcontextprotocol/sdk`
   - Provides 4 tools: `list-categories`, `list-components`, `get-component-details`, `search-design-system`
   - Fetches content from GitHub Gists via GitHub API
   - Uses stdio transport for Claude Desktop communication

2. **Data Layer (`src/design-system-data.ts`)**: Static design system catalog
   - Organized into 3 categories: `components`, `layouts`, `patterns`
   - Each item contains title, description, and GitHub Gist URL
   - Uses TypeScript interfaces for type safety

### Key Architectural Patterns

- **GitHub Gist Integration**: Documentation stored as GitHub Gists with separate guidance and code files
- **Tool-based API**: Exposes functionality through MCP tools rather than traditional REST endpoints
- **Static Data + Dynamic Content**: Catalog structure is static, actual documentation fetched dynamically
- **Category-Component Hierarchy**: Two-level organization (category → component) for easy navigation

### TypeScript Configuration

- **Target**: ES2022 with Node16 module resolution
- **Output**: Compiled to `build/` directory as ES modules
- **Entry Point**: `build/index.js` (executable via shebang)

### MCP Integration

- Designed to integrate with Claude Desktop via `claude_desktop_config.json`
- Server runs as a subprocess communicating over stdio
- Absolute path required in configuration: `/path/to/build/index.js`
- Manual configuration instructions available in `MANUAL_CONFIG.md`