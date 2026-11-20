# Nightingale: Patient-Safety-First Early Ransomware Detection for Hospital Device Fleets

[Team — add names]

## Abstract

Ransomware against hospitals is a patient-safety problem: in the week of an attack, hospital volumes fall 17–24%, and in-hospital mortality among already-admitted patients rises 34–38%. Alarms ranked by threat score alone let a billing server outrank an infusion pump. We present Nightingale, a prototype early-detection watch floor for hospital device fleets. Each device reports a ~2 s telemetry window in which five behavioural signals (canary tripwires, Shannon entropy of fresh writes, shadow-copy deletions, SMB/RDP bursts, rename churn) are fused into a 0–100 risk score smoothed by an asymmetric exponential moving average. A Clinical Risk Index multiplies risk by a clinical tier weight, so containment follows patient-safety impact, not raw threat. In drills on a 14-device simulated fleet, the standard profile crossed the watch threshold ~8 s after arming and reached critical at ~22 s; canary files tripped while write entropy was still ≤2.5 bits/byte, so alarms preceded bulk encryption. Telemetry, thresholds, and containment remain simulated and clinically unvalidated.

## 1. Introduction

This paper presents Nightingale, a prototype early-detection watch floor for hospital device fleets in which response is ordered by patient-safety criticality rather than by raw threat score. Every monitored device reports a ~2 s telemetry window. Five behavioural signals are fused into a 0–100 risk score per window, and a Clinical Risk Index (CRI) multiplies that score by a tier weight reflecting what the device does for patients. An ICU infusion pump therefore outranks a billing PC at equal risk, and the containment queue follows. The motivation is measured, not rhetorical. Ransomware accounts for 54% of analysed health-sector incidents in the EU threat landscape, and hospitals alone are the victim in 42% of them [1]. Among patients already admitted when an attack begins, in-hospital mortality rises by 34–38% [2].

The clinical cost of hospital ransomware is quantified across health systems. WannaCry disrupted at least 80 of 236 English NHS trusts, forced an estimated 19,000 cancelled appointments, and diverted ambulances from five accident-and-emergency departments [3]. Analysis of Hospital Episode Statistics puts the toll at 13,500 cancelled outpatient appointments, a ~6% admissions drop at infected trusts, and £5.9 million of lost activity [4]. The United States shows the same pattern: 725 large breaches exposed about 276 million patient records in 2024 [5]; ransomware was the top attack action in 20% of incidents IBM X-Force handled in 2023, with healthcare sixth among attacked industries [6]; and 374 attacks struck US care-delivery organisations from 2016 to 2021, exposing records of about 42 million patients and disrupting care delivery in 44.4% of attacks [7]. Emergency-department visits fall 8.1% in the week after an attack and 16.2% in the second week, while nearby unattacked hospitals absorb the spillover [8]. Patient volumes fall 17–24% in the attack week [2].

Late detection is the common thread. Once bulk encryption is underway, a hospital's options shrink to restoring backups and diverting ambulances; earlier detection preserves choices, because isolating one device beats isolating a ward. Regulation pushes the same way: the FDA treats cybersecurity as a component of device safety and requires premarket cybersecurity submissions for cyber-devices under FD&C Act §524B [9], and the HHS 405(d) program lists ransomware and compromise of network-connected medical devices among the top threats hospitals must plan against [10]. Nightingale is built for that direction: detect in seconds, show the evidence, and put the devices that keep patients alive at the front of the containment queue.

## 2. Related Work

