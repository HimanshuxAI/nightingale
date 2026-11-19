# Nightingale — Project Report

**Project:** Nightingale, early ransomware detection for hospitals with patient-safety-first containment
**Status:** Working prototype (Next.js 15 + Supabase), simulated telemetry
**Date:** 20 November 2026

## 1. Overview

Nightingale is an early-detection watch floor for hospital device fleets. The premise: hospitals are top ransomware targets, attacks disrupt care, and the harm is now measured. In the week of a ransomware attack, patient volumes fall 17–24% and in-hospital mortality among already-admitted patients rises 34–38% (Neprash, McGlave & Nikpay, 2026). Ransomware accounts for 54% of analysed health-sector incidents, with hospitals the victim in 42% (ENISA, 2023). Detection that arrives after bulk encryption begins leaves a hospital with backups and diverted ambulances; detection that arrives seconds earlier leaves it with choices.

The prototype does three things:

1. **Fuses five behavioural signals per device** (~2 s telemetry windows) into an explainable 0–100 risk score.
2. **Orders containment by a Clinical Risk Index (CRI)**, so an ICU infusion pump outranks a billing PC at equal threat.
3. **Runs attack drills on demand**: a console injects synthetic ransomware campaigns (standard/fast/stealth) into a fleet of 14 seeded devices, so the whole detection-to-containment loop is demonstrable in minutes.

The fleet is synthetic by design. No real patient data and no real hospital traffic exist anywhere in the system.

## 2. Architecture

One Next.js 15 application (React 19 front end, Node/TypeScript API routes as the back end). The browser polls every ~2 s; each poll advances the server-side world one telemetry window and runs the detection engine over all devices. Live state is an in-memory world; Supabase persistence is best-effort, so a database outage never stops the watch floor.

```
┌──────────────────────────────────────────────────────────────┐
│ Browser (React 19, Next.js 15 App Router)                    │
│   app/page.tsx ................ login gate                   │
│   components/LoginClient.tsx .. demo sign-in form            │
│   app/dashboard/page.tsx ...... watch floor page             │
│   components/DashboardClient.tsx  fleet grid, incident feed, │
│   components/Sparkline.tsx .... risk history per device      │
└──────────────┬───────────────────────────────────────────────┘
               │ POST /api/tick every ~2 s (plus actions)
┌──────────────▼───────────────────────────────────────────────┐
│ Next.js API routes (Node/TypeScript)                         │
│   /api/tick      advance one window, run engine              │
│   /api/state     fleet snapshot (devices, incidents, feed)   │
│   /api/inject    arm drill (standard / fast / stealth)       │
│   /api/contain   quarantine device (simulated NAC/VLAN)      │
│   /api/release   return device to service                    │
│   /api/reset     re-seed fleet                               │
│   /api/auth/demo, /api/auth/signout   sessions               │
├──────────────────────────────────────────────────────────────┤
│ lib/world.ts   in-memory fleet: 14 seeded devices,           │
│                attack ramps, baselines, audit trail          │
│ lib/engine.ts  signals → risk → CRI → fever → incidents      │
└──────────────┬───────────────────────────────────────────────┘
               │ best-effort writes (never block the tick)
┌──────────────▼───────────────────────────────────────────────┐
│ Supabase                                                     │
│   Postgres: devices, incidents, audit_log (RLS enabled)      │
│   Auth: email/password, SSR cookie sessions (@supabase/ssr)  │
└──────────────────────────────────────────────────────────────┘
```

**Frontend components:** `app/page.tsx` (entry, login gate), `components/LoginClient.tsx` (sign-in), `app/dashboard/page.tsx` (server page), `components/DashboardClient.tsx` (watch floor: device grid, incident queue, feed, drill console), `components/Sparkline.tsx` (risk history), `middleware.ts` (session guard). The dashboard runs in two modes: full mode with Supabase credentials, and a local Demo Mode when none are set.

## 3. Detection model

Five signals per device per window, each normalised to 0–1, then fused with fixed weights:

| Signal | Weight | Fires when |
|---|---|---|
| Canary/decoy tripwire | 0.32 | Any decoy file touched, anywhere on shares |
| Shannon entropy of fresh writes | 0.24 | Written blocks read as ciphertext |
| Shadow-copy/backup deletions | 0.18 | Volume-shadow-copy or backup deletion events |
| SMB/RDP connection burst | 0.12 | Outbound sessions spike toward peer hosts |
| Mass rename/write churn | 0.14 | Rename/create rate sweeps upward |

The weighted composite (0–100) is smoothed with an **asymmetric EMA**: rise fast (α = 0.62), decay slow (α = 0.38). Escalation reaches the watch band within a few windows; one noisy window decays without alarming anyone. Threshold bands: **watch ≥ 35, alert ≥ 55, critical ≥ 75**. Every alarm carries named evidence lines, so an operator can audit why the engine fired.

**Clinical Risk Index.** CRI = min(100, risk × tier weight). The containment queue sorts by CRI, not raw risk.

| Tier | Class | Examples | Weight |
|---|---|---|---|
| 0 | Life-critical | Infusion pumps, ventilators, patient monitors | ×1.5 |
| 1 | Care-critical | EHR, PACS, lab, ultrasound | ×1.25 |
| 2 | Operational | Pharmacy, nurse stations | ×1.0 |
| 3 | Administrative | Billing, admissions, back-office | ×0.75 |

