"""Builds evaa-notes.txt + .docx from ONE content list (edit CONTENT, re-run).

The notes doc holds ONLY what is NOT on a slide (Mike, 2026-11-08, every standard video): extra facts, caveats,
numbers that did not fit, likely viewer questions, the do-not-air items. Never a recap of a slide.
Every fact comes from RESEARCH.md. Plain OOXML written with zipfile (no python-docx on this machine).
"""
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

HERE = Path(__file__).resolve().parent
NAME = 'evaa-notes'

# (kind, text): title | sub | h1 | h2 | p | b (bullet)
CONTENT = [
    ('title', 'EVAA Protocol (EVAA): Notes'),
    ('sub', 'Only what is NOT on the slides. Deck: evaa.html (9 slides). Prices as of November 20, 2026, about 14:00 UTC (CoinGecko). Every number is in RESEARCH.md with its source.'),

    ('h1', 'Before you hit record'),
    ('b', 'Live story: EVAA moved 20% or more on four of the last seven days. If you record tomorrow or later, or the price has moved a lot, tell me and I will update the price slides (1, 2, 5, 7, 8) first.'),
    ('b', 'Open evaa.html in Chrome, F = fullscreen, G = webcam guide box, arrows or Space to move. Recording goes in raw/ in this folder.'),

    ('h2', 'Slide 1 · EVAA Just Went 11x in Three Weeks, And 39x From My Call'),
    ('b', 'From the June 6 low of $0.28 it is about 20x. The all-time high of $13.62 came 24 days after launch, then it fell about 98% to that low.'),
    ('b', 'CoinMarketCap shows a market cap of $104M, not $38.6M (it counts more tokens as circulating, slide 5). If a viewer quotes $104M, that is why.'),

    ('h2', 'Slide 2 · A Pump With No News'),
    ('b', 'The only "news" sites point to: a FameEX perp listing on November 16, after the move had already started. KuCoin spot listed it October 5, three weeks before the first leg.'),
    ('b', 'The 3-to-1 short figure counts accounts, not dollars, and only on Gate. Say "more traders betting against it", not "a short squeeze" as a fact.'),
    ('b', 'Funding stayed mild (about 0.01% to 0.06% per 8 hours on Gate). Binance, Bybit and KuCoin futures could not be read from here, so the real totals are larger.'),

    ('h2', 'Slide 3 · A Lending App Inside Telegram'),
    ('b', 'TON\'s coin now shows as GRAM on CoinGecko ("Gram, prev. Toncoin"). Same coin.'),
    ('b', 'One pre-seed angel is described in EVAA\'s own docs as someone who "owned a network of Telegram channels with more than 20 million subscribers".'),
    ('b', 'Right now the app\'s best advertised rates: USDT in the Stable Pool 17.4%, GRAM in the LP Pool 16.6% (EVAA Telegram, November 14). They change daily.'),

    ('h2', 'Slide 4 · The Token Went Up. The Deposits Went Down.'),
    ('b', 'The $118M on the home page is "deposits at the peak" and likely counts borrowed money too; DefiLlama\'s peak is $84.3M. Do not try to reconcile them on air.'),
    ('b', 'No fee or revenue number exists. Upper bound if you need one: $3.6M borrowed at 10% interest is about $360K a year, and that goes to lenders before any protocol cut.'),

    ('h2', 'Slide 5 · How Many Tokens Are Out?'),
    ('b', 'The 17.9M figure comes straight from EVAA\'s own server (api.evaa.space); CoinMarketCap marks it "self-reported".'),
    ('b', 'About 0.95M of the 50M cap is not minted yet; the TON side can still mint it.'),

    ('h2', 'Slide 6 · What Holding EVAA Gets You Today'),
    ('b', 'EVAA\'s active channel is a second one, @evaatg (16.8K subscribers), posting every two or three days. Views per post halved since late September (about 4.5K to about 2K).'),
    ('b', 'X (@evaaprotocol) was not checked. If someone says "they posted on X", that may be true.'),

    ('h2', 'Slide 7 · Priced Like a Lending App With 141x the Deposits'),
    ('b', 'On CoinMarketCap\'s market cap ($104M) EVAA is about 16x its deposits, not 5.8x.'),
    ('b', 'EVAA\'s 24h volume ($42M) is about 47x Venus\'s.'),

    ('h2', 'Slide 8 · What to Watch'),
    ('b', 'Do not quote "top 100 wallets hold 99.5%" (a news site): it counts exchanges and the multisigs. Do not quote "staking yields up to 54%" or "security incidents in the past": no source.'),
    ('b', 'The November 27 unlock on this slide: 535K EVAA, about $3.1M, from CoinMarketCap\'s self-reported panel. Large holder wallets: owners unknown, never say "the team" or "insiders".'),
    ('b', 'Contract addresses (scam warning): TON EQBKMfjX_a_dsOLm-juxyVZytFP7_KKnzGv6J01kGc72gVBp · BNB Chain 0xaa036928c9c0df07d525b55ea8ee690bb5a628c1.'),
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
