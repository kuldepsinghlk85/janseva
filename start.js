const { spawn } = require('child_process');
const path = require('path');

console.log('========================================================');
console.log('   Starting JanSeva Full-Stack Platform (Etawah 200)');
console.log('========================================================');

// Start Express Server
const server = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start Vite Client
const client = spawn('cmd.exe', ['/c', 'npm run dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\nShutting down JanSeva Platform...');
  server.kill();
  client.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