Cen et al. survey early ransomware detection by detection surface [11]. Three surfaces matter here. Kharraz et al. showed across 1,359 samples in 15 families that abnormal file-system activity and decoy resources support practical early detection [12]. ShieldFS fused write entropy, read/write/rename frequencies, and cryptographic-primitive detection inside a self-healing filesystem, detecting 97.7% of unseen samples [13]. Entropy remains the workhorse signal: Davies et al. compared eleven randomness tests across 270,000+ files and mapped where Shannon entropy succeeds and where compression defeats it [14]; Casino et al. classify high-entropy file segments for real-time EDR use [15]. Deception has its own literature: Genç et al. analyse honey-file placement formally and show that anti-decoy ransomware bypasses naive decoy deployments [16]; for that reason, Nightingale treats canary trips as one fused signal among five, never the sole containment trigger. On the response side, Cabaj and Mazurczyk showed that software-defined networking can block ransomware command-and-control traffic within roughly 100 ms, fast enough to act before key material is retrieved [17].

Nightingale composes these signal families into one explainable per-device score and adds what the cited systems lack: containment ordered by clinical criticality.

## 3. Method

### 3.1 System Architecture

Nightingale runs as a single Next.js 15 application: a React 19 front end and a Node/TypeScript back end implemented as App Router API routes. The browser polls an API route every two seconds; each poll advances the server-side world one telemetry window and runs the detection engine over every device. Live state is an in-memory fleet of 14 seeded devices spanning four clinical tiers.

Persistence is best-effort: devices, incidents, and an append-only audit log go to Supabase Postgres when configured, and every call is wrapped so a database outage degrades history, never the watch floor. Supabase Auth provides email/password sign-in with server-side cookie sessions via @supabase/ssr, and row-level security is enabled on all three tables.

A drill console injects synthetic campaigns (standard, fast, stealth) into any device. One-click containment simulates a NAC/VLAN revoke. In production this action would call a network-access-control or SDN controller API; feasibility is established by SDN-based ransomware mitigation with measured reaction times of roughly 100 ms [17].

### 3.2 Detection Model

Each window carries five signals, normalised to 0–1 against per-signal baselines. Table I lists them with weights and the evidence behind each.

**Table I. Fused behavioural signals (weights sum to 1.0).**

| Signal | Weight | Rationale |
|---|---|---|
| Canary tripwire touch | 0.32 | Decoy files scattered across shares; any touch is near-certain evidence of malicious enumeration [12], [16] |
| Shannon entropy of freshly written blocks | 0.24 | Ciphertext profile of bulk encryption [13], [14] |
| Shadow-copy/backup deletions | 0.18 | Pre-encryption staging behaviour [12] |
| SMB/RDP connection bursts | 0.12 | Lateral movement toward peer hosts [citation needed] |
| Mass file-rename/write churn | 0.14 | Encryption sweep signature [12] |

The weighted sum, scaled to 0–100, is smoothed by an asymmetric exponential moving average: α = 0.62 on rises, α = 0.38 on decay. Escalation is fast, so attack behaviour reaches the watch band within a few windows, while a single noisy window decays quietly. Bands are watch ≥35, alert ≥55, and critical ≥75. Every alarm ships with named evidence lines (for example, "canary tripwire broken, 3 decoy files touched"), so an operator can audit why the engine fired. Clinical staff will not act on a score they cannot interrogate.

### 3.3 Clinical Triage

The Clinical Risk Index is CRI = min(100, risk × tier weight). Table II defines the tiers.

**Table II. Clinical tiers and containment priority.**

| Tier | Class | Examples | Weight |
|---|---|---|---|
| 0 | Life-critical | Infusion pumps, ventilators, patient monitors | ×1.5 |
| 1 | Care-critical | EHR, PACS, lab systems, ultrasound | ×1.25 |
| 2 | Operational | Pharmacy dispensing, nurse stations | ×1.0 |
| 3 | Administrative | Billing, admissions, back-office shares | ×0.75 |

The containment queue sorts by CRI, not raw risk. At a risk score of 60, an infusion pump scores CRI 90 while a billing server scores 45; when an operator can contain one device at a time, the pump goes first. Prioritising life-critical devices follows the FDA's device-safety position [9] and the medical-device practices in the HHS HICP [10].

