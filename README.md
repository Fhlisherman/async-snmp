# `async-snmp`

[![npm version](https://img.shields.io/npm/v/async-snmp.svg)](https://www.npmjs.com/package/async-snmp)

A lightweight, zero-dependency (other than `net-snmp`) wrapper for the Node.js **[net-snmp](https://www.npmjs.com/package/net-snmp)** library.

This package provides a simple, modern API for SNMP operations (`get` and `set`) by converting the original callback-based methods into **Promise-based `async/await`** functions. It's fully typed for a seamless TypeScript experience.

## Key Features

* **Promise-Based:** No more callback hell. Use `async/await` for clean, readable code.
* **Simple API:** Exposes two main functions: `snmpGet` and `snmpSet`.
* **TypeScript Ready:** Fully typed, bundling the necessary `net-snmp` types for you.
* **Error Handling:** Use standard `try...catch` blocks for robust error management.
* **Lightweight:** A minimal abstraction layer over `net-snmp` with no other dependencies.

## Why use `async-snmp`?

The `net-snmp` library is powerful but relies on a traditional callback API. In a modern Node.js codebase, this can be cumbersome and lead to complex nested logic.

`async-snmp` bridges this gap, allowing you to treat SNMP operations as simple asynchronous calls, just like you would with `fetch` or a database query.

**Before (Callbacks):**
```javascript
const snmp = require('net-snmp');
const session = snmp.createSession('127.0.0.1', 'public');

session.get(['1.3.6.1.2.1.1.1.0'], (error, varbinds) => {
  if (error) {
    console.error(error);
  } else {
    console.log(varbinds[0].value.toString());
  }
  session.close();
});
```

**After (Async/Await):**
```javascript
import { snmpGet } from 'async-snmp';

async function getSysDescr() {
  try {
    const varbind = await snmpGet(
      { host: '127.0.0.1', community: 'public' },
      '1.3.6.1.2.1.1.1.0'
    );
    console.log(varbind.value.toString());
  } catch (error) {
    console.error('SNMP Error:', error);
  }
}

getSysDescr();
```