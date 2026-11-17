from rc_lib import *
import re
base = "https://blog.google/company-news/inside-google/message-ceo/"
with sync_playwright() as p:
    for s in ["alphabet-earnings-q3-2026/", "alphabet-earnings-q2-2026/", "next-chapter-ai-momentum/"]:
        print("=====", s)
        b, pg = open_page(p, base+s, wait=4, dsf=1)
        body = pg.inner_text("body")
        for mm in re.finditer(r"(?i)\bcod(?:e|ing|ers?)\b|\bengineer", body):
            st = max(0, mm.start()-110); print("  >>", body[st:mm.end()+140].replace("\n"," | "))
        b.close()
