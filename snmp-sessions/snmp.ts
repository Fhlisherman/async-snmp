import type { Varbind, VarbindValue } from "net-snmp";
import { snmpSessionManager } from "./snmpSession";

export const snmpGet = (
  ip: string,
  oids: string[]
): Promise<Record<string, VarbindValue>> => {
  return new Promise((resolve, reject) => {
    const session = snmpSessionManager.getSession(ip);

    session?.get(oids, (error: Error, varbinds: Varbind[]) => {
      if (error) {
        reject(error);
      } else {
        const result = originizeResult(varbinds);
        resolve(result);
      }
    });
  });
};

export const snmpSet = (
  ip: string,
  varbinds: Varbind[]
): Promise<{ [key: string]: VarbindValue }> => {
  return new Promise((resolve, reject) => {
    const session = snmpSessionManager.getSession(ip);
    session?.set(varbinds, (error: Error, setVarbinds: Varbind[]) => {
      if (error) {
        reject(error);
      } else {
        const result = originizeResult(setVarbinds);
        resolve(result);
      }
    });
  });
};

const originizeResult = (varbinds: Varbind[]): Record<string, VarbindValue> => {
  return varbinds.reduce((acc, varbind) => {
    const key = varbind.oid;
    acc[key] = Buffer.isBuffer(varbind.value)
      ? varbind.value.toString("utf-8")
      : (varbind.value as VarbindValue);
    return acc;
  }, {} as Record<string, VarbindValue>);
};
