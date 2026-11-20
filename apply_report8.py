# -*- coding: utf-8 -*-
"""Remove duplicate old bibliography entries [1]-[6] and duplicate 'Existing Work' heading."""
from docx import Document
from docx.text.paragraph import Paragraph

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

DOC = Document(SRC)
body = DOC.element.body

paras = []
for child in body.iterchildren():
    if child.tag.split('}')[-1] == 'p':
        paras.append(Paragraph(child, DOC))

to_remove = []
existing_work_indices = []

for i, p in enumerate(paras):
    t = p.text.strip()
    # Old duplicate bibliography [1]-[6] (the freelancing ones, before new IEEE refs)
    if (t.startswith("[1]A. R. Naik") or t.startswith("[2]P. Udhawani") or t.startswith("[3]B. M.Kore") or
        t.startswith("[4]S. Handrale") or t.startswith("[5]V. S. S. Sriram") or t.startswith("[6]S. K. Pathan")):
        to_remove.append(p._element)
    # Track "Existing Work" headings (keep only one)
    if t == "Existing Work":
        existing_work_indices.append(p._element)

# Remove all but the LAST "Existing Work" heading (keep the most recent/newest one)
for el in existing_work_indices[:-1]:
    to_remove.append(el)

# Remove in reverse order
for el in reversed(to_remove):
    el.getparent().remove(el)

print(f"Removed {len(to_remove)} paragraphs.")

DOC.save(DST)
print("Saved:", DST)

# Verify
d2 = Document(DST)
joined = "\n".join(p.text for p in d2.paragraphs)
print("\n--- Verification ---")
print("Old duplicate [1]A. R. Naik present:", "[1]A. R. Naik" in joined)
print("Old duplicate [2]P. Udhawani present:", "[2]P. Udhawani" in joined)
print("Old duplicate [3]B. M.Kore present:", "[3]B. M.Kore" in joined)
print("'Existing Work' count:", joined.count("Existing Work"))
print("New IEEE [1] present:", "[1] UK National Audit Office" in joined)
print("New IEEE [17] present:", "[17] H. Neprash, C. McGlave" in joined)
print("Total paragraphs:", len(d2.paragraphs))