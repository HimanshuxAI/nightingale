# B.Tech Project Report — Nightingale

> **How to use this file (read once, then delete this block).**
> This is the complete manuscript content for the MIT School of Computing B.Tech project report format (Annexure 6). All technical content — architecture, signal weights, thresholds, fleet, schema, API routes, test results, and the 17 IEEE references — is taken from the actual Nightingale codebase and its verified source notes (`README.md`, `docs/report.md`, `docs/research-paper.md`, `notes/sources.md`, `lib/`, `supabase/schema.sql`). Nothing technical is invented.
>
> Fields shown in `[SQUARE BRACKETS]` are the only things you must fill in: student names, PRNs, guide/HoD names, academic year, and a few "attach here" slots. They are left blank deliberately because they are not present in the project files. Do **not** copy the names from the format template (those belong to a different, freelancing project).
>
> Apply the template's typography when you export to Word: Times New Roman 12 pt, justified, 1.5 line spacing, 1.25" left / 1" top-bottom-right margins, chapter titles 18 pt bold ALL CAPS centred, section headings 12 pt bold left-aligned, footer "MITSOC, Department of Computer Engineering 20XX" (10 pt, centred) from the Introduction page onward. Roman numerals (i, ii, iii, …) for front matter; Arabic (1, 2, 3, …) from Chapter 1.

---

## COVER PAGE

*(Hard-bound blue cover, golden embossing; centre everything on the page)*

*(four blank lines)*

**A PROJECT REPORT ON**

*(one blank line)*

# NIGHTINGALE: PATIENT-SAFETY-FIRST EARLY RANSOMWARE DETECTION FOR HOSPITAL DEVICE FLEETS

*(two blank lines)*

**SUBMITTED TO**

**MIT SCHOOL OF COMPUTING, LONI, PUNE, IN PARTIAL FULFILMENT OF THE REQUIREMENTS FOR THE AWARD OF THE DEGREE**

*(four blank lines)*

**BACHELOR OF TECHNOLOGY**

**(Computer Science and Engineering / Information Technology)**

*(two blank lines)*

**BY**

*(two blank lines)*

**[STUDENT NAME 1] — [PRN / ENROLLMENT NO.]**
**[STUDENT NAME 2] — [PRN / ENROLLMENT NO.]**
**[STUDENT NAME 3] — [PRN / ENROLLMENT NO.]**

*(two blank lines)*

**Under the guidance of**

*(one blank line)*

**[GUIDE NAME, DESIGNATION]**

*(one blank line)*

**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**

*(two blank lines)*

**MIT SCHOOL OF COMPUTING**
**MIT ART, DESIGN AND TECHNOLOGY UNIVERSITY**
**RAJBAUG CAMPUS, LONI-KALBHOR, PUNE 412201**

*(one blank line)*

**20[XX] – [XX]**

---

## CERTIFICATE

*(MIT School of Computing letterhead — 16 pt bold, upper case, centred)*

*(two blank lines)*

**CERTIFICATE**

*(two blank lines)*

This is to certify that the project report entitled

**"NIGHTINGALE: PATIENT-SAFETY-FIRST EARLY RANSOMWARE DETECTION FOR HOSPITAL DEVICE FLEETS"**

submitted by

**[STUDENT NAME 1] [PRN], [STUDENT NAME 2] [PRN], [STUDENT NAME 3] [PRN]**

is a bonafide work carried out by them under the supervision of **[GUIDE NAME]** and is submitted towards the partial fulfilment of the requirement of MIT ADT University, Pune, for the award of the degree of Bachelor of Technology (Computer Science and Engineering).

*(four blank lines)*

| | |
|---|---|
| **[GUIDE NAME]** | **[HEAD OF DEPARTMENT NAME]** |
| Guide | Head of Department |
| | |
| **Prof. Suresh Kapare** | **Dr. Ganesh Pathak** |
| Chief Coordinator – PBL | Dean |

*(one blank line)*

Seal / Stamp of the College
Place: PUNE
Date: [DD/MM/YYYY]

---

## CERTIFICATE FROM COMPANY (IF APPLICABLE)

*(On company letterhead / seal. If this project has no industry sponsor, state "Not applicable — internally guided project" and retain this page so pagination matches the template.)*

*(three blank lines)*

**CERTIFICATE**

*(three blank lines)*

This is to certify that the project report entitled

**"NIGHTINGALE: PATIENT-SAFETY-FIRST EARLY RANSOMWARE DETECTION FOR HOSPITAL DEVICE FLEETS"**

submitted by

**[STUDENT NAME] — [EXAM / ENROLLMENT NO.]**

is a bonafide work carried out by him/her (with the sponsorship of **[SPONSOR, or "Not applicable"]**) under the supervision of **[EXTERNAL GUIDE NAME]** and has been completed successfully.

*(four blank lines)*

**[EXTERNAL GUIDE NAME]**
[Designation]
External Guide

Seal / Stamp of the Company / College
Place: [CITY]
Date: [DD/MM/YYYY]

---

## DECLARATION

*(three blank lines)*

**DECLARATION**

*(three blank lines)*

We, the team members,

| Name | Enrollment No. |
|---|---|
| [STUDENT NAME 1] | [PRN 1] |
| [STUDENT NAME 2] | [PRN 2] |
| [STUDENT NAME 3] | [PRN 3] |

hereby declare that the project work incorporated in the present project entitled **"Nightingale: Patient-Safety-First Early Ransomware Detection for Hospital Device Fleets"** is original work. This work, in part or in full, has not been submitted to any university for the award of a degree or a diploma. We have properly acknowledged the material collected from secondary sources wherever required, and all such sources are listed in the Bibliography in IEEE format. We solely own the responsibility for the originality of the entire content.

Date: [DD/MM/YYYY]

Name and Signature of the Team Members
Member 1: __________________
Member 2: __________________
Member 3: __________________

Name and Signature of Guide
**[GUIDE NAME]**

Seal / Stamp of the College
Place: Pune
Date: [DD/MM/YYYY]

---

## EXAMINER'S APPROVAL CERTIFICATE

*(three blank lines)*

**EXAMINER'S APPROVAL CERTIFICATE**

*(three blank lines)*

The project report entitled **"Nightingale: Patient-Safety-First Early Ransomware Detection for Hospital Device Fleets"** submitted by [STUDENT 1] ([PRN 1]), [STUDENT 2] ([PRN 2]) and [STUDENT 3] ([PRN 3]) in partial fulfilment for the award of the degree of Bachelor of Technology (Computer Science and Engineering) during the academic year 20[XX]–[XX], of MIT-ADT University, MIT School of Computing, Pune, is hereby approved.

*(two blank lines)*

Examiners:

1. ______________________________
2. ______________________________

*(one blank line)*

Seal / Stamp of the College
Place: Pune
Date: [DD/MM/YYYY]

---

## ACKNOWLEDGEMENT

*(three blank lines)*

