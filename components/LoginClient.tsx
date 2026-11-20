"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Role = "clinician" | "secops" | "itadmin" | "leadership" | "biomed";

interface RoleOption {
  value: Role;
  label: string;
  desc: string;
  icon: (active: boolean) => React.ReactNode;
}

const ROLES: RoleOption[] = [
  {
    value: "clinician",
    label: "Clinician / Nurse",
    desc: "Patient-critical devices only — what's affecting patients right now",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 3-2 4.5 0 1.5 1.5 2 3 2s2-.5 3-2" />
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <circle cx="18" cy="10" r="3" />
        <path d="M14 10h1" />
      </svg>
    ),
  },
  {
    value: "secops",
    label: "SOC Analyst",
    desc: "Full triage board — all telemetry, canary tripwires & signal forensics",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="11" r="3" />
        <path d="M12 8v1" />
        <path d="M12 13v1" />
      </svg>
    ),
  },
  {
    value: "itadmin",
    label: "IT Admin",
    desc: "Network view — containment actions, device status & VLAN routing",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    value: "leadership",
    label: "Leadership / CISO",
    desc: "Executive summary — risk posture, open incidents & safety compliance",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    value: "biomed",
    label: "Biomedical Engineer",
    desc: "Medical devices only — infusion pumps, ventilators, imaging & lab",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    ),
  },
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
    try {
      await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: realEmail || "clinician@demo", role }),
      });
      router.push("/dashboard");
    } catch {
      setErr("Failed to start session. Please try again.");
      setBusy(false);
    }
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
      {/* Masthead */}
      <header className="masthead">
        <div className="brand">
          <div className="brand-word">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Nightingale
          </div>
          <span className="brand-sub">{hospital}</span>
        </div>
        <div className="masthead-meta">
          <span className="chip calm">
            <span className="dot calm" />
            System Normal
          </span>
          <span className="chip" style={{ color: "var(--muted)" }}>
            14 Devices Monitored
          </span>
        </div>
      </header>

      <div className="login-grid">
        {/* Left Column: Hero & Fever Trace */}
        <section className="login-hero">
          <h1>Catch it while it&rsquo;s still a fever.</h1>

          <p className="lede">
            Ransomware doesn&rsquo;t kick the ward doors down. It slips into a workstation,
            warms up quietly for hours, then starts encrypting records. Nightingale monitors
            clinical devices for behavioural tripwires and high entropy before patient care is disrupted.
          </p>

          {/* Fever Trace Card */}
          <div className="fever-curve">
            <div className="fever-curve-top">
              <div className="fever-curve-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                24-Hour Telemetry Sample · ICU Ventilator 03
              </div>
            </div>

            <svg viewBox="0 0 560 130" width="100%" height="120" aria-hidden style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="clinicalArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E11D48" stopOpacity="0.10" />
                  <stop offset="60%" stopColor="#D97706" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="clinicalLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0D9488" />
                  <stop offset="50%" stopColor="#0D9488" />
                  <stop offset="68%" stopColor="#D97706" />
                  <stop offset="78%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[24, 50, 76, 102].map((y) => (
                <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#F1F5F9" strokeWidth="1" />
              ))}
              <line x1="0" y1="108" x2="560" y2="108" stroke="#E2E8F0" strokeWidth="1.2" />

              {/* Threshold indicator */}
              <line x1="0" y1="56" x2="560" y2="56" stroke="#D97706" strokeWidth="1" strokeDasharray="3 4" opacity="0.8" />
              <text x="6" y="50" fontFamily="var(--font-sans)" fontSize="10" fill="#B45309" fontWeight="600">
                Warning Threshold 38.2°
              </text>

              {/* Shaded Area */}
              <polyline
                points="0,98 40,96 80,98 120,96 160,94 200,97 240,93 280,91 320,86 360,74 400,44 440,24 480,18 560,12 560,108 0,108"
                fill="url(#clinicalArea)"
                stroke="none"
              />

              {/* Clean Line */}
              <polyline
                points="0,98 40,96 80,98 120,96 160,94 200,97 240,93 280,91 320,86 360,74 400,44 440,24 480,18 560,12"
                fill="none"
                stroke="url(#clinicalLine)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Alarm Point */}
              <circle cx="400" cy="44" r="7" fill="#E11D48" opacity="0.2" />
              <circle cx="400" cy="44" r="4" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
              
              {/* Labels */}
              <text x="390" y="34" fontFamily="var(--font-sans)" fontSize="10" fill="#BE123C" textAnchor="end" fontWeight="600">
                Canary Tripwire Triggered
              </text>
              <text x="6" y="122" fontFamily="var(--font-sans)" fontSize="10" fill="#64748B">
                Baseline 36.5° (Normal)
              </text>
              <text x="554" y="122" fontFamily="var(--font-sans)" fontSize="10" fill="#BE123C" textAnchor="end" fontWeight="600">
                Autonomous Containment Active
              </text>
            </svg>
          </div>

          {/* Key Metrics */}
          <div className="login-stats">
            <div className="login-stat-card">
              <div className="stat-n">5</div>
              <div className="stat-l">Behavioural signals fused in real-time</div>
            </div>
            <div className="login-stat-card">
              <div className="stat-n">1.5×</div>
              <div className="stat-l">Priority triage weight for life-critical devices</div>
            </div>
            <div className="login-stat-card">
              <div className="stat-n">~8 s</div>
              <div className="stat-l">Time to autonomous alarm in drills</div>
            </div>
          </div>
        </section>

        {/* Right Column: Access Card */}
        <section className="login-card">
          <div className="login-card-head">
            <h2>Open the watch floor</h2>
            <p className="sub">
              {mode === "demo"
                ? `Select your role to access the simulation floor for ${hospital}.`
                : `Sign in with your hospital credentials for ${hospital}.`}
            </p>
          </div>

          {mode === "demo" ? (
            <form
              className="form-col"
              onSubmit={(e) => {
                e.preventDefault();
                void enterDemo();
              }}
            >
              <div className="field">
                <label htmlFor="operator">
                  <span>Operator Name (Optional)</span>
                </label>
                <div className="field-input-wrap">
                  <span className="field-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="operator"
                    type="text"
                    placeholder="e.g. Dr. Vance — ICU Night Shift"
                    value={realEmail}
                    onChange={(e) => setRealEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="field" style={{ marginTop: "4px" }}>
                <label>
                  <span>Your Role</span>
                </label>

                <div className="role-group">
                  {ROLES.map((r) => {
                    const active = role === r.value;
                    return (
                      <div
                        key={r.value}
                        className={`role-card ${active ? "on" : ""}`}
                        onClick={() => setRole(r.value)}
                      >
                        <input
                          type="radio"
                          name="role"
                          className="role-radio-hidden"
                          value={r.value}
                          checked={active}
                          onChange={() => setRole(r.value)}
                        />
                        <div className="role-card-icon">{r.icon(active)}</div>
                        <div className="role-card-body">
                          <div className="role-card-title">{r.label}</div>
                          <div className="role-card-desc">{r.desc}</div>
                        </div>
                        <div className="role-card-radio-circle">
                          {active && <div className="role-card-radio-dot" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {err && <div className="form-err">{err}</div>}

              <button className="btn-enter" disabled={busy} type="submit">
                {busy ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Opening Watch Floor…
                  </>
                ) : (
                  <>
                    Enter the Watch Floor
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="form-col" onSubmit={submitSupabase}>
              <div className="field">
                <label htmlFor="email">Hospital Email</label>
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
              {err && <div className="form-err">{err}</div>}
              <button className="btn-enter" disabled={busy} type="submit">
                {busy ? "Authenticating…" : signingUp ? "Create Account" : "Sign in →"}
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
