import pptxgen from "pptxgenjs";

const pptx = new pptxgen();

pptx.layout = "LAYOUT_16x9";

const C = {
  ink: "26190e",
  ink2: "6d5c47",
  sage: "58704a",
  amber: "c4841a",
  ember: "b4490f",
  crimson: "9e2b17",
  paper: "f4ede0",
  card: "fbf7ec",
  line: "d9cbae",
};

function titleSlide(text, subtitle) {
  const s = pptx.addSlide();
  s.background = { color: C.paper };
  s.addText(text, { x: 0.8, y: 2.0, w: 11.8, h: 1.2, fontFace: "Georgia", fontSize: 40, bold: true, color: C.ink, align: "left" });
  s.addText(subtitle, { x: 0.8, y: 3.3, w: 11.8, h: 0.8, fontFace: "Georgia", fontSize: 18, italic: true, color: C.ember, align: "left" });
  s.addText("Nightingale — Patient-Safety-First Ransomware Detection for Hospitals", { x: 0.8, y: 5.0, w: 11.8, h: 0.5, fontFace: "Courier New", fontSize: 10, color: C.ink2, align: "left" });
}

function contentSlide(headline, bullets, footnote) {
  const s = pptx.addSlide();
  s.background = { color: C.paper };
  s.addText(headline, { x: 0.8, y: 0.45, w: 11.8, h: 0.9, fontFace: "Georgia", fontSize: 30, bold: true, color: C.ink });
  bullets.forEach((b, i) => {
    s.addText(b, { x: 1.0, y: 1.6 + i * 0.55, w: 11.4, h: 0.5, fontFace: "Calibri", fontSize: 17, color: C.ink2, bullet: true });
  });
  if (footnote) {
    s.addText(footnote, { x: 0.8, y: 6.6, w: 11.8, h: 0.4, fontFace: "Courier New", fontSize: 9, color: C.ink2, italic: true });
  }
}

function diagramSlide(headline, boxes, footnote) {
  const s = pptx.addSlide();
  s.background = { color: C.paper };
  s.addText(headline, { x: 0.8, y: 0.45, w: 11.8, h: 0.9, fontFace: "Georgia", fontSize: 30, bold: true, color: C.ink });
  boxes.forEach((b) => {
    s.addShape("rect", { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: b.fill }, line: { color: C.line, width: 1 }, text: b.label, fontFace: "Calibri", fontSize: b.fs ?? 13, color: C.ink, align: "center", valign: "middle", margin: 0.15 });
    if (b.to) {
      s.addShape("line", { x: b.x + b.w / 2, y: b.y + b.h, w: 0, h: b.to.y - (b.y + b.h), line: { color: C.ink2, width: 1.5, headEndType: "triangle" } });
    }
  });
  if (footnote) s.addText(footnote, { x: 0.8, y: 6.6, w: 11.8, h: 0.4, fontFace: "Courier New", fontSize: 9, color: C.ink2, italic: true });
}

function twoColSlide(headline, leftTitle, leftBullets, rightTitle, rightBullets, footnote) {
  const s = pptx.addSlide();
  s.background = { color: C.paper };
  s.addText(headline, { x: 0.8, y: 0.45, w: 11.8, h: 0.9, fontFace: "Georgia", fontSize: 30, bold: true, color: C.ink });
  s.addText(leftTitle, { x: 0.8, y: 1.5, w: 5.2, h: 0.5, fontFace: "Georgia", fontSize: 18, bold: true, color: C.sage });
  leftBullets.forEach((b, i) => s.addText("• " + b, { x: 1.0, y: 2.1 + i * 0.45, w: 5, h: 0.4, fontFace: "Calibri", fontSize: 15, color: C.ink2 }));
  s.addText(rightTitle, { x: 6.8, y: 1.5, w: 5.2, h: 0.5, fontFace: "Georgia", fontSize: 18, bold: true, color: C.ember });
  rightBullets.forEach((b, i) => s.addText("• " + b, { x: 7.0, y: 2.1 + i * 0.45, w: 5, h: 0.4, fontFace: "Calibri", fontSize: 15, color: C.ink2 }));
  if (footnote) s.addText(footnote, { x: 0.8, y: 6.6, w: 11.8, h: 0.4, fontFace: "Courier New", fontSize: 9, color: C.ink2, italic: true });
}