**ACKNOWLEDGEMENT**

*(three blank lines)*

*[Write this in your own words. The text below is a factual scaffold based on what the project actually involved — replace the bracketed parts with your own voice and add the people you genuinely want to thank.]*

We express our sincere gratitude to **[GUIDE NAME]**, our project guide, for continuous encouragement, technical correction, and for repeatedly pushing us to state limitations honestly rather than overclaim results. We thank **Dr. Ganesh Pathak**, Dean, and **Prof. Suresh Kapare**, Chief Coordinator – PBL, for the environment and the evaluation process that shaped this work.

We are grateful to the faculty of the Department of Computer Science and Engineering, MIT School of Computing, for courses in networking, databases and software engineering that directly underpin this prototype, and to our classmates who acted as the first operators of the watch floor and gave blunt feedback on the dashboard.

We acknowledge the published work of the researchers listed in the Bibliography. In particular, the decoy-file and filesystem-activity studies of Kharraz et al. [6] and Genç et al. [10], the entropy analysis of Davies et al. [8], the self-healing filesystem of Continella et al. [7], and the SDN mitigation results of Cabaj and Mazurczyk [11] defined both the design and its boundaries. The patient-outcome evidence of Neprash et al. [17] and the NHS analyses [3], [4] are the reason this project frames ransomware as a patient-safety problem.

Finally, we thank our families for their patience during the build and test cycles.

*[STUDENT NAME 1], [STUDENT NAME 2], [STUDENT NAME 3]*
Enrollment Nos.: [PRN 1], [PRN 2], [PRN 3]

---

## NOMENCLATURE

| Symbol / Abbreviation | Meaning |
|---|---|
| CRI | Clinical Risk Index — risk score scaled by patient-safety tier weight, capped at 100 |
| EMA | Exponential Moving Average; here asymmetric (α = 0.62 rising, 0.38 falling) |
| α | Smoothing factor of the EMA |
| risk | Smoothed 0–100 behavioural threat score for one device |
| rawScore | Unsmoothed 0–100 composite of the five normalised signals in one window |
| TIER_WEIGHT / w | Per-device clinical weight: 1.5, 1.25, 1.0, 0.75 for tiers 0–3 |
| canaryHits | Decoy files touched in a telemetry window |
| entropy | Shannon entropy of recently written blocks, bits/byte (0–8) |
| shadowDel | Volume-shadow-copy / backup deletion events in a window |
| smbConns | Outbound SMB/RDP connections in a window |
| renameRate | File rename/create operations per second |
| NAC | Network Access Control |
| SDN | Software-Defined Networking |
| VLAN | Virtual Local Area Network |
| RLS | Row-Level Security (PostgreSQL / Supabase) |
| EHR | Electronic Health Record |
| PACS | Picture Archiving and Communication System |
| SSR | Server-Side Rendering |
| JWT | JSON Web Token (session mechanism underlying cookie sessions) |

---

## ABSTRACT

Ransomware against hospitals is a patient-safety problem, not merely an IT problem. In the week of an attack, hospital patient volumes fall by 17–24% and in-hospital mortality among patients already admitted rises by 34–38% [17]. Ransomware accounts for 54% of analysed health-sector incidents, with hospitals the victim in 42% of them [5]. Detection that arrives only after bulk encryption begins leaves a hospital with backups and diverted ambulances; detection that arrives seconds earlier leaves it with choices.

This report presents **Nightingale**, a working prototype of an early-detection "watch floor" for hospital device fleets. Every monitored device reports a telemetry window of approximately two seconds. Five behavioural signals — a canary decoy-file tripwire, Shannon entropy of freshly written blocks, shadow-copy/backup deletions, SMB/RDP connection bursts, and mass file-rename churn — are normalised and fused with fixed weights (0.32, 0.24, 0.18, 0.12, 0.14) into a 0–100 risk score. The score is smoothed with an asymmetric exponential moving average (rise α = 0.62, decay α = 0.38) so escalation is fast but a single noisy window does not raise an alarm. Threshold bands are watch ≥ 35, alert ≥ 55 and critical ≥ 75. A **Clinical Risk Index (CRI)** multiplies the risk score by a patient-safety tier weight (life-critical ×1.5 down to administrative ×0.75), so the containment queue is ordered by clinical impact rather than raw threat: an ICU infusion pump outranks a billing server at equal risk. The interface maps risk to a body temperature between 36.5 °C and 42.0 °C so the dashboard reads like the fever charts ward staff already use.

The prototype is a single Next.js 15 application (React 19 front end, TypeScript API routes) with best-effort Supabase persistence. In drills on a 14-device simulated fleet, the standard attack profile crossed the watch threshold at about 8 seconds and reached critical at about 22 seconds; the canary tripwire fired while write entropy was still at or below 2.5 bits/byte, i.e. before bulk encryption was underway. The stealth profile reached critical roughly 1.6 times more slowly and was still detected before encryption. Containment, telemetry and thresholds are simulated and are not clinically validated; a real endpoint agent, field-tuned thresholds, NAC/SDN integration and a clinical pilot are set out as future work. No real patient data exists anywhere in the system.

---

## CONTENTS

| Item | Page |
|---|---|
| Certificate | i |
| Certificate (from Company, if any) | ii |
| Declaration | iii |
| Examiner's Approval Certificate | iv |
| Acknowledgement | v |
| Nomenclature | vi |
| Abstract | vii |
| List of Figures | viii |
| List of Tables | ix |
| **Chapter 1 — Introduction** | 1 |
| 1.1 Ransomware as a patient-safety problem | 1 |
| 1.2 Existing work | 2 |
| 1.3 Motivation | 3 |
| 1.4 Objectives | 4 |
| 1.5 Scope | 4 |
| **Chapter 2 — Concepts and Methods** | 5 |
| 2.1 Definitions | 5 |
| 2.2 Detection method: five-signal fusion | 5 |
| 2.3 Clinical triage: the Clinical Risk Index | 6 |
| **Chapter 3 — Literature Survey** | 7 |
| 3.1 Detection-surface literature | 7 |
| 3.2 Clinical and regulatory context | 8 |
| 3.3 Gap identified | 8 |
| **Chapter 4 — Project Plan** | 10 |
| 4.1 Development model | 10 |
| 4.2 Phase-wise plan | 10 |
| **Chapter 5 — Software Requirement Specification** | 11 |
| 5.1 Project scope | 11 |
| 5.2 User classes and characteristics | 11 |
| 5.3 Functional requirements | 11 |
| 5.4 Non-functional requirements | 12 |
| 5.5 Data model | 12 |
| **Chapter 6 — Results** | 13 |
| 6.1 Detection timings | 13 |
| 6.2 Clinical prioritisation behaviour | 13 |
| 6.3 Containment flow | 14 |
| **Chapter 7 — Software Testing** | 15 |
| 7.1 Build verification | 15 |
| 7.2 Test cases | 15 |
| 7.3 Known untested items | 16 |
| **Chapter 8 — Conclusion and Future Work** | 17 |
| 8.1 Conclusion | 17 |
| 8.2 Future work | 17 |
| Bibliography | 19 |
| Annexure A — List of Publications and Research Paper | 20 |
| Annexure B — Plagiarism Report | 21 |
| Annexure C — Empathy Chart and Solution Document | 22 |
| Annexure D — Project Tracker | 23 |

