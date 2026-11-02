/**
 * CYBERWALL type definitions — Zyntrava Labs
 * All data shown in the app is demonstration data (see src/mock-data).
 */

export type WorkspaceId = "admin" | "soc";

export type UserRole =
  | "Super Administrator"
  | "Network Administrator"
  | "Security Analyst"
  | "Read Only Auditor";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

/* ---------- Network (Modules 03–05) ---------- */

export type Zone = "WAN" | "LAN" | "DMZ" | "VPN" | "Management" | "Guest";

export type LinkState = "up" | "down" | "degraded";

export interface NetworkInterface {
  id: string;
  name: string;
  device: string;
  zone: Zone;
  ipAddress: string;
  ipv6Address?: string;
  macAddress: string;
  linkState: LinkState;
  linkSpeed: string;
  rxMbps: number;
  txMbps: number;
  mtu: number;
  mode: "static" | "dhcp";
  gateway?: string;
  dns?: string[];
  utilizationPct: number;
}

export interface RouteEntry {
  id: string;
  destination: string;
  gateway: string;
  interface: string;
  metric: number;
  protocol: "Static" | "Connected" | "OSPF" | "BGP";
  routeType: "IPv4" | "IPv6";
  status: "active" | "inactive";
  notes?: string;
}

export interface DhcpLease {
  id: string;
  hostname: string;
  macAddress: string;
  ipAddress: string;
  pool: string;
  leaseStart: string;
  leaseEnd: string;
  state: "active" | "expired" | "reserved";
}

export interface Vlan {
  id: string;
  vlanId: number;
  name: string;
  zone: Zone;
  subnet: string;
  interface: string;
  state: "active" | "inactive";
  devices: number;
}

export interface TopologyNode {
  id: string;
  label: string;
  type:
    | "internet"
    | "gateway"
    | "firewall"
    | "switch"
    | "vlan"
    | "server"
    | "workstation"
    | "access-point"
    | "vpn-user";
  zone: Zone;
  x: number;
  y: number;
  health: "healthy" | "warning" | "critical" | "offline";
  ipAddress?: string;
  parentId?: string;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  status: "up" | "degraded" | "down";
  bandwidth: string;
}

/* ---------- Firewall (Modules 06–08) ---------- */

export type FirewallAction = "allow" | "deny" | "reject";

export interface FirewallRule {
  id: string;
  name: string;
  group: string;
  sourceZone: Zone;
  sourceAddress: string;
  destinationZone: Zone;
  destinationAddress: string;
  protocol: "TCP" | "UDP" | "ICMP" | "Any";
  sourcePort: string;
  destinationPort: string;
  action: FirewallAction;
  priority: number;
  enabled: boolean;
  log: boolean;
  schedule: string;
  lastModified: string;
  hitCount: number;
}

export interface NatRule {
  id: string;
  name: string;
  natType: "source" | "destination" | "port-forward";
  originalSource: string;
  originalDestination: string;
  translatedSource: string;
  translatedDestination: string;
  protocol: "TCP" | "UDP" | "Any";
  portMapping: string;
  enabled: boolean;
  lastModified: string;
}

export interface ActiveConnection {
  id: string;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: "TCP" | "UDP";
  state: string;
  duration: string;
  bytesSent: number;
  bytesReceived: number;
  application: string;
  policyId: string;
  establishedAt: string;
}

/* ---------- Application & Web Security (Modules 09–10) ---------- */

export type AppCategory =
  | "Collaboration"
  | "Streaming"
  | "Social Media"
  | "Cloud Services"
  | "Remote Access"
  | "File Sharing"
  | "Gaming"
  | "Security Tools";

export interface Application {
  id: string;
  name: string;
  category: AppCategory;
  protocol: string;
  usagePct: number;
  bandwidthMbps: number;
  policy: "allow" | "block" | "monitor";
  riskScore: number;
}

export interface WebDomain {
  id: string;
  domain: string;
  list: "allow" | "block" | "watch";
  category: string;
  queries24h: number;
  firstSeen: string;
  source: string;
}

/* ---------- VPN (Module 11) ---------- */

export interface VpnPeer {
  id: string;
  name: string;
  fingerprint: string;
  endpoint: string;
  assignedIp: string;
  lastHandshake: string;
  transferredGb: number;
  status: "connected" | "disconnected" | "pending";
  type: "remote-access" | "site-to-site";
  uptime: string;
}

/* ---------- Administration (Module 12) ---------- */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "disabled" | "invited";
  lastLogin: string;
  mfaEnabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  result: "success" | "failure";
  ipAddress: string;
}

/* ---------- SOC (Modules 13–20) ---------- */

export type Severity = "critical" | "high" | "medium" | "low" | "informational";

export interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: Severity;
  signature: string;
  category: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  action: "blocked" | "allowed" | "flagged";
  status: "new" | "acknowledged" | "resolved";
  mitreId?: string;
  description: string;
  recommendations: string[];
  analystNotes?: string;
  relatedAlertIds: string[];
}

export type IncidentStatus = "new" | "investigating" | "contained" | "resolved" | "closed";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  assignedAnalyst: string;
  affectedAsset: string;
  firstSeen: string;
  lastUpdated: string;
  description: string;
  alertIds: string[];
  mitreIds: string[];
  timeline: IncidentEvent[];
  recommendedActions: string[];
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

export type IocType = "IPv4" | "IPv6" | "Domain" | "URL" | "File hash";

export interface Ioc {
  id: string;
  indicator: string;
  type: IocType;
  reputation: "malicious" | "suspicious" | "benign" | "unrated";
  threatCategory: string;
  confidence: number;
  source: string;
  firstObserved: string;
  lastObserved: string;
  status: "active" | "expired" | "retired";
  relatedAlertIds: string[];
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  subTechniques: { id: string; name: string }[];
  detectionCoverage: "covered" | "partial" | "none";
  alertCount: number;
  recommendations: string[];
}

export interface ThreatActor {
  id: string;
  name: string;
  description: string;
  origin: string;
  targetSectors: string[];
  activeSince: string;
  associatedIocs: number;
}

/* ---------- Analytics & Reports (Modules 18–21) ---------- */

export interface TimeSeriesPoint {
  time: string;
  inbound: number;
  outbound: number;
  blocked?: number;
  events?: number;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface NamedMetric {
  name: string;
  value: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  category:
    | "Network Traffic"
    | "Firewall Policy"
    | "Security Incident"
    | "IDS/IPS"
    | "VPN Usage"
    | "System Health";
  description: string;
  sections: string[];
  lastGenerated: string;
}

/* ---------- Shell ---------- */

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  severity: Severity;
  workspace: WorkspaceId | "both";
  timestamp: string;
  read: boolean;
  link: string;
}

export interface Appliance {
  id: string;
  name: string;
  location: string;
  version: string;
  status: "healthy" | "warning" | "critical" | "offline";
  uptime: string;
}
