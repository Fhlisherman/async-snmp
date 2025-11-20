import * as snmp from "net-snmp";
/** Configuration for SNMPv3 user authentication and privacy */

class SnmpSession {
  /** Default SNMP v3 user configuration */
  private defaultUser: snmp.User = {
    name: "admin",
    level: snmp.SecurityLevel.authPriv,
    authProtocol: snmp.AuthProtocols.sha,
    authKey: "public",
    privProtocol: snmp.PrivProtocols.aes,
    privKey: "public"
  };

  private sessions: Record<string, snmp.Session> = {};

  constructor(config?: snmp.User) {
    if (config) {
      this.defaultUser = config;
    }
  }

  getSession(ip: string, userConfig?: snmp.User): snmp.Session {
    if (!this.sessions[ip]) {
      this.sessions[ip] = snmp.createV3Session(ip, userConfig || this.defaultUser);
    }
    return this.sessions[ip];
  }

  closeSession(ip: string) {
    if (this.sessions[ip]) {
      this.sessions[ip].close();
      delete this.sessions[ip];
    }
  }

  closeAllSessions() {
    for (const session of Object.values(this.sessions)) {
      session.close();
    }
    this.sessions = {};
  }
}

export const snmpSessionManager = new SnmpSession(process.env.SNMP_USER_CONFIG ? JSON.parse(process.env.SNMP_USER_CONFIG) : undefined);
