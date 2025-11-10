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
## Troubleshooting

- If TypeScript complains about `import`/`export` vs CommonJS, ensure `tsconfig.json` uses `module: "nodenext"` and `package.json` has `"type": "module"` when targeting ESM.
- Do not attempt to bundle `net-snmp` if it relies on native components; mark it external in bundlers.

## Contributing

PRs are welcome. If you change public API shape, update examples in this README. Add small focused commits and include tests for behavioral changes when possible.

## License

MIT
