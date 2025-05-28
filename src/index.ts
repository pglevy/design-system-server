import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { designSystemData, DesignSystemItem } from "./design-system-data.js";

// Helper function to extract Gist ID from GitHub URL
function extractGistId(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

// Helper function to fetch Gist content
async function fetchGistContent(gistId: string): Promise<{ guidance: string; code: string } | null> {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const files = data.files;
    
    let guidance = '';
    let code = '';
    
    for (const filename in files) {
      if (filename.toLowerCase().includes('guidance')) {
        guidance = files[filename].content;
      } else if (filename.toLowerCase().includes('code')) {
        code = files[filename].content;
      }
    }
    
    return { guidance, code };
  } catch (error) {
    console.error("Error fetching Gist content:", error);
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
    
    const gistId = extractGistId(component.url);
    const gistContent = await fetchGistContent(gistId);
    
    if (!gistContent) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch details for ${component.title}.\n\nBasic information:\n${component.body}\n\nGist URL: ${component.url}`,
          },
        ],
      };
    }
    
    return {
      content: [
        {
          type: "text",
          text: `# ${component.title}\n\n${component.body}\n\n## Guidance\n\n${gistContent.guidance}\n\n## Code Example\n\n${gistContent.code}`,
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
