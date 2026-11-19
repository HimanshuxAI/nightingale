"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { classify, profileOf, TIER_LABEL } from "@/lib/engine";
import type { Device, Profile, WorldState } from "@/lib/types";
import Sparkline from "./Sparkline";

const PROFILE_COLOR: Record<Profile, string> = {
  calm: "var(--sage)",
  watch: "var(--amber)",
  alert: "var(--ember)",
  critical: "var(--crimson)",
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

export default function DashboardClient({ mode, hospital }: { mode: "demo" | "supabase"; hospital: string }) {
  const router = useRouter();
  const [state, setState] = useState<WorldState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drillDevice, setDrillDevice] = useState("nas-backup-01");
  const [drillProfile, setDrillProfile] = useState<"standard" | "fast" | "stealth">("standard");
  const [busy, setBusy] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [clock, setClock] = useState(() => fmtTime(Date.now()));
  const alive = useRef(true);

  // ── heartbeat: one engine step every ~2.2 s ────────────────────────────────
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

  const devices = state?.devices ?? [];
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
        <div style={{ paddingTop: 80, textAlign: "center" }}>
          <div className="kicker">Nightingale</div>
          <p className="serif-italic" style={{ fontSize: 22, marginTop: 8 }}>
            Warming up the watch floor…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      {/* ── masthead ─────────────────────────────────────────────────────── */}
      <header className="masthead">
        <div className="brand">
          <div>
            <div className="brand-word">
              Nightingale<span className="pulse">.</span>
            </div>
            <div className="brand-sub">{hospital.toUpperCase()} · RANSOMWARE WATCH FLOOR</div>
          </div>
        </div>
        <div className="masthead-meta">
          <ProfileChip p={network.profile} />
          <span className="chip">
            <span className="dot" style={{ background: mode === "supabase" ? "var(--sage)" : "var(--amber)" }} />
            {mode === "supabase" ? "Supabase linked" : "Local demo"}
          </span>
          <span className="chip mono">{clock}</span>
          <button className="btn ghost small" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── status band ──────────────────────────────────────────────────── */}
      <section className="band">
        <div className="panel">
          <div className="panel-head">
            <span className="kicker">Network fever</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
              TOP-CRI DEVICE
            </span>
          </div>
          <div className="panel-body">
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
            <p className="fever-caption">
              {network.hottest === "—" ? "Every device is at baseline." : `Hottest on the floor: ${network.hottest}.`}
              {" "}Fever = risk mapped to body temperature — the chart reads like a patient chart on purpose.
            </p>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="kicker">Night rounds — live event feed</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
              {state.events.length} ENTRIES
            </span>
          </div>
          <div className="panel-body">
            <div className="ticker">
              {state.events.slice(0, 24).map((e) => (
                <div key={e.id} className={`tick-row ${e.level}`}>
                  <span className="tick-ts">{fmtTime(e.ts)}</span>
                  <span className={`tick-dot dot ${e.level === "info" ? "" : e.level}`} style={e.level === "info" ? { background: "var(--ink-3)" } : undefined} />
                  <span className="tick-text">{e.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="kicker">Containment</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
              CRI QUEUE
            </span>
          </div>
          <div className="panel-body">
            <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
              <div className="fever-num" style={{ fontSize: 52 }}>
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
                className="btn ember"
                style={{ width: "100%", marginTop: 10 }}
                disabled={busy}
                onClick={() => void act("/api/contain", { deviceId: topIncident.deviceId })}
              >
                Quarantine {topIncident.deviceName.split(" ")[0]} {topIncident.deviceName.split(" ").slice(1).join(" ")} →
              </button>
            ) : (
              <button className="btn sage" style={{ width: "100%", marginTop: 10 }} disabled>
                All clear — holding baseline
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CRI board ────────────────────────────────────────────────────── */}
      <div className="section-title">
        <h2>Clinical Risk Index — triage queue</h2>
        <span className="kicker">risk × patient-safety weight · click a row for vitals</span>
      </div>
      <section className="panel board">
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
            <div key={d.id} className={`row ${p === "critical" ? "worst" : ""}`} onClick={() => setSelectedId(d.id)}>
              <span className="rank">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="dev-name">{d.name}</span>
                {inc && inc.status === "open" ? <span title={inc.summary}> ⚠︎</span> : null}
                <div className="dev-meta">
                  <span className={`tier-chip tier-${d.tier}`}>{TIER_LABEL[d.tier]}</span>
                  {d.kind} · {d.unit} · {d.ip}
                </div>
              </span>
              <span className="fever-cell hide-md" style={{ color: PROFILE_COLOR[p] }}>
                {d.fever.toFixed(1)}
                <small> °C</small>
              </span>
              <span>
                <div className="cri-bar">
                  <div style={{ width: `${d.cri}%`, background: PROFILE_COLOR[p], transitionDelay: "120ms" }} />
                </div>
                <div className="dev-meta" style={{ marginTop: 4 }}>
                  risk {d.risk.toFixed(0)} → CRI {d.cri}
                </div>
              </span>
              <span className="signals hide-md">
                {anySig ? (
                  <>
                    <span className={`sig sig-canary ${sig.canary ? "on" : ""}`}>CANARY</span>
                    <span className={`sig ${sig.ent ? "on" : ""}`}>ENTROPY</span>
                    <span className={`sig ${sig.shadow ? "on" : ""}`}>SHADOW</span>
                    <span className={`sig ${sig.smb ? "on" : ""}`}>LATERAL</span>
                    <span className={`sig ${sig.ren ? "on" : ""}`}>RENAME</span>
                  </>
                ) : (
                  <span className="sig">— baseline</span>
                )}
              </span>
              <span className="row-actions" onClick={(e) => e.stopPropagation()}>
                {d.status === "quarantined" ? (
                  <button className="btn ghost small" disabled={busy} onClick={() => void act("/api/release", { deviceId: d.id })}>
                    Release
                  </button>
                ) : (
                  <button
                    className="btn crimson small"
                    disabled={busy || d.cri < 25}
                    title={d.cri < 25 ? "Below containment threshold" : "Isolate on the network"}
                    onClick={() => void act("/api/contain", { deviceId: d.id })}
                  >
                    Quarantine
                  </button>
                )}
              </span>
            </div>
          );
        })}
      </section>

      {/* ── drill console + audit ────────────────────────────────────────── */}
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
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 14 }}>
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
                      {d.name} — {TIER_LABEL[d.tier]}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
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
              <p className="dev-meta" style={{ marginTop: 6 }}>
                {drillProfile === "standard"
                  ? "Textbook run: recon → shadow copies → canary trip → burn."
                  : drillProfile === "fast"
                    ? "Compressed timeline — for the stage demo."
                    : "Slow, quiet creep — stresses the early-warning floor."}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn ember" disabled={busy || !!liveAttack} onClick={() => void act("/api/inject", { deviceId: drillDevice, profile: drillProfile })}>
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
                    <span style={{ color: "var(--ink-2)" }}>{a.detail}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
                {state.audit.length} entries · containments, releases, drill arming and resets are
                written here — and to the <span className="mono">audit_log</span> table when
                Supabase is linked.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── legend ───────────────────────────────────────────────────────── */}
      <section className="legend">
        <div className="legend-item">
          <b style={{ color: "var(--crimson)" }}>Canary</b>
          <span>Decoy files scattered across shares. One touch is near-certain evidence — our tripwire.</span>
        </div>
        <div className="legend-item">
          <b style={{ color: "var(--ember)" }}>Entropy</b>
          <span>Encrypted writes look like random noise (≈8 bits/byte). Compression looks different — we can tell.</span>
        </div>
        <div className="legend-item">
          <b style={{ color: "var(--ember)" }}>Shadow</b>
          <span>Deleting volume shadow copies / backups is pre-encryption staging. Classic tell.</span>
        </div>
        <div className="legend-item">
          <b style={{ color: "var(--amber)" }}>Lateral</b>
          <span>SMB/RDP bursts to peer hosts — the worm spreading across wards before it burns.</span>
        </div>
        <div className="legend-item">
          <b style={{ color: "var(--amber)" }}>Rename</b>
          <span>Mass rename/create churn — the sweep of an encryption pass across a file tree.</span>
        </div>
      </section>
      <p style={{ marginTop: 18, fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
        All telemetry on this floor is simulated for demonstration. In deployment the same five
        signals stream from a lightweight endpoint agent into the ingest API; containment calls a
        NAC/SDN controller instead of the simulated VLAN revoke.
      </p>

      {/* ── device drawer ────────────────────────────────────────────────── */}
      {selected && (
        <>
          <div className="scrim" onClick={() => setSelectedId(null)} />
          <aside className="drawer">
            <div className="kicker">{TIER_LABEL[selected.tier].toUpperCase()} · {selected.unit.toUpperCase()}</div>
            <h3>{selected.name}</h3>
            <p className="dev-meta">
              {selected.kind} · {selected.ip} · {selected.status === "quarantined" ? "QUARANTINED" : `phase: ${selected.phase}`}
            </p>
            <div style={{ display: "flex", gap: 10, margin: "16px 0 6px" }}>
              <div style={{ flex: 1 }}>
                <div className="kicker" style={{ fontSize: 9 }}>Fever</div>
                <div className="fever-num" style={{ fontSize: 40, color: PROFILE_COLOR[profileOf(selected.risk)] }}>
                  {selected.fever.toFixed(1)}
                  <sup>°C</sup>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="kicker" style={{ fontSize: 9 }}>Risk → CRI</div>
                <div className="fever-num" style={{ fontSize: 40 }}>
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
              <Sparkline values={selected.history.map((t) => t.entropy)} color={selected.tele.entropy > 1.6 ? "#9e2b17" : "#58704a"} />
            </div>
            <div className="spark-block">
              <div className="spark-head">
                <span className="kicker" style={{ fontSize: 9 }}>Rename churn (files/s)</span>
                <span className="spark-val">{selected.tele.renameRate.toFixed(0)}</span>
              </div>
              <Sparkline values={selected.history.map((t) => t.renameRate)} color="#b4490f" />
            </div>
            <div className="spark-block">
              <div className="spark-head">
                <span className="kicker" style={{ fontSize: 9 }}>Outbound SMB/RDP (conns)</span>
                <span className="spark-val">{selected.tele.smbConns}</span>
              </div>
              <Sparkline values={selected.history.map((t) => t.smbConns)} color="#c4841a" />
            </div>

            <div className="kicker" style={{ marginTop: 18, marginBottom: 4, fontSize: 9 }}>
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
                <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
                  All five signals within learned baseline. {severity ? "" : "No action indicated."}
                </p>
              );
            })()}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {selected.status === "quarantined" ? (
                <button className="btn sage" disabled={busy} onClick={() => void act("/api/release", { deviceId: selected.id })}>
                  Return to service
                </button>
              ) : (
                <button className="btn crimson" disabled={busy} onClick={() => void act("/api/contain", { deviceId: selected.id })}>
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
