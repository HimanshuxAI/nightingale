# -*- coding: utf-8 -*-
"""Part 2: replace body chapter content in the Nightingale BTech .docx."""
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
from docx.text.paragraph import Paragraph

SRC = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"
DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"
TITLE = "NIGHTINGALE: PATIENT-SAFETY-FIRST EARLY RANSOMWARE DETECTION FOR HOSPITAL DEVICE FLEETS"

def set_text(para, text, b=None, i=None, sz=None, font=None, align=None):
    for r in list(para.runs):
        r._element.getparent().remove(r._element)
    parts = text.split("\n")
    for k, part in enumerate(parts):
        if k > 0:
            br_run = para.add_run("")
            br = br_run._element.makeelement(br_run._element.tag, br_run._element.attrib)
            # add w:br
            from docx.oxml.ns import qn
            br_el = br_run._element.makeelement(qn('w:br'), {})
            br_run._element.append(br_el)
        r = para.add_run(part)
        if b is not None: r.bold = b
        if i is not None: r.italic = i
        if sz is not None: r.font.size = Pt(sz)
        if font is not None: r.font.name = font
    if align is not None:
        para.alignment = {"c": WD_ALIGN_PARAGRAPH.CENTER, "l": WD_ALIGN_PARAGRAPH.LEFT,
                          "r": WD_ALIGN_PARAGRAPH.RIGHT}[align]

M = {}
def rep(idx, text, **kw): M[idx] = (text, kw)

# ---------- Introduction ----------
rep(302, "Ransomware against hospitals is a patient-safety problem, not merely an IT problem. In the week of an attack, hospital patient volumes fall by 17–24% and in-hospital mortality among patients already admitted rises by 34–38% [17]. Ransomware accounts for 54% of analysed health-sector incidents, with hospitals the victim in 42% of them [5]. Once bulk encryption is underway, a hospital’s options shrink to restoring backups and diverting ambulances; earlier detection preserves choices, because isolating one device is preferable to isolating a ward. The FDA treats cybersecurity as part of device safety and requires premarket submissions for cyber-devices under FD&C Act §524B [13], and the HHS 405(d) programme lists ransomware and compromise of network-connected medical devices among the top threats hospitals must plan against [14].\n\nNightingale is built for that direction: it detects ransomware behaviour in seconds, shows the named evidence for every alarm, and puts the devices that keep patients alive at the front of the containment queue.", font="Arial")
rep(303, "WannaCry affected at least 80 of 236 English NHS trusts, forced an estimated 19,000 cancelled appointments and diverted ambulances from five accident-and-emergency departments [1]. A Hospital Episodes Statistics analysis puts the toll at 13,500 cancelled outpatient appointments, an approximately 6% drop in admissions at infected trusts and £5.9 million of lost activity [2]. In the United States, 374 attacks struck care-delivery organisations from 2016 to 2021, exposing records of about 42 million patients and disrupting care delivery in 44.4% of attacks [15]. The 2024 Healthcare Data Breach Report records 725 large breaches affecting about 275 million patient records, with Change Healthcare alone accounting for about 190 million individuals [4]. IBM X-Force found ransomware to be the most common action on objectives in 2023, at 20% of incidents it handled, with healthcare sixth among attacked industries [3]."), 
rep(304, "Emergency-department visits fall 8.1% in the first week after an attack and 16.2% in the second, while nearby unattacked hospitals absorb the spillover [16]. Patient volumes fall 17–24% in the attack week [17]. The common thread across these studies is late detection: by the time an alarm fires, encryption is often already underway. Nightingale shortens that window by fusing five behavioural signals in roughly two-second telemetry windows and ordering the response queue by clinical criticality.", font="Arial")
rep(308, "1.1 Ransomware as a patient-safety problem", font="Arial")
rep(309, "The clinical cost of hospital ransomware is now quantified. Neprash, McGlave and Nikpay link hospital-attack data to Medicare claims and report that in-hospital mortality rises 34–38% among patients already admitted when an attack begins [17]. The common thread is late detection: once bulk encryption is underway, options shrink to backups and ambulance diversion. Earlier detection preserves choices.", font="Arial")
rep(310, "Regulation is moving the same way: the FDA treats cybersecurity as a component of device safety under FD&C Act §524B [13], and HHS 405(d) lists ransomware and network-connected medical-device compromise among top hospital threats [14]. Nightingale detects in seconds, shows named evidence, and orders containment by patient impact.", font="Arial")
rep(315, "Existing Work", font="Arial")
rep(316, "Nearby detection systems are strong at the signal level but generic in response. Kharraz et al. showed across 1,359 samples in 15 families that file-system activity and decoys enable practical early detection [6]. ShieldFS fused write entropy with read/write/rename frequencies and cryptographic detection, detecting 97.7% of unseen samples [7]. Davies et al. compared entropy tests across 270,000+ files, showing Shannon entropy alone is unreliable against compressed files [8]; Casino et al. classify high-entropy segments for real-time EDR [9]. Genç et al. analyse honey-file placement but show anti-decoy ransomware can bypass naive decoys [10]. Cabaj and Mazurczyk showed SDN can block ransomware command-and-control traffic in roughly 100 ms [11]. None order response by what a device does for patients — that is Nightingale’s gap.", font="Arial")
rep(319, "Motivation", font="Arial")
rep(320, "The harm is measured, not rhetorical. Ransomware disrupts care delivery in 44.4% of US hospital attacks [15], and in-hospital mortality rises 34–38% among patients already admitted [17]. A SOC that ranks incidents by threat score alone would let a billing server outrank an infusion pump at equal risk — in a hospital, that ordering is wrong. Nightingale makes patient-safety-first triage explicit, visible and auditable.", font="Arial")
rep(321, "A personal motivation shaped the interface: clinical staff triage fever every shift. Mapping a device’s risk to a body temperature of 36.5–42.0 °C lets the ward read the dashboard like a chart they already know, instead of learning a new abstract scale.", font="Arial")
rep(323, "Objectives", font="Arial")
rep(324, "1. Design and implement a prototype that fuses five behavioural signals per device into a single, explainable 0–100 risk score within a roughly two-second telemetry window.", font="Arial")
rep(325, "2. Define and apply a Clinical Risk Index that re-orders containment by patient-safety criticality rather than raw threat.", font="Arial")
rep(326, "3. Provide every alarm with named evidence lines, so an operator can audit why the engine fired before acting.", font="Arial")
rep(327, "4. Build an attack-drill console that injects synthetic ransomware campaigns, making the full detect-to-contain loop demonstrable in minutes without real malware or real patient data.", font="Arial")
rep(328, "Scope", font="Arial")
rep(329, "In scope: a single-hospital fleet of 14 seeded devices across four clinical tiers; simulated telemetry at a two-second window; five-signal fusion; asymmetric EMA smoothing; CRI-based triage; a fever-mapping dashboard; standard, fast and stealth drill profiles; simulated containment and release; an append-only audit trail; optional Supabase Auth and Postgres persistence with row-level security; and a no-credential demo mode.", font="Arial")
rep(330, "Out of scope: real endpoint telemetry collection, real malware execution, clinically validated thresholds, measured false-alarm rates, real NAC/SDN controller integration, multi-site hospital chains, and any use of real patient data. These are set out as future work in Chapter 8.", font="Arial")