*(Generate this as an auto-updating Word TOC field using Heading 1 / Heading 2 / Heading 3 styles; the page numbers above are the intended targets, not measured values.)*

---

## LIST OF FIGURES

| Figure | Caption | Page |
|---|---|---|
| Figure 2.1 | Layered architecture of the Nightingale prototype | 5 |
| Figure 2.2 | Five-signal fusion and escalation pipeline | 6 |
| Figure 4.1 | Waterfall development model followed for the project | 10 |
| Figure 5.1 | Watch-floor dashboard — fleet grid, incident queue and drill console *(insert a screenshot captured from the running prototype at `http://localhost:4310`)* | 12 |
| Figure 6.1 | Risk trajectory of a standard-profile drill on an ICU infusion pump | 13 |
| Figure 6.2 | Canary lead over write entropy (schematic of the measured R4 result) | 14 |

---

## LIST OF TABLES

| Table | Caption | Page |
|---|---|---|
| Table 1.1 | Existing systems and the gap each leaves | 2 |
| Table 2.1 | Fused behavioural signals and weights | 5 |
| Table 2.2 | Clinical tiers and tier weights | 6 |
| Table 2.3 | Threshold bands and operator meaning | 6 |
| Table 3.1 | Literature survey by theme | 9 |
| Table 5.1 | Functional requirements | 11 |
| Table 5.2 | Simulated fleet (14 devices) | 12 |
| Table 5.3 | Database tables | 12 |
| Table 6.1 | Drill measurements | 13 |
| Table 7.1 | Test cases and outcomes | 15 |
| Table 8.1 | Limitations of the prototype | 18 |
| Table 8.2 | Roadmap | 18 |

---

# CHAPTER 1 — INTRODUCTION

## 1.1 Ransomware as a patient-safety problem

Hospital ransomware has moved from an IT inconvenience to a measurable clinical harm. The ENISA Threat Landscape for the health sector found that ransomware made up 54% of 215 analysed incidents, and that hospitals were the victim in 42% of them [5]. In the United States, 374 attacks struck care-delivery organisations between 2016 and 2021, exposing the records of roughly 42 million patients and disrupting care delivery in 44.4% of attacks [15]. The 2024 Healthcare Data Breach Report records 725 large breaches affecting about 275 million records, with Change Healthcare alone accounting for about 190 million individuals [4]. IBM X-Force found ransomware to be the most common action on objectives in 2023, at 20% of the incidents it handled, with healthcare sixth among attacked industries [3].

The clinical consequences are now quantified in peer-reviewed work. WannaCry affected at least 80 of 236 English NHS trusts, forced an estimated 19,000 cancelled appointments and diverted ambulances from five accident-and-emergency departments [1]. A Hospital Episode Statistics analysis places the toll at 13,500 cancelled outpatient appointments, an approximately 6% drop in admissions at infected trusts, and £5.9 million of lost activity [2]. Neprash, McGlave and Nikpay, linking a hospital-attack database to Medicare claims, report that patient volumes fall 17–24% in the attack week and that in-hospital mortality rises 34–38% among patients already admitted when the attack begins [17]. Emergency-department visits fall 8.1% in the first week and 16.2% in the second, while nearby unattacked hospitals absorb the spillover [16].

The common thread is late detection. Once bulk encryption is underway, a hospital's options shrink to restoring backups and diverting ambulances. Earlier detection preserves choices, because isolating one device is preferable to isolating a ward. Regulation is moving in the same direction: the FDA treats cybersecurity as a component of device safety and requires premarket cybersecurity submissions for cyber-devices under FD&C Act §524B [13], and the HHS 405(d) programme lists ransomware and compromise of network-connected medical devices among the top threats hospitals must plan against [14].

Nightingale is built for that direction. It detects behaviour in seconds, shows the named evidence for every alarm, and puts the devices that keep patients alive at the front of the containment queue.

## 1.2 Existing work

A review of the systems and research closest to this problem shows a recurring split: strong signal-level detection on one side, and threat-centric response on the other. Table 1.1 summarises the position of each and the gap Nightingale addresses.

**Table 1.1: Existing systems and the gap each leaves**

| System / approach | What it does well | Gap relevant to hospitals |
|---|---|---|
| Kharraz et al. [6] — behavioural analysis of 1,359 ransomware samples | Establishes that file-system/I/O activity and decoys enable practical early detection | Detection is generic; no clinical notion of which device matters more |
| ShieldFS [7] — self-healing ransomware-aware filesystem | Fuses entropy, I/O frequencies and crypto-primitive detection; 97.7% on unseen samples; automatic rollback | Requires a custom filesystem on each endpoint; response is per-file, not fleet-level |
| Davies et al. [8] and Casino et al. [9] — entropy-based detection | Mature analysis of high-entropy segments for EDR | Shannon entropy alone is unreliable against compressed files; no clinical triage |
| Genç et al. [10] — deception-based protection | Formal honey-file placement and robustness analysis | Anti-decoy ransomware can bypass naive decoy deployment if decoys are the sole trigger |
| Cabaj and Mazurczyk [11] — SDN-based mitigation | Blocks C&C traffic in roughly 100 ms, before key retrieval | Addresses containment transport, not detection scoring or clinical priority |
| Commercial EDR / AV suites | Broad coverage and established deployment | Rank alerts by threat score; a billing server can outrank an infusion pump at equal score |

The gap is therefore not another detector. It is an **explainable, fleet-level score that is deliberately re-ordered by patient-safety criticality**, so that limited operator attention goes first to the device whose loss harms a patient fastest.

## 1.3 Motivation

The motivation for Nightingale is concrete and twofold.

First, the harm is measured rather than rhetorical. A ransomware attack is one of the few security incidents where a delay of seconds can be translated into cancelled operations and higher mortality [17]. Any system that shortens that delay, or that prevents an operator from spending the first critical minute on the wrong device, is worth building.

Second, canonical security operations centre (SOC) practice ranks incidents by threat score. In a hospital that is the wrong ordering. At an identical risk score of 60, Nightingale's Clinical Risk Index gives an ICU infusion pump a CRI of 90 and a billing server a CRI of 45. When an operator can contain one device at a time, the pump must go first. This project sets out to make that ordering explicit, visible and auditable instead of leaving it to a human to remember under pressure.

A personal motivation also shaped the interface: clinical staff already triage fever every shift. Mapping a device's risk to a body temperature between 36.5 °C and 42.0 °C lets a ward team read the dashboard as a chart they already know, instead of learning a new abstract scale.

