# -*- coding: utf-8 -*-
"""Edit the Annexure-6 .docx template in-place: swap placeholder/freelancing
content for real Nightingale content. Format/fonts/margins/sections/tables/
images are left untouched. Only paragraph text changes."""
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl

SRC = "/Users/himanshu/Downloads/Annexure 6_Project report format - guidelines_SKP.docx"
DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

TITLE = "NIGHTINGALE: PATIENT-SAFETY-FIRST EARLY RANSOMWARE DETECTION FOR HOSPITAL DEVICE FLEETS"
SHORT = "Nightingale: Patient-Safety-First Early Ransomware Detection for Hospital Device Fleets"

# fmt keys: b,i,sz,font,align('c'/'l'/'r'/None)
def cap_fmt(para):
    for r in para.runs:
        if r.text.strip():
            return dict(b=r.bold, i=r.italic, sz=(r.font.size.pt if r.font.size else None),
                        font=r.font.name, align=para.alignment)
    return dict(b=False, i=False, sz=None, font=None, align=para.alignment)

def set_runs(para, new_text, fmt):
    # remove all runs
    for r in list(para.runs):
        r._element.getparent().remove(r._element)
    r = para.add_run(new_text)
    r.bold = fmt.get("b", False)
    r.italic = fmt.get("i", False)
    if fmt.get("sz"): r.font.size = Pt(fmt["sz"])
    if fmt.get("font"): r.font.name = fmt["font"]
    if fmt.get("align") is not None:
        para.alignment = {"c": WD_ALIGN_PARAGRAPH.CENTER, "l": WD_ALIGN_PARAGRAPH.LEFT,
                          "r": WD_ALIGN_PARAGRAPH.RIGHT}[fmt["align"]]

def cell_set(cell, new_text, fmt):
    for p in list(cell.paragraphs):
        for r in list(p.runs):
            r._element.getparent().remove(r._element)
    p = cell.paragraphs[0]
    r = p.add_run(new_text)
    r.bold = fmt.get("b", False); r.italic = fmt.get("i", False)
    if fmt.get("sz"): r.font.size = Pt(fmt["sz"])
    if fmt.get("font"): r.font.name = fmt["font"]

M = {}  # index -> (text, fmt)

def rep(idx, text, **kw):
    M[idx] = (text, kw)

# ---------- Cover page ----------
rep(28, TITLE, b=True, sz=18, font="Arial", align="c")
rep(45, "[STUDENT 1 NAME]   [PRN/ENROLLMENT NO.]\n[STUDENT 2 NAME]   [PRN/ENROLLMENT NO.]\n[STUDENT 3 NAME]   [PRN/ENROLLMENT NO.]", sz=14, font="Arial", align="c")
rep(51, "[GUIDE NAME], [DESIGNATION]", sz=14, font="Arial", align="c")
rep(61, "[YYYY] – [YYYY]", b=True, font="Arial")

# ---------- Certificate 1 ----------
rep(75, "\u201c" + TITLE + "\u201d", b=True, font="Arial")
rep(78, "Name of the Candidate   [PRN/ENROLLMENT NO.]   (x3)", font="Arial")
rep(81, "is a bonafide work carried out by them under the supervision of [GUIDE NAME] and it is submitted towards the partial fulfilment of the requirement of MIT ADT University, Pune for the award of the degree of Bachelor of Technology (Computer Science and Engineering)", font="Arial")
rep(87, "[GUIDE NAME]\t\t\t\t[HEAD OF DEPARTMENT NAME]", b=True, font="Arial")
rep(88, "Guide\t\t\t\tHead of Department", font="Arial")
rep(91, "Prof. Suresh Kapare\t\t\t\tDr. Ganesh Pathak", b=True, font="Arial")
rep(92, "Chief Coordinator-PBL\t\t\t\t\tDean", font="Arial")

# ---------- Certificate 2 (company) ----------
rep(103, "CERTIFICATE", b=True, sz=16, font="Arial")
rep(109, "\u201c" + TITLE + "\u201d", b=True, font="Arial")
rep(115, "Name of the Candidate   [EXAM NO.]", font="Arial")
rep(119, "is a bonafide work carried out by him/her (with the sponsorship of [SPONSOR OR 'Not applicable']) under the supervision of [EXTERNAL GUIDE NAME] and has been completed successfully.", font="Arial")
rep(126, "[EXTERNAL GUIDE NAME]", font="Arial")
rep(127, "[DESIGNATION]", font="Arial")

# ---------- Declaration ----------
rep(150, "is a bonafide work carried out by them under the supervision of [GUIDE NAME] and it is submitted towards the partial fulfilment of the requirement of MIT ADT University, Pune for the award of the degree of Bachelor of Technology (Computer Science and Engineering)", font=None)
rep(152, "Date: [DD/MM/YYYY]", font=None)
# declaration table names
# handled separately below (table index 149)

