// ── Simulation world ─────────────────────────────────────────────────────────
// A deterministic-ish hospital device fleet with baseline noise and injectable
// attack ramps. The frontend polls POST /api/tick, which advances the world one
// step (≈2 s of wall clock) and runs the detection engine over every device.
// State lives in a globalThis singleton so Next.js hot reloads don't wipe it.

import {
  classify,
  criOf,
  feverOf,
  incidentSummary,
  profileOf,
  rawScore,
  smooth,
  TIER_LABEL,
} from "./engine";
import type {
  AuditEntry,
  Device,
  FeedEvent,
  Incident,
  NetworkSnapshot,
  Profile,
  Telemetry,
  Tier,
  WorldState,
} from "./types";

export const HOSPITAL = "St. Hesper General Hospital";

const TICK_MS = 2000;
const HISTORY = 72;

interface Seed {
  id: string;
  name: string;
  kind: string;
  unit: string;
  tier: Tier;
  /** baseline telemetry around which noise is drawn */
  base: { entropy: number; writeRate: number; renameRate: number; smbConns: number };
}

const SEEDS: Seed[] = [
  { id: "icu-pump-01", name: "Infusion Pump ICU-01", kind: "Infusion pump", unit: "ICU", tier: 0, base: { entropy: 0.4, writeRate: 0.05, renameRate: 0.1, smbConns: 2 } },
  { id: "icu-vent-01", name: "Ventilator ICU-02", kind: "Ventilator", unit: "ICU", tier: 0, base: { entropy: 0.3, writeRate: 0.04, renameRate: 0.1, smbConns: 1 } },
  { id: "icu-mon-01", name: "Bedside Monitor ICU-03", kind: "Patient monitor", unit: "ICU", tier: 0, base: { entropy: 0.5, writeRate: 0.08, renameRate: 0.2, smbConns: 3 } },
  { id: "ehr-core", name: "EHR Core Server", kind: "EHR server", unit: "IT Core", tier: 1, base: { entropy: 0.7, writeRate: 2.4, renameRate: 3.5, smbConns: 6 } },
  { id: "pacs-01", name: "PACS Imaging Store", kind: "PACS server", unit: "Radiology", tier: 1, base: { entropy: 0.8, writeRate: 5.1, renameRate: 2.2, smbConns: 4 } },
  { id: "mri-console", name: "MRI Console 1", kind: "Imaging console", unit: "Radiology", tier: 1, base: { entropy: 0.5, writeRate: 1.8, renameRate: 1.4, smbConns: 2 } },
  { id: "lab-an-01", name: "Lab Analyzer L-1", kind: "Lab system", unit: "Laboratory", tier: 1, base: { entropy: 0.6, writeRate: 0.9, renameRate: 1.8, smbConns: 2 } },
  { id: "us-port-04", name: "Portable Ultrasound US-04", kind: "Ultrasound", unit: "Ward 3", tier: 1, base: { entropy: 0.4, writeRate: 0.6, renameRate: 0.5, smbConns: 1 } },
  { id: "phar-disp-01", name: "Pharmacy Dispenser P-1", kind: "Dispensing cabinet", unit: "Pharmacy", tier: 2, base: { entropy: 0.5, writeRate: 0.3, renameRate: 0.8, smbConns: 2 } },
  { id: "or-sched-01", name: "OR Scheduling WS", kind: "Workstation", unit: "Operating Theatres", tier: 2, base: { entropy: 0.6, writeRate: 0.4, renameRate: 1.2, smbConns: 3 } },
  { id: "ward-ns-12", name: "Nurse Station WS-12", kind: "Workstation", unit: "Ward 3", tier: 2, base: { entropy: 0.6, writeRate: 0.5, renameRate: 1.5, smbConns: 4 } },
  { id: "adm-front-01", name: "Admissions PC-01", kind: "Desktop", unit: "Front Desk", tier: 3, base: { entropy: 0.7, writeRate: 0.2, renameRate: 0.6, smbConns: 2 } },
  { id: "bill-srv-01", name: "Billing Server", kind: "Server", unit: "Administration", tier: 3, base: { entropy: 0.6, writeRate: 1.1, renameRate: 1.0, smbConns: 3 } },
  { id: "nas-backup-01", name: "Back-office NAS", kind: "NAS share", unit: "Administration", tier: 3, base: { entropy: 0.9, writeRate: 3.2, renameRate: 2.5, smbConns: 5 } },
];

