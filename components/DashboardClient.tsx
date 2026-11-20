"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { classify, profileOf } from "@/lib/engine";
import type { Device, Profile, WorldState } from "@/lib/types";
import Sparkline from "./Sparkline";

const PROFILE_COLOR: Record<Profile, string> = {
  calm: "var(--calm)",
  watch: "var(--watch)",
  alert: "var(--alert)",
  critical: "var(--critical)",
};
const PROFILE_WORD: Record<Profile, string> = {
  calm: "Ward calm — baseline hold",
  watch: "Watch — something is warming up",
  alert: "Alert — encryption signature forming",
  critical: "Critical — encryption likely underway",
};

const fmtTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

function signalState(t: Device["tele"]) {
  return {
    canary: t.canaryHits > 0,
    ent: t.entropy > 1.6,
    shadow: t.shadowDel > 0,
    smb: t.smbConns > 15,
    ren: t.renameRate > 80,
  };
}

function ProfileChip({ p }: { p: Profile }) {
  return (
    <span className={`chip ${p}`}>
      <span className={`dot ${p}`} />
      {p}
    </span>
  );
}

type Role = "clinician" | "secops" | "itadmin" | "leadership" | "biomed";

const TIER_LABELS: Record<number, string> = {
  0: "T0 Life-critical",
  1: "T1 Care-critical",
  2: "T2 Operational",
  3: "T3 Administrative",
};

function filterDevicesForRole(devices: Device[], role: Role): Device[] {
  switch (role) {
    case "clinician":
      return devices.filter((d) => d.tier <= 1);
    case "biomed":
      return devices.filter((d) =>
        d.kind.toLowerCase().includes("pump") ||
        d.kind.toLowerCase().includes("ventilator") ||
        d.kind.toLowerCase().includes("monitor") ||
        d.kind.toLowerCase().includes("imaging") ||
        d.kind.toLowerCase().includes("ultrasound") ||
        d.kind.toLowerCase().includes("lab")
      );
    case "leadership":
      return devices;
    default:
      return devices;
  }
}

function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    clinician: "Clinician View",
    secops: "SOC Analyst View",
    itadmin: "IT Admin View",
    leadership: "Leadership View",
    biomed: "Biomedical View",
  };
  return labels[role];
}

function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? singular + "s");
}

