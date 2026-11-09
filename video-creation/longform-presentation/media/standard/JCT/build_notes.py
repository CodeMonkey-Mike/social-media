"""Builds JCT-notes.txt + .docx from ONE content list (edit CONTENT, re-run).

The notes doc holds ONLY what is NOT on a slide (Mike, 2026-11-08, every standard video): extra facts, caveats,
numbers that did not fit, likely viewer questions, the do-not-air items. Never a recap of a slide.
Every fact comes from RESEARCH.md. Plain OOXML written with zipfile (no python-docx on this machine).
"""
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

HERE = Path(__file__).resolve().parent
NAME = 'JCT-notes'

# (kind, text): title | sub | h1 | h2 | p | b (bullet)
CONTENT = [
    ('title', 'Janction (JCT): Notes'),
    ('sub', 'Only what is NOT on the slides. Deck: JCT.html (9 slides). Prices as of November 8, 2026, 21:05 UTC (CoinGecko). Every number is in RESEARCH.md with its source.'),

    ('h1', 'Before you hit record'),
    ('b', 'This is a live story. JCT is swinging 30% or more within hours and the first unlock lands Tuesday November 10 at 00:00 UTC (7 pm ET Monday). If you record after that, or the price has moved a lot, tell me and I will update the price slides (1, 2, 7, 8, 9) first.'),
    ('b', 'Open JCT.html in Chrome, F = fullscreen, G = webcam guide box, arrows or Space to move. Recording goes in raw/ in this folder.'),

    ('h2', 'Slide 1 · Janction Just Went 5x in a Day'),
    ('b', 'It is also the one-year anniversary: JCT first traded November 10, 2025, the same day the unlock starts.'),
    ('b', 'The two big sites disagree on market cap: CoinMarketCap counts about 1.14B fewer tokens circulating (Ecosystem tokens unlocked at launch that never left the Ecosystem wallet), so its market cap reads about 10% lower. The slides use CoinGecko throughout.'),
    ('b', 'The 24h % differs by site and by the minute (CoinGecko had +361% at 21:05 UTC). If you quote one, name the site. Right now it is about 5.5x off the morning low; 6x is the round number, 7x was the 20:10 peak.'),

    ('h2', 'Slide 2 · Two Pumps, No News'),
    ('b', 'Nobody has a reason for either pump. Do not offer one as fact.'),
    ('b', 'Toobit and OrangeX each report about $245M of open interest, far above Binance. Not credible: do not quote a total across venues.'),

    ('h2', 'Slide 3 · A GPU Marketplace From Jasmy'),
    ('b', 'Harada is an ex-KPMG accountant (11 years). Janction\'s terms of service name a company called Discovery Domain Ltd as the operator. JasmyLab Inc. was founded June 2023 in Tokyo.'),
    ('b', 'Smaller deals: a design MOU with V01D (a Japanese creative studio, May 2026) and a 2024 MOU with C2E (Korea), announced by the project only.'),

    ('h2', 'Slide 4 · Layer 2? Layer 1? Depends Who You Ask'),
    ('b', 'Part of the pitch is also data: a browser extension that crawls and signs users\' browsing data, fed to the network as AI data.'),

    ('h2', 'Slide 5 · What\'s Live Today'),
    ('b', 'Smart Render status is contested: one outlet says it launched mid-September, JasmyLab\'s own fact page still says "in development". Say "announced with Panasonic", not "Panasonic partnered".'),

    ('h2', 'Slide 6 · What Isn\'t Public'),
    ('b', 'A claim floats around of "600 million yen in node sales in four months" (2025 node licences sold as NFTs). Single secondary source: do not air it.'),

    ('h2', 'Slide 7 · The Unlocks Start Tuesday'),
    ('b', 'Do NOT say "28 billion tokens unlock this week." The 27.84B pays out over 18 to 24 months: that is the roughly 1.2B a month.'),
    ('b', 'Exact size of the first release: 1.18B (Phemex, Startup Fortune) vs 1.23B (calculated from the docs). Say "about 1.2 billion."'),
    ('b', 'The Binance Alpha airdrop at launch was 16,000 JCT per claim, part of the 12.7% already out.'),

    ('h2', 'Slide 8 · Priced Above Its Own Parent'),
    ('b', 'The nine coins in the volume comparison: Bittensor, Render, Akash, JASMY, Theta, Golem, Aethir, io.net, Nosana. Together about $82M in 24h vs JCT\'s $321M.'),
    ('b', 'No revenue figure exists for JCT, so a revenue multiple vs the peers cannot be made.'),

    ('h2', 'Slide 9 · What to Watch'),
    ('b', 'On the CoinGecko flag: it is a signal, not proof. Say "flagged", never "fake volume". Same for the big wallets: do not call them insiders.'),
    ('b', 'The next big date after Tuesday: early May 2027, when the team\'s tokens start.'),
    ('b', 'Contract addresses (if someone asks, or for a scam warning): Ethereum 0xC477B6dfd26EC2460b3b92de18837Fd476Ea7549 · BNB Chain 0xeA37A8DE1de2d9D10772EEB569e28Bfa5Cb17707.'),
]


def write_txt():
    out = []
    for kind, t in CONTENT:
        if kind == 'b':
            out.append('    • ' + t)
        elif kind in ('h1', 'h2'):
            out.append('' if not out else '')
            out.append(t)
        else:
            out.append(t)
    (HERE / f'{NAME}.txt').write_text('﻿' + '\n'.join(out) + '\n', encoding='utf-8')


STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="44"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:rPr><w:i/><w:color w:val="595959"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1F3864"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="280" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="2F5496"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Bullet"><w:name w:val="Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="80"/><w:ind w:left="567" w:hanging="283"/></w:pPr></w:style>
</w:styles>'''


def write_docx():
    style = {'title': 'Title', 'sub': 'Subtitle', 'h1': 'Heading1', 'h2': 'Heading2', 'p': 'Normal', 'b': 'Bullet'}
    paras = []
    for kind, t in CONTENT:
        text = ('•\t' + t) if kind == 'b' else t
        tab = '<w:tabs><w:tab w:val="left" w:pos="567"/></w:tabs>' if kind == 'b' else ''
        runs = ''.join(
            (f'<w:r><w:tab/></w:r>' if i else '') + f'<w:r><w:t xml:space="preserve">{escape(part)}</w:t></w:r>'
            for i, part in enumerate(text.split('\t')))
        paras.append(f'<w:p><w:pPr><w:pStyle w:val="{style[kind]}"/>{tab}</w:pPr>{runs}</w:p>')
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
           '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + ''.join(paras) +
           '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>'
           '</w:body></w:document>')
    ct = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
          '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
          '<Default Extension="xml" ContentType="application/xml"/>'
          '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
          '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
          '</Types>')
    rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
            '</Relationships>')
    drels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
             '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
             '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
             '</Relationships>')
    with zipfile.ZipFile(HERE / f'{NAME}.docx', 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', ct)
        z.writestr('_rels/.rels', rels)
        z.writestr('word/document.xml', doc)
        z.writestr('word/_rels/document.xml.rels', drels)
        z.writestr('word/styles.xml', STYLES)


if __name__ == '__main__':
    for _, t in CONTENT:
        assert '—' not in t, f'em dash in: {t[:60]}'
    write_txt()
    write_docx()
    print('wrote', NAME + '.txt', NAME + '.docx')
