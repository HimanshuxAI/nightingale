// ── Shared domain types for Nightingale ─────────────────────────────────────

export type Tier = 0 | 1 | 2 | 3;

export type DeviceStatus = "online" | "quarantined";

export type Profile = "calm" | "watch" | "alert" | "critical";

export interface Telemetry {
  /** Shannon entropy of recently written file blocks (0–8 bits/byte) */
  entropy: number;
  /** Bytes written to disk, MB per second */
  writeRate: number;
  /** File rename/create operations per second */
  renameRate: number;
  /** Open SMB/RDP connections to other hosts (lateral movement signal) */
  smbConns: number;
  /** Canary/decoy files touched in this window (near-certain tripwire) */
  canaryHits: number;
  /** Volume-shadow-copy / backup deletion events in this window */
  shadowDel: number;
}

export interface Device {
  id: string;
  name: string;
  kind: string;
  unit: string;
  ip: string;
  /** Patient-safety criticality: 0 = life-critical … 3 = administrative */
  tier: Tier;
  status: DeviceStatus;
  /** Latest raw telemetry window */
  tele: Telemetry;
  /** Smoothed threat score 0–100 */
  risk: number;
  /** Clinical Risk Index = risk × tier weight (0–100, capped) */
  cri: number;
  /** Mapped body temperature 36.5–42.0 °C */
  fever: number;
  /** Ring buffer of recent telemetry for sparklines */
  history: Telemetry[];
  /** Simulation phase tag (for demo storytelling) */
  phase: string;
  lastSeen: number;
}

export type Severity = "watch" | "alert" | "critical";

export type IncidentStatus = "open" | "contained" | "resolved";

export interface Incident {
  id: string;
  deviceId: string;
  deviceName: string;
  kind: string;
  severity: Severity;
  status: IncidentStatus;
  score: number;
  summary: string;
  evidence: string[];
  startedAt: number;
  containedAt?: number;
}

export interface FeedEvent {
  id: string;
  ts: number;
  level: "info" | "ok" | "watch" | "alert" | "critical";
  deviceName?: string;
  text: string;
}

export interface AuditEntry {
  id: string;
  ts: number;
  actor: string;
  action: string;
  target: string;
  detail: string;
}

export interface NetworkSnapshot {
  fever: number;
  profile: Profile;
  contained: number;
  activeIncidents: number;
  hottest: string;
  criTop: number;
}

export interface WorldState {
  mode: "demo" | "supabase";
  hospital: string;
  now: number;
  devices: Device[];
  incidents: Incident[];
  events: FeedEvent[];
  audit: AuditEntry[];
  network: NetworkSnapshot;
  tickCount: number;
}
