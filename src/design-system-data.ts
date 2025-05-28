// Define the type structure for our design system data
export interface DesignSystemItem {
  title: string;
  body: string;
  url: string;
}

export interface DesignSystemCategory {
  [key: string]: DesignSystemItem;
}

export interface DesignSystemData {
  components: DesignSystemCategory;
  layouts: DesignSystemCategory;
  patterns: DesignSystemCategory;
  [key: string]: DesignSystemCategory;
}

export const designSystemData: DesignSystemData = {
  components: {
    'breadcrumbs': { 
      title: 'Breadcrumbs (Components)',
      body: 'Breadcrumbs are a navigation aid that help users understand where they are in the application hierarchy.',
      url: 'https://gist.github.com/d06a1535eb4bfd34113a9068fd64f641'
    },
    'cards': { 
      title: 'Cards (Components)',
      body: 'Cards are containers that display content and actions on a single topic.',
      url: 'https://gist.github.com/2a3696b0d394b2fbb169a0161ca1dcee'
    },
    'more-less-link': { 
      title: 'More/Less Link (Components)',
      body: 'More/Less links allow users to expand or collapse content sections.',
      url: 'https://gist.github.com/a405696ea1876eb423454e4a80729cbd'
    }
  },
  layouts: {
    'empty-states': { 
      title: 'Empty States (Layouts)',
      body: 'Empty states provide feedback when no data is available for display in a view.',
      url: 'https://gist.github.com/41b571829dc4436bae4ee6dcd6c04840'
    }
  },
  patterns: {
    'banners': { 
      title: 'Banners (Patterns)',
      body: 'Banners provide users with important information that may affect their experience.',
      url: 'https://gist.github.com/49bfc97a5314081a03912ed277449605'
    },
    'notifications': { 
      title: 'Notifications (Patterns)',
      body: 'Notifications provide users with timely information about events or changes in the system.',
      url: 'https://gist.github.com/4df12bb673b7e1c1b56f364bcadacdea'
    }
  }
};