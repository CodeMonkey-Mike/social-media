"""Builds binance-talking-points.txt + .docx from ONE content list (edit CONTENT, re-run).

The .docx is plain OOXML written with zipfile (no python-docx on this machine), same layout as near-vs-tao's.
"""
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

HERE = Path(__file__).resolve().parent
NAME = 'binance-talking-points'

# (kind, text): title | sub | h1 | h2 | p | b (bullet)
CONTENT = [
    ('title', 'The Binance Hack'),
    ('sub', 'Talking points for a free-form screen-share recording. Not a script: glance, then talk.'),
    ('sub', 'Deck: binance.html (5 slides) · target 8 to 12 minutes · facts as of October 31, 2026'),

    ('h1', 'Before you hit record'),
    ('b', 'Open binance.html in Chrome and press F for fullscreen. Right/Down arrow or Space = next slide, Left/Up = back (the dots on the right jump to a slide).'),
    ('b', 'Press G to show the webcam guide box (bottom-right). Line your OBS webcam up on it, then press G again to hide it. No slide puts anything in that corner.'),
    ('b', 'OBS 1080p30, webcam bottom-right. No noise gate or noise suppression on the mic.'),
    ('b', 'Say the slide title out loud when you land on each slide. That gives me a clean cue for the overlays later.'),
    ('b', 'This is a live story. Binance plans to reopen withdrawals Sunday November 1 and publish Proof of Reserves Monday November 2. If you record after Sunday, tell me what happened and I will update slide 5 first.'),
    ('b', 'Drop the recording into raw/ in this same folder (media/standard/binance/raw/) when done.'),

    ('h1', 'The angle'),
    ('p', 'The biggest theft in history just hit the biggest exchange in crypto, and the trail points to North Korea. The twist: Binance users will probably not lose a dollar, because Binance is paying for it out of its own pocket. The story has three layers: how they got in (it was not one laptop), where the money went (stablecoins frozen, Bitcoin sitting, ETH being laundered), and who is behind it (a state hacking unit that has now stolen $12.8B). End on what to watch: Sunday and Monday.'),
    ('p', 'Two numbers from the Bitcoin Strategy video are not quite right, so use these instead: the bulk left in about 20 minutes (not 14), and the whole drain ran about 3 hours 50 minutes (not under 3 hours).'),

    ('h2', 'Slide 1 · The Biggest Heist in History'),
    ('p', 'On screen: $6.3B stolen from Binance\'s hot wallets; three stat cards (~20 min, 4x+ Bybit, 10 blockchains); the Elliptic quote.'),
    ('b', 'Thursday October 29, about 4 pm New York time (20:05 UTC). Attackers emptied Binance\'s hot wallets: the online wallets an exchange uses to pay out withdrawals fast.'),
    ('b', 'Binance says about $6.3B. TRM Labs counts $6.36B, Chainalysis and Elliptic about $6.4B.'),
    ('b', 'Most of it was gone in about 20 minutes. Ten blockchains at once: Ethereum, Bitcoin, Tron, XRP, Solana, Arbitrum, Optimism, Base, Avalanche, Polygon.'),
    ('b', 'The old record was Bybit, February 2025, $1.46B. This is more than four times that.'),
    ('b', 'Elliptic: "almost certainly the single largest known theft of any kind." The previous biggest theft of anything was Saddam Hussein taking about $1B from Iraq\'s central bank in 2003. This is about six times that.'),
    ('b', 'Perspective: it is about 4% of what Binance held (around $145B) before the hack.'),
    ('p', 'Into slide 2: "So how do you steal six billion dollars from the biggest exchange in the world?"'),

    ('h2', 'Slide 2 · Not One Laptop. Not One Click.'),
    ('p', 'On screen: the Thursday-night timeline (20:05, 20:20, 20:23, 21:01) and "The Story Changed" (laptop, additional points of breach, self-destruct tool, EIP-7702); strip: "Ethereum wasn\'t broken."'),
    ('b', 'It was planned. The attackers funded their wallet through Tornado Cash a day before, deployed their code, and tested it on other wallets first. Then they fired everything in one burst.'),
    ('b', '20:05 the XRP wallets go first. 20:20 the Bitcoin hot wallet sends 18,270 BTC, and at the same moment one Ethereum transaction lands carrying 50 pre-signed approvals.'),
    ('b', 'The trick is an Ethereum feature called EIP-7702 (added in May 2025). It lets a normal wallet hand its controls to a smart contract. The attackers had 50 of those approvals already signed with Binance\'s own hot-wallet key, all pointing at their "sweeper" contract. Once it went through, the wallet swept itself: $2.53B in a single transaction, about three minutes later.'),
    ('b', 'And it kept sweeping. Anything deposited into that wallet afterwards got pulled too, with no new signature needed.'),
    ('b', 'The story changed. Day 1 (Friday morning): one DevOps engineer\'s hacked laptop. Hours later, Update #2: "additional points of breach." Richard Teng, Binance co-CEO: not carried out by one person, not a one-click action.'),
    ('b', 'They used a self-destruct mechanism that wiped their tools and traces. And Teng says the EIP-7702 approval "did not pass through our normal approval controls."'),
    ('b', 'Important: Ethereum was not hacked. Binance\'s own signing system signed for the attacker. Even the CFTC chair said the exploit did not break Ethereum or its smart contracts.'),
    ('b', 'Binance says no private keys leaked. Not everyone buys that: Mark Karpeles, the former Mt. Gox CEO, told Reuters he thinks keys for at least two wallets were accessed. (Optional one-liner.)'),
    ('p', 'Into slide 3: "So where is six billion dollars right now?"'),

    ('h2', 'Slide 3 · Follow the Money'),
    ('p', 'On screen: three cards: Frozen ~$3B, Sitting 18,270 BTC, Moving ETH + TRX; strip: stablecoins can be frozen, Bitcoin can\'t.'),
    ('b', 'Frozen: Binance says about $3B. Independent counts land at $2.7B to $2.85B, roughly 44%. Almost all of it is stablecoins.'),
    ('b', 'Tether froze about 1.77B USDT, Circle about 823M USDC, both within about an hour. Ripple (RLUSD), World Liberty (USD1), Paxos and First Digital froze theirs too. Arbitrum\'s security council pulled about $30M back out of the attacker\'s wallet, Optimism about $5M.'),
    ('b', 'Sitting: 18,270 BTC, about $1.41B, split into 19 wallets of mostly 1,000 BTC each. None of it has touched an exchange or any service yet. Nobody can freeze Bitcoin, so they can wait.'),
    ('b', 'That is the North Korea pattern: let the Bitcoin sit for months, move it when nobody is watching.'),
    ('b', 'Moving: the attackers raced the freezes. They dumped about $786M of stablecoins for ETH and TRX, at losses of 12% to 26%, just to get out of anything freezable.'),
    ('b', 'The laundering is automated: Chainalysis sees thousands of transfers. One Tron wallet made 546 transfers, one about every 96 seconds.'),
    ('b', 'Optional: Beam reportedly burned the BEAM tokens the hacker held (about 984M BEAM, ~$3.4M). Only secondary sources, so say "reportedly".'),
    ('p', 'Into slide 4: "And every firm that traces this stuff points at the same place."'),

    ('h2', 'Slide 4 · The North Korea Connection'),
    ('p', 'On screen: TraderTraitor panel (attribution, fake jobs, IT workers, the signing-system playbook), the track-record table (Ronin, Bybit, Bitget, Binance), three stats ($12.8B, ~89%, ~50%).'),
    ('b', 'TRM Labs and Chainalysis: North Korea, specifically the group called TraderTraitor, with "high confidence". Elliptic says "likely". The FBI says it is engaged but has not named anyone yet. For Bybit it took the FBI five days. Say it straight: firms, not governments, have named them so far.'),
    ('b', 'Who they are: Lazarus Group is the umbrella name. TraderTraitor is the crypto unit, run by the RGB, North Korea\'s main intelligence agency. Microsoft calls them Jade Sleet.'),
    ('b', 'How they get in: fake job offers. Ronin (2022) started with a fake LinkedIn job and an offer PDF carrying spyware. DMM Bitcoin (2024) started with a fake recruiter and a "coding test" on GitHub. Bybit (2025) started on a developer\'s laptop at Safe, its wallet provider.'),
    ('b', 'IT workers: North Koreans under fake identities got jobs at more than 100 US companies (US Justice Department, June 2025).'),
    ('b', 'The new playbook (Bybit, Bitget, now Binance): do not break the code, hijack the victim\'s own signing system so it signs for you.'),
    ('b', 'The track record: Ronin $620M (2022), Bybit $1.46B (2025), Bitget about $390M (September 2026, one month ago), now Binance $6.3B. Chainalysis links this hack to the Bitget money on-chain.'),
    ('b', 'TRM: North Korea has stolen about $12.8B in crypto since 2017, and $7.4B of it in 2026 alone. Chainalysis: about 89% of all crypto hack losses this year.'),
    ('b', 'Where the money goes: the UN panel found cyber theft brings in about half of North Korea\'s foreign currency. One member state told the panel about 40% of its weapons programs are paid for this way (that 40% is a government claim, not the panel\'s finding). The FBI has said the same about missiles and WMD.'),
    ('b', 'Not much ever comes back: for Bybit, only about 5% was ever recovered or frozen. Binance is the exception at about 44%, only because so much of it was stablecoins.'),
    ('p', 'Into slide 5: "So who pays for all this, and should you be worried if you are on Binance?"'),

    ('h2', 'Slide 5 · Covered on Paper. Sunday Is the Test.'),
    ('p', 'On screen: Who Pays ($6.34B, hot wallets only, 90% covered, Mt. Gox/FTX contrast, BNB -4.9%) and What\'s Next (withdrawals open Sunday vs the deadline slips); scam alert strip.'),
    ('b', 'Binance set aside more than $6.34B of company money, from SAFU (its user protection fund), its futures insurance fund and its treasury. About $5B of it was already sitting in the exact tokens that got stolen; the rest it is buying on the market and over the counter.'),
    ('b', 'October 31: Binance says up to 90% is covered. Careful: that means backed, not recovered from the hacker.'),
    ('b', 'Only hot wallets got hit. Most customer money sits in cold wallets, offline.'),
    ('b', 'CZ\'s point: biggest in dollars, not in Bitcoin. "MtGox was 650,000 BTC!" At Mt. Gox and FTX the customers lost. Here the only victim is Binance itself.'),
    ('b', 'The market agrees, so far: BNB is down only about 4.9% since the hack (about $93B market cap). Cantor Fitzgerald, TD Cowen and Compass Point told clients to buy the weakness. TD Cowen: "We do not stop using dollars when a bank is robbed."'),
    ('b', 'The regulators: CFTC chair Michael Selig says it "proves our exact point" about offshore exchanges, and wants a way for them to register in the US.'),
    ('b', 'Two ways from here. Withdrawals open Sunday, Proof of Reserves Monday, every customer dollar is there: this fades, like Bybit did. Or the deadline slips with no clear reason, people run for the exit at once, and that is how a hack turns into an FTX.'),
    ('b', 'Binance assets on DefiLlama: $144.9B before, $134.8B now. That number cannot show a run yet, because nobody can withdraw. The real test starts when withdrawals open.'),
    ('b', 'Scam alert: Binance has announced no claims process. Any "refund", "compensation form" or "hack victim airdrop" is a scam. Never sign anything or pay a fee to "release" funds. Binance never asks for your 2FA codes or seed phrase.'),
    ('h2', 'Your close (your call)'),
    ('b', 'Your own take on Binance in a sentence or two, and the lesson for viewers: not your keys, not your coins. Cold storage for anything you are not trading.'),
    ('b', 'Ask viewers: did this change how much you keep on exchanges?'),

    ('h1', 'Sources (all read October 31, 2026)'),
    ('b', 'TRM Labs, "North Korea Steals USD 6.36 Billion From Binance" (Oct 30) and "North Korea Has Stolen USD 12.8 Billion in Crypto" (Oct 30)'),
    ('b', 'Chainalysis, "Binance Hack: Tracing the $6.4 Billion Theft to North Korea" (Oct 30); 89% figure via its X post (Oct 31)'),
    ('b', 'Elliptic, "The largest theft in history: North Korea likely behind the $6.4 billion Binance hack" (Oct 30, updated Oct 31)'),
    ('b', 'Binance Security Incident Update #2 (Oct 30); Richard Teng and CZ posts on X; Cointelegraph live blog'),
    ('b', 'CNBC, "Binance says 90% of $6.3 billion hack losses are now covered" (Oct 31)'),
    ('b', 'Decrypt (CFTC chair Michael Selig, Oct 30); CoinDesk (Cantor, TD Cowen, Compass Point, Oct 30); Al Jazeera / Reuters (Karpeles)'),
    ('b', 'DefiLlama (Binance CEX assets) and CoinGecko (BNB), queried Oct 31'),
    ('b', 'FBI IC3 PSA on Bybit (Feb 26, 2025); FBI on Ronin (Apr 2022); UN Panel of Experts report (Mar 2024); US DOJ on IT workers (Jun 30, 2025)'),
    ('b', 'Full sourced research with URLs: RESEARCH.md in this folder'),
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
