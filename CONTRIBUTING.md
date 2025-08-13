# Contributing to Design System MCP Server

Thank you for your interest in contributing to the Design System MCP Server! This guide will help you get started with contributing to this open-source project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

### Reporting Issues

- Use our [issue templates](.github/ISSUE_TEMPLATE/) to report bugs or request features
- Search existing issues before creating a new one
- Provide clear, detailed descriptions with examples when possible
- Include your environment details (Node.js version, MCP client, OS)

### Suggesting Enhancements

- Open an issue using the feature request template
- Explain the use case and expected behavior
- Consider how the enhancement would benefit MCP server functionality
- Describe any new MCP tools or configuration options needed

### Contributing Code

We welcome contributions to improve the MCP server:

- **Bug fixes**: Fix issues with existing MCP tools or server functionality
- **New MCP tools**: Add new tools to extend server capabilities
- **Performance improvements**: Optimize server response times or memory usage
- **Documentation updates**: Improve setup guides, API docs, or examples
- **Configuration enhancements**: Add new configuration options or improve existing ones

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git
- An MCP client for testing (Claude Desktop, Amazon Q CLI, etc.)

### Development Setup

1. **Fork the repository**: Click the "Fork" button on GitHub
2. **Clone your fork**: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/design-system-server.git
   cd design-system-server
   ```
3. **Install dependencies**: 
   ```bash
   npm install
   ```
4. **Build the server**: 
   ```bash
   npm run build
   ```
5. **Test locally**: 
   ```bash
   npm start
   ```

### Testing Your Changes

Before submitting a pull request:

1. **Build successfully**: Ensure `npm run build` completes without errors
2. **Test with MCP client**: Configure the server in Claude Desktop or Amazon Q CLI
3. **Verify MCP tools**: Test that all tools work as expected
4. **Check error handling**: Test error scenarios and edge cases
5. **Run existing tests**: If tests exist, ensure they pass

### MCP Client Testing

#### Claude Desktop
1. Update your `claude_desktop_config.json` to point to your local build
2. Restart Claude Desktop
3. Test MCP tools in a conversation
4. Verify error messages are helpful

#### Amazon Q CLI
1. Configure the server in your Q CLI setup
2. Test MCP tools through the CLI
3. Verify integration works correctly

## Development Guidelines

### Code Style

- Follow existing code patterns and conventions
- Use TypeScript for type safety
- Add comments for complex logic
- Keep functions focused and single-purpose

### MCP Tool Development

When adding new MCP tools:

- Follow the MCP specification
- Provide clear tool descriptions
- Include proper parameter validation
- Handle errors gracefully
- Add appropriate logging

### Configuration

When adding configuration options:

- Update the example configuration files
- Document new options in README
- Ensure backward compatibility
- Provide sensible defaults

## Pull Request Process

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Follow the development guidelines above
3. **Test thoroughly**: Ensure your changes work with MCP clients
4. **Commit with clear messages**: Use descriptive commit messages
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Open a pull request**: Use the PR template and provide context
7. **Respond to feedback**: Address review comments promptly

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Fill out the PR template completely
- Include testing information
- Update documentation if needed
- Ensure CI checks pass

## Project Structure

```
design-system-server/
├── src/                 # TypeScript source code
├── build/              # Compiled JavaScript output
├── docs/               # Documentation
├── .github/            # GitHub templates and workflows
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project overview
```

## Questions and Support

- Check our [README](README.md) for setup instructions
- Search through [existing issues](https://github.com/pglevy/design-system-server/issues)
- Start a [discussion](https://github.com/pglevy/design-system-server/discussions) for questions
- Review the [MCP specification](https://modelcontextprotocol.io/docs) for technical details

Thank you for contributing to making the Design System MCP Server better for everyone!
