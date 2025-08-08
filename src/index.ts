import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { designSystemData, DesignSystemItem, GITHUB_CONFIG } from "./design-system-data.js";

// Interface for parsed markdown content
interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
  designSection: string;
  developmentSection: string;
}

// Helper function to parse frontmatter from markdown
function parseFrontmatter(content: string): ParsedMarkdown {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  let frontmatter = {};
  let markdownContent = content;
  
  if (match) {
    const frontmatterText = match[1];
    markdownContent = match[2];
    
    // Parse YAML-like frontmatter
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        (frontmatter as any)[key] = value;
      }
    });
  }
  
  // Extract Design and Development sections
  const designMatch = markdownContent.match(/## Design\n([\s\S]*?)(?=## Development|$)/);
  const developmentMatch = markdownContent.match(/## Development\n([\s\S]*?)$/);
  
  return {
    frontmatter,
    content: markdownContent,
    designSection: designMatch ? designMatch[1].trim() : '',
    developmentSection: developmentMatch ? developmentMatch[1].trim() : ''
  };
}

// Helper function to fetch content from GitHub repository
async function fetchRepoContent(filePath: string): Promise<ParsedMarkdown | null> {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
    console.error(`[DEBUG] Fetching: ${filePath}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'design-system-mcp-server'
      }
    });
    
    if (!response.ok) {
      console.error(`[ERROR] GitHub API error for ${filePath}: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns base64 encoded content
    const content = atob(data.content);
    console.error(`[DEBUG] Content fetched successfully: ${content.length} characters`);
    
    const parsed = parseFrontmatter(content);
    console.error(`[DEBUG] Content parsed: Design=${parsed.designSection.length}chars, Development=${parsed.developmentSection.length}chars`);
    
    return parsed;
  } catch (error) {
    console.error(`[ERROR] Failed to fetch repo content for ${filePath}:`, error);
    return null;
  }
}

// Create server instance
const server = new McpServer({
  name: "design-system",
  version: "1.0.0",
});

// Tool 1: List all categories
server.tool(
  "list-categories",
  "List all design system categories",
  {},
  async () => {
    const categories = Object.keys(designSystemData);
    
    return {
      content: [
        {
          type: "text",
          text: `Available design system categories: ${categories.join(", ")}`,
        },
      ],
    };
  },
);

// Tool 2: List components in a category
server.tool(
  "list-components",
  "List components in a specific category",
  {
    category: z.string().describe("Design system category (components, layouts, patterns)"),
  },
  async ({ category }) => {
    const normalizedCategory = category.toLowerCase();
    
    if (!(normalizedCategory in designSystemData)) {
      return {
        content: [
          {
            type: "text",
            text: `Category not found. Available categories: ${Object.keys(designSystemData).join(", ")}`,
          },
        ],
      };
    }
    
    const items = Object.entries(designSystemData[normalizedCategory]).map(
      ([key, value]) => `${key}: ${(value as DesignSystemItem).title} - ${(value as DesignSystemItem).body}`
    );
    
    return {
      content: [
        {
          type: "text",
          text: `Components in ${normalizedCategory}:\n\n${items.join("\n\n")}`,
        },
      ],
    };
  },
);

// Tool 3: Get detailed component information
server.tool(
  "get-component-details",
  "Get detailed information about a specific component",
  {
    category: z.string().describe("Design system category (components, layouts, patterns)"),
    componentName: z.string().describe("Name of the component, layout, or pattern"),
  },
  async ({ category, componentName }) => {
    const normalizedCategory = category.toLowerCase();
    const normalizedComponentName = componentName.toLowerCase();
    
    if (!(normalizedCategory in designSystemData)) {
      return {
        content: [
          {
            type: "text",
            text: `Category not found. Available categories: ${Object.keys(designSystemData).join(", ")}`,
          },
        ],
      };
    }
    
    const categoryData = designSystemData[normalizedCategory];
    
    if (!(normalizedComponentName in categoryData)) {
      return {
        content: [
          {
            type: "text",
            text: `Component not found in ${normalizedCategory}. Available components: ${Object.keys(categoryData).join(", ")}`,
          },
        ],
      };
    }
    
    const component = categoryData[normalizedComponentName] as DesignSystemItem;
    
    const repoContent = await fetchRepoContent(component.filePath);
    
    if (!repoContent) {
      console.error(`[ERROR] Unable to fetch content for ${component.title} at ${component.filePath}`);
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch details for ${component.title}.\n\nBasic information:\n${component.body}\n\nFile path: ${component.filePath}\n\nNote: This may be due to GitHub API limits, network issues, or authentication problems. Check server logs for details.`,
          },
        ],
      };
    }
    
    let response = `# ${component.title}\n\n${component.body}\n\n`;
    
    // Add frontmatter info if available
    if (Object.keys(repoContent.frontmatter).length > 0) {
      response += `**Status:** ${repoContent.frontmatter.status || 'Unknown'}\n`;
      if (repoContent.frontmatter.last_updated) {
        response += `**Last Updated:** ${repoContent.frontmatter.last_updated}\n`;
      }
      response += '\n';
    }
    
    // Add Design section
    if (repoContent.designSection) {
      response += `## Design\n\n${repoContent.designSection}\n\n`;
    }
    
    // Add Development section
    if (repoContent.developmentSection) {
      response += `## Development\n\n${repoContent.developmentSection}`;
    }
    
    // If no sections found, show full content
    if (!repoContent.designSection && !repoContent.developmentSection) {
      response += `## Content\n\n${repoContent.content}`;
    }
    
    console.error(`[DEBUG] Final response size: ${response.length} characters for ${component.title}`);
    
    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  },
);

// Tool 4: Search across all components
server.tool(
  "search-design-system",
  "Search for components, layouts, or patterns by keyword",
  {
    keyword: z.string().describe("Keyword to search for in titles and descriptions"),
  },
  async ({ keyword }) => {
    const normalizedKeyword = keyword.toLowerCase();
    const results = [];
    
    // Search through all categories and components
    for (const [categoryName, category] of Object.entries(designSystemData)) {
      for (const [componentName, component] of Object.entries(category)) {
        if (
          component.title.toLowerCase().includes(normalizedKeyword) || 
          component.body.toLowerCase().includes(normalizedKeyword)
        ) {
          results.push({
            category: categoryName,
            name: componentName,
            title: component.title,
            description: component.body,
          });
        }
      }
    }
    
    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results found for keyword "${keyword}".`,
          },
        ],
      };
    }
    
    const formattedResults = results.map(
      result => `Category: ${result.category}\nComponent: ${result.name}\n${result.title}\n${result.description}`
    );
    
    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} results for "${keyword}":\n\n${formattedResults.join("\n\n")}`,
        },
      ],
    };
  },
);