## 1.4 Objectives

1. To design and implement a prototype that fuses five behavioural signals per device into a single, explainable 0–100 risk score within a roughly two-second telemetry window.
2. To define and apply a Clinical Risk Index that re-orders containment by patient-safety criticality rather than raw threat.
3. To provide every alarm with named evidence lines, so an operator can audit why the engine fired before acting.
4. To build an attack-drill console that injects synthetic ransomware campaigns, making the full detect-to-contain loop demonstrable in minutes without real malware or real patient data.
5. To implement one-click, fully audited containment and release actions with a simulated NAC/VLAN revoke.
6. To deliver the system with authentication, persistence and row-level security in Supabase, while degrading gracefully to a credential-free demo mode.
7. To verify the implementation with a production build and end-to-end drill tests, and to state plainly what remains unmeasured.

## 1.5 Scope

**In scope.** A single-hospital device fleet of 14 seeded devices across four clinical tiers; simulated telemetry at a two-second window; five-signal fusion; asymmetric EMA smoothing; CRI-based triage; a fever-mapping dashboard; standard, fast and stealth drill profiles; simulated containment and release; an append-only audit trail; optional Supabase Auth and Postgres persistence with RLS; and a no-credential demo mode.

**Out of scope.** Real endpoint telemetry collection, real malware execution, clinically validated thresholds, measured false-alarm rates, real NAC/SDN controller integration, multi-site hospital chains, and any use of real patient data. These are documented as future work in Chapter 8. The project is a prototype that validates detection logic and operator workflow; it is not a deployable clinical product.

---

# CHAPTER 2 — CONCEPTS AND METHODS

## 2.1 Definitions

**Ransomware.** Malware that encrypts files or blocks access until a payment is made. This project models the behavioural ramp that precedes bulk encryption rather than the encryption itself.

**Canary file (decoy).** A harmless file placed on a share with an attention-grabbing name. Legitimate users have no reason to open it, so any touch is near-certain evidence of malicious enumeration [6], [10]. Nightingale records `canaryHits` per window.

**Shannon entropy.** A measure of randomness in data, expressed in bits per byte (0–8). Encrypted blocks tend toward high entropy. The engine normalises entropy as `(entropy − 1.0) / 6.5`, clamped to 0–1, so ordinary text stays near zero.

**Shadow copy.** A Windows volume snapshot used for recovery. Deleting shadow copies is a well-known pre-encryption staging step, recorded here as `shadowDel`.

**Lateral movement.** Spread from one host to peers, observed as a burst of outbound SMB/RDP connections (`smbConns`). Normalised as `(smbConns − 15) / 85`.

**Clinical Risk Index (CRI).** `CRI = min(100, round(risk × tier weight))`. It is the value that orders the containment queue.

**Exponential Moving Average (EMA).** A smoother of the form `new = α·raw + (1 − α)·previous`. Nightingale uses α = 0.62 when the score rises and α = 0.38 when it falls — "rise fast, decay slow."

**Fever mapping.** `fever = 36.5 + 5.5 × (risk / 100)` °C, clamped to 36.5–42.0 °C. A design metaphor, not a clinical measurement.

**NAC / VLAN containment.** In production, revoking a device's network access through a controller. In this prototype it is simulated inside the world state and written to the audit log.

## 2.2 Detection method: five-signal fusion

Each telemetry window carries the six raw fields defined in `lib/types.ts`: entropy, writeRate, renameRate, smbConns, canaryHits and shadowDel. Five of them are normalised against fixed baselines and combined with fixed weights. (Write rate contributes to the simulation narrative but is not one of the five fused signals.)

**Table 2.1: Fused behavioural signals and weights**

| Signal | Code field | Weight | Normalisation | Fires when |
|---|---|---|---|---|
| Canary / decoy tripwire | `canaryHits` | 0.32 | `hits / 1` | Any decoy file touched anywhere on a share |
| Shannon entropy of fresh writes | `entropy` | 0.24 | `(entropy − 1.0) / 6.5` | Written blocks read as ciphertext |
| Shadow-copy / backup deletion | `shadowDel` | 0.18 | `deletions / 1` | Snapshot or backup deletion events occur |
| SMB/RDP connection burst | `smbConns` | 0.12 | `(conns − 15) / 85` | Outbound sessions spike toward peer hosts |
| Mass rename / write churn | `renameRate` | 0.14 | `rate / 900` | Rename/create rate sweeps upward |

The weights sum to 1.0. The canary carries the largest weight because a decoy touch has a near-zero benign explanation; entropy is second because it is strong but confounded by compression [8]. Shadow-copy deletion is a staging signal, and the two movement/churn signals are weaker individually but useful in combination.

The weighted sum, scaled to 0–100, is smoothed by the asymmetric EMA. Escalation reaches a band within a few windows while a single noisy window decays quietly. The bands are:

**Table 2.3: Threshold bands and operator meaning**

| Band | Threshold | Meaning |
|---|---|---|
| Calm | risk < 35 | Baseline behaviour; no incident |
| Watch | risk ≥ 35 | First anomaly; incident opens with evidence |
| Alert | risk ≥ 55 | Escalated; operator review advised |
| Critical | risk ≥ 75 | Urgent; containment advised |

Every alarm carries named evidence lines generated by `classify()` in `lib/engine.ts`, for example *"Canary tripwire broken (3 decoy files touched)"* or *"Write entropy 6.10 bits/byte — ciphertext profile."* This is deliberate: clinical staff will not act on a score they cannot interrogate. The engine also produces a plain-language incident summary through `incidentSummary()`, distinguishing a canary-led alarm ("treating as encryption prep") from an entropy-led one ("bulk encryption signature").

**Figure 2.2 — Five-signal fusion and escalation pipeline.** *Insert a diagram showing: six telemetry fields → five normalisers → weighted sum (weights 0.32/0.24/0.18/0.12/0.14) → rawScore 0–100 → asymmetric EMA (α 0.62 up / 0.38 down) → risk → band (calm/watch/alert/critical) → CRI (× tier weight) → containment queue → fever mapping.*

## 2.3 Clinical triage: the Clinical Risk Index

The containment queue is ordered by CRI, not by raw risk. The four tiers are defined in `lib/engine.ts` and reproduced in Table 2.2.

**Table 2.2: Clinical tiers and tier weights**

| Tier | Class | Examples from the simulated fleet | Weight |
|---|---|---|---|
| 0 | Life-critical | Infusion pumps, ventilators, patient monitors | ×1.5 |
| 1 | Care-critical | EHR, PACS, lab systems, ultrasound | ×1.25 |
| 2 | Operational | Pharmacy dispensing, nurse stations, OR scheduling | ×1.0 |
| 3 | Administrative | Billing, admissions, back-office shares | ×0.75 |

