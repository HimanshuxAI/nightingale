# -*- coding: utf-8 -*-
"""Final structural cleanup: remove template instructions, old freelancing content,
duplicate bibliography, fix heading styles."""
from docx import Document
from docx.table import Table
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

DOC = Document(SRC)
body = DOC.element.body

# Collect elements in order with their paragraph objects
elements = []  # (index, element, type, paragraph_or_table)
idx = 0
for child in body.iterchildren():
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        from docx.text.paragraph import Paragraph
        p = Paragraph(child, DOC)
        elements.append((idx, child, 'p', p))
        idx += 1
    elif tag == 'tbl':
        t = Table(child, DOC)
        elements.append((idx, child, 't', t))
        idx += 1

# ---------- Identify paragraphs to REMOVE ----------
to_remove = set()

for i, (ei, el, etype, obj) in enumerate(elements):
    if etype != 'p':
        continue
    p = obj
    t = p.text.strip()

    # 1) Template instruction paragraphs (guidelines, not report content)
    instruction_starts = [
        "Project Report should include necessary certificates",
        "If particular part is repeated, you can mention",
        "Prepare at least n + 2 Project Report copies",
        "Acknowledgment, List of Publications, List of Diagrams",
        "Always place the images/Diagrams/Table",
        "The footer “MITSOC, Department of Computer Engineering",
        "Main part of manuscripts should be Times Roman",
        "Use paper size 8.5",
        "All paragraphs will be single line spaced",
        "Chapter titles should be bold with 18 pt",
        "Section heading should be aligning at the left",
        "Section subheading should be aligning at the left",
        "Leave one spaces between section heading",
        "References should be in IEEE format",
        "Symbols and notations if any should be included",
        "All chapters, section heading and sub headings",
        "The text should be typed on both side of the paper",
    ]
    if any(t.startswith(s) for s in instruction_starts):
        to_remove.add(ei)
        continue

    # 2) Old freelancing template content (from the original docx placeholder text)
    freelance_markers = [
        "The conventional idea of \"labor\" as referring",
        "The incredible rise of the Internet, dubbed the Fourth Industrial",
        "So, with the rapid unemployment rate",
        "The fact that most of the youths are looking forward",
        "$20 to $30 billion by the end of 2025",
        "Around 15 million people in India are freelancing",
        "1.1 Digitalization in Labor Market:",
        "Bots and Artificial Intelligence (AI) have given rise to new career",
        "The development of online freelancing and microwork",
        "There are a few existing systems related to our project field",
        "Table  STYLEREF 1 \s 1: SEQ Table",
        "Motivation",
        "As it’s said, “No country, however rich, can afford",
        "The main motivation behind this project is different though",
        "Since, the final solution for unemployment is work",
        "Objectives",
        "In support of the New Education Policy 2020",
        "To make students self-dependent",
        "To provide a platform to freelancers",
        "The platform Code-n-Mingle will allow",
        "Scope",
        "The proposed work aims to answer these questions :",
        "The coders can bid for a particular project",
        "Buyers are able to upload a project",
        "Code-n-Mingle focuses on equality of both",
        "ARIFIN, Riscal; DANIAWAN, Benny",
        "Abhinav, Kumar & Dubey, Alpana",
        "Hong, Kevin & Pavlou, Paul",
        "Tu, Zhiying & Zhaoyang, Liu",
        "Pataropura, Amesanggeng & Riki",
        "Hannak, Aniko & Wagner, Claudia",
        "Toth, Ilona & Heinänen, Sanna",
        "Table 3:1: Literature Survey",
        "We approached the system development using the waterfall",
        "Figure 4.1: Software modeling",
        "Freelancing is said to have grown in popularity",
        "We aim to implement a module in our system through which, unskilled people",
    ]
    if any(t.startswith(s) for s in freelance_markers):
        to_remove.add(ei)
        continue

    # 3) Old duplicate bibliography [1],[2],[3] (keep only the new IEEE ones starting at "[1] UK National")
    if t.startswith("[1]A. R. Naik") or t.startswith("[2]P. Udhawani") or t.startswith("[3]B. M.Kore") or \
       t.startswith("[4]S. Handrale") or t.startswith("[5]V. S. S. Sriram") or t.startswith("[6]S. K. Pathan"):
        to_remove.add(ei)
        continue

# ---------- Remove paragraphs (reverse order) ----------
remove_children = [el for ei, el, etype, obj in elements if ei in to_remove]
for el in remove_children:
    el.getparent().remove(el)
print(f"Removed {len(remove_children)} paragraphs.")

# ---------- Fix heading styles ----------
# Re-collect paragraphs after removal
for p in DOC.paragraphs:
    t = p.text.strip()
    # Fix SRS subsections wrongly set as Heading 2
    if t == "Operators can bid-style actions are not applicable; instead:":
        p.style = DOC.styles['Normal']
        print("Fixed heading style:", t[:50])
    # Fix bibliography [6] wrongly set as Heading 1
    if t.startswith("[6] A. Kharraz"):
        p.style = DOC.styles['Normal']
        print("Fixed bibliography heading:", t[:50])

DOC.save(DST)
print("Saved:", DST)

# ---------- Verify ----------
d2 = Document(DST)
joined = "\n".join(p.text for p in d2.paragraphs)
for t in d2.tables:
    for r in t.rows:
        for c in r.cells:
            joined += "\n" + c.text

print()
print("=== VERIFICATION ===")
bad = ['Code-n-Mingle', '15 million people', 'Digitalization in Labor Market', 'The conventional idea of',
       'Project Report should include', 'Use paper size', '[1]A. R. Naik', '[2]P. Udhawani', '[3]B. M.Kore']
remaining = [b for b in bad if b in joined]
print("Old/template content remaining:", remaining if remaining else "NONE")

good = ['NIGHTINGALE: PATIENT-SAFETY-FIRST','Clinical Risk Index','watch ≥ 35','alert ≥ 55','critical ≥ 75',
        'Next.js 15','Supabase','infusion pump','Kharraz','Genç','Davies','Cabaj','Neprash','ENISA','FDA',
        '/api/tick','/api/inject','/api/contain','/api/release','/api/reset','2.5 bits/byte']
missing = [g for g in good if g not in joined]
print("Key content missing:", missing if missing else "NONE")

print()
print("Total paragraphs:", len(d2.paragraphs))
print("Total tables:", len(d2.tables))