The interface borrows from clinical practice. Risk maps to a per-device temperature, fever = 36.5 + 5.5·(risk/100) °C, spanning 36.5–42.0 °C. Ward staff triage fevers every shift; the watch floor should read like the charts they already know.

## 4. Results

Drills ran against the 14-device simulated fleet at a two-second window. Table III reports the measured timings; R1–R4 are measured values from the prototype, R5–R6 are open slots.

**Table III. Drill measurements.**

| # | Metric | Value |
|---|---|---|
| R1 | Drill start → first alarm (watch ≥35), standard profile | ~8 s (≈4 windows) |
| R2 | Drill start → critical (≥75), standard profile | ~22 s (≈11 windows) |
| R3 | Time to critical, stealth profile | ≈1.6× slower than standard (≈35 s) |
| R4 | Write entropy at the moment the canary trips | ≤2.5 bits/byte |
| R5 | False alarms on the benign baseline | [to be measured] |
| R6 | End-to-end containment action latency | [to be measured] |

Three observations. First, R1: the first alarm lands within four windows of arming the drill. Second, R4 is the result that matters most. The canary fires while write entropy is still ≤2.5 bits/byte, a level the entropy channel alone would not flag as ciphertext [14]. The alarm therefore precedes bulk encryption: deception catches the intent, and entropy later confirms the act. Third, R3: the stealth profile stretches the ramp ~1.6× and detection still leads encryption, the early-warning property a hospital actually needs. R5 and R6 remain open; the prototype has not run long enough on a benign baseline to quote a false-alarm rate, and we decline to invent one.

## 5. Discussion

At two-second windows, ~8 s to first alarm means the pipeline from endpoint agent to engine must complete in seconds. EMA smoothing tolerates transport jitter, since a missed window moves the score by a fraction. Explainability earned its cost: every alarm carried named evidence, which let us separate a canary-led alarm (treat as confirmed) from an entropy-led one (verify against compression first, since compressed writes can masquerade as ciphertext [14]).

The triage claim is observable in the prototype: a drill on an infusion pump escalates to the top of the containment queue with a "CLINICAL PRIORITY" tag, while the identical drill on an administrative device sits lower. No real patient data exists anywhere in the system; the fleet is synthetic by design, which keeps the path to a clinical pilot free of privacy exposure.

**Limitations.** We state them plainly.

1. Telemetry is simulated. The prototype validates detection logic and operator workflow, not endpoint conditions on real devices; a lightweight OS agent is future work.
2. Thresholds and weights are hand-tuned. No clinical-field validation has occurred, and R5 (false-alarm rate) is unmeasured.
3. Individual signals have known confounders. Compression defeats raw Shannon entropy [14], and anti-decoy malware can evade naive honey-file deployments [16]. Fusion lowers both risks without eliminating either.
4. Containment is simulated. Production requires integration with NAC or SDN APIs [17] plus fail-safe rollback, neither of which exists in the prototype.
5. Row-level security is prototype-grade: a single coarse policy grants all authenticated users full access to the three tables, with per-role policies deferred.
6. Scope is a single hospital. Multi-site chains and shared-services organisations need their own evaluation.

## 6. Conclusion

Nightingale demonstrates that two ideas compose well: behavioural early detection drawn from a decade of ransomware research [11]–[16], and clinical triage that ranks response by what a device does for patients. On a simulated fleet, alarms lead bulk encryption by seconds, and the containment queue puts the infusion pump before the billing server. The distance from prototype to practice is specific: a real OS agent streaming the same telemetry schema, field-tuned thresholds, a validated containment path through NAC/SDN APIs [17], and a clinical pilot under the project's mutual NDA. The contribution stands independent of that distance: patient-safety-first ordering is a design decision hospitals can evaluate today, in simulation, with their own staff.

## References

[1] ENISA, "ENISA Threat Landscape: Health Sector," European Union Agency for Cybersecurity, Jul. 2023. [Online]. Available: https://www.enisa.europa.eu/publications/health-threat-landscape