At a risk score of 60, an infusion pump scores CRI 90 and a billing server CRI 45. In the world model, devices in tiers 0 and 1 additionally receive a "CLINICAL PRIORITY" tag in the incident feed when an alarm opens. Prioritising life-critical devices follows the FDA's device-safety position [13] and the medical-device practices in the HICP [14].

**Figure 2.1 — Layered architecture of the Nightingale prototype.**

```
+------------------------------------------------------------------------------+
| Browser (React 19, Next.js 15 App Router)                                    |
|   app/page.tsx ................ login gate                                   |
|   components/LoginClient.tsx .. demo sign-in form                            |
|   app/dashboard/page.tsx ...... watch floor page                             |
|   components/DashboardClient.tsx  fleet grid, incident feed, drill console   |
|   components/Sparkline.tsx .... risk history per device                      |
+-------------------------------+----------------------------------------------+
                                | POST /api/tick every ~2 s (plus actions)
+-------------------------------v----------------------------------------------+
| Next.js API routes (Node / TypeScript)                                       |
|   /api/tick      advance one window, run engine                              |
|   /api/state     fleet snapshot (devices, incidents, feed)                   |
|   /api/inject    arm drill (standard / fast / stealth)                       |
|   /api/contain   quarantine device (simulated NAC/VLAN revoke)               |
|   /api/release   return device to service                                    |
|   /api/reset     re-seed fleet                                               |
|   /api/auth/demo, /api/auth/signout   sessions                               |
+------------------------------------------------------------------------------+
| lib/world.ts   in-memory fleet: 14 seeded devices, attack ramps, audit trail |
| lib/engine.ts  signals -> risk -> CRI -> fever -> incidents                  |
+-------------------------------+----------------------------------------------+
                                | best-effort writes (never block the tick)
+-------------------------------v----------------------------------------------+
| Supabase                                                                     |
|   Postgres: devices, incidents, audit_log (RLS enabled)                      |
|   Auth: email/password, SSR cookie sessions (@supabase/ssr)                  |
+------------------------------------------------------------------------------+
```

---

# CHAPTER 3 — LITERATURE SURVEY

## 3.1 Detection-surface literature

Cen et al. survey early ransomware detection by detection surface [12]. Three surfaces matter to Nightingale: file-system behaviour, deception, and the network.

Kharraz et al., in the foundational large-scale study of 1,359 samples across 15 families, showed that abnormal file-system activity and decoy resources support practical early detection [6]. ShieldFS fused write entropy with read/write/rename frequencies and cryptographic-primitive detection inside a self-healing filesystem, detecting 97.7% of unseen samples [7]. Entropy remains the workhorse signal: Davies et al. compared eleven randomness tests across more than 270,000 files and mapped where Shannon entropy succeeds and where compression defeats it [8]; Casino et al. classify high-entropy file segments for real-time EDR use, reporting accuracy between 0.95 and 1.0 on 64 KB streams [9]. Deception has its own literature: Genç et al. analyse honey-file placement formally and demonstrate that anti-decoy ransomware can bypass naive decoy deployments [10]. For that reason Nightingale treats the canary as one fused signal among five, never a sole containment trigger. On the response side, Cabaj and Mazurczyk showed that software-defined networking can block ransomware command-and-control traffic within about 100 ms, well below the 3.8–27.4 s public-key download time, fast enough to act before key material is retrieved [11].

## 3.2 Clinical and regulatory context

The clinical cost of hospital ransomware is documented across health systems: the NAO WannaCry investigation [1], the NHS retrospective analysis [2], US breach reporting [4], IBM X-Force [3], and peer-reviewed studies of care disruption [15], [16] and mortality [17]. Regulation and guidance push the same way: FDA device-cybersecurity guidance [13] and the HHS 405(d) Health Industry Cybersecurity Practices [14]. Together these establish the premise of this project: a hospital security alarm is a patient-safety alarm.

## 3.3 Gap identified

The surveyed systems solve parts of the problem. Signal-level detectors [6]–[10] are strong but generic; the SDN work [11] solves fast blocking but not scored detection or triage; and commercial EDR ranks by threat. None of them orders response by what a device does for patients. Nightingale composes the established signal families into one explainable per-device score and adds clinical triage.

**Table 3.1: Literature survey by theme**

| Ref. | Theme | Contribution used in Nightingale |
|---|---|---|
| [1], [2] | NHS / WannaCry impact | Motivation; quantified cancellations, admissions drop and lost activity |
| [3], [4], [5] | Health-sector threat landscape | Ransomware 54% of incidents; hospitals 42%; 725 US breaches in 2024 |
| [6] | Behavioural detection | File-system activity and decoys as early indicators |
| [7] | Fusion + self-healing | Multi-signal fusion (entropy + I/O frequencies), 97.7% detection |
| [8], [9] | Entropy analysis | Justifies entropy weight and the compression confounder |
| [10] | Deception | Justifies canary weight and the decision never to let decoys act alone |
| [11] | SDN mitigation | Feasibility of ~100 ms network-level containment for the roadmap |
| [12] | Survey | Framing by detection surface |
| [13], [14] | Regulation / guidance | Patient-safety framing of device security |
| [15], [16], [17] | Care disruption and mortality | Evidence that harm is measured and that timing matters |

---

# CHAPTER 4 — PROJECT PLAN

## 4.1 Development model

The project followed a waterfall model with feedback loops between testing and revision. Each phase was planned separately and its output carried forward, which suited a prototype with a fixed, well-understood requirements set: a defined telemetry schema, a defined scoring contract and a defined operator workflow.

**Figure 4.1 — Waterfall development model followed for the project.** *Insert a diagram with the phases: Requirements → Design → Implementation → Testing → Deployment/demo, with a backward arrow from Testing to Design for revisions.*

## 4.2 Phase-wise plan

| Phase | Activity | Outcome |
|---|---|---|
| 1. Requirements | Study hospital ransomware harm and existing detectors; fix scope | Requirements list and explicit out-of-scope list (Chapters 1 and 5) |
| 2. Design | Choose signals, weights, EMA, tiers, fever metaphor, data model | `lib/engine.ts` contract, `lib/types.ts` schema, Supabase schema |
| 3. Implementation | Build Next.js app, world simulator, API routes, dashboard, auth/persistence | Working prototype (Chapters 2 and 5) |
| 4. Testing | Production build; end-to-end drills; containment and release | Build passes; measured drill timings (Chapters 6 and 7) |
| 5. Delivery | Documentation, research paper, deck, NDA, this report | `docs/` and `slides/` artefacts |

Estimates of effort and schedule are recorded in the Project Tracker at Annexure D.

---

# CHAPTER 5 — SOFTWARE REQUIREMENT SPECIFICATION

## 5.1 Project scope

The proposed system answers the following: can behavioural signals collected in a two-second window identify a ransomware ramp before bulk encryption; can a clinical weighting make the response queue patient-safety-first; and can the whole loop be demonstrated safely with synthetic data? The detailed in-scope and out-of-scope lists are in Section 1.5.

## 5.2 User classes and characteristics

