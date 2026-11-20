# -*- coding: utf-8 -*-
"""Fix remaining wrong heading styles (body text styled as Heading 2)."""
from docx import Document

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

DOC = Document(SRC)

# Body text paragraphs that are wrongly styled as headings -> change to Normal
wrong_headings = [
    "Existing Work",
    "Nearby detection systems are strong at the signal level but generic in response.",
    "The harm is measured, not rhetorical.",
    "2. Define and apply a Clinical Risk Index that re-orders containment",
    "Operators can bid-style actions are not applicable; instead:",
]

fixed = 0
for p in DOC.paragraphs:
    t = p.text.strip()
    if t in wrong_headings and p.style.name != 'Normal':
        p.style = DOC.styles['Normal']
        fixed += 1
        print(f"Fixed: {t[:60]}")

# Fix leading space in LITERATURE SURVEY
for p in DOC.paragraphs:
    if p.text.strip() == "LITERATURE SURVEY":
        # remove leading space from runs
        for r in p.runs:
            if r.text.startswith(" LITERATURE"):
                r.text = r.text.replace(" LITERATURE", "LITERATURE", 1)
        print("Fixed leading space in LITERATURE SURVEY")

DOC.save(DST)
print(f"\nFixed {fixed} heading styles. Saved: {DST}")

# Verify
d2 = Document(DST)
print("\n--- Corrected headings ---")
for p in d2.paragraphs:
    if p.style.name in ('Heading 1', 'Heading 2'):
        print(f"  [{p.style.name}] {p.text}")