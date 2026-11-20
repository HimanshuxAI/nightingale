# -*- coding: utf-8 -*-
"""Remove the margin-specification instruction table (Table 0) from the report."""
from docx import Document
from docx.table import Table
from docx.oxml.table import CT_Tbl

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

DOC = Document(SRC)
body = DOC.element.body

# Find the margin table: first table with 'Margin' as first cell
margin_tbl = None
for c in body.iterchildren():
    if c.tag.split('}')[-1] == 'tbl':
        t = Table(c, DOC)
        if len(t.rows) == 3 and len(t.columns) == 4 and t.rows[0].cells[0].text.strip() == 'Margin':
            margin_tbl = c
            break

if margin_tbl is not None:
    margin_tbl.getparent().remove(margin_tbl)
    print("Margin specification table removed.")
else:
    print("Margin table not found.")

DOC.save(DST)
print("Saved:", DST)

# Verify
d2 = Document(DST)
print("\nRemaining tables:", len(d2.tables))
for i, t in enumerate(d2.tables):
    print(f"  Table {i}: {len(t.rows)} rows x {len(t.columns)} cols | first: {t.rows[0].cells[0].text.strip()[:40]}")