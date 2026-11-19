# Nightingale — Early Ransomware Detection for Hospitals

A working prototype of a **patient-safety-first ransomware watch floor** for hospital device
fleets. Ransomware doesn't kick ward doors down — it warms up quietly, then burns records.
Nightingale watches every device the way a night nurse watches vitals, and triages alarms by
**clinical impact**, not just threat score: an infusion pump outranks a billing PC.

![status](https://img.shields.io/badge/prototype-working-b4490f) ![stack](https://img.shields.io/badge/Next.js-15-26190e) ![db](https://img.shields.io/badge/Supabase-Postgres+Auth-58704a)

## What it does

- **Five fused behavioural signals** per ~2 s telemetry window:
  `canary` decoy-file tripwires (0.32) · `entropy` of fresh writes (0.24) ·
  `shadow` copy/backup deletions (0.18) · `lateral` SMB/RDP bursts (0.12) ·
  `rename` mass file churn (0.14). Composite 0–100, asymmetric-EMA smoothed.
  Thresholds: **watch ≥ 35 · alert ≥ 55 · critical ≥ 75**.
- **Clinical Risk Index (CRI)** = risk × patient-safety tier weight
  (life-critical ×1.5 → administrative ×0.75). The containment queue is ordered by CRI.
- **Fever metaphor**: every device's risk maps to a body temperature (36.5–42.0 °C) —
  the dashboard reads like a patient chart on purpose.
- **One-click containment**: simulated NAC/VLAN revoke per device, with a full audit trail.
- **Attack drill console**: arm synthetic campaigns (`standard` / `fast` / `stealth`) on any
  device and watch detection fire live — a fire drill for the ward network.
- **Auth + persistence**: Supabase Auth (email/password, SSR cookie sessions) and Postgres
  tables (`devices`, `incidents`, `audit_log`) with RLS. Runs without credentials too —
  a local demo mode keeps everything in memory.

## Run it

```bash
npm install
npm run dev          # http://localhost:4310
```

**Demo mode (no config):** open the URL, enter a name, press *Enter the watch floor*.

**Supabase mode (auth + persistence):**
1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` → `.env.local`, paste your project URL + publishable/anon key.
4. Restart `npm run dev`, create an account on the login page.
   *(Tip: disable "Confirm email" in Supabase → Authentication → Providers for instant signups during a demo.)*

## 90-second demo script

1. Open the watch floor — fleet of 14 devices at baseline, network fever 36.5 °C.
2. Attack drill → target **Back-office NAS**, profile **standard** → **Arm drill**.
3. Watch *Night rounds*: SMB recon → shadow-copy deletion → **canary tripwire alarm**
   (before bulk encryption starts) → entropy spike → critical.
4. Containment panel → **Quarantine** — VLAN revoked, incident contained, audit logged.
5. Reset floor, then arm a **stealth** drill on **EHR Core Server** to show the
   early-warning behaviour on a life-critical device.

## Project layout

```
app/            pages (login, dashboard) + API routes (tick/inject/contain/release/audit/auth)
components/     DashboardClient, LoginClient, Sparkline
lib/            engine.ts (scoring) · world.ts (simulation) · persist.ts (Supabase glue)
supabase/       schema.sql — run once in the SQL editor
docs/           research paper · project report · NDA
slides/         `npm run slides` → docs/nightingale-deck.pptx
```

## Docs

- `docs/research-paper.md` — original paper with verified citations (IEEE style)
- `docs/report.md` — architecture, data model, testing, roadmap
- `docs/nda.md` — mutual NDA template for pilot partners
- `docs/nightingale-deck.pptx` — presentation deck (`npm run slides` to regenerate)

## Honest limitations

Telemetry is **simulated** in this prototype (a lightweight endpoint agent is future work);
containment is simulated; thresholds are hand-tuned and not clinically validated; RLS is
prototype-grade. See the report for the hardening roadmap.
