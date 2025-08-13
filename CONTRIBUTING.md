# Contributing to Design System MCP Server

Thank you for your interest in contributing to the Design System MCP Server! This guide will help you get started with contributing to this open-source project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

### Reporting Issues

- Use our [issue templates](.github/ISSUE_TEMPLATE/) to report bugs or request features
- Search existing issues before creating a new one
- Provide clear, detailed descriptions with examples when possible

### Suggesting Enhancements

- Open an issue using the feature request template
- Explain the use case and expected behavior
- Consider if the enhancement fits within the design system's scope

### Contributing Documentation

We welcome contributions to improve our design system documentation:

- **Component documentation**: Add new components or improve existing ones
- **Pattern documentation**: Document reusable design patterns
- **Layout guidance**: Contribute page-level layout templates
- **Accessibility improvements**: Enhance accessibility guidelines and examples
- **Code examples**: Add or improve implementation examples

## Getting Started

### For Designers

1. **Edit directly in GitHub**: Use GitHub's web interface to edit markdown files
2. **Create a branch**: Always work on a feature branch for changes
3. **Request review**: Open a pull request when ready for feedback
4. **Collaborate**: Use PR comments for discussion and iteration

### For Developers

1. **Fork the repository**: Click the "Fork" button on GitHub
2. **Clone your fork**: `git clone https://github.com/YOUR-USERNAME/design-system-docs.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make changes**: Edit markdown files or add new documentation
5. **Test locally**: Run `bundle exec jekyll serve` to preview changes
6. **Submit PR**: Push changes and open a pull request for review

## Workflow Conventions

### Tracking Work

- Check existing issues and projects before starting work
- Create or assign issues to avoid overlap with other contributors
- Use clear, descriptive commit messages

### Doing Work

- Favor use of the web editor for simple changes to keep things accessible
- For larger changes, work locally and test with Jekyll
- Paste or drag-and-drop images to leverage GitHub's `user-attachment` feature
- Keep page hierarchy as flat as possible, but use logical structure as needed
- For pages with an "Options" section, use the term "Variants" instead

### Markdown Conventions

- **Front Matter**: Delete "parent" and "related" elements if not needed for the file
- Use double space between all elements (except lists)
- Place images after heading and subheading and before paragraphs
- Use empty alt text for component images: `![](image-url)`
- Put inline functions in backticks (e.g., `a!localVariables`)
- Use `1.` for all numbers in ordered lists (sequential numbers rendered automatically)
- Use `<br>` to break lines within a paragraph
- Format code samples properly before copying over

### File Structure

Follow our established file structure:

```
design-system-docs/
├── components/         # Individual UI components
├── patterns/          # Reusable design patterns
├── layouts/           # Page-level layout templates
├── branding/          # Brand identity elements
├── accessibility/     # Accessibility guidelines
└── content-style-guide/ # Content and writing guidelines
```

## Review Process

### Submitting Pull Requests

1. **Create a clear PR title**: Use descriptive titles that explain the change
2. **Fill out the PR template**: Provide context and testing information
3. **Request review**: Tag relevant reviewers or use auto-assignment
4. **Respond to feedback**: Address comments and suggestions promptly
5. **Keep PRs focused**: One feature or fix per PR when possible

### Review Guidelines

- Have at least one other person review your changes
- Anyone with write access can merge when ready
- Delete remote branches after merge

## Local Development

### Prerequisites

- Ruby (version specified in `.ruby-version`)
- Bundler gem
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/pglevy/design-system-docs.git
cd design-system-docs

# Install dependencies
bundle install

# Serve the site locally
bundle exec jekyll serve

# View at http://localhost:4000
```

### Testing Changes

- Always test your changes locally before submitting
- Verify that all links work correctly
- Check that images display properly
- Ensure responsive design works across devices

## Style Guidelines

### Writing Style

- Use clear, concise language
- Write in active voice when possible
- Use consistent terminology throughout
- Include practical examples and use cases

### Documentation Structure

Each documentation page should include:

- Clear title and description
- Design guidelines and principles
- Accessibility considerations
- Implementation examples
- Related components or patterns

## Questions?

- Check our [existing documentation](README.md)
- Search through [existing issues](https://github.com/pglevy/design-system-docs/issues)
- Start a [discussion](https://github.com/pglevy/design-system-docs/discussions) for questions
- Reach out to maintainers for guidance

Thank you for contributing to making our design system documentation better for everyone!