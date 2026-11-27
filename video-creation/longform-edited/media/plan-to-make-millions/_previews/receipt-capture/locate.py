"""Locate the claim sentences on the article pages (page coordinates), after dismissing consent."""
import json
import time

from kit import *

JOBS = {
    "C10": ("https://www.bls.gov/news.release/archives/cpi_11102026.htm", [r"gasoline", r"9\.1 percent"]),
    "R-ALJ": ("https://aljazeera.com/news/2026/10/30/binance-says-6-3bn-stolen-in-biggest-crypto-heist-in-history-what-we-know",
              [r"biggest crypto heist on record", r"20 minutes", r"hot wallet"]),
    "R-BLOCK": ("https://theblock.co/news/markets/2026-10-29-bitcoin-slides-below-77000-binance-hack-432183",
                [r"liquidat", r"CoinGlass", r"1\.5"]),
    "C12": ("https://www.coindesk.com/markets/2026/11/13/bitcoin-slides-to-usd68k-as-nvidia-turmoil-anthropic-ipo-fuel-broader-market-sell-off",
            [r"Nvidia", r"Anthropic", r"risk-off", r"at once|several|multiple|combination|confluence"]),
    "C9": ("https://www.aljazeera.com/economy/2026/11/19/anthropic-starts-trading-in-the-us-after-blockbuster-ipo",
           [r"largest initial public offering", r"81"]),
    "C18": ("https://x.com/mikeneder/status/2123379202254680088", [r"Nov 19", r"2026", r"PM|AM", r"billion market cap"]),
    "R-NVDA-NEWS": ("https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director",
                    [r"November 23", r"Reinstates"]),
    "C20a": ("https://cryptorich.vip/", [r"since 2013", r"software developer", r"New Coin Alert", r"rug", r"\$|per month|/mo"]),
    "C20b": ("https://cryptorich.vip/showcase", [r"Called by"]),
}
import sys
only = set(sys.argv[1:])
with sync_playwright() as p:
    br = launch(p)
    for rid, (url, pats) in JOBS.items():
        if only and rid not in only:
            continue
        page = new_page(br, dsf=1)
        try:
            goto(page, url, 6)
            print(f"== {rid} consent={click_buttons(page, CONSENT_BUTTONS)} title={page.title()[:80]}")
            time.sleep(1.5)
            print("   page height", page.evaluate("document.documentElement.scrollHeight"))
            for pat in pats:
                for r in find_text(page, pat, limit=5):
                    print(f"   [{pat}] y={r['y']} x={r['x']} w={r['w']} h={r['h']} <{r['tag']}> {r['text'][:200]}")
        except Exception as e:
            print(rid, "ERR", str(e).splitlines()[0])
        page.close()
    br.close()
