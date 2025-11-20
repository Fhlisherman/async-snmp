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

````ts
import { createSnmpManager, type SnmpUserConfig } from "async-snmp";
# async-snmp

[![npm version](https://img.shields.io/npm/v/async-snmp.svg)](https://www.npmjs.com/package/async-snmp)

Lightweight TypeScript helpers for SNMP operations built on top of `net-snmp`.

This README focuses on the exported runtime functions: `snmpGet` and `snmpSet`, and how to configure SNMPv3 credentials via the `SNMP_USER_CONFIG` environment variable.

## Exports

- `snmpGet(ip: string, oids: string[]): Promise<Varbind[]>` — perform an SNMP GET on the given `oids` at `ip`.
- `snmpSet(ip: string, varbinds: Varbind[]): Promise<Varbind[]>` — perform an SNMP SET with the provided `varbinds` at `ip`.

Both functions return Promises that resolve to the `varbinds` returned by `net-snmp` or reject with an `Error` on failure.

## Configure SNMPv3 credentials using `SNMP_USER_CONFIG`

Set the environment variable `SNMP_USER_CONFIG` to a JSON string to provide default SNMPv3 credentials the package will use when creating sessions. Example (bash):

```bash
export SNMP_USER_CONFIG='{"name":"operator","level":3,"authProtocol":3,"authKey":"auth","privProtocol":2,"privKey":"priv"}'
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

If you want examples that show per-session overrides or programmatic manager creation, tell me and I will add them.

MIT
