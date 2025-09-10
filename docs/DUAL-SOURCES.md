# Dual Documentation Sources Guide

This guide explains how to set up and use the Design System MCP Server with both public and internal documentation sources.

## Overview

The server supports two main usage scenarios:

1. **Public users**: Access only public design system documentation
2. **Internal users**: Access both public and internal documentation with internal taking priority

## Repository Structure

### Public Repository (design-system-docs)
Contains documentation safe for public consumption:
- Generic, reusable components
- Open-source friendly patterns
- General accessibility guidelines
- Brand elements safe for public use

### Internal Repository (design-system-docs-internal)
Contains internal-specific documentation:
- Internal-specific components
- Proprietary business logic
- Internal system integrations
- Sensitive brand guidelines
- Internal team processes

The internal repository includes the public repository as a submodule, allowing for easy content organization and updates.

## Setup Scenarios

### Scenario 1: Public Only

**Use case**: External developers, open-source contributors, public documentation

**Configuration:**
```yaml
# config.yml
documentation:
  sources:
    public:
      enabled: true
      repo: "https://github.com/appian-design/aurora.git"
      priority: 1
```

**Environment:**
```bash
# .env
GITHUB_TOKEN=your_public_token
GITHUB_OWNER=pglevy
GITHUB_REPO=design-system-docs
```

**Result**: Only public documentation is accessible. No source attribution needed.

### Scenario 2: Internal Access

**Use case**: Internal team members, contractors with access, internal tools

**Configuration:**
```yaml
# config.yml
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
      submodule_path: "design-system-docs"
```

**Environment:**
```bash
# .env
ENABLE_INTERNAL_DOCS=true
INTERNAL_DOCS_TOKEN=your_private_repo_token
GITHUB_TOKEN=your_public_token  # Optional, for rate limits
```

**Result**: Access to both public and internal documentation with internal overriding public when conflicts exist.

## Content Merging Behavior

### Priority System
- **Public source**: Priority 1 (lower)
- **Internal source**: Priority 2 (higher)
- Higher priority sources override lower priority sources

### Merge Examples

#### Example 1: No Conflicts
```
Public repo:
- components/cards.md
- components/buttons.md

Internal repo:
- components/internal-widget.md
- patterns/internal-flow.md
```

**Result**: All files available, each from their respective source.

#### Example 2: Override Scenario
```
Public repo:
- components/cards.md (basic card component)

Internal repo:
- components/cards.md (enhanced with internal features)
```

**Result**: Internal version served with attribution "Source: INTERNAL (overrides public)"

#### Example 3: Metadata Merging
```
Public cards.md frontmatter:
---
status: "stable"
category: "components"
---

Internal cards.md frontmatter:
---
status: "beta"
internal_only: true
last_updated: "2025-01-15"
---
```

**Merged result:**
```yaml
status: "beta"  # Internal wins
category: "components"  # From public
internal_only: true  # From internal
last_updated: "2025-01-15"  # From internal
```

## Content Organization Guidelines

### What Goes Where

#### Public Repository Content
- **Generic components**: Buttons, cards, forms that work across contexts
- **Open patterns**: Navigation, layouts, common UI patterns
- **Public brand elements**: Logos, colors, typography safe for public use
- **General guidelines**: Accessibility, content style, general best practices
- **Open-source examples**: Code snippets safe for public consumption

#### Internal Repository Content
- **Internal components**: Company-specific widgets, internal tools UI
- **Proprietary patterns**: Business-specific workflows, internal processes
- **Sensitive brand elements**: Internal brand guidelines, restricted assets
- **Internal integrations**: API-specific components, internal system patterns
- **Confidential guidelines**: Internal processes, sensitive business logic

### Naming Conventions

To avoid conflicts and ensure clarity:

#### File Organization
```
# Good - Clear separation
public/components/cards.md          # Generic card component
internal/components/dashboard-card.md  # Internal-specific card

# Avoid - Potential conflicts
components/cards.md (in both repos)  # Will cause override
```

#### Content Prefixes
```markdown
# Public content
## Button Component
Basic button implementation...

# Internal content  
## Internal Dashboard Button
Enhanced button with internal analytics...
```

