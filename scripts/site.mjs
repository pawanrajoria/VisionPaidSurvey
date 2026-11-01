// Builds and deploys the site with server-side rendering on or off.
// The switch is SSR_ENABLED: a real environment variable wins, otherwise .env is read; default is false.
//   SSR on  -> firebase.json: pages are rendered by the "ssr" Cloud Function (billed per request).
//   SSR off -> firebase.static.json: pages are served as static files from Hosting; only
//              /api/** (AI chat) and the two generated sitemaps still go to the function.
//   node scripts/site.mjs build    -> ng build and copy the build into functions/dist
//   node scripts/site.mjs deploy   -> build, then firebase deploy with the matching config
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs';

function readFlag() {
  if (process.env.SSR_ENABLED !== undefined) return process.env.SSR_ENABLED;
  if (!existsSync('.env')) return 'false';
  const line = readFileSync('.env', 'utf8').split(/\r?\n/).find((l) => /^\s*SSR_ENABLED\s*=/.test(l));
  return line ? line.split('=')[1].trim() : 'false';
}

const ssr = /^(true|1|yes|on)$/i.test(readFlag());
const command = process.argv[2] ?? 'build';
const config = ssr ? 'firebase.json' : 'firebase.static.json';
const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

console.log(`SSR is ${ssr ? 'ENABLED' : 'DISABLED'} (hosting config: ${config})`);

// Both modes use the same build: the browser files for Hosting, and the server bundle
// for the function (which also serves the AI chat API and the sitemaps).
rmSync('dist', { recursive: true, force: true });
run('npx ng build');

// The function only uploads the functions/ folder, so it gets its own copy of the build.
rmSync('functions/dist', { recursive: true, force: true });
cpSync('dist', 'functions/dist', { recursive: true });

if (command === 'deploy') {
  run(`npx firebase deploy --config ${config} --only functions,hosting`);
}