const noise = (v: number, spread: number, lo = 0) =>
  Math.max(lo, Math.round((v + (Math.random() * 2 - 1) * spread) * 100) / 100);

function baselineTele(seed: Seed): Telemetry {
  return {
    entropy: noise(seed.base.entropy, 0.12, 0.05),
    writeRate: noise(seed.base.writeRate, seed.base.writeRate * 0.25 + 0.05, 0),
    renameRate: noise(seed.base.renameRate, seed.base.renameRate * 0.3 + 0.1, 0),
    smbConns: Math.round(noise(seed.base.smbConns, 1.4, 0)),
    canaryHits: 0,
    shadowDel: 0,
  };
}

function makeDevice(seed: Seed): Device {
  const tele = baselineTele(seed);
  return {
    id: seed.id,
    name: seed.name,
    kind: seed.kind,
    unit: seed.unit,
    ip: `10.${20 + seed.tier}.${10 + SEEDS.indexOf(seed)}.5`,
    tier: seed.tier,
    status: "online",
    tele,
    risk: 0,
    cri: 0,
    fever: 36.5,
    history: Array.from({ length: 12 }, () => baselineTele(seed)),
    phase: "steady",
    lastSeen: Date.now(),
  };
}

/** Attack ramp: per-tick telemetry targets, keyed by ticks since injection. */
function rampAt(t: number, profile: "standard" | "fast" | "stealth"): Partial<Telemetry> {
  // stealth: slower entropy creep, delayed burst — stresses early warning
  const s = profile === "stealth" ? 0.62 : profile === "fast" ? 1.6 : 1;
  const tt = Math.floor(t * s);
  if (tt < 2) return { smbConns: 9 + tt * 3 }; // recon: quiet SMB probe
  if (tt < 4) return { smbConns: 16 + tt * 4, shadowDel: tt === 3 ? 3 : 1 }; // staging
  if (tt < 6) return { smbConns: 22 + tt * 3, canaryHits: tt - 3, entropy: 1.4 + (tt - 4) * 1.1 }; // tripwire
  if (tt < 11) {
    const p = (tt - 6) / 5;
    return {
      smbConns: 30 + Math.round(p * 60),
      entropy: 3.4 + p * 4.4,
      renameRate: 120 + Math.round(p * 780),
      writeRate: 40 + Math.round(p * 260),
    };
  }
  return { smbConns: 88, entropy: 7.92, renameRate: 920, writeRate: 300 }; // sustained burn
}

class World {
  state: WorldState;
  private attacks = new Map<string, { started: number; profile: "standard" | "fast" | "stealth" }>();

  constructor() {
    const devices = SEEDS.map(makeDevice);
    this.state = {
      mode: "demo",
      hospital: HOSPITAL,
      now: Date.now(),
      devices,
      incidents: [],
      events: [],
      audit: [],
      network: {
        fever: 36.5,
        profile: "calm",
        contained: 0,
        activeIncidents: 0,
        hottest: "—",
        criTop: 0,
      },
      tickCount: 0,
    };
    this.state.network = this.snapshot();
    this.log("info", "Nightingale watch floor online — baseline learned for 14 devices.");
    this.audit("system", "watch.start", "all devices", "Baseline behaviour capture started");
  }

