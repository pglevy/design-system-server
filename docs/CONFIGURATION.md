# Configuration System

The Design System MCP Server supports a flexible configuration system that allows you to serve content from multiple documentation sources.

## Configuration File

The server looks for a `config.yml` file in the project root. If not found, it uses default settings.

### Basic Structure

```yaml
documentation:
  sources:
    public:
      enabled: true
      path: "./docs-public"
      repo: "https://github.com/appian-design/aurora.git"
      branch: "main"
      priority: 1
      auth_required: false
    internal:
      enabled: false
      path: "./docs-internal"
      repo: "https://github.com/appian-design/aurora-internal.git"
      branch: "main"
      priority: 2
      auth_required: true
      submodule_path: "design-system-docs"

refresh_interval: 300
cache_enabled: true
```

## Configuration Options

### Documentation Sources

Each source supports the following options:

- **enabled**: Boolean - Whether this source is active
- **path**: String - Local directory path for cloned content
- **repo**: String - Git repository URL
- **branch**: String - Git branch to use (default: "main")
- **priority**: Number - Higher numbers override lower numbers for conflicts
- **auth_required**: Boolean - Whether authentication is needed
- **submodule_path**: String (optional) - Path to submodule within the repo

### Global Settings

- **refresh_interval**: Number - How often to sync sources (seconds, default: 300)
- **cache_enabled**: Boolean - Enable response caching (default: true)

## Environment Variables

Environment variables can override configuration settings:

### Required for Internal Documentation

- `ENABLE_INTERNAL_DOCS=true` - Enables internal documentation source
- `INTERNAL_DOCS_TOKEN` - GitHub token for private repository access

### Optional Overrides

- `DOCS_REFRESH_INTERVAL` - Override refresh interval
- `GITHUB_OWNER` - Override GitHub owner for public repo
- `GITHUB_REPO` - Override GitHub repository name for public repo
- `GITHUB_TOKEN` - Token for public repository (if auth required)

## Authentication

### Public Documentation

Public repositories typically don't require authentication. However, if you hit GitHub API rate limits, you can provide a `GITHUB_TOKEN`.

### Internal Documentation

Internal/private repositories require authentication:

1. Create a GitHub Personal Access Token with repository access
2. Set the `INTERNAL_DOCS_TOKEN` environment variable
3. Enable internal docs with `ENABLE_INTERNAL_DOCS=true`

## Content Merging

When multiple sources are enabled:

1. **Priority-based**: Higher priority sources override lower priority ones
2. **File-level**: Conflicts resolved at the file level (not merged within files)
3. **Source attribution**: Responses indicate which source provided the content

## Example Configurations

### Public Only (Default)

```yaml
documentation:
  sources:
    public:
      enabled: true
      repo: "https://github.com/appian-design/aurora.git"
```

### Dual Sources

```yaml
documentation:
  sources:
    public:
      enabled: true
      repo: "https://github.com/appian-design/aurora.git"
      priority: 1
    internal:
      enabled: true
      repo: "https://github.com/appian-design/aurora-internal.git"
      priority: 2
      auth_required: true
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify token has correct permissions
   - Check token is not expired
   - Ensure token is set in environment

2. **Repository Access**
   - Verify repository URLs are correct
   - Check network connectivity
   - Ensure branch exists

3. **Configuration Validation**
   - Check YAML syntax
   - Verify all required fields are present
   - Review error messages in server logs

### Debug Mode

Set environment variable for detailed logging:
```bash
export DEBUG=design-system-server
```

This will show configuration loading, source synchronization, and content merging details.