**Fever metaphor.** Risk maps to a per-device temperature: `fever = 36.5 + 5.5·(risk/100) °C`, i.e. 36.5–42.0 °C. The UI reads like a patient chart because ward staff already triage fevers every shift.

## 4. Data model

Three Supabase tables (see `supabase/schema.sql`):

| Table | Columns | Purpose |
|---|---|---|
| `devices` | `device_id` (PK), `name`, `kind`, `unit`, `tier` (0–3), `ip`, `created_at` | The monitored fleet |
| `incidents` | `id` (uuid PK), `incident_ref` (unique), `device_ref` (FK), `device_name`, `kind`, `severity` (watch/alert/critical), `status` (open/contained/resolved), `score`, `summary`, `evidence` (jsonb), `started_at`, `contained_at` | One row per detection |
| `audit_log` | `id` (uuid PK), `ts`, `actor`, `action`, `target`, `detail` | Every operator action on the record |

Indexes: `incidents(device_ref, started_at desc)`, `audit_log(ts desc)`. Row-level security is enabled on all three tables (see §5).

## 5. Security & privacy

- **Authentication.** Supabase Auth, email/password, with server-side cookie sessions via `@supabase/ssr`; `middleware.ts` guards the dashboard.
- **Authorisation.** RLS is enabled on `devices`, `incidents`, and `audit_log`. The prototype uses one coarse policy (all authenticated users, all operations). Hardening for production: per-role policies, service-role separation, retention rules.
- **Data minimisation.** The demo system holds no real patient data and must never receive any. All telemetry, devices, and incidents are simulated. This is also a contractual commitment: anyone evaluating the prototype with us signs the mutual NDA at `docs/nda.md`, which forbids entering real patient data into the demo system.
- **Auditability.** Containment, release, drill injection, and resets all write to `audit_log` and to the in-app audit trail.
- **Containment is simulated.** One click revokes the device's "VLAN lease" in the simulated world. Production containment would call a NAC or SDN controller API, an approach with measured ~100 ms reaction times in SDN-based ransomware mitigation (Cabaj & Mazurczyk, 2016).

## 6. How to run

```bash
npm install
cp .env.example .env.local   # optional: add Supabase URL + anon key
npm run dev                  # http://localhost:4310
```

For full mode: create a Supabase project, run `supabase/schema.sql` in the SQL editor, paste the URL and anon key into `.env.local`, restart. Without credentials the app runs in Demo Mode; nothing else changes.

**Drill walkthrough (6 steps):**

1. Open `http://localhost:4310` and sign in. The watch floor loads: 14 devices at baseline, every fever reading 36.5 °C.
2. Watch the calm state for a few seconds. Baseline noise moves sparklines; no incidents appear.
3. In the drill console, pick a device (start with **Infusion Pump ICU-01**, tier 0) and arm the **standard** profile.
4. Within ~8 s the device crosses the watch band. The fever rises, an incident opens with named evidence lines, and its CRI pushes it to the top of the containment queue with a "CLINICAL PRIORITY" tag.
5. At critical (~22 s), press **Contain**. The device quarantines, its telemetry zeroes, the incident flips to *contained*, and the audit trail records the action.
6. Press **Release** to return it to service, or **Reset** to re-seed the fleet. Repeat with the **stealth** profile to see the ramp stretch ~1.6×; the canary still fires before bulk encryption.

## 7. Testing performed

- **Build:** `npm run build` (Next.js 15 production build, TypeScript strict) passes.
- **Drill timings (standard profile):** first alarm (watch ≥ 35) at **~8 s of wall-clock simulation (≈4 telemetry windows)**; critical (≥ 75) at **~22 s (≈11 windows)**. Stealth profile reaches critical **~1.6× slower**; detection still precedes encryption.
- **Canary precedence:** the canary trip fires while write entropy is still **≤ 2.5 bits/byte**, i.e. before bulk encryption is underway.
- **Containment flow:** inject → watch → alert → critical → contain (status `quarantined`, incident `contained`, audit row written) → release (device returns to service, risk re-learns from ~6). Verified end-to-end in Demo Mode and with Supabase persistence enabled.

## 8. Roadmap

1. **Real telemetry agent.** A lightweight OS agent streaming the same telemetry schema from real endpoints; the engine contract does not change.
2. **Learned thresholds.** Replace hand-tuned weights and bands with thresholds fitted on labelled fleet data; measure the false-alarm rate (currently an open slot).
3. **Hospital pilot.** Evaluate on a real ward's device inventory under the mutual NDA (`docs/nda.md`), with simulated data only until the pilot agreement says otherwise.
4. **SDN/NAC integration.** Replace the simulated revoke with a real NAC or SDN controller call for network-level containment (Cabaj & Mazurczyk, 2016), with fail-safe rollback.

## Sources cited in this report

- ENISA, *ENISA Threat Landscape: Health Sector*, Jul. 2023. https://www.enisa.europa.eu/publications/health-threat-landscape
- K. Cabaj and W. Mazurczyk, "Using software-defined networking for ransomware mitigation: The case of CryptoWall," *IEEE Network*, 30(6), 2016. doi:10.1109/MNET.2016.1600110NM
- H. Neprash, C. McGlave, and S. Nikpay, "Hacked to pieces? The effects of ransomware attacks on hospitals and patients," *AEJ: Economic Policy*, 18(1), 2026. doi:10.1257/pol.20240594
