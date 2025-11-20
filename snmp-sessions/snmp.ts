import type { Varbind, VarbindValue } from "net-snmp";
import { snmpSessionManager } from "./snmpSession";

export const snmpGet = (
  ip: string,
  oids: string[]
): Promise<Varbind[]> => {
  return new Promise((resolve, reject) => {
    const session = snmpSessionManager.getSession(ip);
    session?.get(oids, (error: Error, varbinds: Varbind[]) => {
      if (error) {
        reject(error);
      } else {
        resolve(varbinds);
      }
    });
  });
};

export const snmpSet = (
  ip: string,
  varbinds: Varbind[]
): Promise<Varbind[]> => {
  return new Promise((resolve, reject) => {
    const session = snmpSessionManager.getSession(ip);
    session?.set(varbinds, (error: Error, setVarbinds: Varbind[]) => {
      if (error) {
        reject(error);
      } else {

        resolve(setVarbinds);
      }
    });
  });
};

export const originizeResult = (varbinds: Varbind[]): Record<string, VarbindValue> => {
  return varbinds.reduce((acc, varbind) => {
    const key = varbind.oid;
    acc[key] = Buffer.isBuffer(varbind.value)
      ? varbind.value.toString("utf-8")
      : (varbind.value as VarbindValue);
    return acc;
  }, {} as Record<string, VarbindValue>);
};