### Override Strategy

When the same file exists in both repositories:

1. **Intentional overrides**: Internal version completely replaces public
2. **Content attribution**: Clear indication of source and override status
3. **Fallback behavior**: If internal source fails, public content still available

## Migration Strategies

### From Single to Dual Sources

#### Phase 1: Preparation
1. Audit existing content for sensitivity
2. Identify content that should remain public vs. internal
3. Plan repository structure

#### Phase 2: Content Separation
1. Create internal repository
2. Add public repository as submodule
3. Move sensitive content to internal repository
4. Update internal-specific content

#### Phase 3: Server Configuration
1. Update server configuration for dual sources
2. Test access controls
3. Validate content merging behavior
4. Update documentation and training

### Migration Example

**Before (single public repo):**
```
design-system-docs/
├── components/
│   ├── cards.md (mixed public/internal content)
│   └── buttons.md (public content)
└── patterns/
    └── dashboard.md (internal content)
```

**After (dual repos):**
```
design-system-docs/ (public)
├── components/
│   ├── cards.md (public content only)
│   └── buttons.md (unchanged)

design-system-docs-internal/ (private)
├── design-system-docs/ (submodule)
├── components/
│   └── cards.md (internal enhancements)
└── patterns/
    └── dashboard.md (moved from public)
```

## Access Control

### User Types

#### Public Users
- **Access**: Public documentation only
- **Configuration**: Default settings, no internal tokens
- **API behavior**: `includeInternal=false` by default
- **Error handling**: Graceful degradation when internal content referenced

#### Internal Users
- **Access**: Both public and internal documentation
- **Configuration**: `ENABLE_INTERNAL_DOCS=true` + authentication token
- **API behavior**: Can set `includeInternal=true`
- **Priority**: Internal content overrides public when available

### Authentication

#### Public Repository Access
- **No authentication**: For public repositories
- **Optional token**: To avoid rate limits
- **Rate limits**: 60 requests/hour without token, 5000 with token

#### Internal Repository Access
- **Required authentication**: GitHub personal access token
- **Permissions needed**: Repository read access
- **Token management**: Secure storage, regular rotation
- **Fallback**: Public content still available if internal fails

## Troubleshooting

### Common Issues

#### Authentication Problems
```
Error: Authentication required for source but INTERNAL_DOCS_TOKEN not provided
```
**Solution**: Verify `INTERNAL_DOCS_TOKEN` is set and has correct permissions.

#### Content Not Found
```
Component Cards not available from internal source. Available from: public
```
**Solution**: Check if content exists in requested source, or use `sourceOnly="all"`.

#### Override Confusion
```
Source: INTERNAL (overrides public)
```
**Understanding**: This is expected behavior when internal content replaces public content.

### Debug Mode

Enable detailed logging:
```bash
export DEBUG=design-system-server
```

This shows:
- Configuration loading
- Source synchronization
- Content merging decisions
- Authentication attempts
- Cache behavior

### Health Checks

Regular checks to ensure system health:

1. **Source status**: Use `get-content-sources` tool
2. **Authentication**: Verify tokens haven't expired
3. **Content sync**: Check last sync timestamps
4. **Cache performance**: Monitor response times

## Best Practices

### Content Management
1. **Regular audits**: Review what should be public vs. internal
2. **Clear documentation**: Document override decisions
3. **Version control**: Tag releases for both repositories
4. **Testing**: Validate content merging in staging environment

### Security
1. **Token rotation**: Regular authentication token updates
2. **Access reviews**: Periodic review of who has internal access
3. **Audit logging**: Monitor access to internal documentation
4. **Principle of least privilege**: Only grant internal access when needed

### Performance
1. **Cache management**: Use appropriate refresh intervals
2. **Rate limiting**: Monitor GitHub API usage
3. **Content size**: Keep documentation files reasonably sized
4. **Concurrent access**: Design for multiple simultaneous users

### Maintenance
1. **Submodule updates**: Keep internal repo's public submodule current
2. **Dependency management**: Regular updates to server dependencies
3. **Documentation**: Keep setup guides current
4. **Monitoring**: Track server performance and error rates