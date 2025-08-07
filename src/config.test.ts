import { loadConfig, validateAuth, getAuthToken } from './config.js';

// Simple test runner
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}: ${error}`);
  }
}

console.log('Running configuration tests...\n');

// Test 1: Basic configuration loading
test('loadConfig returns valid configuration', () => {
  // Ensure clean environment
  delete process.env.ENABLE_INTERNAL_DOCS;
  
  const config = loadConfig();
  
  if (!config.documentation?.sources?.public) {
    throw new Error('Public source not configured');
  }
  
  if (config.documentation.sources.public.priority !== 1) {
    throw new Error('Public source priority should be 1');
  }
  
  if (typeof config.refresh_interval !== 'number') {
    throw new Error('Refresh interval should be a number');
  }
});

// Test 2: Authentication validation with public-only config
test('validateAuth works with public-only config', () => {
  // Ensure clean environment
  delete process.env.ENABLE_INTERNAL_DOCS;
  
  const config = loadConfig();
  validateAuth(config); // Should not throw
});

// Test 3: Auth token retrieval for non-auth sources
test('getAuthToken returns undefined for non-auth sources', () => {
  const publicSource = {
    enabled: true,
    path: './docs-public',
    repo: 'https://github.com/example/repo.git',
    branch: 'main',
    priority: 1,
    auth_required: false
  };
  
  const token = getAuthToken(publicSource);
  if (token !== undefined) {
    throw new Error('Should return undefined for non-auth sources');
  }
});

// Test 4: Configuration with internal source enabled
test('configuration supports internal source', () => {
  // Enable internal docs
  process.env.ENABLE_INTERNAL_DOCS = 'true';
  
  const config = loadConfig();
  
  if (!config.documentation.sources.internal) {
    throw new Error('Internal source should be enabled');
  }
  
  if (config.documentation.sources.internal.priority !== 2) {
    throw new Error('Internal source should have priority 2');
  }
  
  if (!config.documentation.sources.internal.auth_required) {
    throw new Error('Internal source should require auth');
  }
  
  // Clean up
  delete process.env.ENABLE_INTERNAL_DOCS;
});

console.log('\nConfiguration tests completed!');