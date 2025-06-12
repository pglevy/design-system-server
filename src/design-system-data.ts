import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Define the type structure for our design system data
export interface DesignSystemItem {
  title: string;
  body: string;
  filePath: string;
}

export interface DesignSystemCategory {
  [key: string]: DesignSystemItem;
}

export interface DesignSystemData {
  branding: DesignSystemCategory;
  'content-style-guide': DesignSystemCategory;
  accessibility: DesignSystemCategory;
  layouts: DesignSystemCategory;
  patterns: DesignSystemCategory;
  components: DesignSystemCategory;
  [key: string]: DesignSystemCategory;
}

// Load environment variables from .env file
function loadEnvVariable(variableName: string): string {
  // Get the current file's directory (ES module equivalent of __dirname)
  const currentDir = dirname(fileURLToPath(import.meta.url));
  
  // Try multiple possible locations for .env file
  const possiblePaths = [
    join(process.cwd(), '.env'),
    join(currentDir, '..', '.env'),
    join(currentDir, '..', '..', '.env')
  ];
  
  for (const envPath of possiblePaths) {
    try {
      console.error(`[DEBUG] Attempting to load .env from: ${envPath}`);
      const envContent = readFileSync(envPath, 'utf8');
      const regex = new RegExp(`${variableName}=(.+)`);
      const match = envContent.match(regex);
      if (match) {
        const value = match[1].trim();
        if (variableName === 'GITHUB_TOKEN') {
          console.error(`[DEBUG] ${variableName} loaded from .env: ${value.substring(0, 20)}...`);
        } else {
          console.error(`[DEBUG] ${variableName} loaded from .env: ${value}`);
        }
        return value;
      }
    } catch (error) {
      console.error(`[DEBUG] Failed to load .env from ${envPath}: ${error}`);
    }
  }
  
  // Fall back to environment variable
  const envValue = process.env[variableName] || '';
  if (variableName === 'GITHUB_TOKEN') {
    console.error(`[DEBUG] Using environment ${variableName}: ${envValue ? envValue.substring(0, 20) + '...' : 'EMPTY'}`);
  } else {
    console.error(`[DEBUG] Using environment ${variableName}: ${envValue || 'EMPTY'}`);
  }
  return envValue;
}

// GitHub repository configuration
export const GITHUB_CONFIG = {
  owner: loadEnvVariable('GITHUB_OWNER'),
  repo: loadEnvVariable('GITHUB_REPO'),
  token: loadEnvVariable('GITHUB_TOKEN')
};