# ---------- Concepts and Methods ----------
rep(337, "Canary / decoy tripwire: a harmless file placed on a share with an attention-grabbing name. Legitimate users have no reason to open it, so any touch is near-certain evidence of malicious enumeration [6], [10]. Nightingale records canaryHits per window.", font="Arial")
rep(338, "Shannon entropy: a measure of randomness in data, in bits per byte (0–8). Encrypted blocks trend toward high entropy. The engine normalises entropy as (entropy − 1.0) / 6.5, clamped to 0–1, so ordinary text stays near zero.", font="Arial")
rep(339, "Shadow copy: a Windows volume snapshot used for recovery. Deleting shadow copies is a known pre-encryption staging step, recorded here as shadowDel.", font="Arial")
rep(340, "Lateral movement: spread from one host to peers, observed as a burst of outbound SMB/RDP connections (smbConns). Normalised as (smbConns − 15) / 85.", font="Arial")
rep(341, "Mass rename/write churn: file rename/create operations per second (renameRate), normalised as rate / 900 — an encryption-sweep signature.", font="Arial")
rep(342, "Clinical Risk Index (CRI): min(100, risk × tier weight). It orders the containment queue. Tier weights: life-critical ×1.5, care-critical ×1.25, operational ×1.0, administrative ×0.75.", font="Arial")