// ── deck ─────────────────────────────────────────────────────────────────────
titleSlide(
  "Catch the fire\nwhile it's still a fever.",
  "Nightingale: patient-safety-first ransomware detection for hospital device fleets"
);

contentSlide(
  "The hospital ransomware problem is a patient-safety crisis",
  [
    "WannaCry (2017) hit ≥80/236 NHS trusts, cancelled ~19,000 appointments, diverted 5 A&Es [NAO 2017]",
    "374 attacks on US hospitals 2016–2021; 44% disrupted care delivery [Neprash 2022]",
    "In attack week: patient volumes fall 17–24%; in-hospital mortality rises 34–38% for admitted patients [Neprash 2026]",
    "ED visits drop 8–16% at attacked hospitals; spillover surges at nearby hospitals [Abouk 2024]",
    "Ransomware = 54% of health-sector incidents; hospitals are 42% of targets [ENISA 2023]",
  ],
  "Sources: NAO 2017; Neprash 2022/2026; Abouk 2024; ENISA 2023"
);

contentSlide(
  "Existing detection misses the clinical stakes",
  [
    "File-entropy & I/O models exist (ShieldFS, Kharraz 2015, Continella 2016) but treat every host equally",
    "Decoy/canary files proposed (Genç 2019) but not fused with entropy + shadow-copy + lateral signals",
    "SDN containment proven at ~100 ms reaction (Cabaj 2016) — but not wired to clinical triage",
    "HHS HICP 2023 & FDA 2023 guidance: ransomware & networked devices among top threats; cybersecurity = device safety",
    "Gap: no production system orders containment by patient-safety weight (ICU pump vs. billing PC)",
  ],
  "Sources: Kharraz 2015; Continella 2016; Genç 2019; Cabaj 2016; FDA 2023; HHS 2023"
);

contentSlide(
  "Nightingale: five fused signals → Clinical Risk Index → fever metaphor",
  [
    "Canary (0.32): decoy files across shares — one touch = near-certain tripwire",
    "Entropy (0.24): Shannon entropy of fresh writes — ciphertext ≈ 8 bits/byte; compression differs [Davies 2022; Casino 2025]",
    "Shadow (0.18): vssadmin / backup deletions — classic pre-encryption staging",
    "Lateral (0.12): SMB/RDP connection bursts — worm spreading before burn",
    "Rename (0.14): mass file-rename/create churn — encryption sweep signature",
  ],
  "Composite 0–100, asymmetric EMA (α↑=0.62, α↓=0.38); thresholds: watch≥35 alert≥55 critical≥75"
);

twoColSlide(
  "Clinical Risk Index: triage by patient harm, not raw threat",
  "Tier weights (CRI = risk × weight)",
  [
    "Tier 0 — Life-critical ×1.5: infusion pumps, ventilators, bedside monitors",
    "Tier 1 — Care-critical ×1.25: EHR core, PACS, lab systems, ultrasound",
    "Tier 2 — Operational ×1.0: pharmacy dispensers, nurse stations, OR scheduling",
    "Tier 3 — Administrative ×0.75: admissions desktops, billing, back-office NAS",
  ],
  "Fever metaphor",
  [
    "Risk 0–100 maps to body temperature 36.5–42.0 °C (36.5 + 5.5·risk/100)",
    "Dashboard reads like a patient chart — clinicians recognize it instantly",
    "Network fever = hottest device's temperature; ward profile = calm/watch/alert/critical",
    "One-click containment = simulated NAC VLAN revoke + full audit trail",
  ],
  "CRI queue always surfaces the ICU pump above the billing server"
);

