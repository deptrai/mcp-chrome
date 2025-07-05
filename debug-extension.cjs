#!/usr/bin/env node

/**
 * Debug script to help troubleshoot Chrome MCP Server extension
 */

console.log('🔍 Chrome MCP Server Debug Information\n');

console.log('1. Native Messaging Host Registration:');
console.log('   ✅ mcp-chrome-bridge is installed and registered');
console.log('   ✅ Native messaging manifest should be at:');
console.log('   /Users/mac_1/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.chromemcp.nativehost.json');

console.log('\n2. Extension Status Check:');
console.log('   📋 Please manually verify in Chrome:');
console.log('   • Go to chrome://extensions/');
console.log('   • Find "Chrome MCP Server" extension');
console.log('   • Check if it shows any errors');
console.log('   • Click the extension icon in toolbar');

console.log('\n3. Extension Popup Check:');
console.log('   📋 In the extension popup, you should see:');
console.log('   • Connection status (should be "Connected")');
console.log('   • Server URL (should show http://127.0.0.1:12306/mcp)');
console.log('   • If not connected, try clicking "Connect" button');

console.log('\n4. Chrome Console Check:');
console.log('   📋 To check for extension errors:');
console.log('   • Right-click extension icon → "Inspect popup"');
console.log('   • Or go to chrome://extensions/ → Click "background page" link');
console.log('   • Look for any error messages in console');

console.log('\n5. Common Issues & Solutions:');
console.log('   🔧 If extension shows "Disconnected":');
console.log('      • Try reloading the extension');
console.log('      • Check if native messaging host is properly registered');
console.log('      • Restart Chrome browser');

console.log('   🔧 If HTTP server not starting:');
console.log('      • Extension might not have started background script');
console.log('      • Check extension permissions');
console.log('      • Look for JavaScript errors in extension console');

console.log('   🔧 If port 12306 is not listening:');
console.log('      • Extension background script might have crashed');
console.log('      • Try different port in extension settings');
console.log('      • Check if another process is using the port');

console.log('\n6. Manual Test Steps:');
console.log('   📋 Please try these steps and report results:');
console.log('   1. Click Chrome MCP Server extension icon');
console.log('   2. What does the popup show? (Connected/Disconnected?)');
console.log('   3. What URL is displayed in the popup?');
console.log('   4. Are there any error messages?');
console.log('   5. Try clicking "Connect" if available');

console.log('\n7. Alternative Test:');
console.log('   📋 If popup shows connected but HTTP test fails:');
console.log('   • Try opening the URL from popup directly in browser');
console.log('   • Check if it responds with any content');

console.log('\n🎯 Next Steps:');
console.log('   Please check the extension popup and report:');
console.log('   • Connection status');
console.log('   • Server URL shown');
console.log('   • Any error messages');
console.log('   • Console errors (if any)');

console.log('\n   Then we can proceed with targeted troubleshooting!');
