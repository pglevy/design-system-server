#!/usr/bin/env node

/**
 * Test script for Design System MCP Server
 * Run with: npm test
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

// Load environment variables from .env file
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf8');
    const token = envContent.match(/GITHUB_TOKEN=(.+)/)?.[1];
    if (token) {
      process.env.GITHUB_TOKEN = token;
      return true;
    }
  } catch (error) {
    console.log('⚠️  Could not load .env file');
  }
  return false;
}

// Test GitHub API connectivity
async function testGitHubAPI() {
  console.log('1. Testing GitHub API connectivity...');
  
  const url = 'https://api.github.com/repos/pglevy/design-system-docs/contents/components/breadcrumbs.md';
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'design-system-mcp-server'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const content = atob(data.content);
      console.log(`   ✅ GitHub API working (${content.length} chars fetched)`);
      return true;
    } else {
      console.log(`   ❌ GitHub API failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ GitHub API error: ${error.message}`);
    return false;
  }
}

// Test MCP server tools
function testMCPServer() {
  return new Promise((resolve) => {
    console.log('2. Testing MCP server tools...');
    
    const server = spawn('node', ['build/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });
    
    let responses = [];
    let serverReady = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      try {
        const parsed = JSON.parse(output);
        responses.push(parsed);
      } catch (e) {
        // Ignore non-JSON output
      }
    });
    
    server.stderr.on('data', (data) => {
      if (data.toString().includes('running on stdio')) {
        serverReady = true;
        // Send test requests
        sendTestRequests();
      }
    });
    
    function sendTestRequests() {
      const tests = [
        {
          jsonrpc: "2.0",
          method: "tools/call",
          params: { name: "list-categories", arguments: {} },
          id: 1
        },
        {
          jsonrpc: "2.0",
          method: "tools/call",
          params: { name: "get-component-details", arguments: { category: "components", componentName: "breadcrumbs" } },
          id: 2
        }
      ];
      
      tests.forEach(test => {
        server.stdin.write(JSON.stringify(test) + '\n');
      });
      
      // Wait for responses then check results
      setTimeout(() => {
        server.kill();
        checkResults();
      }, 3000);
    }
    
    function checkResults() {
      if (responses.length >= 2) {
        const categoriesResponse = responses.find(r => r.id === 1);
        const detailsResponse = responses.find(r => r.id === 2);
        
        if (categoriesResponse?.result?.content?.[0]?.text?.includes('categories')) {
          console.log('   ✅ list-categories tool working');
        } else {
          console.log('   ❌ list-categories tool failed');
        }
        
        if (detailsResponse?.result?.content?.[0]?.text?.includes('Breadcrumbs')) {
          console.log('   ✅ get-component-details tool working');
          console.log('   ✅ GitHub content fetching working');
        } else {
          console.log('   ❌ get-component-details tool failed');
        }
        
        resolve(true);
      } else {
        console.log('   ❌ MCP server not responding properly');
        resolve(false);
      }
    }
    
    server.on('error', (error) => {
      console.log(`   ❌ Server error: ${error.message}`);
      resolve(false);
    });
    
    // Timeout if server doesn't start
    setTimeout(() => {
      if (!serverReady) {
        console.log('   ❌ Server failed to start');
        server.kill();
        resolve(false);
      }
    }, 5000);
  });
}

async function runTests() {
  console.log('🧪 Design System MCP Server Test\n');
  console.log('═'.repeat(50));
  
  // Load environment
  const envLoaded = loadEnv();
  if (!envLoaded || !process.env.GITHUB_TOKEN) {
    console.log('❌ GITHUB_TOKEN not found in .env file');
    console.log('   Please ensure .env contains: GITHUB_TOKEN=your_token');
    process.exit(1);
  }
  
  console.log('✅ Environment loaded');
  
  // Test GitHub API
  const apiWorking = await testGitHubAPI();
  
  // Test MCP server (only if API is working)
  let mcpWorking = false;
  if (apiWorking) {
    mcpWorking = await testMCPServer();
  }
  
  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📋 Test Summary:');
  console.log(`   GitHub API: ${apiWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`   MCP Server: ${mcpWorking ? '✅ Working' : '❌ Failed'}`);
  
  if (apiWorking && mcpWorking) {
    console.log('\n🎉 All tests passed! Your MCP server is ready.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above.');
    process.exit(1);
  }
}

runTests().catch(console.error);