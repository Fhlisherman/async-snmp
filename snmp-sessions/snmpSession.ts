
/** Configuration for SNMPv3 user authentication and privacy */
import { AuthProtocols, createV3Session, PrivProtocols, SecurityLevel, Session, type User } from "net-snmp";

class SnmpSession {
  /** Default SNMP v3 user configuration */
  private defaultUser: User = {
    name: "admin",
    level: SecurityLevel.authPriv,
    authProtocol: AuthProtocols.sha,
    authKey: "public",
    privProtocol: PrivProtocols.aes,
    privKey: "public"
  };

  private sessions: Record<string, Session> = {};

  constructor(config?: User) {
    if (config) {
      this.defaultUser = config;
    }
  }

  getSession(ip: string, userConfig?: User, options?: any): Session {
    if (!this.sessions[ip]) {
      this.sessions[ip] = createV3Session(ip, userConfig || this.defaultUser, options);
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
