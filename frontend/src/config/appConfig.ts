// App Configuration - Change app name here and it will reflect everywhere
export const APP_CONFIG = {
  // App Identity
  name: 'SponsorConnect',
  displayName: 'SponsorConnect',
  tagline: 'Connect Brands with Influencers',
  
  // Database/Backend related (lowercase, no spaces)
  databaseName: 'sponsorconnect',
  containerPrefix: 'sponsorconnect',
  
  // URLs and API
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
  
  // Company/Brand info
  company: {
    description: 'The premier platform connecting brands with content creators and influencers for authentic marketing partnerships.',
    website: 'https://sponsorconnect.com',
    support: 'support@sponsorconnect.com'
  }
} as const;

// Export individual values for easier imports
export const { name: APP_NAME, displayName: APP_DISPLAY_NAME, tagline: APP_TAGLINE } = APP_CONFIG;
export const { databaseName: DB_NAME, containerPrefix: CONTAINER_PREFIX } = APP_CONFIG;
export const { apiBaseUrl: API_BASE_URL, frontendUrl: FRONTEND_URL } = APP_CONFIG;
