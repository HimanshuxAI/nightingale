// ── Detection engine ──────────────────────────────────────────────────────────
// Transparent, weighted multi-signal fusion. Each signal is normalised to 0–1
// and combined with fixed weights; the composite is smoothed with an EMA so a
// single noisy window cannot trip the ward. Designed to be explainable on a
// slide: every alarm can be traced back to named signals.

import type { Device, Telemetry } from "./types";

export const WEIGHTS = {
  canary: 0.32, // decoy file touched — near-zero false-positive tripwire
  entropy: 0.24, // high entropy of freshly written blocks = ciphertext
  shadow: 0.18, // shadow-copy / backup deletion = pre-encryption prep
  lateral: 0.12, // SMB/RDP burst to peer hosts = worm-style spread
  rename: 0.14, // mass rename/create churn = encryption sweep
} as const;

export const THRESHOLDS = { watch: 35, alert: 55, critical: 75 } as const;

export const TIER_WEIGHT: Record<number, number> = { 0: 1.5, 1: 1.25, 2: 1.0, 3: 0.75 };

export const TIER_LABEL: Record<number, string> = {
  0: "Life-critical",
  1: "Care-critical",
  2: "Operational",
  3: "Administrative",
};

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export function normaliseSignals(t: Telemetry) {
  return {
    canary: clamp(t.canaryHits / 1),
    entropy: clamp((t.entropy - 1.0) / 6.5),
    shadow: clamp(t.shadowDel / 1),
    lateral: clamp((t.smbConns - 15) / 85),
    rename: clamp(t.renameRate / 900),
  };
}

/** Raw composite score for one telemetry window (0–100, unsmoothed). */
export function rawScore(t: Telemetry): number {
  const s = normaliseSignals(t);
  const raw =
    WEIGHTS.canary * s.canary +
    WEIGHTS.entropy * s.entropy +
    WEIGHTS.shadow * s.shadow +
    WEIGHTS.lateral * s.lateral +
    WEIGHTS.rename * s.rename;
  return raw * 100;
}

/** Exponential moving average — stability without blinding us to spikes. */
export function smooth(prev: number, raw: number): number {
  const alpha = raw > prev ? 0.62 : 0.38; // rise fast, decay slow
  return Math.round((alpha * raw + (1 - alpha) * prev) * 10) / 10;
}

export function profileOf(risk: number) {
  if (risk >= THRESHOLDS.critical) return "critical" as const;
  if (risk >= THRESHOLDS.alert) return "alert" as const;
  if (risk >= THRESHOLDS.watch) return "watch" as const;
  return "calm" as const;
}

/** Map threat score to a clinical "fever" — the design metaphor of the UI. */
export function feverOf(risk: number): number {
  const t = 36.5 + 5.5 * clamp(risk / 100);
  return Math.round(t * 10) / 10;
}

/** Clinical Risk Index — threat × patient-safety criticality, capped at 100. */
export function criOf(risk: number, tier: number): number {
  return Math.min(100, Math.round(risk * (TIER_WEIGHT[tier] ?? 1)));
}

export function classify(d: Device): { severity: "watch" | "alert" | "critical" | null; evidence: string[] } {
  const s = normaliseSignals(d.tele);
  const evidence: string[] = [];
  if (s.canary > 0) evidence.push(`Canary tripwire broken (${d.tele.canaryHits} decoy files touched)`);
  if (s.entropy > 0.25) evidence.push(`Write entropy ${d.tele.entropy.toFixed(2)} bits/byte — ciphertext profile`);
  if (s.shadow > 0) evidence.push(`${d.tele.shadowDel} shadow-copy/backup deletion event(s)`);
  if (s.lateral > 0.15) evidence.push(`${d.tele.smbConns} outbound SMB/RDP connections — lateral burst`);
  if (s.rename > 0.2) evidence.push(`${d.tele.renameRate} renames/s — mass encryption sweep`);
  const profile = profileOf(d.risk);
  if (profile === "calm") return { severity: null, evidence };
  return { severity: profile, evidence };
}

/** Human-readable sentence for the incident feed, weighted by tier. */
export function incidentSummary(d: Device): string {
  const s = normaliseSignals(d.tele);
  if (s.canary > 0 && s.entropy > 0.5)
    return `Confirmed encryption in progress: decoy files touched and ciphertext-entropy writes on ${d.name}.`;
  if (s.canary > 0) return `Canary tripwire broken on ${d.name} — treating as encryption prep.`;
  if (s.entropy > 0.7) return `Sustained high-entropy writes on ${d.name} — bulk encryption signature.`;
  if (s.shadow > 0 && s.lateral > 0.3)
    return `${d.name} deleted backups and is reaching out to peer hosts — staged attack pattern.`;
  if (s.shadow > 0) return `${d.name} deleted volume shadow copies — pre-encryption staging.`;
  if (s.lateral > 0.4) return `Lateral movement burst from ${d.name} across ${d.tele.smbConns} SMB/RDP sessions.`;
  if (s.rename > 0.5) return `Mass file-rename churn on ${d.name} — possible encryption sweep.`;
  return `Behavioural anomaly on ${d.name} exceeded the alert threshold.`;
}
