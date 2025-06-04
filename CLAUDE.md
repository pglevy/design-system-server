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

# GitHub repo migration plan

## **What We’d Build**

A centralized, developer-accessible design system documentation platform that makes our design guidance available directly within coding environments through AI assistants and other tools.

## **The Problem We're Solving**

**For Designers:**

- Design system documentation is scattered across different tools  
- Hard to keep documentation updated and consistent  
- Difficult to track what's been changed and by whom  
- No clear workflow for collaborative editing

**For Developers:**

- Design system guidance isn't available when actually writing code  
- Have to context-switch between code editor and documentation sites  
- Often end up implementing components inconsistently because guidance isn't easily accessible

## **Our Proposed Solution**

### **Content Creation & Editing Workflow**

**For Designers:**

1. **Web-based editing**: Edit markdown files directly in GitHub's web interface. See more below for Why GitHub.  
2. **Rich preview**: See formatted output before publishing  
3. **Collaborative editing**: Use pull requests for review and discussion  
4. **Version history**: Track all changes with automatic backups  
5. **Simple workflow**: Create branch → Edit → Request review → Merge

**For Developers:**

- Full access to raw markdown files for technical contributions  
- Can propose changes through standard pull request workflow  
- Integration with existing development processes

## **Why GitHub?**

### **Benefits**

- **Familiar workflow**: Similar to how we already collaborate on design files   
- **Version control**: Track every change with full history and rollback capability  
- **Access control**: Manage who can edit what with teams and permissions   
- **Integration ready**: Works seamlessly with developer tools and processes   
- **No additional tools**: Leverage platform we already use internally

### **Content Management with GitHub**

Private repo: https://github.com/pglevy/design-system-docs

PAT: See the `.env` file.

We'll organize all design system documentation in a dedicated, GitHub repository with a structure like:

```
design-system-docs/
├── components/
│   ├── buttons.md
│   ├── forms.md
│   └── navigation.md
├── patterns/
│   ├── page-layouts.md
│   └── user-flows.md
├── foundations/
│   ├── colors.md
│   ├── typography.md
│   └── spacing.md
└── guidelines/
    ├── accessibility.md
    └── content-style.md
```

## **The MCP Server: Making Documentation Work Where You Work**

### **What's an MCP Server?**

A "Model Context Protocol" server makes our design system documentation available directly within AI coding assistants (like Claude, GitHub Copilot, etc.) and other development tools.

### **Benefits for Developers**

- **In-context guidance**: Get design system answers while developing  
- **Consistent implementation**: AI assistants can reference our exact guidelines when suggesting code  
- **Faster development**: No more hunting through documentation sites mid-development  
- **Always up-to-date**: Documentation changes are immediately available in coding tools

### **Benefits for Designers**

- **Increased adoption**: Developers are more likely to follow guidelines when they're easily accessible  
- **Consistent implementation**: Reduced variance in how components get built  
- **Feedback loop**: See how your documentation is being used and where gaps exist  
- **Living documentation**: Your guidance becomes an active part of the development process

## **Getting Started**

### **Phase 1: Setup & Migration**

- Create repository structure  
- Migrate existing documentation to markdown format  
- Set up basic editing workflow

### **Phase 2: MCP Integration**

- Deploy MCP server to make content accessible to AI tools  
- Test integration with development environments  
- Gather feedback and iterate

### **Phase 3: Enhancement**

- Refine content organization based on usage  
- Add automation for consistency checking  
- Expand to additional tool integrations

## **Next Steps**

1. **Pilot program**: Start with 2-3 key components to test the workflow  
2. **Training session**: 30-minute walkthrough of GitHub editing for design team  
3. **Feedback collection**: Gather input after 2 weeks of pilot usage  
4. **Full rollout**: Migrate remaining documentation based on lessons learned

---

**The bottom line**: This approach puts our design system documentation directly into developers' workflows while giving designers a modern, collaborative way to maintain it. Instead of documentation that sits on a shelf, we're creating living guidance that actively shapes how our products get built.