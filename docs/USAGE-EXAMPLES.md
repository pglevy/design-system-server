# Usage Examples

This document provides comprehensive examples of how to use the Design System MCP Server with both public and internal documentation sources.

## Basic Usage (Public Documentation)

### Getting Started

```bash
# Check what's available
"What design system categories are available?"

# Browse a category
"Show me all components in the 'components' category"

# Get component details
"Get details about the 'cards' component"

# Search for components
"Search the design system for 'navigation'"
```

### Expected Responses

#### Category Listing
```
Available design system categories: branding, content-style-guide, accessibility, layouts, patterns, components
```

#### Component Listing
```
Components in components:

cards: Cards - Card components for displaying grouped content.
tabs: Tabs - Tabbed interface components for organizing content.
breadcrumbs: Breadcrumbs - Navigation breadcrumb components for showing hierarchy.
...
```

#### Component Details
```markdown
# Cards

Card components for displaying grouped content.

**Source:** PUBLIC
**Status:** stable
**Last Updated:** 2025-01-15T10:30:00Z

## Design

Cards are flexible containers for grouping related content...

## Development

Use the Card component to create consistent content containers...
```

## Dual-Source Usage (Public + Internal)

### Source Management

```bash
# Check source status
"Check the status of documentation sources"

# Refresh sources manually
"Refresh the documentation sources"
```

#### Source Status Response
```
Documentation Sources Status:

**PUBLIC SOURCE**
- Enabled: true
- Priority: 1
- Authentication Required: false
- Last Sync: 2025-01-15T10:30:00Z

**INTERNAL SOURCE**
- Enabled: true
- Priority: 2
- Authentication Required: true
- Last Sync: 2025-01-15T10:30:00Z
```

### Accessing Internal Documentation

```bash
# Include internal documentation in component details
"Get details about the 'cards' component including internal documentation"

# Access internal-only components
"Get details about the 'admin-panel' component including internal documentation"

# Search including internal content
"Search for 'dashboard' including internal documentation"
```

#### Internal Content Response
```markdown
# Cards

Card components for displaying grouped content.

**Source:** INTERNAL (overrides public)
**Status:** beta
**Last Updated:** 2025-01-15T10:30:00Z

## Design

Cards are flexible containers with enhanced internal features...
[Internal-specific design guidance]

## Development

Enhanced Card component with internal analytics integration...
[Internal-specific implementation details]
```

### Source Filtering

```bash
# Get content from specific source only
"Get details about the 'cards' component from internal source only"

# Search within specific source
"Search for 'widget' in internal documentation only"

# Search all sources
"Search for 'button' in all documentation sources"
```

#### Source-Filtered Response
```
Found 2 results for "widget":

**Category:** components
**Component:** admin-widget
**Title:** Admin Widget
**Description:** Administrative interface widget for internal tools.
**Source:** INTERNAL

**Category:** patterns
**Component:** dashboard-widget
**Title:** Dashboard Widget
**Description:** Widget pattern for dashboard layouts.
**Source:** INTERNAL
```

## Advanced Usage Patterns

### Content Discovery Workflow

```bash
# 1. Start with overview
"What design system categories are available?"

# 2. Explore specific category
"Show me all components in the 'patterns' category"

# 3. Get detailed information
"Get details about the 'banners' pattern including internal documentation"

# 4. Search for related content
"Search for 'alert' including internal documentation"

# 5. Check for internal alternatives
"Search for 'banner' in internal documentation only"
```

### Component Research Workflow

```bash
# Research a specific component across sources
"Get details about the 'navigation' component"
"Get details about the 'navigation' component including internal documentation"
"Search for 'nav' in all documentation sources"
```

### Internal Team Workflow

```bash
# Check what's available internally
"Search for 'internal' in internal documentation only"

# Compare public vs internal versions
"Get details about the 'cards' component"  # Public version
"Get details about the 'cards' component including internal documentation"  # Internal version

# Find internal-only components
"Show me all components including internal documentation"
```

## Error Handling Examples

### Authentication Issues

#### Query
```bash
"Get details about the 'admin-panel' component including internal documentation"
```

#### Response (No Internal Access)
```
Component admin-panel is only available in internal documentation. Set includeInternal=true to access.
```

#### Response (Authentication Failed)
```
Failed to fetch details for Admin Panel.

Basic information:
Administrative interface component for internal tools.

File path: components/admin-panel.md

Note: This may be due to GitHub API limits, network issues, or authentication problems. Check server logs for details.
```

### Content Not Found

#### Query
```bash
"Get details about the 'nonexistent' component"
```

