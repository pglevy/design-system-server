# Migration Guide

This guide helps existing users upgrade from single-source to dual-source documentation setup.

## Overview

The Design System MCP Server now supports both public and internal documentation sources. This migration guide covers:

- Upgrading from single-source setup
- Configuration changes needed
- Breaking changes (if any)
- Rollback procedures

## Pre-Migration Checklist

Before starting the migration:

- [ ] **Backup current configuration**: Save your existing `.env` and any custom configs
- [ ] **Audit content**: Identify what should remain public vs. become internal
- [ ] **Plan repository structure**: Decide on internal repository organization
- [ ] **Test environment**: Set up staging environment for testing
- [ ] **Access tokens**: Prepare GitHub tokens for private repository access

## Migration Scenarios

### Scenario 1: Staying Public-Only

**If you want to keep using only public documentation:**

✅ **No changes required!** The server maintains full backward compatibility.

Your existing configuration will continue to work exactly as before:

```bash
# .env (unchanged)
GITHUB_TOKEN=your_token
GITHUB_OWNER=your_username
GITHUB_REPO=design-system-docs
```

### Scenario 2: Adding Internal Documentation

**If you want to add internal documentation alongside public:**

#### Step 1: Create Internal Repository

1. Create a new private GitHub repository (e.g., `design-system-docs-internal`)
2. Add your public repository as a submodule:
   ```bash
   git submodule add https://github.com/your-username/design-system-docs.git
   ```

#### Step 2: Update Server Configuration

Add internal documentation settings to your `.env`:

```bash
# Existing settings (keep these)
GITHUB_TOKEN=your_public_token
GITHUB_OWNER=your_username
GITHUB_REPO=design-system-docs

# New settings for internal docs
ENABLE_INTERNAL_DOCS=true
INTERNAL_DOCS_TOKEN=your_private_repo_token
```

#### Step 3: Test the Setup

1. Rebuild the server:
   ```bash
   npm run build
   ```

2. Test source status:
   ```bash
   # In Claude or your MCP client
   "Check the status of documentation sources"
   ```

3. Verify both sources are available:
   ```
   **PUBLIC SOURCE**
   - Enabled: true
   - Priority: 1
   
   **INTERNAL SOURCE**
   - Enabled: true
   - Priority: 2
   ```

### Scenario 3: Migrating Content to Internal

**If you want to move some existing public content to internal:**

#### Step 1: Content Audit

Review your existing documentation and categorize:

```bash
# Example audit results
components/
├── cards.md          # Keep public
├── buttons.md        # Keep public
├── admin-panel.md    # Move to internal
└── dashboard.md      # Move to internal

patterns/
├── navigation.md     # Keep public
└── internal-flow.md  # Move to internal
```

#### Step 2: Content Migration

1. **Create internal repository** (as in Scenario 2)

2. **Move sensitive content**:
   ```bash
   # In your internal repository
   mkdir -p components patterns
   
   # Copy sensitive files from public repo
   cp ../design-system-docs/components/admin-panel.md components/
   cp ../design-system-docs/patterns/internal-flow.md patterns/
   ```

3. **Remove from public repository**:
   ```bash
   # In your public repository
   git rm components/admin-panel.md
   git rm patterns/internal-flow.md
   git commit -m "Move internal content to private repository"
   ```

4. **Update internal content** with internal-specific information

#### Step 3: Test Content Merging

Verify that content is served from the correct sources:

```bash
# Should come from public source
"Get details about the cards component"

# Should come from internal source (if you have access)
"Get details about the admin-panel component with internal documentation included"
```

## Configuration Changes

### Environment Variables

#### New Variables
- `ENABLE_INTERNAL_DOCS`: Set to `true` to enable internal documentation
- `INTERNAL_DOCS_TOKEN`: GitHub token for private repository access
- `DOCS_REFRESH_INTERVAL`: Optional, override default refresh interval

#### Existing Variables (Unchanged)
- `GITHUB_TOKEN`: Still used for public repository access
- `GITHUB_OWNER`: Still used for public repository
- `GITHUB_REPO`: Still used for public repository

### Configuration File (Optional)

For advanced configuration, create `config.yml`:

```yaml
documentation:
  sources:
    public:
      enabled: true
      repo: "https://github.com/your-username/design-system-docs.git"
      priority: 1
    internal:
      enabled: true
      repo: "https://github.com/your-username/design-system-docs-internal.git"
      priority: 2
      auth_required: true
      submodule_path: "design-system-docs"

refresh_interval: 300
cache_enabled: true
```

## Breaking Changes

### None! 🎉

The migration maintains full backward compatibility:

- **Existing API calls work unchanged**
- **Default behavior matches original implementation**
- **No changes required for public-only usage**
- **Response format enhanced but maintains core structure**

### New Features (Optional)

Enhanced API tools with new optional parameters:

