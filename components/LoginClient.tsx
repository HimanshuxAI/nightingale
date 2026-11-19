"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginClient({ mode, hospital }: { mode: "demo" | "supabase"; hospital: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [realEmail, setRealEmail] = useState("");

  async function enterDemo() {
    setBusy(true);
    setErr("");
    await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: realEmail || "sister.kam@nighthesper.local" }),
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
            Catch the fire while it&rsquo;s still <em>a fever.</em>
          </h1>
          <p className="lede">
            Ransomware doesn&rsquo;t kick the ward doors down — it slips in through a workstation,
            warms up quietly for hours, then starts burning records. Nightingale watches every
            device the way a night nurse watches vitals: decoy-file tripwires, entropy
            thermometers, and a containment switch that puts patient safety first.
          </p>

          <div className="fever-curve">
            <svg viewBox="0 0 560 120" width="100%" height="120" aria-hidden>
              <line x1="0" y1="104" x2="560" y2="104" stroke="#cbb994" strokeWidth="1" />
              <line x1="0" y1="54" x2="560" y2="54" stroke="#cbb994" strokeWidth="1" strokeDasharray="2 6" />
              <text x="2" y="48" fontFamily="var(--font-mono)" fontSize="9" fill="#98876f">THRESHOLD 38.2°</text>
              <polyline
                points="0,96 40,94 80,97 120,95 160,93 200,96 240,92 280,90 320,86 360,74 400,44 440,22 480,16 560,12"
                fill="none"
                stroke="#b4490f"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <polyline
                points="0,96 40,94 80,97 120,95 160,93 200,96 240,92 280,90 320,86 360,74 400,44 440,22 480,16 560,12 560,104 0,104"
                fill="rgba(180,73,15,0.10)"
                stroke="none"
              />
              <circle cx="400" cy="44" r="4.4" fill="#9e2b17" />
              <text x="408" y="40" fontFamily="var(--font-mono)" fontSize="9.5" fill="#9e2b17">CANARY TRIP — ALARM</text>
              <text x="2" y="117" fontFamily="var(--font-mono)" fontSize="9" fill="#98876f">WARD BASELINE 36.5°</text>
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
              <div className="stat-n">&lt;4 s</div>
              <div className="stat-l">tripwire to alarm in the drill</div>
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
              <div className="form-err">{err}</div>
              <button className="btn ember" disabled={busy} type="submit">
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
              <button className="btn ember" disabled={busy} type="submit">
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