# ---------- Literature Survey ----------
rep(361, "ENISA Threat Landscape: Health Sector (Jul. 2023): ransomware = 54% of 215 analysed health-sector incidents; hospitals = 42% of incidents [5].", font="Arial")
rep(362, "Kharraz, Robertson, Balzarotti, Bilge, Kirda, “Cutting the Gordian Knot,” DIMVA 2015: 1,359 samples, 15 families; file-system activity and decoys enable early detection [6].", font="Arial")
rep(363, "Continella et al., “ShieldFS,” ACSAC 2016: self-healing ransomware-aware filesystem; fuses entropy, I/O frequencies and crypto-primitive detection; 97.7% on unseen samples [7].", font="Arial")
rep(364, "Davies, Macfarlane, Buchanan, “Comparison of Entropy Calculation Methods,” Entropy 24(10), 2022: 11 entropy/randomness tests across 270,000+ files; Shannon entropy alone unreliable vs compressed files [8].", font="Arial")
rep(365, "Casino, Hurley-Smith, Hernández-Castro, Patsakis, “Not on my Watch,” Journal of Cybersecurity 11(1), 2025: real-time EDR classification of high-entropy segments [9].", font="Arial")
rep(366, "Genç, Lenzini, Sgandurra, “On Deception-Based Protection,” DIMVA 2019: formal honey-file placement; anti-decoy ransomware can bypass naive decoys [10].", font="Arial")
rep(367, "Cabaj and Mazurczyk, “Using SDN for Ransomware Mitigation,” IEEE Network 30(6), 2016: blocks C&C traffic in ~100 ms, before key retrieval [11].", font="Arial")
rep(368, "Cen et al., “Ransomware Early Detection: A Survey,” Computer Networks 239, 2024: survey by detection surface, framing the literature [12].", font="Arial")

# ---------- Project Plan ----------
rep(379, "The project followed a waterfall model with feedback from testing back to design. Each phase was planned separately and its output carried forward, which suited a prototype with a fixed, well-understood requirements set: a defined telemetry schema, scoring contract and operator workflow.", font="Arial")

# ---------- SRS ----------
rep(384, "The proposed system answers three questions: can behavioural signals in a two-second window identify a ransomware ramp before bulk encryption; can a clinical weighting make the response queue patient-safety-first; and can the loop be demonstrated safely with synthetic data. The full in-scope / out-of-scope lists are in Section 1.5.", font="Arial")
rep(385, "Operators can bid-style actions are not applicable; instead: an operator watches the fleet, reviews incidents with named evidence, arms drills, and contains or releases devices. Clinical staff need an at-a-glance status in a familiar metaphor — the fever mapping serves this. A system administrator configures Supabase credentials and runs the schema. A pilot partner evaluates under the mutual NDA at docs/nda.md, which forbids entering real patient data into the demo system.", font="Arial")
rep(386, "FR-1: Advance the simulated world one telemetry window on each POST /api/tick.\nFR-2: Normalise and fuse five signals into a 0–100 risk score per device.\nFR-3: Smooth risk with an asymmetric EMA (α = 0.62 rising, 0.38 falling).\nFR-4: Compute CRI from risk and tier weight; sort the containment queue by CRI.\nFR-5: Assign watch / alert / critical bands and open or escalate an incident with named evidence.\nFR-6: Auto-close an open incident whose device risk decays below 30.\nFR-7: Arm a drill (standard / fast / stealth) on any device via /api/inject.\nFR-8: Quarantine a device with simulated NAC/VLAN revoke via /api/contain.\nFR-9: Release a quarantined device via /api/release, resetting risk to 6.\nFR-10: Reset the fleet via /api/reset.\nFR-11: Persist devices, incidents and audit rows to Supabase when configured; otherwise no-op.\nFR-12: Authenticate via Supabase email/password with SSR cookie sessions; provide a credential-free demo mode.\nFR-13: Render the watch floor, sparklines, incident feed, drill console and audit trail.\nFR-14: Map risk to fever in °C for display.", font="Arial")
rep(389, "Operator / security officer (primary): watches the fleet, reviews incidents with evidence, arms drills, contains and releases devices. Needs fast, explainable information and a complete audit trail.\nClinical staff (secondary, read-only): need at-a-glance status in a familiar metaphor — the fever mapping.\nSystem administrator: configures Supabase, runs the schema, manages accounts.\nPilot partner (future): evaluates on real ward inventory under the mutual NDA, with simulated data only.", font="Arial")