// Tool 5: Get coding guidance
server.tool(
  "get-coding-guidance",
  "Get coding guidance and best practices for specific technologies or frameworks",
  {
    technology: z.string().describe("Technology or framework (e.g., 'sail', 'html', 'css')").optional(),
  },
  async ({ technology }) => {
    // If no technology specified, list available guides
    if (!technology) {
      const codingGuides = designSystemData['coding-guides'];
      const guides = Object.entries(codingGuides).map(
        ([key, guide]) => `${key}: ${guide.title} - ${guide.body}`
      );
      
      return {
        content: [
          {
            type: "text",
            text: `Available coding guides:\n\n${guides.join("\n\n")}\n\nUse get-component-details with category 'coding-guides' to access specific guides.`,
          },
        ],
      };
    }
    
    // Look for technology-specific guide
    const normalizedTech = technology.toLowerCase();
    const codingGuides = designSystemData['coding-guides'];
    
    // Check if there's a direct match or partial match
    let matchedGuide = null;
    let matchedKey = null;
    
    for (const [key, guide] of Object.entries(codingGuides)) {
      if (key.includes(normalizedTech) || guide.title.toLowerCase().includes(normalizedTech)) {
        matchedGuide = guide;
        matchedKey = key;
        break;
      }
    }
    
    if (!matchedGuide) {
      return {
        content: [
          {
            type: "text",
            text: `No coding guide found for "${technology}". Available guides: ${Object.keys(codingGuides).join(", ")}`,
          },
        ],
      };
    }
    
    // Fetch the full guide content
    const repoContent = await fetchRepoContent(matchedGuide.filePath);
    
    if (!repoContent) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch ${matchedGuide.title} guide. Basic info: ${matchedGuide.body}`,
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: `# ${matchedGuide.title}\n\n${repoContent.content}`,
        },
      ],
    };
  },
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Design System MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
