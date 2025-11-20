import type { ResponseInvalidError, User, Varbind, VarbindValue } from "net-snmp";
import { snmpSessionManager } from "./snmpSession";

export const snmpGet = (
  ip: string,
  oids: string[],
  userConfig?: User,
  options?: any
): Promise<Varbind[]> => {
  return new Promise((resolve, reject) => {
    const session = snmpSessionManager.getSession(ip, userConfig, options);
    session?.get(oids, (error: ResponseInvalidError | null, varbinds: Varbind[] | undefined) => {
      if (error) {
        reject(error);
      } else {
        resolve(varbinds || []);
      }
    });
  });
};

export const snmpSet = (
  ip: string,
  varbinds: Varbind[],
  userConfig?: User,
  options?: any
): Promise<Varbind[]> => {
  return new Promise((resolve, reject) => {
    const session = snmpSessionManager.getSession(ip, userConfig, options);
    session?.set(varbinds, (error: ResponseInvalidError | null, setVarbinds: Varbind[] | undefined) => {
      if (error) {
        reject(error);
      } else {
        resolve(setVarbinds || []);
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
