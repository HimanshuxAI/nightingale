# -*- coding: utf-8 -*-
"""Part 3: fix declaration table names + add bibliography refs [7]-[17] before ANNEXURE B."""
from docx import Document
from docx.shared import Pt
from docx.table import Table
from docx.text.paragraph import Paragraph

SRC = DST = "/Users/himanshu/Downloads/hospital_ransomware_detection/Nightingale_BTech_Project_Report.docx"

DOC = Document(SRC)
body = DOC.element.body

# 1) Fix declaration table -> placeholder names
for c in body.iterchildren():
    if c.tag.split('}')[-1] == 'tbl':
        t = Table(c, DOC)
        if len(t.rows) == 4 and t.rows[0].cells[0].text.strip() == 'Name':
            t.rows[1].cells[0].text = "[STUDENT 1 NAME]"
            t.rows[1].cells[1].text = "[PRN/ENROLLMENT NO. 1]"
            t.rows[2].cells[0].text = "[STUDENT 2 NAME]"
            t.rows[2].cells[1].text = "[PRN/ENROLLMENT NO. 2]"
            t.rows[3].cells[0].text = "[STUDENT 3 NAME]"
            t.rows[3].cells[1].text = "[PRN/ENROLLMENT NO. 3]"
            print("Declaration table updated.")
            break

# 2) Add bibliography refs [7]-[17] before ANNEXURE B paragraph
bib_entries = [
 "[7] A. Continella et al., \"ShieldFS: A Self-healing, Ransomware-aware Filesystem,\" in Proc. ACSAC, 2016, pp. 336–347, doi: 10.1145/2991079.2991110.",
 "[8] E. Davies, R. Macfarlane and W. J. Buchanan, \"Comparison of entropy calculation methods for ransomware encrypted file identification,\" Entropy, vol. 24, no. 10, art. 1503, 2022, doi: 10.3390/e24101503.",
 "[9] R. Casino, D. Hurley-Smith, J. Hernández-Castro and C. Patsakis, \"Not on my watch: ransomware detection through classification of high-entropy file segments,\" Journal of Cybersecurity, vol. 11, no. 1, tyaf009, 2025, doi: 10.1093/cybsec/tyaf009.",
 "[10] Z. A. Genç, G. Lenzini and D. Sgandurra, \"On deception-based protection against cryptographic ransomware,\" in Proc. DIMVA, LNCS 11550, 2019, pp. 219–239, doi: 10.1007/978-3-030-22038-9_11.",
 "[11] K. Cabaj and W. Mazurczyk, \"Using software-defined networking for ransomware mitigation: The case of CryptoWall,\" IEEE Network, vol. 30, no. 6, pp. 14–20, 2016, doi: 10.1109/MNET.2016.1600110NM.",
 "[12] M. Cen, F. Jiang, X. Qin, Q. Jiang and R. Doss, \"Ransomware early detection: A survey,\" Computer Networks, vol. 239, art. 110138, 2024, doi: 10.1016/j.comnet.2023.110138.",
 "[13] U.S. Food and Drug Administration, \"Cybersecurity in medical devices: Quality system considerations and content of premarket submissions,\" Final Guidance, Sep. 2023. [Online]. Available: https://www.federalregister.gov/documents/2023/09/27/2023-20955/cybersecurity-in-medical-devices-quality-system-considerations-and-content-of-premarket-submissions",
 "[14] HHS 405(d) Program and Health Sector Coordinating Council, \"Health Industry Cybersecurity Practices (HICP), 2023 Edition,\" Apr. 2023. [Online]. Available: https://405d.hhs.gov/cornerstone/hicp",
 "[15] H. T. Neprash et al., \"Trends in ransomware attacks on US hospitals, clinics, and other health care delivery organizations, 2016–2021,\" JAMA Health Forum, vol. 3, no. 12, e224873, 2022, doi: 10.1001/jamahealthforum.2022.4873.",
 "[16] R. Abouk and D. Powell, \"Ransomware attacks, ED visits and inpatient admissions in targeted and nearby hospitals,\" JAMA, vol. 331, no. 24, pp. 2129–2131, 2024, doi: 10.1001/jama.2024.7752.",
 "[17] H. Neprash, C. McGlave and S. Nikpay, \"Hacked to pieces? The effects of ransomware attacks on hospitals and patients,\" AEJ: Economic Policy, vol. 18, no. 1, pp. 256–281, 2026, doi: 10.1257/pol.20240594.",
]

anchor = None
for p in DOC.paragraphs:
    if p.text.strip().startswith('ANNEXURE B'):
        anchor = p._element
        break

if anchor is None:
    print("ERROR: ANNEXURE B anchor not found")
else:
    for entry in bib_entries:
        new_p = DOC.add_paragraph(entry)
        new_p.style = DOC.styles['Normal']
        for r in new_p.runs:
            r.font.name = 'Arial'
            r.font.size = Pt(11.5)
        anchor.addprevious(new_p._element)
    print(f"Added {len(bib_entries)} bibliography entries before ANNEXURE B.")

DOC.save(DST)
print("Part 3 complete. Saved:", DST)