  // ── feed helpers ───────────────────────────────────────────────────────────
  private ring<T>(arr: T[], item: T, cap: number) {
    arr.unshift(item);
    if (arr.length > cap) arr.length = cap;
  }
  log(level: FeedEvent["level"], text: string, deviceName?: string) {
    this.ring(this.state.events, { id: `e${Date.now()}${Math.random().toString(36).slice(2, 6)}`, ts: Date.now(), level, text, deviceName }, 80);
  }
  audit(actor: string, action: string, target: string, detail: string) {
    this.ring(this.state.audit, { id: `a${Date.now()}${Math.random().toString(36).slice(2, 6)}`, ts: Date.now(), actor, action, target, detail }, 60);
  }

  device(id: string) {
    return this.state.devices.find((d) => d.id === id);
  }

  // ── one engine step ────────────────────────────────────────────────────────
  tick() {
    this.state.tickCount += 1;
    this.state.now = Date.now();
    for (const d of this.state.devices) {
      const seed = SEEDS.find((s) => s.id === d.id)!;
      let tele: Telemetry;
      const atk = this.attacks.get(d.id);
      if (d.status === "quarantined") {
        tele = { ...baselineTele(seed), smbConns: 0 };
      } else if (atk) {
        const t = this.state.tickCount - atk.started;
        const r = rampAt(t, atk.profile);
        tele = { ...baselineTele(seed), ...r } as Telemetry;
        d.phase =
          (r.canaryHits ?? 0) > 0 ? "canary-tripped"
          : (r.entropy ?? 0) > 3 ? "encrypting"
          : (r.shadowDel ?? 0) > 0 ? "staging"
          : (r.smbConns ?? 0) > 8 ? "recon" : d.phase;
      } else {
        tele = baselineTele(seed);
        d.phase = "steady";
      }
      d.tele = tele;
      this.ring(d.history, tele, HISTORY);
      d.risk = d.status === "quarantined" ? Math.min(d.risk, 18) : smooth(d.risk, rawScore(tele));
      d.cri = d.status === "quarantined" ? Math.round(d.risk * 1.2) : criOf(d.risk, d.tier);
      d.fever = feverOf(d.risk);
      d.lastSeen = Date.now();
      this.evaluate(d);
    }
    // resolve stale incidents whose device cooled down
    for (const inc of this.state.incidents) {
      const d = this.device(inc.deviceId);
      if (inc.status === "open" && d && d.risk < 30) {
        inc.status = "resolved";
        this.log("ok", `Signal on ${d.name} decayed below watch threshold — incident auto-closed after review.`, d.name);
      }
    }
    this.state.network = this.snapshot();
  }

  private evaluate(d: Device) {
    const { severity, evidence } = classify(d);
    if (!severity) return;
    const open = this.state.incidents.find((i) => i.deviceId === d.id && i.status === "open");
    if (open) {
      if (orderOf(severity) > orderOf(open.severity)) {
        open.severity = severity;
        open.score = d.risk;
        open.summary = incidentSummary(d);
        open.evidence = evidence;
        this.log(levelOf(severity), `Escalated → ${severity.toUpperCase()} on ${d.name}: ${open.summary}`, d.name);
      }
      return;
    }
    const inc: Incident = {
      id: `inc-${d.id}-${Date.now()}`,
      deviceId: d.id,
      deviceName: d.name,
      kind: d.kind,
      severity,
      status: "open",
      score: d.risk,
      summary: incidentSummary(d),
      evidence,
      startedAt: Date.now(),
    };
    this.state.incidents.unshift(inc);
    if (this.state.incidents.length > 40) this.state.incidents.length = 40;
    const triage = d.tier <= 1 ? `CLINICAL PRIORITY ${TIER_LABEL[d.tier].toUpperCase()} — containment advised` : "containment advised";
    this.log(levelOf(severity), `${severity.toUpperCase()} on ${d.name} (risk ${d.risk}, CRI ${d.cri}). ${inc.summary} ${triage}.`, d.name);
  }