export const designSystemData: DesignSystemData = {
  branding: {
    'logo-and-favicon': {
      title: 'Logo and Favicon',
      body: 'Guidelines for using logos and favicons consistently across applications.',
      filePath: 'branding/logo-and-favicon.md'
    },
    'colors': {
      title: 'Colors',
      body: 'Color palette and usage guidelines for the design system.',
      filePath: 'branding/colors.md'
    },
    'icons': {
      title: 'Icons',
      body: 'Icon library and usage guidelines.',
      filePath: 'branding/icons.md'
    },
    'typography': {
      title: 'Typography',
      body: 'Typography scale, fonts, and text styling guidelines.',
      filePath: 'branding/typography.md'
    },
    'approach-to-ai': {
      title: 'Approach to AI',
      body: 'Guidelines for incorporating AI elements in design.',
      filePath: 'branding/approach-to-ai.md'
    }
  },
  'content-style-guide': {
    'voice-and-tone': {
      title: 'Voice and Tone',
      body: 'Guidelines for consistent voice and tone across content.',
      filePath: 'content-style-guide/voice-and-tone.md'
    },
    'dictionary': {
      title: 'Dictionary',
      body: 'Terminology and language standards.',
      filePath: 'content-style-guide/dictionary.md'
    }
  },
  accessibility: {
    'checklist': {
      title: 'Accessibility Checklist',
      body: 'Comprehensive checklist for ensuring accessible design and development.',
      filePath: 'accessibility/checklist.md'
    }
  },
  layouts: {
    'dashboards': {
      title: 'Dashboards',
      body: 'Layout patterns for dashboard interfaces.',
      filePath: 'layouts/dashboards.md'
    },
    'empty-states': {
      title: 'Empty States',
      body: 'Layout guidance for empty state screens.',
      filePath: 'layouts/empty-states.md'
    },
    'forms': {
      title: 'Forms',
      body: 'Form layout patterns and best practices.',
      filePath: 'layouts/forms.md'
    },
    'grids': {
      title: 'Grids',
      body: 'Grid system and layout structures.',
      filePath: 'layouts/grids.md'
    },
    'landing-pages': {
      title: 'Landing Pages',
      body: 'Layout patterns for landing and marketing pages.',
      filePath: 'layouts/landing-pages.md'
    },
    'messaging-module': {
      title: 'Messaging Module',
      body: 'Layout for messaging and communication interfaces.',
      filePath: 'layouts/messaging-module.md'
    },
    'pane-layouts': {
      title: 'Pane Layouts',
      body: 'Multi-pane layout patterns for complex interfaces.',
      filePath: 'layouts/pane-layouts.md'
    },
    'portals': {
      title: 'Portals',
      body: 'Portal and hub page layout patterns.',
      filePath: 'layouts/portals.md'
    },
    'record-views': {
      title: 'Record Views',
      body: 'Layout patterns for viewing and editing records.',
      filePath: 'layouts/record-views.md'
    }
  },
  patterns: {
    'banners': {
      title: 'Banners',
      body: 'Banner patterns for important announcements and alerts.',
      filePath: 'patterns/banners.md'
    },
    'calendar-widget': {
      title: 'Calendar Widget',
      body: 'Calendar interface patterns and interactions.',
      filePath: 'patterns/calendar-widget.md'
    },
    'charts': {
      title: 'Charts',
      body: 'Data visualization and chart patterns.',
      filePath: 'patterns/charts.md'
    },
    'comment-thread': {
      title: 'Comment Thread',
      body: 'Comment and discussion thread patterns.',
      filePath: 'patterns/comment-thread.md'
    },
    'document-summary': {
      title: 'Document Summary',
      body: 'Document summary and preview patterns.',
      filePath: 'patterns/document-summary.md'
    },
    'document-cards': {
      title: 'Document Cards',
      body: 'Card patterns for displaying document information.',
      filePath: 'patterns/document-cards.md'
    },
    'inline-dialog': {
      title: 'Inline Dialog',
      body: 'Inline dialog and contextual popup patterns.',
      filePath: 'patterns/inline-dialog.md'
    },
    'key-performance-indicators': {
      title: 'Key Performance Indicators',
      body: 'KPI display and dashboard patterns.',
      filePath: 'patterns/key-performance-indicators.md'
    },
    'notifications': {
      title: 'Notifications',
      body: 'Notification patterns for system messages and alerts.',
      filePath: 'patterns/notifications.md'
    },
    'pick-list': {
      title: 'Pick List',
      body: 'Selection and pick list interface patterns.',
      filePath: 'patterns/pick-list.md'
    }
  },
  components: {
    'breadcrumbs': {
      title: 'Breadcrumbs',
      body: 'Navigation breadcrumb components for showing hierarchy.',
      filePath: 'components/breadcrumbs.md'
    },
    'cards': {
      title: 'Cards',
      body: 'Card components for displaying grouped content.',
      filePath: 'components/cards.md'
    },
    'confirmation-dialog': {
      title: 'Confirmation Dialog',
      body: 'Modal dialog components for confirmations.',
      filePath: 'components/confirmation-dialog.md'
    },
    'milestones': {
      title: 'Milestones',
      body: 'Milestone and progress indicator components.',
      filePath: 'components/milestones.md'
    },
    'more-less-link': {
      title: 'More / Less Link',
      body: 'Expandable content toggle components.',
      filePath: 'components/more-less-link.md'
    },
    'tabs': {
      title: 'Tabs',
      body: 'Tabbed interface components for organizing content.',
      filePath: 'components/tabs.md'
    }
  }
};