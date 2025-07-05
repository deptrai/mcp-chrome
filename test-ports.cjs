#!/usr/bin/env node

const http = require('http');

async function testPort(port) {
  return new Promise((resolve) => {
    const req = http.request(`http://127.0.0.1:${port}/mcp/health`, {
      method: 'GET',
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ port, status: res.statusCode, data, success: true });
      });
    });

    req.on('error', () => resolve({ port, success: false }));
    req.on('timeout', () => resolve({ port, success: false }));
    req.end();
  });
}

async function scanPorts() {
  console.log('🔍 Scanning for Chrome MCP Server on different ports...\n');
  
  // Common ports that might be used
  const portsToTest = [12306, 3000, 8080, 8000, 9000, 3001, 8081, 12307, 12308];
  
  const results = await Promise.all(portsToTest.map(testPort));
  
  const workingPorts = results.filter(r => r.success);
  const failedPorts = results.filter(r => !r.success);
  
  if (workingPorts.length > 0) {
    console.log('✅ Found working ports:');
    workingPorts.forEach(result => {
      console.log(`   Port ${result.port}: Status ${result.status}`);
      console.log(`   Response: ${result.data.substring(0, 100)}...`);
    });
  } else {
    console.log('❌ No working ports found');
  }
  
  console.log(`\n📊 Tested ${portsToTest.length} ports: ${workingPorts.length} working, ${failedPorts.length} failed`);
  
  return workingPorts;
}

if (require.main === module) {
  scanPorts().catch(console.error);
}

module.exports = { scanPorts, testPort };