#### Response
```
Component not found in components. Available components: cards, tabs, breadcrumbs, confirmation-dialog, milestones, more-less-link
```

### Source Filtering Issues

#### Query
```bash
"Get details about the 'cards' component from internal source only"
```

#### Response (When Only Public Exists)
```
Component Cards not available from internal source. Available from: public
```

## Integration Examples

### With Claude Desktop

```json
{
    "mcpServers": {
        "design-system": {
            "command": "node",
            "args": ["/path/to/design-system-server/build/index.js"]
        }
    }
}
```

#### Usage in Claude
```
User: "I need to create a card component for our dashboard. What options do we have?"

Claude: I'll check our design system for card components.

[Uses get-component-details tool]

Based on our design system, we have a Cards component available. Let me get the details including any internal documentation since this is for a dashboard.

[Shows component details with internal enhancements]

The Cards component has both public and internal versions. The internal version includes enhanced features for dashboard use...
```

### With Amazon Q

```bash
# In terminal
q chat

# Then in Q chat
"What card components are available in our design system?"
"Show me the internal version of the cards component"
"Search for dashboard-specific components"
```

## Troubleshooting Examples

### Debug Source Issues

```bash
# Check source configuration
"Check the status of documentation sources"

# Test basic functionality
"What design system categories are available?"

# Test internal access
"Search for 'test' including internal documentation"
```

### Performance Optimization

```bash
# Clear cache if content seems stale
"Refresh the documentation sources"

# Check specific source status
"Check the status of documentation sources"
```

### Content Validation

```bash
# Verify content merging
"Get details about the 'cards' component"  # Should show source attribution
"Get details about the 'cards' component including internal documentation"  # Should show override if applicable
```

## Best Practices

### For Public Users

1. **Start broad, then narrow down**:
   ```bash
   "What design system categories are available?"
   "Show me all components in the 'components' category"
   "Get details about the 'cards' component"
   ```

2. **Use search effectively**:
   ```bash
   "Search the design system for 'form'"  # Find all form-related content
   "Search the design system for 'button'"  # Find button components and patterns
   ```

3. **Understand the structure**:
   - Categories organize content by type
   - Components are reusable UI elements
   - Patterns are higher-level design solutions
   - Layouts provide page-level structure

### For Internal Users

1. **Always check for internal versions**:
   ```bash
   "Get details about the 'cards' component including internal documentation"
   ```

2. **Use source filtering strategically**:
   ```bash
   "Search for 'admin' in internal documentation only"  # Find internal tools
   "Search for 'public' in all documentation sources"  # Find public-facing components
   ```

3. **Monitor source status**:
   ```bash
   "Check the status of documentation sources"  # Regular health check
   ```

4. **Understand override behavior**:
   - Internal content overrides public when both exist
   - Source attribution shows which version you're seeing
   - Use filtering to see specific versions

### For Administrators

1. **Regular health checks**:
   ```bash
   "Check the status of documentation sources"
   "Refresh the documentation sources"
   ```

2. **Content validation**:
   ```bash
   # Test that overrides work correctly
   "Get details about the 'cards' component"
   "Get details about the 'cards' component including internal documentation"
   ```

3. **Access control verification**:
   ```bash
   # Test with different user permissions
   "Search for 'internal' including internal documentation"
   ```

## Common Workflows

### New Team Member Onboarding

```bash
# 1. Overview of available content
"What design system categories are available?"

# 2. Explore each category
"Show me all components in the 'components' category"
"Show me all patterns in the 'patterns' category"

# 3. Learn about key components
"Get details about the 'cards' component including internal documentation"
"Get details about the 'navigation' pattern including internal documentation"

# 4. Understand internal vs public
"Check the status of documentation sources"
"Search for 'internal' in internal documentation only"
```

### Component Implementation

```bash
# 1. Find the right component
"Search the design system for 'form'"

# 2. Get detailed implementation guidance
"Get details about the 'forms' layout including internal documentation"

# 3. Look for related components
"Search for 'input' including internal documentation"
"Search for 'validation' including internal documentation"

# 4. Check for internal enhancements
"Get details about the 'forms' layout from internal source only"
```

### Design System Audit

```bash
# 1. Check source health
"Check the status of documentation sources"

# 2. Inventory all content
"Show me all components including internal documentation"
"Show me all patterns including internal documentation"
"Show me all layouts including internal documentation"

# 3. Identify gaps
"Search for 'TODO' including internal documentation"
"Search for 'deprecated' including internal documentation"

# 4. Refresh if needed
"Refresh the documentation sources"
```