# ---------- Examiner's approval ----------
rep(179, "The project report entitled \u201c" + TITLE + "\u201d submitted by [STUDENT 1] ([PRN 1]), [STUDENT 2] ([PRN 2]) and [STUDENT 3] ([PRN 3]) in partial fulfilment for the award of the degree of Bachelor of Technology (Computer Science & Engineering) during the academic year [YYYY]–[YYYY], of MIT-ADT University, MIT School of Computing, Pune, is hereby approved.", sz=11.5, font="Arial")

# ---------- Acknowledgement ----------
rep(198, "We are grateful to [GUIDE NAME], our project guide, for guidance, technical review, and for insisting we state limitations honestly instead of overclaiming results. We thank Dr. Ganesh Pathak (Dean) and Prof. Suresh Kapare (Chief Coordinator – PBL) for the environment and evaluation process that shaped this work. We thank the faculty of the Department of Computer Science and Engineering for courses in networking, databases and software engineering that underpin this prototype, and classmates who acted as the first operators of the watch floor. We acknowledge the researchers cited in the Bibliography — especially the decoy-file and filesystem work of Kharraz et al. and Genç et al., the entropy analysis of Davies et al., the self-healing filesystem of Continella et al., and the SDN mitigation results of Cabaj and Mazurczyk — whose findings defined both the design and its boundaries. The patient-outcome evidence of Neprash et al. and the NHS analyses are why this project frames ransomware as a patient-safety problem. Finally, we thank our families for their patience through the build and test cycles.", i=True, font="Arial")
rep(234, "Name, Enrollment No.", b=True, sz=11.5, font="Arial")

# ---------- Abstract ----------
rep(240, "Ransomware against hospitals is a patient-safety problem, not merely an IT problem. In the week of an attack, hospital patient volumes fall by 17–24% and in-hospital mortality among patients already admitted rises by 34–38% [17]. Ransomware accounts for 54% of analysed health-sector incidents, with hospitals the victim in 42% [5]. Detection that arrives only after bulk encryption begins leaves a hospital with backups and diverted ambulances; detection that arrives seconds earlier leaves it with choices.\n\nThis report presents Nightingale, a working prototype early-detection watch floor for hospital device fleets. Every monitored device reports a telemetry window of about two seconds. Five behavioural signals — a canary decoy-file tripwire, Shannon entropy of freshly written blocks, shadow-copy/backup deletions, SMB/RDP connection bursts, and mass file-rename churn — are normalised and fused with fixed weights (0.32, 0.24, 0.18, 0.12, 0.14) into a 0–100 risk score. The score is smoothed with an asymmetric exponential moving average (rise α = 0.62, decay α = 0.38) so escalation is fast but a single noisy window does not raise an alarm. Threshold bands are watch ≥ 35, alert ≥ 55 and critical ≥ 75. A Clinical Risk Index (CRI) multiplies risk by a patient-safety tier weight (life-critical ×1.5 down to administrative ×0.75), so the containment queue is ordered by clinical impact rather than raw threat: an ICU infusion pump outranks a billing server at equal risk. The interface maps risk to a body temperature between 36.5 °C and 42.0 °C so the dashboard reads like the fever charts ward staff already use.\n\nThe prototype is a single Next.js 15 application (React 19 front end, TypeScript API routes) with best-effort Supabase persistence. In drills on a 14-device simulated fleet, the standard attack profile crossed the watch threshold at about 8 seconds and reached critical at about 22 seconds; the canary tripwire fired while write entropy was still at or below 2.5 bits/byte, before bulk encryption was underway. The stealth profile reached critical roughly 1.6 times more slowly and was still detected before encryption. Containment, telemetry and thresholds are simulated and are not clinically validated; a real endpoint agent, field-tuned thresholds, NAC/SDN integration and a clinical pilot are set out as future work. No real patient data exists anywhere in the system.", i=True, font="Arial")

DOC = Document(SRC)

# Apply paragraph replacements by overall top-level index (matches the dump)
body = DOC.element.body
from docx.text.paragraph import Paragraph
overall = 0
for child in body.iterchildren():
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        if overall in M:
            text, fmt = M.pop(overall)
            set_runs(Paragraph(child, DOC), text, fmt)
        overall += 1
    elif tag == 'tbl':
        overall += 1

if M:
    print("WARNING: unreplaced indices:", sorted(M))
print("Paragraph replacements done.")
DOC.save(DST)
print("Saved:", DST)

print("Paragraph replacements done:", len(M))
DOC.save(DST)
print("Saved:", DST)
