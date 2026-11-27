"""Probe every receipt URL: status, title, first viewport shot (scratch, not deliverables)."""
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).parent
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/128.0.0.0 Safari/537.36")
URLS = {
    "R-HL1": "https://techcrunch.com/2026/11/01/binance-resumes-withdrawals-following-6-3-billion-breach/",
    "R-HL2": "https://aljazeera.com/economy/2026/10/30/oil-flows-are-up-as-iran-war-turmoil-eases-why-do-prices-keep-rising",
    "R-HL3": "https://www.foxbusiness.com/markets/nvidia-shares-plunge-more-7-premarket-trading-ceo-uncertainty-rattles-ai-stocks",
    "R-HL4": "https://www.fool.com/coverage/stock-market-today/2026/11/20/stock-market-today-nov-20-stocks-plunge-as-ai-trade-unwinds/",
    "C27": "https://www.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD&interval=D",
    "C7": "https://www.binance.com/square/post/382966351297065",
    "R-ALJ": "https://aljazeera.com/news/2026/10/30/binance-says-6-3bn-stolen-in-biggest-crypto-heist-in-history-what-we-know",
    "R-BLOCK": "https://theblock.co/news/markets/2026-10-29-bitcoin-slides-below-77000-binance-hack-432183",
    "C10": "https://www.bls.gov/news.release/archives/cpi_11102026.htm",
    "C11": "https://www.foxbusiness.com/markets/stocks-nov-5-2026",
    "C8": "https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000082/nvidiaannouncesceotransiti.htm",
    "C9": "https://www.aljazeera.com/economy/2026/11/19/anthropic-starts-trading-in-the-us-after-blockbuster-ipo",
    "C12": "https://www.coindesk.com/markets/2026/11/13/bitcoin-slides-to-usd68k-as-nvidia-turmoil-anthropic-ipo-fuel-broader-market-sell-off",
    "R-NVDA-NEWS": "https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director",
    "R-NVDA-CHART": "https://www.tradingview.com/chart/?symbol=NASDAQ%3ANVDA&interval=D",
    "C15": "https://www.coingecko.com/en/coins/pieverse",
    "C18": "https://x.com/mikeneder/status/2123379202254680088",
    "C13": "https://www.coingecko.com/en/coins/evaa-protocol",
    "R-NEWCOINS": "https://www.coingecko.com/en/new-cryptocurrencies",
    "C20a": "https://cryptorich.vip/",
    "C20b": "https://cryptorich.vip/showcase",
}
only = set(sys.argv[1:])
out_dir = HERE / "probe"
out_dir.mkdir(exist_ok=True)
results = {}
with sync_playwright() as p:
    br = p.chromium.launch(headless=True, channel="chrome")
    for rid, url in URLS.items():
        if only and rid not in only:
            continue
        page = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1, user_agent=UA)
        info = {"url": url}
        try:
            resp = page.goto(url, wait_until="domcontentloaded", timeout=60000)
            info["status"] = resp.status if resp else None
            time.sleep(6)
            info["final_url"] = page.url
            info["title"] = page.title()
            info["h1"] = (page.locator("h1").first.inner_text(timeout=2000) if page.locator("h1").count() else "")
            page.screenshot(path=str(out_dir / f"{rid}.png"))
        except Exception as e:
            info["error"] = str(e).splitlines()[0]
        print(rid, json.dumps(info, ensure_ascii=False))
        results[rid] = info
        page.close()
    br.close()
(HERE / "probe.json").write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