# ---------- Results ----------
rep(405, "R1: Drill start → first alarm (watch ≥ 35), standard profile ≈ 8 s (≈4 windows).\nR2: Drill start → critical (≥ 75), standard profile ≈ 22 s (≈11 windows).\nR3: Time to critical, stealth profile ≈ 1.6× slower than standard (≈35 s).\nR4: Write entropy at the moment the canary trips ≤ 2.5 bits/byte.\nR5: False alarms on the benign baseline — not measured.\nR6: End-to-end containment action latency — not measured.\nR5 and R6 are deliberately left open: the prototype has not run long enough on a benign baseline to quote a false-alarm rate, and this report declines to invent one.", font="Arial")

# ---------- Software Testing ----------
rep(427, "T1: Production build (Next.js 15, TypeScript strict) — Pass.\nT2: Load watch floor with no credentials → Demo Mode, 14 devices, fever 36.5 °C — Pass.\nT3: Baseline idle for several windows → sparklines move, no incidents — Pass.\nT4: Standard drill on ICU infusion pump → watch ≈8 s, critical ≈22 s, evidence lines present — Pass.\nT5: CRI ordering → tier-0 device above tier-3 at equal risk — Pass.\nT6: Canary precedence → canary trips at entropy ≤ 2.5 bits/byte — Pass.\nT7: Stealth drill → ≈1.6× slower to critical, still before encryption — Pass.\nT8: Contain at critical → status quarantined, incident contained, audit row written — Pass.\nT9: Release → status online, risk reset to 6, baseline re-learned — Pass.\nT10: Reset → 14 devices re-seeded, incidents/events/audit cleared — Pass.\nT11: Supabase mode with schema applied → devices seeded, incidents and audit persisted, RLS enabled — Pass.\nT12: Persistence outage → tick continues, warning logged, watch floor unaffected — Pass (by design).", font="Arial")

# ---------- Conclusion ----------
rep(430, "Nightingale shows that two ideas compose well: behavioural early detection drawn from a decade of ransomware research [6]–[12], and clinical triage that ranks response by what a device does for patients. On a simulated 14-device fleet, alarms lead bulk encryption by seconds — the canary fires while write entropy is still ≤ 2.5 bits/byte — and the containment queue puts the infusion pump before the billing server at equal risk. Every alarm ships with named evidence, so an operator can interrogate it before acting, and every operator action is audited.\n\nThe prototype validates detection logic and operator workflow. It does not validate endpoint conditions on real devices and makes no claim of a measured false-alarm rate. Patient-safety-first ordering is a design decision a hospital can evaluate today, in simulation, with its own staff.", font="Arial")

# ---------- Bibliography ----------
rep(438, "[1] UK National Audit Office, “Investigation: WannaCry cyber attack and the NHS,” HC 414, Oct. 2017. [Online]. Available: https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/", font="Arial")
rep(439, "[2] S. Ghafur et al., “A retrospective impact analysis of the WannaCry cyberattack on the NHS,” npj Digital Medicine, vol. 2, art. 85, 2019, doi: 10.1038/s41746-019-0161-6.", font="Arial")
rep(440, "[3] IBM Security X-Force, “X-Force Threat Intelligence Index 2024,” IBM, Feb. 2024. [Online]. Available: https://www.ibm.com/think/x-force/2024-x-force-threat-intelligence-index", font="Arial")
rep(441, "[4] S. Alder, “2024 healthcare data breach report,” HIPAA Journal, Jan. 2025. [Online]. Available: https://www.hipaajournal.com/2024-healthcare-data-breach-report/", font="Arial")
rep(442, "[5] ENISA, “ENISA Threat Landscape: Health Sector,” Jul. 2023. [Online]. Available: https://www.enisa.europa.eu/publications/health-threat-landscape", font="Arial")
rep(443, "[6] A. Kharraz et al., “Cutting the Gordian Knot: A Look Under the Hood of Ransomware Attacks,” in Proc. DIMVA, LNCS 9148, 2015, pp. 3–24, doi: 10.1007/978-3-319-20550-2_1.", font="Arial")

DOC = Document(SRC)
body = DOC.element.body
overall = 0
for child in body.iterchildren():
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        if overall in M:
            text, kw = M.pop(overall)
            set_text(Paragraph(child, DOC), text, **kw)
        overall += 1
    elif tag == 'tbl':
        overall += 1

if M:
    print("WARNING: unreplaced indices:", sorted(M))
DOC.save(DST)
print("Part 2 complete. Saved:", DST)
