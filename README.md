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

The package uses a singelton snmpManager to manage sessions instead of closing them after each use. You can configure credentials for the snmp user in two ways:

1. Environment variable: `SNMP_USER_CONFIG` (JSON string)
2. Provide a per-session override when calling `getSession(ip, userConfig)`

Example — programmatic default config:

```bash
SNMP_USER_CONFIG='{"name":"operator","level":3,"authProtocol":3,"authKey":"auth","privProtocol":2,"privKey":"priv"}'
````

The JSON fields map to the `SnmpUserConfig` shape used by `net-snmp`:

- `name` — username
- `level` — numeric `snmp.SecurityLevel` (e.g. `authPriv`)
- `authProtocol` — numeric `snmp.AuthProtocols` (e.g. `sha`)
- `authKey` — authentication key/password
- `privProtocol` — numeric `snmp.PrivProtocols` (e.g. `aes`)
- `privKey` — privacy/encryption key

If `SNMP_USER_CONFIG` is not set, the package falls back to reasonable defaults for development (see types in source).

## Usage examples

Simple SNMP GET:

```ts
import { snmpGet } from "async-snmp";

async function readSysDescr() {
  const varbinds = await snmpGet("192.168.1.1", ["1.3.6.1.2.1.1.1.0"]);
  console.log(varbinds[0].value.toString());
}
```

Simple SNMP SET:

```ts
import { snmpSet } from "async-snmp";
import type { Varbind } from "net-snmp";

const vb: Varbind[] = [
  { oid: "1.3.6.1.2.1.1.5.0", type: 4, value: "newName" }, // example
];

async function setSysName() {
  const result = await snmpSet("192.168.1.1", vb);
  console.log("Set result:", result);
}
```

## Notes

- These helpers use an internal session manager that will reuse sessions per-IP.
- For per-call or per-session credential overrides you can modify the session manager usage in source or extend the API; by default the package uses `SNMP_USER_CONFIG` as the manager's default credentials.
- The package expects `net-snmp` available at runtime (listed as a peer dependency). Install it in your project.
  
## Troubleshooting

- If TypeScript complains about `import`/`export` vs CommonJS, ensure `tsconfig.json` uses `module: "nodenext"` and `package.json` has `"type": "module"` when targeting ESM.
- Do not attempt to bundle `net-snmp` if it relies on native components; mark it external in bundlers.

## Contributing

PRs are welcome. If you change public API shape, update examples in this README. Add small focused commits and include tests for behavioral changes when possible.

## License

MIT
