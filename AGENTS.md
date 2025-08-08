# AGENTS.md - Design System MCP Server Guide

## Overview
This repository contains a **Model Context Protocol (MCP) server** that provides design system documentation access to AI assistants through GitHub integration. The server makes design system guidance available directly within development environments.

## Architecture Overview

### Core Components

1. **MCP Server (`src/index.ts`)**: Main server implementation using `@modelcontextprotocol/sdk`
   - Provides 4 tools: `list-categories`, `list-components`, `get-component-details`, `search-design-system`
   - Fetches content from GitHub repository via GitHub API
   - Uses stdio transport for AI assistant communication

2. **Data Layer (`src/design-system-data.ts`)**: Static design system catalog
   - Organized into 3 categories: `components`, `layouts`, `patterns`
   - Each item contains title, description, and GitHub repository reference
   - Uses TypeScript interfaces for type safety

### Key Architectural Patterns

- **GitHub Repository Integration**: Documentation stored in companion GitHub repository
- **Tool-based API**: Exposes functionality through MCP tools rather than traditional REST endpoints
- **Static Data + Dynamic Content**: Catalog structure is static, actual documentation fetched dynamically
- **Category-Component Hierarchy**: Two-level organization (category → component) for easy navigation

## Development Commands

### Build and Development
- `npm run build` - Compiles TypeScript to JavaScript in the `build/` directory and makes the output executable
- `npm test` - Runs comprehensive tests for GitHub API connectivity and MCP server functionality
- `tsc` - Run TypeScript compiler directly for type checking

### Installation and Setup
- `npm install` - Install dependencies
- `./setup.sh` (macOS/Linux) or `setup.bat` (Windows) - Automated AI assistant MCP configuration

## Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=repository_owner
GITHUB_REPO=repository_name
```

### TypeScript Configuration

- **Target**: ES2022 with Node16 module resolution
- **Output**: Compiled to `build/` directory as ES modules
- **Entry Point**: `build/index.js` (executable via shebang)

### MCP Integration

- Designed to integrate with AI assistants via MCP configuration
- Server runs as a subprocess communicating over stdio
- Absolute path required in configuration: `/path/to/build/index.js`
- Manual configuration instructions available in `MANUAL_CONFIG.md`

## Working with This Server

### For AI Assistants
- Use the provided MCP tools to access design system documentation
- Tools provide structured access to components, patterns, and layouts
- Content is fetched dynamically from the GitHub repository
- Search functionality available across all documentation

### Available MCP Tools

1. **list-categories**: Get available documentation categories
2. **list-components**: List components within a specific category
3. **get-component-details**: Get detailed information about a specific component
4. **search-design-system**: Search across all documentation by keyword

### Integration Points

- **GitHub Repository**: [design-system-docs](https://github.com/pglevy/design-system-docs) - Source of truth for all documentation
- **AI Assistants**: Provides real-time access to design system guidance during development
- **Development Workflow**: Enables contextual design system assistance within coding environments

## Development Guidelines

### Code Organization
- Keep MCP tools focused and single-purpose
- Maintain clear separation between data layer and API layer
- Use TypeScript for type safety and better developer experience

### Error Handling
- Provide meaningful error messages for GitHub API failures
- Handle network timeouts gracefully
- Log errors appropriately for debugging

### Performance Considerations
- Cache GitHub API responses when appropriate
- Minimize API calls through efficient data structures
- Handle rate limiting gracefully

## Testing

Run the test suite to verify:
- GitHub API connectivity
- MCP server functionality
- Tool implementations
- Error handling

```bash
npm test
```

## Deployment

The MCP server is designed to run locally as part of AI assistant configurations. See setup scripts and manual configuration documentation for deployment instructions.