**Operator / security officer (primary).** Watches the fleet, reviews incidents with evidence, arms drills, contains and releases devices. Needs fast, explainable information and a complete audit trail.

**Clinical staff (secondary, read-only in the prototype).** Needs at-a-glance status in a familiar metaphor; the fever mapping serves this class.

**System administrator.** Configures Supabase credentials, runs the schema, manages accounts.

**Pilot partner (future).** A hospital evaluating the system under the mutual NDA in `docs/nda.md`, which forbids entering real patient data into the demo system.

## 5.3 Functional requirements

**Table 5.1: Functional requirements**

| ID | Requirement |
|---|---|
| FR-1 | Advance the simulated world one telemetry window on each `POST /api/tick` |
| FR-2 | Normalise and fuse five signals into a 0–100 risk score per device |
| FR-3 | Smooth risk with asymmetric EMA (α 0.62 rising, 0.38 falling) |
| FR-4 | Compute CRI from risk and tier weight; sort containment queue by CRI |
| FR-5 | Assign watch / alert / critical bands and open or escalate an incident with named evidence |
| FR-6 | Auto-close an open incident whose device risk decays below 30 |
| FR-7 | Arm a drill (`standard` / `fast` / `stealth`) on any device via `/api/inject` |
| FR-8 | Quarantine a device with simulated NAC/VLAN revoke via `/api/contain` |
| FR-9 | Release a quarantined device via `/api/release`, resetting risk to 6 |
| FR-10 | Reset the fleet via `/api/reset` |
| FR-11 | Persist devices, incidents and audit rows to Supabase when configured; otherwise no-op |
| FR-12 | Authenticate users via Supabase email/password with SSR cookie sessions; provide a credential-free demo mode |
| FR-13 | Render the watch floor, sparklines, incident feed, drill console and audit trail |
| FR-14 | Map risk to fever in °C for display |

## 5.4 Non-functional requirements

