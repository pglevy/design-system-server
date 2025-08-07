# API Documentation

The Design System MCP Server provides tools for accessing design system documentation from multiple sources with enhanced filtering and source attribution.

## Available Tools

### 1. get-content-sources

Get information about available documentation sources and their status.

**Parameters:** None

**Response:**
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

### 2. refresh-sources

Trigger manual refresh of documentation sources and clear cache.

**Parameters:** None

**Response:**
```
Documentation sources refreshed successfully. Cache cleared and sources will be re-synced on next request.
```

### 3. list-categories

List all available design system categories.

**Parameters:** None

**Response:**
```
Available design system categories: branding, content-style-guide, accessibility, layouts, patterns, components
```

### 4. list-components

List components in a specific category.

**Parameters:**
- `category` (string): Design system category (components, layouts, patterns, etc.)

**Response:**
```
Components in components:

cards: Cards - Card components for displaying grouped content.
tabs: Tabs - Tabbed interface components for organizing content.
...
```

### 5. get-component-details

Get detailed information about a specific component with source attribution.

**Parameters:**
- `category` (string): Design system category
- `componentName` (string): Name of the component, layout, or pattern
- `includeInternal` (boolean, optional): Include internal documentation if available (default: false)
- `sourceOnly` (enum, optional): Filter by specific source ("public", "internal", "all")

**Enhanced Response Format:**
```markdown
# Cards

Card components for displaying grouped content.

**Source:** INTERNAL (overrides public)
**Status:** stable
**Last Updated:** 2025-01-15T10:30:00Z

## Design

[Design content from the highest priority source]

## Development

[Development content from the highest priority source]
```

**Source Attribution:**
- `Source`: Indicates which source provided the content ("PUBLIC" or "INTERNAL")
- `overrides`: Shows if this content overrides a lower priority source
- Content merging follows priority rules (higher priority sources override lower ones)

### 6. search-design-system

Search for components, layouts, or patterns by keyword with source filtering.

**Parameters:**
- `keyword` (string): Keyword to search for in titles and descriptions
- `includeInternal` (boolean, optional): Include internal documentation in search (default: false)
- `sourceOnly` (enum, optional): Filter results by specific source ("public", "internal", "all")

**Enhanced Response Format:**
```
Found 2 results for "card":

**Category:** components
**Component:** cards
**Title:** Cards
**Description:** Card components for displaying grouped content.
**Source:** INTERNAL (overrides public)

**Category:** patterns
**Component:** document-cards
**Title:** Document Cards
**Description:** Card patterns for displaying document information.
**Source:** PUBLIC
```

## Content Merging Behavior

### Priority System
- **Public source**: Priority 1 (lower priority)
- **Internal source**: Priority 2 (higher priority)
- Higher priority sources override lower priority sources for the same file

### Merge Logic
1. **File-level merging**: Conflicts resolved at the file level (entire file from higher priority source)
2. **Metadata merging**: Frontmatter from all sources combined (higher priority wins for conflicts)
3. **Source attribution**: All responses indicate source and override status

### Example Scenarios

#### Scenario 1: Public Only
```yaml
# Configuration
sources:
  public:
    enabled: true
    priority: 1
```

**Result:** Only public content served, no source attribution needed.

#### Scenario 2: Dual Sources - No Conflicts
```yaml
# Configuration
sources:
  public:
    enabled: true
    priority: 1
  internal:
    enabled: true
    priority: 2
```

**Files:**
- `components/cards.md` exists in public only
- `components/internal-widget.md` exists in internal only

**Result:** Each file served from its respective source with source attribution.

#### Scenario 3: Dual Sources - With Override
```yaml
# Configuration (same as above)
```

**Files:**
- `components/cards.md` exists in both public and internal

**Result:** Internal version served with "Source: INTERNAL (overrides public)" attribution.

## Error Handling

### Authentication Errors
```
Error: Authentication required for source but INTERNAL_DOCS_TOKEN not provided
```

### Source Unavailable
```
Component Cards not available from internal source. Available from: public
```

### Access Restrictions
```
Component Cards is only available in internal documentation. Set includeInternal=true to access.
```

### Network/API Errors
```
Failed to fetch details for Cards.

Basic information:
Card components for displaying grouped content.

File path: components/cards.md

Note: This may be due to GitHub API limits, network issues, or authentication problems. Check server logs for details.
```

## Filtering Parameters

### includeInternal
- `false` (default): Only show public content
- `true`: Include internal content if available and accessible

### sourceOnly
- `"public"`: Only return content from public source
- `"internal"`: Only return content from internal source  
- `"all"`: Return content from any source (respects includeInternal setting)

## Backward Compatibility

All existing API calls continue to work without modification:
- Default behavior matches original single-source implementation
- New parameters are optional
- Response format enhanced but maintains core structure
- Legacy tools work with public source only

## Performance Considerations

### Caching
- Content cached based on `refresh_interval` setting
- Cache cleared on `refresh-sources` call
- Cache keys include source information

### Rate Limiting
- GitHub API rate limits apply per source
- Authentication tokens increase rate limits
- Failed requests don't affect other sources

### Concurrent Access
- Multiple sources fetched concurrently when possible
- Source failures don't block other sources
- Graceful degradation when sources unavailable