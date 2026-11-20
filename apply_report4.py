# -*- coding: utf-8 -*-
"""Part 4: fill Contents, List of Figures, List of Tables tables."""
from docx import Document
from docx.table import Table
from docx.oxml.ns import qn

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

DOC = Document(SRC)
tables = DOC.tables

# ---------- Table 2: Contents (8 rows x 2 cols) -> add chapters ----------
contents_tbl = tables[2]
front_matter = [
    ("Certificate", "i"),
    ("Certificate (From Company, if any)", "ii"),
    ("Declaration", "iii"),
    ("Examiner's Approval Certificate", "iv"),
    ("Acknowledgement", "v"),
    ("Nomenclature", "vi"),
    ("Abstract", "vii"),
    ("List of Figures", "viii"),
    ("List of Tables", "ix"),
]
chapters = [
    ("Chapter 1 — INTRODUCTION", "1"),
    ("1.1 Ransomware as a Patient-Safety Problem", "1"),
    ("1.2 Existing Work", "2"),
    ("1.3 Motivation", "3"),
    ("1.4 Objectives", "4"),
    ("1.5 Scope", "4"),
    ("Chapter 2 — CONCEPTS AND METHODS", "5"),
    ("2.1 Definitions", "5"),
    ("2.2 Detection Method: Five-Signal Fusion", "5"),
    ("2.3 Clinical Triage: The Clinical Risk Index", "6"),
    ("Chapter 3 — LITERATURE SURVEY", "7"),
    ("3.1 Detection-Surface Literature", "7"),
    ("3.2 Clinical and Regulatory Context", "8"),
    ("3.3 Gap Identified", "8"),
    ("Chapter 4 — PROJECT PLAN", "10"),
    ("4.1 Development Model", "10"),
    ("4.2 Phase-Wise Plan", "10"),
    ("Chapter 5 — SOFTWARE REQUIREMENT SPECIFICATION", "11"),
    ("5.1 Project Scope", "11"),
    ("5.2 User Classes and Characteristics", "11"),
    ("5.3 Functional Requirements", "11"),
    ("5.4 Non-Functional Requirements", "12"),
    ("5.5 Data Model", "12"),
    ("Chapter 6 — RESULTS", "13"),
    ("6.1 Detection Timings", "13"),
    ("6.2 Clinical Prioritisation Behaviour", "13"),
    ("6.3 Containment Flow", "14"),
    ("Chapter 7 — SOFTWARE TESTING", "15"),
    ("7.1 Build Verification", "15"),
    ("7.2 Test Cases", "15"),
    ("7.3 Known Untested Items", "16"),
    ("Chapter 8 — CONCLUSION AND FUTURE WORK", "17"),
    ("8.1 Conclusion", "17"),
    ("8.2 Future Work", "17"),
    ("Bibliography", "19"),
    ("Annexure A — List of Publications and Research Paper", "20"),
    ("Annexure B — Plagiarism Report", "21"),
    ("Annexure C — Empathy Chart and Solution Document", "22"),
    ("Annexure D — Project Tracker", "23"),
]

# Keep existing 8 front-matter rows, replace text, then add chapter rows
n_front = min(len(front_matter), len(contents_tbl.rows))
for i in range(n_front):
    contents_tbl.rows[i].cells[0].text = front_matter[i][0]
    contents_tbl.rows[i].cells[1].text = front_matter[i][1]

# Add chapter rows
for title, page in chapters:
    row = contents_tbl.add_row()
    row.cells[0].text = title
    row.cells[1].text = page
print(f"Contents table: {len(contents_tbl.rows)} rows")

# ---------- Table 3: List of Figures (1 row x 1 col) ----------
figures_tbl = tables[3]
figures = [
    ("Figure 2.1", "Layered architecture of the Nightingale prototype", "5"),
    ("Figure 2.2", "Five-signal fusion and escalation pipeline", "6"),
    ("Figure 4.1", "Waterfall development model followed for the project", "10"),
    ("Figure 5.1", "Watch-floor dashboard — fleet grid, incident queue and drill console", "12"),
    ("Figure 6.1", "Risk trajectory of a standard-profile drill on an ICU infusion pump", "13"),
    ("Figure 6.2", "Canary lead over write entropy", "14"),
]
figures_tbl.rows[0].cells[0].text = "Figure Number: Figure Title                                       Page Number"
for fig, title, page in figures:
    row = figures_tbl.add_row()
    row.cells[0].text = f"{fig}: {title}                                            {page}"
print(f"List of Figures: {len(figures_tbl.rows)} rows")

# ---------- Table 4: List of Tables (1 row x 1 col) ----------
tables_tbl = tables[4]
table_entries = [
    ("Table 1.1", "Existing systems and the gap each leaves", "2"),
    ("Table 2.1", "Fused behavioural signals and weights", "5"),
    ("Table 2.2", "Clinical tiers and tier weights", "6"),
    ("Table 2.3", "Threshold bands and operator meaning", "6"),
    ("Table 3.1", "Literature survey by theme", "9"),
    ("Table 5.1", "Functional requirements", "11"),
    ("Table 5.2", "Simulated fleet (14 devices)", "12"),
    ("Table 5.3", "Database tables", "12"),
    ("Table 6.1", "Drill measurements", "13"),
    ("Table 7.1", "Test cases and outcomes", "15"),
    ("Table 8.1", "Limitations of the prototype", "18"),
    ("Table 8.2", "Roadmap", "18"),
]
tables_tbl.rows[0].cells[0].text = "Table Number: Title of the table                                              Page Number"
for num, title, page in table_entries:
    row = tables_tbl.add_row()
    row.cells[0].text = f"{num}: {title}                                                {page}"
print(f"List of Tables: {len(tables_tbl.rows)} rows")

DOC.save(DST)
print("Part 4 complete. Saved:", DST)