  // ── operator actions ───────────────────────────────────────────────────────
  inject(deviceId: string, profile: "standard" | "fast" | "stealth" = "standard") {
    const d = this.device(deviceId);
    if (!d || this.attacks.has(deviceId)) return false;
    this.attacks.set(deviceId, { started: this.state.tickCount, profile });
    this.log("watch", `Drill armed: simulated ransomware campaign (${profile}) targeting ${d.name} — watch for early signals.`, d.name);
    this.audit("demo operator", "attack.inject", d.name, `Synthetic ransomware profile "${profile}" armed`);
    return true;
  }

  contain(deviceId: string) {
    const d = this.device(deviceId);
    if (!d || d.status === "quarantined") return false;
    d.status = "quarantined";
    d.phase = "contained";
    d.tele = { ...d.tele, smbConns: 0, canaryHits: 0, shadowDel: 0, renameRate: 0, writeRate: 0.01, entropy: 0.1 };
    const inc = this.state.incidents.find((i) => i.deviceId === d.id && i.status === "open");
    if (inc) {
      inc.status = "contained";
      inc.containedAt = Date.now();
    }
    this.attacks.delete(deviceId);
    const gain = d.tier <= 1 ? "Life-critical segment isolated" : "Segment isolated";
    this.log("ok", `${d.name} quarantined — NAC revoked its VLAN lease, SMB/RDP dropped. ${gain}.`, d.name);
    this.audit("demo operator", "device.contain", d.name, "Network quarantine enforced (simulated NAC/VLAN revoke)");
    return true;
  }

  release(deviceId: string) {
    const d = this.device(deviceId);
    if (!d || d.status !== "quarantined") return false;
    d.status = "online";
    d.phase = "steady";
    d.risk = 6;
    this.log("info", `${d.name} returned to service after operator review — re-learning baseline.`, d.name);
    this.audit("demo operator", "device.release", d.name, "Returned to production VLAN");
    return true;
  }

  reset() {
    this.attacks.clear();
    const devices = SEEDS.map(makeDevice);
    this.state.devices = devices;
    this.state.incidents = [];
    this.state.events = [];
    this.state.audit = [];
    this.state.tickCount = 0;
    this.state.now = Date.now();
    this.state.network = this.snapshot();
    this.log("info", "Watch floor reset — fleet re-seeded, baselines re-learned.");
    this.audit("demo operator", "watch.reset", "all devices", "Simulation state cleared");
  }

  // ── network rollup ─────────────────────────────────────────────────────────
  private snapshot(): NetworkSnapshot {
    const ds = this.state.devices;
    const top = [...ds].sort((a, b) => b.cri - a.cri)[0];
    const hottest = top.cri > 8 ? top.name : "—";
    const worst: Profile = ds.reduce<Profile>((acc, d) => {
      const p = profileOf(d.risk);
      return orderOf(p as any) > orderOf(acc as any) ? p : acc;
    }, "calm");
    return {
      fever: top ? feverOf(Math.min(100, top.cri)) : 36.5,
      profile: worst,
      contained: ds.filter((d) => d.status === "quarantined").length,
      activeIncidents: this.state.incidents.filter((i) => i.status === "open").length,
      hottest,
      criTop: top?.cri ?? 0,
    };
  }

  /** Seed rows for the Supabase devices table. */
  deviceSeedRows() {
    return SEEDS.map((s) => ({
      device_id: s.id,
      name: s.name,
      kind: s.kind,
      unit: s.unit,
      tier: s.tier,
      ip: `10.${20 + s.tier}.${10 + SEEDS.indexOf(s)}.5`,
    }));
  }
}

const orderOf = (p: Profile) => ({ calm: 0, watch: 1, alert: 2, critical: 3 }[p]);
const levelOf = (s: Incident["severity"]) => s;

const g = globalThis as unknown as { __nightingale?: World };
export const world: World = g.__nightingale ?? (g.__nightingale = new World());
export { TICK_MS };
