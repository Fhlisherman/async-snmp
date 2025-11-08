import * as snmp from "net-snmp";

const USER = {
  name: "fred",
  level: snmp.SecurityLevel.authPriv,
  authProtocol: snmp.AuthProtocols.sha,
  authKey: "adar",
  privProtocol: snmp.PrivProtocols.aes,
  privKey: "adar",
};

class SnmpSession {
  private sessions: { [ip: string]: any } = {};

  getSession(ip: string): Record<string, any> | null {
    if (!this.sessions[ip]) {
      this.sessions[ip] = snmp.createV3Session(ip, USER);
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
    for (const ip in this.sessions) {
      this.sessions[ip].close();
    }
    this.sessions = {};
  }
}

export const snmpSessionManager = new SnmpSession();
