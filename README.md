# async-snmp

[![npm version](https://img.shields.io/npm/v/async-snmp.svg)](https://www.npmjs.com/package/async-snmp)

A lightweight TypeScript wrapper around the Node.js `net-snmp` library that exposes Promise-friendly helpers and a small session manager.

## Why this package

- Converts `net-snmp`'s callback APIs into Promise/async-friendly helpers.
- Provides a session manager that reuses `net-snmp` sessions per-IP and supports SNMPv3 credentials.
- TypeScript-first with declaration output so consumers get types.

## Install

This package expects `net-snmp` to be available at runtime. Install it as a peer or runtime dependency in your project:

```bash
npm install net-snmp
```

## Quick usage

The package exports a factory `createSnmpManager` and TypeScript types. You can configure credentials in three ways:

1. Environment variable: `SNMP_USER_CONFIG` (JSON string)
2. Provide a default `SnmpUserConfig` when creating a manager
3. Provide a per-session override when calling `getSession(ip, userConfig)`

Example — default manager (reads `SNMP_USER_CONFIG` if set):

```ts
import { createSnmpManager } from "async-snmp";

const manager = createSnmpManager();
const session = manager.getSession("192.168.1.1");
// Use session.get / session.set per net-snmp API
```

Example — programmatic default config:

```ts
import { createSnmpManager, type SnmpUserConfig } from "async-snmp";
import * as snmp from "net-snmp";

const cfg: SnmpUserConfig = {
  name: "operator",
  level: snmp.SecurityLevel.authPriv,
  authProtocol: snmp.AuthProtocols.sha,
  authKey: "auth-password",
  privProtocol: snmp.PrivProtocols.aes,
  privKey: "priv-password",
};

const manager = createSnmpManager(cfg);
const session = manager.getSession("192.168.1.1");
```

Per-session override example:

```ts
const tempSession = manager.getSession("192.168.1.2", {
  name: "tempUser",
  level: snmp.SecurityLevel.authPriv,
  authProtocol: snmp.AuthProtocols.sha,
  authKey: "tmp-auth",
  privProtocol: snmp.PrivProtocols.aes,
  privKey: "tmp-priv",
});
```

## Environment variable (optional)

You may set `SNMP_USER_CONFIG` to a JSON string to make the manager pick up default credentials on startup. Example (bash):

```bash
export SNMP_USER_CONFIG='{"name":"operator","level":3,"authProtocol":3,"authKey":"auth","privProtocol":2,"privKey":"priv"}'
node my-app.js
```

The JSON shape matches the exported `SnmpUserConfig` interface: `name`, `level`, `authProtocol`, `authKey`, `privProtocol`, `privKey`.

## Build & bundle

This project uses `tsup` (esbuild) for fast library builds. The `package.json` includes a `build` script that outputs ESM + CJS bundles and type declarations into `dist/`.

Notes:

- Keep `net-snmp` external (do not bundle native/node-specific dependencies). It's declared as a peer dependency in `package.json`.
- The package sets `"type": "module"` but builds both formats for compatibility.

Build locally:

```bash
npm install
npm run build
```

## API (high-level)

- `createSnmpManager(config?: SnmpUserConfig): SnmpSession` — create a session manager. If `config` is omitted the function will look for `SNMP_USER_CONFIG`.
- `SnmpSession.getSession(ip: string, userConfig?: SnmpUserConfig)` — get or create a `net-snmp` session for `ip`. If `userConfig` is provided it overrides the manager's default for that session.
- `SnmpSession.closeSession(ip)` and `SnmpSession.closeAllSessions()` — close sessions to free resources.

## Troubleshooting

- If TypeScript complains about `import`/`export` vs CommonJS, ensure `tsconfig.json` uses `module: "nodenext"` and `package.json` has `"type": "module"` when targeting ESM.
- Do not attempt to bundle `net-snmp` if it relies on native components; mark it external in bundlers.

## Contributing

PRs are welcome. If you change public API shape, update examples in this README. Add small focused commits and include tests for behavioral changes when possible.

## License

MIT
