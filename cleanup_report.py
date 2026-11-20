# -*- coding: utf-8 -*-
"""Remove leftover template instruction text from the Nightingale report docx."""
from docx import Document
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

# Phrases that are purely template instructions (remove whole paragraph if it's only this)
INSTRUCTION_ONLY = [
    "(14/bold, upper case)", "(18/bold, upper case)", "(16, bold, upper case)",
    "(16, bold/upper case)", "(12,upper case)", "(12, Title case)", "(12, Sentence case)",
    "(12, sentence case)", "(Two blank spaces)", "(One blank spaces)", "(One blank space)",
    "(Four blank spaces)", "(Three blank spaces)", "(one blank spaces)", "(one blank space)",
    "(Hard bound blue cover page with golden embossing)",
    "Instructions for B.Tech. Project Report Writing",
]

# Substrings to strip from within mixed content paragraphs
INSTRUCTION_SUBSTR = [
    "(14/bold, upper case)", "(18/bold, upper case)", "(16, bold, upper case)",
    "(16, bold/upper case)", "(12,upper case)", "(12, Title case)", "(12, Sentence case)",
    "(12, sentence case)", "(Two blank spaces)", "(One blank spaces)", "(One blank space)",
    "(Four blank spaces)", "(Three blank spaces)", "(one blank spaces)", "(one blank space)",
]

DOC = Document(SRC)
body = DOC.element.body

overall = 0
to_remove = []  # elements to remove from body

for child in body.iterchildren():
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        from docx.text.paragraph import Paragraph
        p = Paragraph(child, DOC)
        t = p.text.strip()
        # Is this paragraph ONLY instruction text?
        if t in INSTRUCTION_ONLY:
            to_remove.append(child)
        else:
            # Strip instruction substrings from runs
            changed = False
            for r in list(p.runs):
                rt = r.text
                for ins in INSTRUCTION_SUBSTR:
                    if ins in rt:
                        rt = rt.replace(ins, "")
                        changed = True
                if changed:
                    r.text = rt
        overall += 1
    elif tag == 'tbl':
        overall += 1

# Remove instruction-only paragraphs (in reverse order to preserve indices)
import copy
# Collect elements in document order again and remove
body = DOC.element.body
all_children = list(body.iterchildren())
for el in all_children:
    if el in to_remove:
        el.getparent().remove(el)

DOC.save(DST)
print("Cleanup complete. Saved:", DST)

# Verify
d2 = Document(DST)
joined = "\n".join(p.text for p in d2.paragraphs)
remaining = [ins for ins in INSTRUCTION_SUBSTR if ins in joined]
print("Remaining instruction substrings:", remaining if remaining else "NONE")