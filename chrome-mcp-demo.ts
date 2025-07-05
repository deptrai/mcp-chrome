/**
 * Demo script showing Chrome MCP Server integration with Augment Code
 * Run this to test the integration
 */

import { chromeMCP, quickWebSearch, captureCurrentPage, automateWebTask } from './chrome-mcp-integration';

async function demoChromeMCPIntegration() {
  console.log('🚀 Chrome MCP Server Integration Demo for Augment Code\n');

  // 1. Check if Chrome MCP Server is running
  console.log('1. Checking Chrome MCP Server status...');
  const isRunning = await chromeMCP.isServerRunning();
  if (!isRunning) {
    console.log('❌ Chrome MCP Server is not running!');
    console.log('Please start the server first:');
    console.log('   npm install -g mcp-chrome-bridge');
    console.log('   Load Chrome extension from releases');
    return;
  }
  console.log('✅ Chrome MCP Server is running!\n');

  // 2. Get current browser state
  console.log('2. Getting current browser windows and tabs...');
  const browserState = await chromeMCP.getWindowsAndTabs();
  if (browserState) {
    console.log(`📊 Found ${browserState.windowCount} windows with ${browserState.tabCount} tabs total`);
    browserState.windows.forEach((window, i) => {
      console.log(`   Window ${i + 1}: ${window.tabs.length} tabs`);
      window.tabs.forEach((tab, j) => {
        const status = tab.active ? '🔸' : '  ';
        console.log(`     ${status} ${tab.title.substring(0, 50)}...`);
      });
    });
  }
  console.log('');

  // 3. Semantic search demo
  console.log('3. Testing semantic search across browser tabs...');
  const searchQuery = 'JavaScript tutorial';
  console.log(`   Searching for: "${searchQuery}"`);
  const searchResults = await quickWebSearch(searchQuery);
  console.log('📝 Search Results:');
  console.log(searchResults);
  console.log('');

  // 4. Web content extraction demo
  console.log('4. Extracting content from current active tab...');
  const webContent = await chromeMCP.getWebContent();
  if (webContent) {
    console.log(`📄 Content preview (first 200 chars):`);
    console.log(webContent.substring(0, 200) + '...');
  }
  console.log('');

  // 5. Interactive elements detection
  console.log('5. Finding interactive elements on current page...');
  const interactiveElements = await chromeMCP.getInteractiveElements();
  if (interactiveElements && interactiveElements.length > 0) {
    console.log(`🎯 Found ${interactiveElements.length} interactive elements:`);
    interactiveElements.slice(0, 5).forEach((element, i) => {
      console.log(`   ${i + 1}. ${element.tagName} - ${element.text?.substring(0, 30) || 'No text'}...`);
    });
  }
  console.log('');

  // 6. Screenshot demo
  console.log('6. Taking screenshot of current page...');
  try {
    const screenshot = await chromeMCP.takeScreenshot({ format: 'png' });
    if (screenshot) {
      console.log('📸 Screenshot captured successfully!');
      console.log(`   Data length: ${screenshot.length} characters`);
      // In real usage, you could save this to file or display it
    }
  } catch (error) {
    console.log('❌ Screenshot failed:', error);
  }
  console.log('');

  // 7. Browser history search
  console.log('7. Searching browser history...');
  const historyResults = await chromeMCP.searchHistory('github', 10);
  if (historyResults && historyResults.length > 0) {
    console.log(`📚 Found ${historyResults.length} history entries:`);
    historyResults.slice(0, 3).forEach((entry, i) => {
      console.log(`   ${i + 1}. ${entry.title?.substring(0, 40)}... - ${entry.url}`);
    });
  }
  console.log('');

  // 8. Bookmark search
  console.log('8. Searching bookmarks...');
  const bookmarks = await chromeMCP.searchBookmarks('development');
  if (bookmarks && bookmarks.length > 0) {
    console.log(`🔖 Found ${bookmarks.length} bookmarks:`);
    bookmarks.slice(0, 3).forEach((bookmark, i) => {
      console.log(`   ${i + 1}. ${bookmark.title} - ${bookmark.url}`);
    });
  }
  console.log('');

  console.log('✨ Demo completed! Chrome MCP Server integration is working.');
}

// Advanced automation example
async function demoWebAutomation() {
  console.log('\n🤖 Advanced Web Automation Demo\n');

  // Example: Automated GitHub search
  const automationSteps = [
    { action: 'navigate' as const, url: 'https://github.com' },
    { action: 'wait' as const },
    { action: 'click' as const, target: '[data-target="qbsearch-input.inputButton"]' },
    { action: 'fill' as const, target: 'input[name="q"]', value: 'chrome extension' },
    { action: 'click' as const, target: 'button[type="submit"]' },
    { action: 'wait' as const }
  ];

  console.log('🔍 Automating GitHub search...');
  try {
    await automateWebTask(automationSteps);
    console.log('✅ Automation completed successfully!');
    
    // Capture results
    const screenshot = await captureCurrentPage();
    console.log('📸 Results captured!');
    
    // Extract search results
    const content = await chromeMCP.getWebContent();
    if (content) {
      console.log('📄 Search results extracted');
    }
  } catch (error) {
    console.log('❌ Automation failed:', error);
  }
}

// Network monitoring example
async function demoNetworkMonitoring() {
  console.log('\n🌐 Network Monitoring Demo\n');

  console.log('📡 Starting network capture...');
  await chromeMCP.startNetworkCapture();

  console.log('🔄 Navigating to test page...');
  await chromeMCP.navigate('https://httpbin.org/json');
  
  // Wait for requests to complete
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('🛑 Stopping network capture...');
  const networkData = await chromeMCP.stopNetworkCapture();
  
  if (networkData && networkData.length > 0) {
    console.log(`📊 Captured ${networkData.length} network requests:`);
    networkData.slice(0, 5).forEach((request, i) => {
      console.log(`   ${i + 1}. ${request.method} ${request.url} - ${request.status}`);
    });
  }
}

// Main execution
async function main() {
  try {
    await demoChromeMCPIntegration();
    
    // Uncomment to run additional demos
    // await demoWebAutomation();
    // await demoNetworkMonitoring();
    
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

// Export for use in Augment Code
export {
  demoChromeMCPIntegration,
  demoWebAutomation,
  demoNetworkMonitoring
};

// Run if called directly
if (require.main === module) {
  main();
}
