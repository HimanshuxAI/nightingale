# Verified Sources — "Nightingale: Patient-Safety-First Early Ransomware Detection for Hospital Networks"

Verification date: 2026-11-20. Every source below was opened/confirmed via websearch or webfetch
(publisher DOI page, official report page, arXiv, or journal site). No invented citations.

---

## WannaCry / NHS impact

1. **Investigation: WannaCry cyber attack and the NHS** — National Audit Office (Comptroller and Auditor General, Sir Amyas Morse) — NAO report, published 27 Oct 2017 (HC 414, session 2017–19, printed 25 April 2018) — https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/ (PDF: https://www.nao.org.uk/wp-content/uploads/2017/10/Investigation-WannaCry-cyber-attack-and-the-NHS.pdf)
   - Supports: ≥80 of 236 English trusts affected (34 infected + locked out); 603 primary care/other NHS orgs infected incl. 595 GP practices; 6,912 appointments identified as cancelled, >19,000 estimated cancelled in total; ambulance diversions at 5 A&Es; unpatched/unsupported Windows as cause.

2. **A retrospective impact analysis of the WannaCry cyberattack on the NHS** — S. Ghafur, S. Kristensen, K. Honeyford, G. Martin, A. Darzi, P. Aylin — npj Digital Medicine 2:85, 2019 — https://www.nature.com/articles/s41746-019-0161-6 (DOI: 10.1038/s41746-019-0161-6)
   - Supports: peer-reviewed Hospital Episodes Statistics analysis of WannaCry: 13,500 outpatient appointments cancelled at infected trusts; ~6% drop in total admissions at infected hospitals; £5.9m lost activity; corroborates the NAO's ~19,000 cancellation estimate.

## Healthcare ransomware statistics (2023–2024)

3. **X-Force Threat Intelligence Index 2024** — IBM Security X-Force — IBM report, February 2024 — https://www.ibm.com/think/x-force/2024-x-force-threat-intelligence-index
   - Supports: ransomware was the most common action on objectives (20% of incidents X-Force responded to in 2023); healthcare the 6th most-attacked industry (6.3% of attacks); 69.6% of attacks hit critical-infrastructure organizations; valid-account abuse in 59% of healthcare incidents.

4. **2024 Healthcare Data Breach Report** — Steve Alder, The HIPAA Journal (analysis of HHS OCR breach portal data) — HIPAA Journal, 30 Jan 2025 — https://www.hipaajournal.com/2024-healthcare-data-breach-report/ (rolling statistics page: https://www.hipaajournal.com/healthcare-data-breach-statistics/)
   - Supports: 725 large breaches (≥500 records) reported to OCR in 2024 (third straight year >700); 275 million patient records breached in 2024 (82% of the US population); Change Healthcare ransomware breach 190M individuals (BlackCat); OCR-reported 278% increase in healthcare ransomware attacks Jan 2018–Sep 2023; hacking/IT = 81.2% of 2024 breaches.

5. **ENISA Threat Landscape: Health Sector (January 2021 – March 2023)** — European Union Agency for Cybersecurity (ENISA) — ENISA report, July 2023 — https://www.enisa.europa.eu/publications/health-threat-landscape (PDF: https://www.enisa.europa.eu/sites/default/files/publications/Health%20Threat%20Landscape.pdf)
   - Supports: first EU health-sector threat landscape; ransomware = 54% of 215 analysed health-sector incidents; hospitals = 42% of incidents; 43% of ransomware incidents coupled with data breach/theft; patient care affected in documented hospital cases (ED closure, diverted ambulances, cancelled operations).

## Ransomware detection techniques (peer-reviewed)

6. **Cutting the Gordian Knot: A Look Under the Hood of Ransomware Attacks** — Amin Kharraz, William Robertson, Davide Balzarotti, Leyla Bilge, Engin Kirda — DIMVA 2015 (LNCS 9148, pp. 3–24, Springer) — https://doi.org/10.1007/978-3-319-20550-2_1
   - Supports: foundational study (1,359 samples, 15 families) showing abnormal file-system/I/O activity (MFT changes, mass encryption/deletion patterns) and decoy resources enable practical early detection of ransomware.

7. **ShieldFS: A Self-healing, Ransomware-aware Filesystem** — Andrea Continella, Alessandro Guagnelli, Giovanni Zingaro, Giulio De Pasquale, Alessandro Barenghi, Stefano Zanero, Federico Maggi — ACSAC 2016 (pp. 336–347, ACM) — https://doi.org/10.1145/2991079.2991110
   - Supports: runtime ransomware detection combining entropy of write operations, read/write/rename frequencies and cryptographic-primitive detection, with automatic file rollback; 97.7% detection on unseen samples.

8. **Comparison of Entropy Calculation Methods for Ransomware Encrypted File Identification** — Simon R. Davies, Richard Macfarlane, William J. Buchanan — Entropy (MDPI) 24(10):1503, 2022 — https://doi.org/10.3390/e24101503 (open access; also arXiv:2210.13376)
   - Supports: evaluation of 11 entropy/randomness tests (incl. Shannon) across 270,000+ files (NapierOne dataset) for detecting ransomware-encrypted files; Shannon entropy alone is unreliable vs compressed files — the standard reference for entropy-based detection design.

9. **Not on my watch: ransomware detection through classification of high-entropy file segments** — F. Casino, D. Hurley-Smith, J. Hernández-Castro, C. Patsakis — Journal of Cybersecurity 11(1):tyaf009 (Oxford), 2025 — https://doi.org/10.1093/cybsec/tyaf009 (verified via Semantic Scholar + Oxford Academic)
   - Supports: recent state-of-the-art in classifying encrypted vs compressed high-entropy file segments for real-time EDR integration (accuracy 0.95–1.0 on 64 KB streams). [Verified alternative to #8 if only one entropy paper is needed.]

10. **On Deception-Based Protection Against Cryptographic Ransomware** — Ziya Alper Genç, Gabriele Lenzini, Daniele Sgandurra — DIMVA 2019 (LNCS 11550, pp. 219–239, Springer) — https://doi.org/10.1007/978-3-030-22038-9_11 (open PDF: https://orbilu.uni.lu/bitstream/10993/40579/1/dimva2019_GLS.pdf)
    - Supports: formal analysis of decoy/honey-file placement strategies for ransomware detection, robustness metrics, and demonstration that anti-decoy ransomware can bypass naive decoys — the verified Genç et al. decoy paper.

11. **Using Software-Defined Networking for Ransomware Mitigation: The Case of CryptoWall** — Krzysztof Cabaj, Wojciech Mazurczyk — IEEE Network 30(6):14–20, 2016 — https://doi.org/10.1109/MNET.2016.1600110NM (preprint: arXiv:1608.06673)
    - Supports: network-based (SDN/OpenFlow) real-time ransomware mitigation by blocking C&C communication before key retrieval; reaction time (~100 ms) far below public-key download time (3.8–27.4 s) — basis for network-level early detection/mitigation.

12. **Ransomware early detection: A survey** — Mingcan Cen, Frank Jiang, Xingsheng Qin, Qinghong Jiang, Robin Doss — Computer Networks 239:110138 (Elsevier), 2024 (online 7 Dec 2023) — https://doi.org/10.1016/j.comnet.2023.110138
    - Supports: most recent dedicated survey of *early* ransomware detection (categories, evolution, datasets, future directions) — anchors the literature-review framing.

## Medical device / clinical cybersecurity context

13. **Cybersecurity in Medical Devices: Quality System Considerations and Content of Premarket Submissions (Final Guidance)** — U.S. FDA (CDRH/CBER) — FDA final guidance, issued 27 Sept 2023 (Docket FDA-2021-D-1158; Federal Register 88 FR 66458) — https://www.federalregister.gov/documents/2023/09/27/2023-20955/cybersecurity-in-medical-devices-quality-system-considerations-and-content-of-premarket-submissions (FDA device-cyber page: https://www.fda.gov/medical-devices/medical-device-cybersecurity)
    - Supports: FDA position that cybersecurity is part of device safety; premarket cyber-device requirements (SBOM, postmarket plans) under FD&C Act §524B; notes cyber incidents have "rendered medical devices and hospital networks inoperable." (Superseded by updated final guidances of 27 June 2025 / Feb 2026 — same docket.)

14. **Health Industry Cybersecurity Practices: Managing Threats and Protecting Patients (HICP), 2023 Edition** — HHS 405(d) Program & Health Sector Coordinating Council (public–private task group) — HHS publication, 17 April 2023 — https://405d.hhs.gov/cornerstone/hicp (main PDF: https://405d.hhs.gov/Documents/HICP-Main-508.pdf)
    - Supports: voluntary consensus practices under Cybersecurity Act of 2015 §405(d); top-5 threats include ransomware and attacks on network-connected medical devices; 10 cybersecurity practices (endpoint, network mgmt, medical-device security, incident response) sized for small-to-large hospitals.

## Ransomware impact on patient care / hospital operations (peer-reviewed)

15. **Trends in Ransomware Attacks on US Hospitals, Clinics, and Other Health Care Delivery Organizations, 2016-2021** — Hannah T. Neprash, Claire C. McGlave, Drew A. Cross, Beth A. Virnig, Michael A. Puskarich, Jared D. Huling, Alan Z. Rozenshtein, Sayeh S. Nikpay — JAMA Health Forum 3(12):e224873, 2022 — https://jamanetwork.com/journals/jama-health-forum/fullarticle/2799961 (DOI: 10.1001/jamahealthforum.2022.4873)
    - Supports: 374 ransomware attacks on US health delivery orgs 2016–2021 (annual count 43→91), PHI of ~42M patients exposed; 44.4% disrupted care delivery (EHR downtime 41.7%, cancellations 10.2%, ambulance diversion 4.3%).

16. **Ransomware Attacks, ED Visits and Inpatient Admissions in Targeted and Nearby Hospitals** — Rahi Abouk, David Powell — JAMA 331(24):2129–2131 (research letter), 2024 — https://doi.org/10.1001/jama.2024.7752
    - Supports: California 2014–2020, 8 disruptive attacks on 15 hospitals: ED visits −8.1% and admissions −8.2% in week 1, −16.2%/−16.6% in week 2, recovery within ~8 weeks; ED visits rose up to ~7% at nearby unattacked hospitals (spillover).

17. **Hacked to Pieces? The Effects of Ransomware Attacks on Hospitals and Patients** — Hannah Neprash, Claire McGlave, Sayeh Nikpay — American Economic Journal: Economic Policy 18(1):256–281, Feb 2026 (earlier SSRN working paper, 2023) — https://doi.org/10.1257/pol.20240594 (AEA page: https://www.aeaweb.org/articles?id=10.1257%2Fpol.20240594; SSRN 2023 preprint: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4579292)
    - Supports: THREAT database of hospital ransomware attacks linked to Medicare claims: hospital volume falls 17–24% in first attack week with recovery in ~3 weeks; in-hospital mortality increases 34–38% among patients already admitted when an attack begins — the key patient-safety evidence.

---

## Cross-checked counts

- Main list: 17 verified sources (16 requested + 1 supplementary entropy paper, #9; all independently verified).

## Unverified / excluded (could not confirm existence — do NOT cite)

- **"Invoke, Encipher, Exfiltrate" (attributed to Genç et al.)** — no such published title found in searches (author's own publication list at ziyagenc.com does not list it). Use Genç et al., DIMVA 2019 (#10) instead; also verified in the same line of work: Genç, Lenzini, Ryan, "Security Analysis of Key Acquiring Strategies Used by Cryptographic Ransomware," CECC 2018, https://doi.org/10.1145/3277570.3277577.
- **"Post-Modern OS" decoy paper (Genç et al.)** — not independently verified in this session; excluded.
- **"Candice W. Chern et al. Medicare ransomware 2020–2022 in JAMA"** — no matching JAMA/peer-reviewed study found; excluded. The verified peer-reviewed hospital-outcomes studies are #15, #16, #17.
- **BMJ news item O'Dowd 2017 (j2357) and BMJ editorial "WannaCry—a year on" (k2381)** — both exist and verify (https://doi.org/10.1136/bmj.j2357; https://doi.org/10.1136/bmj.k2381) but were not needed in the main list; available as extra NHS-impact citations if desired.