[2] H. Neprash, C. McGlave, and S. Nikpay, "Hacked to pieces? The effects of ransomware attacks on hospitals and patients," *American Economic Journal: Economic Policy*, vol. 18, no. 1, pp. 256–281, 2026, doi: 10.1257/pol.20240594.

[3] UK National Audit Office, "Investigation: WannaCry cyber attack and the NHS," Report HC 414, Oct. 2017. [Online]. Available: https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/

[4] S. Ghafur et al., "A retrospective impact analysis of the WannaCry cyberattack on the NHS," *npj Digital Medicine*, vol. 2, art. 85, 2019, doi: 10.1038/s41746-019-0161-6.

[5] S. Alder, "2024 healthcare data breach report," HIPAA Journal, Jan. 2025. [Online]. Available: https://www.hipaajournal.com/2024-healthcare-data-breach-report/

[6] IBM Security X-Force, "X-Force Threat Intelligence Index 2024," IBM, Feb. 2024. [Online]. Available: https://www.ibm.com/think/x-force/2024-x-force-threat-intelligence-index

[7] H. T. Neprash et al., "Trends in ransomware attacks on US hospitals, clinics, and other health care delivery organizations, 2016–2021," *JAMA Health Forum*, vol. 3, no. 12, e224873, 2022, doi: 10.1001/jamahealthforum.2022.4873.

[8] R. Abouk and D. Powell, "Ransomware attacks, ED visits and inpatient admissions in targeted and nearby hospitals," *JAMA*, vol. 331, no. 24, pp. 2129–2131, 2024, doi: 10.1001/jama.2024.7752.

[9] U.S. Food and Drug Administration, "Cybersecurity in medical devices: Quality system considerations and content of premarket submissions," Final Guidance, Sep. 2023. [Online]. Available: https://www.federalregister.gov/documents/2023/09/27/2023-20955/cybersecurity-in-medical-devices-quality-system-considerations-and-content-of-premarket-submissions

[10] HHS 405(d) Program and Health Sector Coordinating Council, "Health Industry Cybersecurity Practices (HICP), 2023 Edition," Apr. 2023. [Online]. Available: https://405d.hhs.gov/cornerstone/hicp

[11] M. Cen et al., "Ransomware early detection: A survey," *Computer Networks*, vol. 239, art. 110138, 2024, doi: 10.1016/j.comnet.2023.110138.

[12] A. Kharraz, W. Robertson, D. Balzarotti, L. Bilge, and E. Kirda, "Cutting the Gordian knot: A look under the hood of ransomware attacks," in *Proc. DIMVA*, LNCS 9148, 2015, pp. 3–24, doi: 10.1007/978-3-319-20550-2_1.

[13] A. Continella et al., "ShieldFS: A self-healing, ransomware-aware filesystem," in *Proc. ACSAC*, 2016, pp. 336–347, doi: 10.1145/2991079.2991110.

[14] E. Davies, R. Macfarlane, and W. J. Buchanan, "Comparison of entropy calculation methods for ransomware encrypted file identification," *Entropy*, vol. 24, no. 10, art. 1503, 2022, doi: 10.3390/e24101503.

[15] R. Casino, D. Hurley-Smith, J. Hernández-Castro, and C. Patsakis, "Not on my watch: ransomware detection through classification of high-entropy file segments," *Journal of Cybersecurity*, vol. 11, no. 1, tyaf009, 2025, doi: 10.1093/cybsec/tyaf009.

[16] Z. A. Genç, G. Lenzini, and D. Sgandurra, "On deception-based protection against cryptographic ransomware," in *Proc. DIMVA*, LNCS 11550, 2019, pp. 219–239, doi: 10.1007/978-3-030-22038-9_11.

[17] K. Cabaj and W. Mazurczyk, "Using software-defined networking for ransomware mitigation: The case of CryptoWall," *IEEE Network*, vol. 30, no. 6, pp. 14–20, 2016, doi: 10.1109/MNET.2016.1600110NM.