- **Availability:** a database outage must never stop the watch floor; all persistence calls are wrapped so they degrade to a warning ([5.5](#55-data-model)).
- **Explainability:** every alarm must carry named evidence lines.
- **Auditability:** inject, contain, release and reset must write to the audit trail and, when configured, to `audit_log`.
- **Privacy:** no real patient data anywhere in the system; the NDA at `docs/nda.md` forbids entering it.
- **Security:** RLS enabled on all three tables; session guard via `middleware.ts`.
- **Performance:** tick completes one window for all 14 devices and returns a full state snapshot as JSON.
- **Portability:** single Next.js 15 application; Node 20+; no native dependencies.

## 5.5 Data model

Three Supabase tables are defined in `supabase/schema.sql` (Table 5.3).

**Table 5.3: Database tables**

| Table | Key columns | Purpose |
|---|---|---|
| `devices` | `device_id` (PK), `name`, `kind`, `unit`, `tier` (0–3), `ip`, `created_at` | The monitored fleet |
| `incidents` | `id` (uuid PK), `incident_ref` (unique), `device_ref` (FK → devices), `device_name`, `kind`, `severity` (watch/alert/critical), `status` (open/contained/resolved), `score`, `summary`, `evidence` (jsonb), `started_at`, `contained_at` | One row per detection |
| `audit_log` | `id` (uuid PK), `ts`, `actor`, `action`, `target`, `detail` | Every operator action on the record |

Indexes: `incidents(device_ref, started_at desc)` and `audit_log(ts desc)`. RLS is enabled on all three tables with one coarse prototype policy that grants all authenticated users full access; per-role policies are deferred (Section 8.2).

**Table 5.2: Simulated fleet (14 devices)** — defined in `lib/world.ts`, hospital: "St. Hesper General Hospital".

| ID | Device | Unit | Tier |
|---|---|---|---|
| `icu-pump-01` | Infusion Pump ICU-01 | ICU | 0 |
| `icu-vent-01` | Ventilator ICU-02 | ICU | 0 |
| `icu-mon-01` | Bedside Monitor ICU-03 | ICU | 0 |
| `ehr-core` | EHR Core Server | IT Core | 1 |
| `pacs-01` | PACS Imaging Store | Radiology | 1 |
| `mri-console` | MRI Console 1 | Radiology | 1 |
| `lab-an-01` | Lab Analyzer L-1 | Laboratory | 1 |
| `us-port-04` | Portable Ultrasound US-04 | Ward 3 | 1 |
| `phar-disp-01` | Pharmacy Dispenser P-1 | Pharmacy | 2 |
| `or-sched-01` | OR Scheduling WS | Operating Theatres | 2 |
| `ward-ns-12` | Nurse Station WS-12 | Ward 3 | 2 |
| `adm-front-01` | Admissions PC-01 | Front Desk | 3 |
| `bill-srv-01` | Billing Server | Administration | 3 |
| `nas-backup-01` | Back-office NAS | Administration | 3 |

**Figure 5.1 — Watch-floor dashboard.** *Insert a screenshot from the running prototype showing the fleet grid with fever values, the containment queue, the incident feed, the drill console and the audit trail.*

---

# CHAPTER 6 — RESULTS

All results below are measured from the running prototype as recorded in `docs/report.md` and `docs/research-paper.md`. They are prototype observations on synthetic telemetry, not clinical measurements.

## 6.1 Detection timings

**Table 6.1: Drill measurements**

| # | Metric | Value |
|---|---|---|
| R1 | Drill start → first alarm (watch ≥ 35), standard profile | ~8 s (≈4 windows) |
| R2 | Drill start → critical (≥ 75), standard profile | ~22 s (≈11 windows) |
| R3 | Time to critical, stealth profile | ≈1.6× slower than standard (≈35 s) |
| R4 | Write entropy at the moment the canary trips | ≤ 2.5 bits/byte |
| R5 | False alarms on the benign baseline | Not measured |
| R6 | End-to-end containment action latency | Not measured |

R5 and R6 are deliberately left open. The prototype has not run long enough on a benign baseline to quote a false-alarm rate, and this report declines to invent one.

**Figure 6.1 — Risk trajectory of a standard-profile drill on an ICU infusion pump.** *Insert a plot of risk versus time showing the calm baseline, the watch crossing near 8 s, the alert band, and the critical crossing near 22 s. The trajectory is produced by `rampAt()` in `lib/world.ts` and `smooth()` in `lib/engine.ts`.*

## 6.2 Clinical prioritisation behaviour

A drill on an infusion pump (tier 0) escalates to the top of the containment queue with a "CLINICAL PRIORITY LIFE-CRITICAL" tag, because its CRI is `min(100, risk × 1.5)`. The identical drill on an administrative device (tier 3, weight 0.75) sits lower in the queue. At a risk of 60 the two CRIs are 90 and 45 respectively. This is the central design claim, and it is observable directly in the running prototype.

## 6.3 Containment flow

The end-to-end sequence inject → watch → alert → critical → contain → release was verified. On containment, the device status becomes `quarantined`, its SMB/RDP, canary, shadow-delete and rename/write values are zeroed, its telemetry is suppressed, the open incident flips to `contained` with a `containedAt` timestamp, and an audit row is written. On release, the device returns to service with risk reset to 6 and re-learns its baseline. The same flow was verified in Demo Mode and with Supabase persistence enabled.

**Figure 6.2 — Canary lead over write entropy.** *Insert a schematic of the measured R4 result: entropy remains at or below 2.5 bits/byte when the canary trips; entropy crosses the ciphertext threshold several windows later. The point is that deception catches intent and entropy later confirms the act.*

---

# CHAPTER 7 — SOFTWARE TESTING

## 7.1 Build verification

`npm run build` — the Next.js 15 production build with TypeScript strict mode — passes. The dependency set is small and current: Next.js 15, React 19, `@supabase/ssr`, `@supabase/supabase-js`; development tooling includes TypeScript 5.7 and PptxGenJS for deck generation (`package.json`).

## 7.2 Test cases

**Table 7.1: Test cases and outcomes**

| # | Test | Expected | Observed |
|---|---|---|---|
| T1 | Production build | Compiles with no type errors | Pass |
| T2 | Load watch floor with no credentials | Demo Mode, 14 devices, fever 36.5 °C | Pass |
| T3 | Baseline idle for several windows | Sparklines move; no incidents open | Pass |
| T4 | Standard drill on ICU infusion pump | Watch alarm ≈8 s, critical ≈22 s, evidence lines present | Pass |
| T5 | CRI ordering | Tier-0 device appears above tier-3 device at equal risk | Pass |
| T6 | Canary precedence | Canary trips at entropy ≤ 2.5 bits/byte | Pass |
| T7 | Stealth drill | ≈1.6× slower to critical; still precedes encryption | Pass |
| T8 | Contain at critical | Status `quarantined`, incident `contained`, audit row written | Pass |
| T9 | Release | Status `online`, risk reset to 6, baseline re-learned | Pass |
| T10 | Reset | 14 devices re-seeded, incidents/events/audit cleared, tick count 0 | Pass |
| T11 | Supabase mode with schema applied | Devices seeded; incidents and audit rows persisted; RLS enabled | Pass |
| T12 | Persistence outage simulated | Tick continues; warning logged; watch floor unaffected | Pass (by design) |

## 7.3 Known untested items

- False-alarm rate on a long benign baseline (R5).
- End-to-end containment latency measured against a real controller (R6) — containment is simulated, so this cannot yet be measured.
- Real endpoint telemetry, real malware samples and clinical-field evaluation are outside the prototype and untested.

---

# CHAPTER 8 — CONCLUSION AND FUTURE WORK

## 8.1 Conclusion

Nightingale demonstrates that two ideas compose well: behavioural early detection drawn from a decade of ransomware research [6]–[12], and clinical triage that ranks response by what a device does for patients. On a simulated 14-device fleet, alarms lead bulk encryption by seconds — the canary fires while write entropy is still ≤ 2.5 bits/byte — and the containment queue puts the infusion pump before the billing server at equal risk. Every alarm ships with named evidence, so an operator can interrogate it before acting, and every operator action is audited.

The prototype validates detection logic and operator workflow. It does not validate endpoint conditions on real devices, and it does not claim a measured false-alarm rate. The contribution stands independent of that distance: patient-safety-first ordering is a design decision a hospital can evaluate today, in simulation, with its own staff.

**Table 8.1: Limitations of the prototype**

| # | Limitation |
|---|---|
| 1 | Telemetry is simulated; a lightweight OS agent is future work |
| 2 | Weights and thresholds are hand-tuned; no clinical validation; R5 unmeasured |
| 3 | Individual signals have confounders — compression defeats raw entropy [8], anti-decoy malware can bypass naive decoys [10]; fusion lowers but does not remove them |
| 4 | Containment is simulated; real NAC/SDN integration and fail-safe rollback do not exist yet |
| 5 | RLS is prototype-grade: one coarse policy gives all authenticated users full access to the three tables; per-role policies are deferred |
| 6 | Scope is a single hospital; multi-site chains need separate evaluation |

## 8.2 Future work

**Table 8.2: Roadmap**

| # | Item | Description |
|---|---|---|
| 1 | Real telemetry agent | A lightweight OS agent streaming the same telemetry schema from real endpoints; the engine contract does not change |
| 2 | Learned thresholds | Fit weights and bands on labelled fleet data; measure the false-alarm rate (currently an open slot) |
| 3 | Hospital pilot | Evaluate on a real ward inventory under the mutual NDA at `docs/nda.md`, with simulated data only until the pilot agreement says otherwise |
| 4 | SDN/NAC integration | Replace the simulated revoke with a real controller call [11], with fail-safe rollback |
| 5 | Per-role authorisation | Split the coarse RLS policy into role-specific policies; separate service-role access; add retention rules |

---

# BIBLIOGRAPHY

[1] UK National Audit Office, *Investigation: WannaCry cyber attack and the NHS*, HC 414, Oct. 2017. [Online]. Available: https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/

[2] S. Ghafur, S. Kristensen, K. Honeyford, G. Martin, A. Darzi, and P. Aylin, "A retrospective impact analysis of the WannaCry cyberattack on the NHS," *npj Digital Medicine*, vol. 2, art. 85, 2019, doi: 10.1038/s41746-019-0161-6.

[3] IBM Security X-Force, *X-Force Threat Intelligence Index 2024*, IBM, Feb. 2024. [Online]. Available: https://www.ibm.com/think/x-force/2024-x-force-threat-intelligence-index

[4] S. Alder, "2024 healthcare data breach report," *HIPAA Journal*, Jan. 2025. [Online]. Available: https://www.hipaajournal.com/2024-healthcare-data-breach-report/

[5] ENISA, *ENISA Threat Landscape: Health Sector*, European Union Agency for Cybersecurity, Jul. 2023. [Online]. Available: https://www.enisa.europa.eu/publications/health-threat-landscape

[6] A. Kharraz, W. Robertson, D. Balzarotti, L. Bilge, and E. Kirda, "Cutting the Gordian knot: A look under the hood of ransomware attacks," in *Proc. DIMVA*, LNCS 9148, 2015, pp. 3–24, doi: 10.1007/978-3-319-20550-2_1.

[7] A. Continella *et al.*, "ShieldFS: A self-healing, ransomware-aware filesystem," in *Proc. ACSAC*, 2016, pp. 336–347, doi: 10.1145/2991079.2991110.

[8] E. Davies, R. Macfarlane, and W. J. Buchanan, "Comparison of entropy calculation methods for ransomware encrypted file identification," *Entropy*, vol. 24, no. 10, art. 1503, 2022, doi: 10.3390/e24101503.

[9] R. Casino, D. Hurley-Smith, J. Hernández-Castro, and C. Patsakis, "Not on my watch: ransomware detection through classification of high-entropy file segments," *Journal of Cybersecurity*, vol. 11, no. 1, tyaf009, 2025, doi: 10.1093/cybsec/tyaf009.

[10] Z. A. Genç, G. Lenzini, and D. Sgandurra, "On deception-based protection against cryptographic ransomware," in *Proc. DIMVA*, LNCS 11550, 2019, pp. 219–239, doi: 10.1007/978-3-030-22038-9_11.

[11] K. Cabaj and W. Mazurczyk, "Using software-defined networking for ransomware mitigation: The case of CryptoWall," *IEEE Network*, vol. 30, no. 6, pp. 14–20, 2016, doi: 10.1109/MNET.2016.1600110NM.

[12] M. Cen, F. Jiang, X. Qin, Q. Jiang, and R. Doss, "Ransomware early detection: A survey," *Computer Networks*, vol. 239, art. 110138, 2024, doi: 10.1016/j.comnet.2023.110138.

[13] U.S. Food and Drug Administration, "Cybersecurity in medical devices: Quality system considerations and content of premarket submissions," Final Guidance, Sep. 2023. [Online]. Available: https://www.federalregister.gov/documents/2023/09/27/2023-20955/cybersecurity-in-medical-devices-quality-system-considerations-and-content-of-premarket-submissions

[14] HHS 405(d) Program and Health Sector Coordinating Council, *Health Industry Cybersecurity Practices (HICP), 2023 Edition*, Apr. 2023. [Online]. Available: https://405d.hhs.gov/cornerstone/hicp

[15] H. T. Neprash *et al.*, "Trends in ransomware attacks on US hospitals, clinics, and other health care delivery organizations, 2016–2021," *JAMA Health Forum*, vol. 3, no. 12, e224873, 2022, doi: 10.1001/jamahealthforum.2022.4873.

[16] R. Abouk and D. Powell, "Ransomware attacks, ED visits and inpatient admissions in targeted and nearby hospitals," *JAMA*, vol. 331, no. 24, pp. 2129–2131, 2024, doi: 10.1001/jama.2024.7752.

[17] H. Neprash, C. McGlave, and S. Nikpay, "Hacked to pieces? The effects of ransomware attacks on hospitals and patients," *AEJ: Economic Policy*, vol. 18, no. 1, pp. 256–281, 2026, doi: 10.1257/pol.20240594.

*(All 17 references above were independently verified on 20 November 2026 against publisher DOI pages, official report pages and journal sites; see `notes/sources.md` in the project repository. No source was invented.)*

---

# ANNEXURE A — LIST OF PUBLICATIONS AND RESEARCH PAPER

**A.1 List of publications**

*[Fill in only publications that actually exist; otherwise state "No publications arising from this project to date." Do not list the project's internal documents as publications.]*

| # | Title | Venue | Status |
|---|---|---|---|
| 1 | [Publication title, if any] | [Venue] | [Published / Submitted / Under preparation] |

**A.2 Research paper (in its original format)**

The full research paper arising from this project is maintained at `docs/research-paper.md` in the project repository. Attach the formatted PDF/Word version here, in its original format, with this report.

---

# ANNEXURE B — PLAGIARISM REPORT

*[Attach the original plagiarism/similarity report generated for this manuscript. State the tool used, the date and the overall similarity index. Do not leave this as a blank page.]*

| Tool used | Date | Overall similarity index | Report reference |
|---|---|---|---|
| [e.g. Turnitin] | [DD/MM/YYYY] | [X%] | [Attach original report] |

---

# ANNEXURE C — EMPATHY CHART AND SOLUTION DOCUMENT

**C.1 Empathy chart**

The design of Nightingale was driven by three real constraints documented in the project: harm is measured in patient outcomes, operators cannot interrogate an opaque score, and ward staff already read fever charts. The table maps each stakeholder's situation to the design decision it produced.

| Stakeholder | What they face (situation) | Need | Design decision in Nightingale |
|---|---|---|---|
| ICU nurse / clinician | A compromised pump can harm a patient within minutes; IT alerts arrive as opaque numbers | Know immediately which device keeps a patient alive | Clinical Risk Index with tier weights; "CLINICAL PRIORITY" tag; CRI-ordered queue |
| Security officer | Many simultaneous alarms; limited time to contain one device at a time | Trust and explain each alarm before acting | Five fused signals with named evidence lines; plain-language incident summary |
| Security officer | Attacks that hide by ramping slowly | Catch intent before encryption | Canary tripwire weighted highest and fused with entropy; stealth drill profile |
| Ward staff | Already triage fever every shift | A familiar reading of device state | Fever mapping, 36.5–42.0 °C |
| Auditor / clinical governance | Must reconstruct who did what after an incident | Tamper-evident record | Append-only audit trail; `audit_log` table |
| Pilot partner / patient | Must not expose real patient data to a demo | Privacy by construction | Fully synthetic fleet; mutual NDA at `docs/nda.md` forbids real patient data |

**C.2 Solution document**

Problem: hospital ransomware detection arrives too late, and response is ordered by threat score rather than clinical impact. Solution: a watch floor that fuses five behavioural signals in ~2 s windows into an explainable risk score, re-orders response by a Clinical Risk Index, and demonstrates containment through a synthetic drill console. Evidence of solution: prototype drills reach the watch band in ~8 s and critical in ~22 s, canary fires at entropy ≤ 2.5 bits/byte, and containment is fully audited (Chapter 6). Boundaries of solution: telemetry, thresholds and containment are simulated and not clinically validated (Table 8.1).

---

# ANNEXURE D — PROJECT TRACKER

*[Fill dates from your own records; the status column reflects the actual state of the codebase as of 20 November 2026.]*

| # | Phase / task | Planned start | Planned end | Status |
|---|---|---|---|---|
| 1 | Literature review and source verification | [date] | [date] | Complete — 17 verified sources in `notes/sources.md` |
| 2 | Requirements and scope | [date] | [date] | Complete |
| 3 | Detection engine and world simulator | [date] | [date] | Complete — `lib/engine.ts`, `lib/world.ts` |
| 4 | Frontend dashboard and sparklines | [date] | [date] | Complete — `components/` |
| 5 | API routes and drill/containment flow | [date] | [date] | Complete — `app/api/` |
| 6 | Supabase schema, auth and persistence | [date] | [date] | Complete — `supabase/schema.sql`, `lib/persist.ts` |
| 7 | Build and end-to-end testing | [date] | [date] | Complete — Chapter 7 |
| 8 | Research paper, deck, NDA and report | [date] | [date] | Complete |
| 9 | Real telemetry agent | — | — | Future work (roadmap item 1) |
| 10 | Learned thresholds + false-alarm measurement | — | — | Future work (roadmap item 2) |
| 11 | Clinical pilot under NDA | — | — | Future work (roadmap item 3) |
| 12 | Real NAC/SDN integration | — | — | Future work (roadmap item 4) |