diagramSlide(
  "Architecture: browser → Next.js API routes → engine/world → Supabase",
  [
    { x: 0.8, y: 1.8, w: 2.6, h: 1.0, fill: C.card, label: "Browser\nReact 19\nNext.js 15", fs: 14, to: { x: 0.8, y: 3.2 } },
    { x: 4.2, y: 1.8, w: 2.8, h: 1.0, fill: C.card, label: "API Routes\ntick / inject / contain\nrelease / auth", fs: 14, to: { x: 4.2, y: 3.2 } },
    { x: 8.0, y: 1.8, w: 2.8, h: 1.0, fill: C.card, label: "Engine / World\nTelemetry sim\n5-signal fusion\nCRI + fever", fs: 14, to: { x: 8.0, y: 3.2 } },
    { x: 4.2, y: 3.6, w: 2.8, h: 1.0, fill: C.sage, label: "Supabase\nPostgres + Auth\nRLS on devices/incidents/audit", fs: 14 },
  ],
  "Local demo mode runs entirely in memory — no credentials needed"
);

contentSlide(
  "Prototype results: early alarm before bulk encryption",
  [
    "MEASURE-1: Standard drill → first alarm (watch threshold) at ~8 s wall-clock (≈4 telemetry windows)",
    "MEASURE-2: Standard drill → critical at ~22 s (≈11 windows); stealth profile ~1.6× slower to critical",
    "MEASURE-3: Canary trip fires while entropy ≤2.5 bits/byte — alarm before bulk encryption is underway",
    "Containment click → device quarantined, incident contained, audit entry written — end-to-end < 1 s in demo",
    "Build passes; drill timings reproducible; 14-device fleet runs continuously at 2.2 s/tick",
  ],
  "Measured on the prototype; clinical validation is future work"
);

contentSlide(
  "Honest limitations — this is a prototype",
  [
    "Telemetry is simulated — a lightweight OS agent (eBPF / filesystem minifilter) is the next step",
    "Thresholds are hand-tuned on synthetic profiles; no clinical-field validation",
    "Containment is simulated (NAC VLAN revoke stub); production needs SDN/NAC API integration",
    "RLS policies are prototype-grade — hardening: per-role policies, audit immutability, retention",
    "Single-hospital scope; multi-tenant, FHIR-aware alerting, and regulatory review are on the roadmap",
  ],
  "See docs/report.md for the full hardening roadmap"
);

contentSlide(
  "Roadmap: from demo to ward deployment",
  [
    "Real endpoint agent (Linux/Windows) streaming the 5 signals to /api/tick",
    "ML threshold learning on labelled hospital traces (NapierOne + clinical logs)",
    "SDN/NAC integration (Cisco ISE, Arista, Palo Alto) for real one-click quarantine",
    "Pilot with a clinical partner — NDA template in docs/nda.md",
    "FDA §524B premarket cyber submission prep; HICP 10-practice alignment",
    "Multi-hospital federation with shared threat intel (STIX/TAXII) — zero patient data egress",
  ],
  "Designed for clinical reality, not security theatre"
);

contentSlide(
  "Nightingale — the night nurse for your network",
  [
    "Five fused behavioural signals, clinically-weighted triage, fever dashboard",
    "Prototype working today: Next.js 15 + Supabase + live attack drills",
    "Open the watch floor at localhost:4310 — demo mode needs zero setup",
    "Research paper (docs/research-paper.md), project report (docs/report.md), NDA (docs/nda.md)",
    "Ready for pilot conversations — catch the fire while it's still a fever",
  ],
  "Repository: github.com/HimanshuxAI/nightingale  ·  Contact: [Team — add names]"
);

pptx.writeFile({ fileName: "docs/nightingale-deck.pptx" });
console.log("→ docs/nightingale-deck.pptx written");