export default function DashboardClient({
  mode,
  hospital,
  role,
}: { mode: "demo" | "supabase"; hospital: string; role: Role }) {
  const router = useRouter();
  const [state, setState] = useState<WorldState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drillDevice, setDrillDevice] = useState("icu-pump-01");
  const [drillProfile, setDrillProfile] = useState<"standard" | "fast" | "stealth">("standard");
  const [busy, setBusy] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [clock, setClock] = useState(() => fmtTime(Date.now()));
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const poll = async () => {
      try {
        const r = await fetch("/api/tick", { method: "POST" });
        if (r.ok && alive.current) setState(await r.json());
      } catch {
        /* transient */
      }
    };
    void poll();
    const t = setInterval(poll, 2200);
    const c = setInterval(() => setClock(fmtTime(Date.now())), 1000);
    return () => {
      alive.current = false;
      clearInterval(t);
      clearInterval(c);
    };
  }, []);

  const act = useCallback(async (path: string, body?: object) => {
    setBusy(true);
    try {
      await fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const r = await fetch("/api/tick", { method: "POST" });
      if (r.ok) setState(await r.json());
    } finally {
      setBusy(false);
    }
  }, []);

  const allDevices = state?.devices ?? [];
  const devices = useMemo(() => filterDevicesForRole(allDevices, role), [allDevices, role]);
  const ranked = useMemo(() => [...devices].sort((a, b) => b.cri - a.cri), [devices]);
  const selected = devices.find((d) => d.id === selectedId) ?? null;
  const network = state?.network;
  const openIncidents = state?.incidents.filter((i) => i.status === "open") ?? [];
  const topIncident = openIncidents[0] ?? null;
  const liveAttack = devices.find((d) => d.status === "online" && d.phase !== "steady");
  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (!state || !network) {
    return (
      <main className="wrap">
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
          <div className="kicker">Nightingale</div>
          <p className="serif-italic" style={{ fontSize: 22, marginTop: "8px" }}>
            Warming up the watch floor…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      {/* ── masthead ── */}
      <header className="masthead">
        <div className="brand">
          <div>
            <div className="brand-word">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Nightingale
            </div>
            <div className="brand-sub">{hospital.toUpperCase()} · RANSOMWARE WATCH FLOOR</div>
          </div>
        </div>
        <div className="masthead-meta">
          <ProfileChip p={network.profile} />
          <span className="chip">
            <span className="dot" style={{ background: mode === "supabase" ? "var(--calm)" : "var(--resolved)" }} />
            {mode === "supabase" ? "Supabase linked" : "Local demo"}
          </span>
          <span className="chip" style={{ background: "var(--brand-light)", borderColor: "var(--brand-border)", color: "var(--brand)" }}>
            {getRoleLabel(role)}
          </span>
          <span className="chip mono">{clock}</span>
          <button className="btn ghost small" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── status band ── */}
      <section className="band">
        <div className="panel" style={{ height: "190px", display: "flex", flexDirection: "column", borderLeft: `4px solid ${PROFILE_COLOR[network.profile]}` }}>
          <div className="panel-head">
            <span className="kicker">Network fever</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
              TOP-CRI DEVICE
            </span>
          </div>
          <div className="panel-body" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="fever-num" style={{ color: PROFILE_COLOR[network.profile] }}>
                {network.fever.toFixed(1)}
                <sup>°C</sup>
              </div>
              <div className="fever-profile" style={{ color: PROFILE_COLOR[network.profile] }}>
                {PROFILE_WORD[network.profile]}
              </div>
              <div className="fever-bar">
                <div className="pin" style={{ left: `calc(${Math.min(100, ((network.fever - 36.5) / 5.5) * 100)}% - 2px)` }} />
              </div>
            </div>
            <p className="fever-caption" style={{ marginTop: "auto" }}>
              {network.hottest === "—" ? "Every device is at baseline." : `Hottest on the floor: ${network.hottest}.`}
              {" "}Fever = risk mapped to body temperature — the chart reads like a patient chart on purpose.
            </p>
          </div>
        </div>

        <div className="panel" style={{ height: "190px", display: "flex", flexDirection: "column" }}>
          <div className="panel-head">
            <span className="kicker">Night rounds — live event feed</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
              {state.events.length} {pluralize(state.events.length, "entry")}
            </span>
          </div>
          <div className="panel-body" style={{ flex: 1, overflow: "hidden" }}>
            {state.events.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--muted)", fontSize: 12 }}>
                No events yet
              </div>
            ) : (
              <div className="ticker">
                {state.events.slice(0, 24).map((e) => (
                  <div key={e.id} className={`tick-row ${e.level}`}>
                    <span className="tick-ts">{fmtTime(e.ts)}</span>
                    <span className={`tick-dot dot ${e.level === "info" ? "" : e.level}`} style={e.level === "info" ? { background: "var(--muted)" } : undefined} />
                    <span className="tick-text">{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`panel contain-card ${openIncidents.length > 0 ? 'critical' : ''}`} style={{ height: "190px", display: "flex", flexDirection: "column" }}>
          <div className="panel-head">
            <span className="kicker">Containment</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
              CRI QUEUE
            </span>
          </div>
          <div className="panel-body" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
              <div className="fever-num" style={{ fontSize: 48, color: openIncidents.length > 0 ? "var(--critical)" : "var(--brand)" }}>
                {openIncidents.length}
              </div>
              <div className="kicker" style={{ letterSpacing: "0.14em" }}>
                open incident{openIncidents.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="fever-caption">
              {network.contained > 0
                ? `${network.contained} device${network.contained === 1 ? "" : "s"} quarantined · audit trail kept.`
                : "No devices quarantined. Queue orders by patient-safety weight, not raw threat."}
            </p>
            {topIncident && topIncident.status === "open" ? (
              <button
                className="btn critical small"
                style={{ width: "100%", marginTop: "8px" }}
                disabled={busy}
                onClick={() => void act("/api/contain", { deviceId: topIncident.deviceId })}
              >
                Contain {topIncident.deviceName}
              </button>
            ) : (
              <button className="btn secondary small" style={{ marginTop: "8px" }} disabled>
                All clear — holding baseline
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CRI board ── */}
      {role === "leadership" ? (
        <>
          <div className="section-title">
            <h2>Risk Posture Summary</h2>
            <span className="kicker">Executive view — open incidents, containment status, fleet health</span>
          </div>
          <div className="summary-grid">
            <div className="panel" style={{ borderLeft: `4px solid ${PROFILE_COLOR[network.profile]}` }}>
              <div className="panel-head"><span className="kicker">Open Incidents</span></div>
              <div className="panel-body">
                <div className="summary-num" style={{ color: openIncidents.length > 0 ? "var(--critical)" : "var(--brand)" }}>
                  {openIncidents.length}
                </div>
                <p className="fever-caption" style={{ marginTop: "4px" }}>
                  {openIncidents.length === 0 ? "No active threats" : `${openIncidents.filter((i) => i.severity === "critical").length} critical, ${openIncidents.filter((i) => i.severity === "alert").length} alert`}
                </p>
              </div>
            </div>
            <div className="panel" style={{ borderLeft: "4px solid var(--contained)" }}>
              <div className="panel-head"><span className="kicker">Contained</span></div>
              <div className="panel-body">
                <div className="summary-num" style={{ color: "var(--contained)" }}>{network.contained}</div>
                <p className="fever-caption" style={{ marginTop: "4px" }}>Devices quarantined</p>
              </div>
            </div>
            <div className="panel" style={{ borderLeft: "4px solid var(--brand)" }}>
              <div className="panel-head"><span className="kicker">Fleet Fever</span></div>
              <div className="panel-body">
                <div className="summary-num" style={{ color: PROFILE_COLOR[network.profile] }}>
                  {network.fever.toFixed(1)}<sup>°C</sup>
                </div>
                <p className="fever-caption" style={{ marginTop: "4px" }}>Network temperature</p>
              </div>
            </div>
            <div className="panel" style={{ borderLeft: "4px solid var(--watch)" }}>
              <div className="panel-head"><span className="kicker">Life-Critical at Risk</span></div>
              <div className="panel-body">
                <div className="summary-num" style={{ color: allDevices.filter((d) => d.tier === 0 && d.risk > 35).length > 0 ? "var(--critical)" : "var(--calm)" }}>
                  {allDevices.filter((d) => d.tier === 0 && d.risk > 35).length}
                </div>
                <p className="fever-caption" style={{ marginTop: "4px" }}>Tier 0 devices above watch threshold</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="section-title">
            <h2>Clinical Risk Index — triage queue</h2>
            <span className="kicker">risk × patient-safety weight · click a row for vitals</span>
          </div>
          <section className="panel board">
            <div className="table-wrap">
              <div className="thead">
                <span className="kicker">#</span>
                <span className="kicker">Device</span>
                <span className="kicker hide-md">Fever</span>
                <span className="kicker">Clinical risk</span>
                <span className="kicker hide-md">Active signals</span>
                <span className="kicker" style={{ textAlign: "right" }}>
                  Action
                </span>
              </div>
              {ranked.map((d, i) => {
                const p = profileOf(d.risk);
                const sig = signalState(d.tele);
                const anySig = sig.canary || sig.ent || sig.shadow || sig.smb || sig.ren;
                const inc = openIncidents.find((x) => x.deviceId === d.id);
                return (
                  <div
                    key={d.id}
                    className={`row-content ${p === "critical" ? "critical" : ""}`}
                    onClick={() => setSelectedId(d.id)}
                    style={{ minWidth: "900px", display: "contents" }}
                  >
                    <div className="row">
                      <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                      <span className="dev-cell">
                        <span className="dev-name">{d.name}</span>
                        {inc && inc.status === "open" ? <span title={inc.summary} style={{ marginLeft: 6, color: "var(--critical)" }}>⚠</span> : null}
                        <div className="dev-meta">
                          <span className={`tier-chip tier-${d.tier}`}>{TIER_LABELS[d.tier]}</span>
                          {d.kind} · {d.unit} · {d.ip}
                        </div>
                      </span>
                      <span className="fever-cell hide-md" style={{ color: PROFILE_COLOR[p] }}>
                        {d.fever.toFixed(1)}
                        <small> °C</small>
                      </span>
                      <span className="cri-cell">
                        <div className="cri-bar">
                          <div style={{ width: `${d.cri}%`, background: PROFILE_COLOR[p], transitionDelay: "120ms" }} />
                        </div>
                        <span className="cri-val">{d.cri}</span>
                        <div className="dev-meta" style={{ marginTop: 4 }}>
                          risk {d.risk.toFixed(0)} / 100
                        </div>
                      </span>
                      <span className="signals hide-md">
                        {anySig ? (
                          <>
                            {sig.canary && <span className="sev-tag critical">CANARY</span>}
                            {sig.shadow && <span className="sev-tag critical">SHADOW</span>}
                            {sig.ent && <span className="sev-tag alert">ENTROPY</span>}
                            {sig.smb && <span className="sev-tag watch">LATERAL</span>}
                            {sig.ren && <span className="sev-tag watch">RENAME</span>}
                          </>
                        ) : (
                          <span className="sig">— baseline</span>
                        )}
                      </span>
                      <span className="row-actions" onClick={(e) => e.stopPropagation()}>
                        {d.status === "quarantined" ? (
                          <button className="btn secondary small" disabled={busy} onClick={() => void act("/api/release", { deviceId: d.id })}>
                            Release
                          </button>
                        ) : (
                          <button
                            className={`btn small ${d.cri >= 35 ? "critical" : "secondary"}`}
                            disabled={busy || d.cri < 25}
                            title={d.cri < 25 ? "Below containment threshold" : "Isolate on the network"}
                            onClick={() => void act("/api/contain", { deviceId: d.id })}
                          >
                            Contain
                          </button>
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}

      {/* ── drill console + audit ── */}
      {(role === "secops" || role === "itadmin" || role === "biomed") && (
        <section className="console">
          <div className="panel">
            <div className="panel-head">
              <span className="kicker">Attack drill — safe-haven simulation</span>
              {liveAttack ? (
                <span className="chip critical">
                  <span className="dot critical" />
                  LIVE ON {liveAttack.name.toUpperCase()} · {liveAttack.phase.toUpperCase()}
                </span>
              ) : (
                <span className="chip calm">
                  <span className="dot calm" />
                  Idle
                </span>
              )}
            </div>
            <div className="panel-body">
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: "12px" }}>
                Injects a synthetic campaign into the fleet. Nothing real is touched — the engine
                only reads simulated telemetry, exactly like a fire drill.
              </p>
              <div className="field">
                <label htmlFor="drill-dev">Target device</label>
                <select id="drill-dev" value={drillDevice} onChange={(e) => setDrillDevice(e.target.value)}>
                  {devices
                    .filter((d) => d.status === "online")
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {TIER_LABELS[d.tier]}
                      </option>
                    ))}
                </select>
              </div>
              <div className="field" style={{ marginTop: "12px" }}>
                <label>Campaign profile</label>
                <div className="radio-row">
                  {(["standard", "fast", "stealth"] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      className={`radio-pill ${drillProfile === pr ? "on" : ""}`}
                      onClick={() => setDrillProfile(pr)}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
                <p className="dev-meta" style={{ marginTop: 4 }}>
                  {drillProfile === "standard"
                    ? "Textbook run: recon → shadow copies → canary trip → burn."
                    : drillProfile === "fast"
                    ? "Compressed timeline — for the stage demo."
                    : "Slow, quiet creep — stresses the early-warning floor."}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button className="btn critical" disabled={busy || !!liveAttack} onClick={() => void act("/api/inject", { deviceId: drillDevice, profile: drillProfile })}>
                  Arm drill
                </button>
                <button className="btn ghost" disabled={busy} onClick={() => void act("/api/reset")}>
                  Reset floor
                </button>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="kicker">Audit trail — every action on the record</span>
              <button className="btn ghost small" onClick={() => setShowAudit((s) => !s)}>
                {showAudit ? "Hide" : "Show"}
              </button>
            </div>
            <div className="panel-body">
              {showAudit ? (
                <div>
                  {state.audit.map((a) => (
                    <div key={a.id} className="audit-row">
                      <span className="a-ts">{fmtTime(a.ts)}</span>
                      <span className="a-act">{a.action}</span>
                      <span>{a.target}</span>
                      <span style={{ color: "var(--muted)" }}>{a.detail}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: "var(--muted)" }}>
                  {state.audit.length} {pluralize(state.audit.length, "entry")} · containments, releases, drill arming and resets are
                  written here — and to the <span className="mono">audit_log</span> table when
                  Supabase is linked.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── legend ── */}
      <section className="legend">
        {role === "clinician" && (
          <>
            <div className="legend-item">
              <b>Canary</b>
              <span>Decoy file touched — immediate red flag on a patient device.</span>
            </div>
            <div className="legend-item">
              <b>Fever Rising</b>
              <span>Device temperature climbing — encryption likely starting.</span>
            </div>
            <div className="legend-item">
              <b>Quarantined</b>
              <span>Device isolated from network — patient care may need alternate device.</span>
            </div>
          </>
        )}
        {role === "leadership" && (
          <>
            <div className="legend-item">
              <b>Critical</b>
              <span>Active encryption — patient safety at immediate risk.</span>
            </div>
            <div className="legend-item">
              <b>Alert</b>
              <span>Encryption signature forming — containment decision needed.</span>
            </div>
            <div className="legend-item">
              <b>Watch</b>
              <span>Anomalous behavior detected — monitoring escalated.</span>
            </div>
            <div className="legend-item">
              <b>Contained</b>
              <span>Device quarantined — threat isolated, audit preserved.</span>
            </div>
            <div className="legend-item">
              <b>Calm</b>
              <span>Baseline normal — no active threats.</span>
            </div>
          </>
        )}
        {(role === "secops" || role === "itadmin" || role === "biomed") && (
          <>
            <div className="legend-item">
              <b>Canary</b>
              <span>Decoy files scattered across shares. One touch = near-certain evidence.</span>
            </div>
            <div className="legend-item">
              <b>Entropy</b>
              <span>Encrypted writes ≈8 bits/byte. Compression looks different — we distinguish.</span>
            </div>
            <div className="legend-item">
              <b>Shadow</b>
              <span>vssadmin/backup deletions = pre-encryption staging.</span>
            </div>
            <div className="legend-item">
              <b>Lateral</b>
              <span>SMB/RDP bursts to peers — worm spreading before burn.</span>
            </div>
            <div className="legend-item">
              <b>Rename</b>
              <span>Mass rename/create churn — encryption sweep signature.</span>
            </div>
          </>
        )}
      </section>
      <p style={{ marginTop: "24px", fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        All telemetry on this floor is simulated for demonstration. In deployment the same five
        signals stream from a lightweight endpoint agent into the ingest API; containment calls a
        NAC/SDN controller instead of the simulated VLAN revoke.
      </p>

      {/* ── device drawer ── */}
      {selected && (
        <>
          <div className="scrim" onClick={() => setSelectedId(null)} />
          <aside className="drawer">
            <div className="kicker">{TIER_LABELS[selected.tier].toUpperCase()} · {selected.unit.toUpperCase()}</div>
            <h3>{selected.name}</h3>
            <p className="dev-meta">
              {selected.kind} · {selected.ip} · {selected.status === "quarantined" ? "QUARANTINED" : `phase: ${selected.phase}`}
            </p>
            <div style={{ display: "flex", gap: "12px", margin: "16px 0 6px" }}>
              <div style={{ flex: 1 }}>
                <div className="kicker" style={{ fontSize: 9 }}>Fever</div>
                <div className="fever-num" style={{ fontSize: 36, color: PROFILE_COLOR[profileOf(selected.risk)] }}>
                  {selected.fever.toFixed(1)}
                  <sup>°C</sup>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="kicker" style={{ fontSize: 9 }}>Risk → CRI</div>
                <div className="fever-num" style={{ fontSize: 36 }}>
                  {selected.cri}
                </div>
                <div className="dev-meta">risk {selected.risk.toFixed(0)} / 100</div>
              </div>
            </div>

            <div className="spark-block">
              <div className="spark-head">
                <span className="kicker" style={{ fontSize: 9 }}>Write entropy (bits/byte)</span>
                <span className="spark-val">{selected.tele.entropy.toFixed(2)}</span>
              </div>
              <Sparkline values={selected.history.map((t) => t.entropy)} color={selected.tele.entropy > 1.6 ? "var(--critical)" : "var(--brand)"} />
            </div>
            <div className="spark-block">
              <div className="spark-head">
                <span className="kicker" style={{ fontSize: 9 }}>Rename churn (files/s)</span>
                <span className="spark-val">{selected.tele.renameRate.toFixed(0)}</span>
              </div>
              <Sparkline values={selected.history.map((t) => t.renameRate)} color="var(--watch)" />
            </div>
            <div className="spark-block">
              <div className="spark-head">
                <span className="kicker" style={{ fontSize: 9 }}>Outbound SMB/RDP (conns)</span>
                <span className="spark-val">{selected.tele.smbConns}</span>
              </div>
              <Sparkline values={selected.history.map((t) => t.smbConns)} color="var(--brass)" />
            </div>

            <div className="kicker" style={{ marginTop: "16px", marginBottom: "4px", fontSize: 9 }}>
              Engine evidence — latest window
            </div>
            {(() => {
              const { evidence, severity } = classify(selected);
              return evidence.length ? (
                <ul className="evidence">
                  {evidence.map((ev) => (
                    <li key={ev}>{ev}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: 12, color: "var(--muted)" }}>
                  All five signals within learned baseline. {severity ? "" : "No action indicated."}
                </p>
              );
            })()}

            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              {selected.status === "quarantined" ? (
                <button className="btn brand" disabled={busy} onClick={() => void act("/api/release", { deviceId: selected.id })}>
                  Return to service
                </button>
              ) : (
                <button className="btn critical" disabled={busy} onClick={() => void act("/api/contain", { deviceId: selected.id })}>
                  Quarantine now
                </button>
              )}
              <button className="btn ghost" onClick={() => setSelectedId(null)}>
                Close
              </button>
            </div>
          </aside>
        </>
      )}
    </main>
  );
}