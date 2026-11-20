"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Role = "clinician" | "secops" | "itadmin" | "leadership" | "biomed";

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "clinician", label: "Clinician / Nurse", desc: "Patient-critical devices only — what's affecting my patients right now" },
  { value: "secops", label: "SOC Analyst", desc: "Full triage board — all signals, all devices, deep investigation" },
  { value: "itadmin", label: "IT Admin", desc: "Network view — containment actions, device status, VLAN assignments" },
  { value: "leadership", label: "Leadership / CISO", desc: "Executive summary — risk posture, open incidents, compliance" },
  { value: "biomed", label: "Biomedical Engineer", desc: "Medical devices only — infusion pumps, ventilators, imaging, lab" },
];

export default function LoginClient({ mode, hospital }: { mode: "demo" | "supabase"; hospital: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [realEmail, setRealEmail] = useState("");
  const [role, setRole] = useState<Role>("clinician");

  async function enterDemo() {
    setBusy(true);
    setErr("");
    await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: realEmail || "clinician@demo", role }),
    });
    router.push("/dashboard");
  }

  async function submitSupabase(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const db = createSupabaseBrowserClient();
      if (signingUp) {
        const { data, error } = await db.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setErr("Account created — check your inbox to confirm the address, then sign in.");
          setSigningUp(false);
          setBusy(false);
          return;
        }
      } else {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="wrap">
      <div className="login-grid">
        <section className="login-hero">
          <div className="kicker">Nightingale · Watch floor for clinical networks</div>
          <h1>
            Catch it while it&rsquo;s still <span className="pulse">a fever</span>.
          </h1>
          <p className="lede">
            Ransomware doesn&rsquo;t kick the ward doors down. It slips in through a workstation,
            warms up quietly for hours, then starts burning records. Nightingale watches every
            device the way a night nurse watches vitals: decoy-file tripwires, entropy
            thermometers, and a containment switch that puts patient safety first.
          </p>

          <div className="fever-curve">
            <div className="kicker" style={{ marginBottom: "8px" }}>Fever trace — sample device, 24 h</div>
            <svg viewBox="0 0 560 120" width="100%" height="110" aria-hidden style={{ overflow: "visible" }}>
              {/* Grid lines */}
              {[20, 40, 60, 80, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="var(--grid)" strokeWidth="0.5" opacity="0.5" />
              ))}
              <line x1="0" y1="104" x2="560" y2="104" stroke="var(--border)" strokeWidth="1" />
              {/* Threshold */}
              <line x1="0" y1="54" x2="560" y2="54" stroke="var(--watch)" strokeWidth="1" strokeDasharray="3 4" />
              <text x="2" y="48" fontFamily="var(--font-mono)" fontSize="9" fill="var(--watch)" fontWeight="500">THRESHOLD 38.2°</text>
              {/* Area */}
              <polyline
                points="0,96 40,94 80,97 120,95 160,93 200,96 240,92 280,90 320,86 360,74 400,44 440,22 480,16 560,12 560,104 0,104"
                fill="rgba(179,38,30,0.08)"
                stroke="none"
              />
              {/* Line */}
              <polyline
                points="0,96 40,94 80,97 120,95 160,93 200,96 240,92 280,90 320,86 360,74 400,44 440,22 480,16 560,12"
                fill="none"
                stroke="var(--critical)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Alarm dot */}
              <circle cx="400" cy="44" r="4.4" fill="var(--critical)" stroke="var(--card)" strokeWidth="1.5" />
              <text x="392" y="36" fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--critical)" textAnchor="end" fontWeight="500">CANARY TRIP — ALARM</text>
              <text x="2" y="117" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted)">WARD BASELINE 36.5°</text>
            </svg>
          </div>

          <div className="login-stats">
            <div>
              <div className="stat-n">5</div>
              <div className="stat-l">behavioural signals fused</div>
            </div>
            <div>
              <div className="stat-n">1.5×</div>
              <div className="stat-l">triage weight for life-critical devices</div>
            </div>
            <div>
              <div className="stat-n">~8 s</div>
              <div className="stat-l">to first alarm in the drill</div>
            </div>
          </div>
        </section>

        <section className="panel login-card">
          <div className="kicker">{mode === "demo" ? "Night rounds · local demo" : "Night rounds · sign in"}</div>
          <h2>Open the watch floor.</h2>
          <p className="sub">
            {mode === "demo"
              ? `You are entering ${hospital} on the simulation floor — 14 devices, live telemetry, no real data.`
              : `Accounts are managed with Supabase Auth for ${hospital}.`}
          </p>

          {mode === "demo" ? (
            <form
              className="form-col"
              onSubmit={(e) => {
                e.preventDefault();
                void enterDemo();
              }}
            >
              <div className="field">
                <label htmlFor="email">Operator name (optional)</label>
                <input
                  id="email"
                  type="text"
                  placeholder="e.g. Sr. Kam — ICU night shift"
                  value={realEmail}
                  onChange={(e) => setRealEmail(e.target.value)}
                />
              </div>
              <div className="field" style={{ marginTop: "12px" }}>
                <label>Your role</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {ROLES.map((r) => (
                    <label
                      key={r.value}
                      className={`role-card ${role === r.value ? "on" : ""}`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={() => setRole(r.value)}
                      />
                      <div style={{ flex: 1 }}>
                        <div className="role-card-title">{r.label}</div>
                        <div className="role-card-desc">{r.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-err">{err}</div>
              <button className="btn brand" disabled={busy} type="submit" style={{ marginTop: "8px" }}>
                {busy ? "Unlocking…" : "Enter the watch floor →"}
              </button>
              <p className="login-foot">
                DEMO MODE — the ward runs in memory; incidents and audit entries persist to
                Supabase once you add credentials in .env.local.
              </p>
            </form>
          ) : (
            <form className="form-col" onSubmit={submitSupabase}>
              <div className="field">
                <label htmlFor="email">Hospital email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="pw">Password</label>
                <input
                  id="pw"
                  type="password"
                  autoComplete={signingUp ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-err">{err}</div>
              <button className="btn brand" disabled={busy} type="submit">
                {busy ? "Working…" : signingUp ? "Create account" : "Sign in →"}
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  setSigningUp((s) => !s);
                  setErr("");
                }}
              >
                {signingUp ? "← Back to sign in" : "New here? Create an account"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}