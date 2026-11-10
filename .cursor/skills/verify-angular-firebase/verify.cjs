#!/usr/bin/env node
/* Purpose-fit verification for angular-firebase.
 * Production build plus the Karma suite in real headless Chrome.
 * Exit 0 and FAILURES=0 mean green. */
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const checks = [];
const failures = [];

function record(name, ok, detail = '') {
  checks.push({ name, ok: !!ok, detail });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : ''));
  if (!ok) failures.push(name);
}

function run(args, opts = {}) {
  return spawnSync('npx', args, {
    cwd: ROOT, encoding: 'utf8', timeout: 300000,
    env: { ...process.env, CHROME_BIN: process.env.CHROME_BIN || '/usr/bin/google-chrome', CI: 'true' },
    ...opts,
  });
}

if (!fs.existsSync(path.join(ROOT, 'node_modules'))) {
  record('doctor: dependencies installed', false, 'run npm install first');
} else {
  record('doctor: dependencies installed', true);
  const build = run(['ng', 'build']);
  const buildTail = (build.stdout || '').trim().split('\n').pop() || '';
  record('production build succeeds', build.status === 0 && /Initial Total/.test(build.stdout || ''),
         buildTail + (build.status ? (build.stderr || '').trim().slice(-300) : ''));
  const test = run(['ng', 'test', '--watch=false', '--browsers=ChromeHeadlessNoSandbox']);
  const out = (test.stdout || '') + (test.stderr || '');
  const matches = [...out.matchAll(/Executed (\d+) of (\d+) SUCCESS/g)];
  const m = matches[matches.length - 1];
  record('karma suite green in headless Chrome', test.status === 0 && !!m && m[1] === m[2] && m[1] !== '0',
         m ? `${m[1]}/${m[2]} specs` : out.trim().slice(-300));
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-angular-firebase-'));
fs.writeFileSync(path.join(dir, 'evidence.json'), JSON.stringify({ repo: 'angular-firebase', checks, failures }, null, 2));
console.log('EVIDENCE_DIR=' + dir);
console.log('FAILURES=' + failures.length);
process.exit(failures.length ? 1 : 0);
