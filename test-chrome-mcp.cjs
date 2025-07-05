#!/usr/bin/env node

/**
 * Simple test script for Chrome MCP Server
 */

const http = require('http');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testChromeMCP() {
  console.log('🔍 Testing Chrome MCP Server...\n');

  // Test 1: Check if HTTP server is running
  console.log('1. Testing HTTP server connection...');
  try {
    const response = await makeRequest('http://127.0.0.1:12306/mcp/health');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${response.data}`);
    
    if (response.status === 200) {
      console.log('   ✅ HTTP server is running!');
    } else {
      console.log('   ⚠️ HTTP server responded but with non-200 status');
    }
  } catch (error) {
    console.log('   ❌ HTTP server connection failed:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('   - Chrome MCP Server is not running');
    console.log('   - Chrome extension is not loaded');
    console.log('   - Extension is not connected to native host');
    return false;
  }

  // Test 2: Try MCP tools endpoint
  console.log('\n2. Testing MCP tools endpoint...');
  try {
    const response = await makeRequest('http://127.0.0.1:12306/mcp/tools/get_windows_and_tabs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      console.log('   ✅ Successfully got browser data!');
      console.log(`   Windows: ${data.windowCount || 'N/A'}`);
      console.log(`   Tabs: ${data.tabCount || 'N/A'}`);
      
      if (data.windows && data.windows.length > 0) {
        console.log('   Sample tabs:');
        data.windows[0].tabs?.slice(0, 3).forEach((tab, i) => {
          const title = (tab.title || 'No title').substring(0, 50);
          console.log(`     ${i + 1}. ${title}...`);
        });
      }
      return true;
    } else {
      console.log(`   ❌ Tools endpoint failed with status ${response.status}`);
      console.log(`   Response: ${response.data}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Tools endpoint test failed:', error.message);
    return false;
  }
}

async function checkChromeExtension() {
  console.log('\n3. Chrome Extension Status Check...');
  console.log('   📋 Manual checks needed:');
  console.log('   1. Open Chrome and go to chrome://extensions/');
  console.log('   2. Make sure "Developer mode" is enabled');
  console.log('   3. Look for "Chrome MCP Server" extension');
  console.log('   4. Make sure it\'s enabled and has no errors');
  console.log('   5. Click the extension icon to see connection status');
  console.log('   6. It should show "Connected" status');
}

async function main() {
  console.log('🚀 Chrome MCP Server Connection Test\n');
  
  const success = await testChromeMCP();
  
  if (!success) {
    await checkChromeExtension();
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('   1. Make sure Chrome extension is loaded from releases');
    console.log('   2. Check extension popup shows "Connected" status');
    console.log('   3. Try reloading the extension');
    console.log('   4. Check Chrome console for extension errors');
    console.log('   5. Restart Chrome browser');
  } else {
    console.log('\n🎉 Chrome MCP Server is working correctly!');
    console.log('   You can now use the integration code with Augment.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testChromeMCP, makeRequest };
