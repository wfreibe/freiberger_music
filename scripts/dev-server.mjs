import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createServer } from 'node:net';

const root = fileURLToPath(new URL('../', import.meta.url));
const frontend = resolve(root, 'frontend');
const children = [];
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}

function start(command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: 'inherit', windowsHide: true });
  children.push(child);
  child.on('error', error => {
    console.error(`Could not start ${command}: ${error.message}`);
    stop(1);
  });
  child.on('exit', code => { if (!stopping) stop(code ?? 1); });
  return child;
}

// Fail before starting either service if a required port is already in use.
async function checkPort(port, host) {
  await new Promise((resolveCheck, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(port, host, () => server.close(resolveCheck));
  });
}

try {
  await checkPort(8080, '127.0.0.1');
  await checkPort(3000, 'localhost');
  start('php', ['-S', '127.0.0.1:8080', '-t', root, resolve(root, 'scripts/dev-router.php')], root);
  start(process.execPath, [resolve(frontend, 'node_modules/vite/bin/vite.js'), ...process.argv.slice(2)], frontend);
} catch (error) {
  console.error(`Cannot start local preview: ${error.message}`);
  stop(1);
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
