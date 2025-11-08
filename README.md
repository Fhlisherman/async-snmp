# `async-snmp`

[![npm version](https://img.shields.io/npm/v/async-snmp.svg)](https://www.npmjs.com/package/async-snmp)

A lightweight, zero-dependency (other than `net-snmp`) wrapper for the Node.js **[net-snmp](https://www.npmjs.com/package/net-snmp)** library.

This package provides a simple, modern API for SNMP operations (`get` and `set`) by converting the original callback-based methods into **Promise-based `async/await`** functions. It's fully typed for a seamless TypeScript experience.

## Key Features

- **Promise-Based:** No more callback hell. Use `async/await` for clean, readable code.
- **Simple API:** Exposes two main functions: `snmpGet` and `snmpSet`.
- **TypeScript Ready:** Fully typed, bundling the necessary `net-snmp` types for you.
- **Error Handling:** Use standard `try...catch` blocks for robust error management.
- **Lightweight:** A minimal abstraction layer over `net-snmp` with no other dependencies.

## Why use `async-snmp`?

The `net-snmp` library is powerful but relies on a traditional callback API. In a modern Node.js codebase, this can be cumbersome and lead to complex nested logic.

`async-snmp` bridges this gap, allowing you to treat SNMP operations as simple asynchronous calls, just like you would with `fetch` or a database query.

**Before (Callbacks):**

````javascript
const snmp = require('net-snmp');
const session = snmp.createSession('127.0.0.1', 'public');

session.get(['1.3.6.1.2.1.1.1.0'], (error, varbinds) => {
  if (error) {
    # async-snmp

    [![npm version](https://img.shields.io/npm/v/async-snmp.svg)](https://www.npmjs.com/package/async-snmp)

    A lightweight TypeScript wrapper around the Node.js `net-snmp` library that provides Promise-based async/await helpers and a small session manager.

    This repo intentionally keeps the runtime dependency on `net-snmp` external (not bundled). The package provides a configurable `SnmpSession` manager and exported helpers that make SNMP `get`/`set` code cleaner.

    ## Quick install
# async-snmp

[![npm version](https://img.shields.io/npm/v/async-snmp.svg)](https://www.npmjs.com/package/async-snmp)

A lightweight TypeScript wrapper around the Node.js `net-snmp` library that provides Promise-based async/await helpers and a small session manager.

This repo intentionally keeps the runtime dependency on `net-snmp` external (not bundled). The package provides a configurable `SnmpSession` manager and exported helpers that make SNMP `get`/`set` code cleaner.

## Quick install

Install runtime and dev dependencies:

```bash
npm install
# or to install runtime only
npm install net-snmp
```

## Configuration options

There are two ways consumers can configure SNMPv3 user credentials:

- Per-manager default: pass a `SnmpUserConfig` object when creating a session manager.
- Per-session override: pass a `SnmpUserConfig` when calling `getSession` for a specific IP.

Additionally, the manager constructor reads an optional environment variable `SNMP_USER_CONFIG` (JSON). If present, it will be parsed and used as the manager's default configuration. Example:

```bash
export SNMP_USER_CONFIG='{"name":"operator","level":3,"authProtocol":3,"authKey":"auth","privProtocol":2,"privKey":"priv"}'
node my-app.js
```

The JSON keys correspond to the `SnmpUserConfig` interface exported by the package (name, level, authProtocol, authKey, privProtocol, privKey).

## Usage examples

Create a manager with defaults (reads `SNMP_USER_CONFIG` if set):

```ts
import { createSnmpManager, type SnmpUserConfig } from 'async-snmp';

const manager = createSnmpManager();
const session = manager.getSession('192.168.1.1');
// use session.get / session.set per net-snmp API
```

Create with a programmatic default config:

```ts
const cfg: SnmpUserConfig = {
  name: 'operator',
  level: 3, // snmp.SecurityLevel.authPriv
  authProtocol: 3, // snmp.AuthProtocols.sha
  authKey: 'auth-password',
  privProtocol: 2, // snmp.PrivProtocols.aes
  privKey: 'priv-password'
};

const manager = createSnmpManager(cfg);
const session = manager.getSession('192.168.1.1');
```

Override credentials per session:

```ts
const temp = manager.getSession('192.168.1.2', {
  name: 'tempUser',
  level: 3,
  authProtocol: 3,
  authKey: 'tmp',
  privProtocol: 2,
  privKey: 'tmp'
});
```

## Build & distribution

This project uses `tsup` for bundling in library mode. The provided `package.json` contains a `build` script that produces ESM + CJS outputs and type declarations into `dist/`.

Build locally:

```bash
npm run build
```

Notes:
- `net-snmp` is marked external when bundling. Do not bundle native or node-specific modules — keep them as runtime dependencies.
- The package is configured as ESM (`"type": "module"`) but the build emits both ESM and CJS for compatibility.

## API reference (high-level)

- `createSnmpManager(config?: SnmpUserConfig): SnmpSession` — create a session manager with an optional default user config (or let the manager read `SNMP_USER_CONFIG`).
- `SnmpSession.getSession(ip: string, userConfig?: SnmpUserConfig)` — returns a `net-snmp` session for the given IP, creating one if necessary. If `userConfig` is provided it will be used for that session.
- `SnmpSession.closeSession(ip)` and `SnmpSession.closeAllSessions()` — cleanup helpers.

## Migration notes / common issues

- If you compiled previously with CommonJS and see TypeScript diagnostics about `import`/`export`, ensure `package.json` has `"type": "module"` and `tsconfig.json` is set for `module: "nodenext"`.
- When publishing, make sure `net-snmp` stays in `dependencies` (not bundled) so consumers install it.

## Contributing

Contributions are welcome. If you change public APIs, update examples in this README.
````