```javascript
// Old way (still works)
get-component-details(category: "components", componentName: "cards")

// New way (optional enhancements)
get-component-details(
  category: "components", 
  componentName: "cards",
  includeInternal: true,
  sourceOnly: "all"
)
```

## Testing Your Migration

### 1. Basic Functionality Test

```bash
# Test that basic functionality still works
"What design system categories are available?"
"Show me all components in the 'components' category"
"Get details about the 'cards' component"
```

### 2. Source Status Test

```bash
# Verify sources are configured correctly
"Check the status of documentation sources"
```

Expected output for dual-source setup:
```
**PUBLIC SOURCE**
- Enabled: true
- Priority: 1
- Authentication Required: false

**INTERNAL SOURCE**
- Enabled: true
- Priority: 2
- Authentication Required: true
```

### 3. Content Access Test

```bash
# Test public content access
"Get details about the cards component"

# Test internal content access (if applicable)
"Get details about the admin-panel component with internal documentation included"
```

### 4. Search Functionality Test

```bash
# Test basic search
"Search the design system for 'button'"

# Test search with internal access
"Search for 'internal' components including internal documentation"
```

## Rollback Procedures

If you need to rollback to the previous single-source setup:

### Quick Rollback

1. **Disable internal docs**:
   ```bash
   # In your .env file
   ENABLE_INTERNAL_DOCS=false
   # or remove the line entirely
   ```

2. **Restart the server**:
   ```bash
   npm run build
   ```

### Complete Rollback

1. **Remove new environment variables**:
   ```bash
   # Remove from .env
   # ENABLE_INTERNAL_DOCS=true
   # INTERNAL_DOCS_TOKEN=your_token
   ```

2. **Remove configuration file** (if created):
   ```bash
   rm config.yml
   ```

3. **Rebuild and restart**:
   ```bash
   npm run build
   ```

Your server will return to the original single-source behavior.

## Troubleshooting Migration Issues

### Issue: Internal docs not showing up

**Symptoms**: Only public content visible, internal content not accessible

**Solutions**:
1. Verify `ENABLE_INTERNAL_DOCS=true` is set
2. Check `INTERNAL_DOCS_TOKEN` has correct permissions
3. Confirm internal repository URL is correct
4. Test token access manually:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" \
        https://api.github.com/repos/owner/internal-repo
   ```

### Issue: Authentication errors

**Symptoms**: "Authentication required" errors

**Solutions**:
1. Verify token hasn't expired
2. Check token has repository read permissions
3. Confirm repository is accessible with the token
4. Try regenerating the token

### Issue: Content not updating

**Symptoms**: Old content still showing after changes

**Solutions**:
1. Clear cache manually:
   ```bash
   "Refresh the documentation sources"
   ```
2. Check `refresh_interval` setting
3. Verify changes were committed to the correct repository

### Issue: Override behavior unexpected

**Symptoms**: Wrong content version showing

**Solutions**:
1. Check file exists in expected repository
2. Verify priority settings (internal should be higher than public)
3. Use source attribution to understand which source is being used
4. Check for file path differences between repositories

## Post-Migration Best Practices

### 1. Regular Health Checks

Set up monitoring to check:
- Source availability
- Authentication status
- Content freshness
- Cache performance

### 2. Content Governance

Establish processes for:
- Deciding what content goes where
- Reviewing content sensitivity
- Managing content updates
- Coordinating between public and internal teams

### 3. Access Management

Implement procedures for:
- Granting internal documentation access
- Regular access reviews
- Token rotation
- Audit logging

### 4. Documentation Maintenance

Keep documentation current:
- Update setup guides
- Document override decisions
- Maintain troubleshooting guides
- Train team members on new features

## Getting Help

If you encounter issues during migration:

1. **Check the logs**: Enable debug mode with `DEBUG=design-system-server`
2. **Review documentation**: See [Configuration Guide](CONFIGURATION.md) and [API Guide](API.md)
3. **Test in isolation**: Try each component separately
4. **Verify prerequisites**: Ensure all tokens and permissions are correct

## Migration Checklist

Use this checklist to track your migration progress:

### Pre-Migration
- [ ] Backup current configuration
- [ ] Audit content for sensitivity
- [ ] Plan repository structure
- [ ] Set up test environment
- [ ] Prepare access tokens

### Migration
- [ ] Create internal repository (if needed)
- [ ] Update environment variables
- [ ] Create configuration file (if needed)
- [ ] Move sensitive content (if applicable)
- [ ] Test basic functionality
- [ ] Test source status
- [ ] Test content access
- [ ] Test search functionality

### Post-Migration
- [ ] Update team documentation
- [ ] Train users on new features
- [ ] Set up monitoring
- [ ] Establish content governance
- [ ] Plan regular maintenance

### Rollback Plan
- [ ] Document rollback procedure
- [ ] Test rollback in staging
- [ ] Prepare communication plan
- [ ] Identify rollback triggers