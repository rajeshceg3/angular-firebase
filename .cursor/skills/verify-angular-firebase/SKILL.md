---
name: verify-angular-firebase
description: Verifies the angular-firebase starter builds for production and passes its Karma suite in real headless Chrome, with machine-readable evidence.
---

# Verify angular-firebase

## Launch

```bash
npm install   # first run only
node .cursor/skills/verify-angular-firebase/verify.cjs
```

Exit 0 and `FAILURES=0` mean green.

## Doctor

The only gate is `node_modules` being present. Tests run in headless
Chrome via the `ChromeHeadlessNoSandbox` launcher in `src/karma.conf.js`;
set `CHROME_BIN` if Chrome is not at `/usr/bin/google-chrome`.

## Drive

1. `ng build` - the production bundle must build; the Starter is a
   compile-target as much as a runtime one.
2. `ng test` - the Karma suite (`src/app/app.component.spec.ts`) in real
   headless Chrome: component creation, version naming, hello rendering.

## Evidence

Each run writes a fresh `EVIDENCE_DIR` with `evidence.json`.
`FAILURES=n` is the last line; the exit code mirrors it.

## Cleanup

Only build artifacts (`dist/`, `coverage/`) are produced. No servers stay
up, nothing leaves the repo and the evidence directory.

## Maintenance

When the starter gains components or services, extend the spec file in the
same commit.

## Known boundaries

- The Firebase config in `src/environments/environment.ts` is a
  placeholder; nothing here talks to a real Firebase project. The starter's
  promise is "compiles, boots, renders" - live Firebase behavior needs a
  real project config.
