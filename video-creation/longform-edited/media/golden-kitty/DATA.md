# golden-kitty: DATA (research dump; every number carries a source)
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift, re-pull before recording/render._
_Compiled 2026-10-01 for the LOCKED brief "Golden Kitty: The Robinhood Chain Token Backed by Gold" (target 7:00, window 5:00 to 8:00; very bullish, verified-claims-only, no em dashes, Robinhood lime green / gold palette). Spelling per persona: Golden Kitty, ticker $GOLDEN, X handle @golden_kitty_rh._

**READ THIS FIRST (three findings that touch the locked brief, detail in Open questions):**
1. **No primary source was found for "Vlad Tenev was photographed holding up a Golden Kitty."** Robinhood's own 2015 award post carries a GRAPHIC, not a photo of a person. The project site shows a photo of an unnamed man holding a trophy and does not say who he is. Until Mike supplies the source, the Vlad photo claim is NOT airable (Open question 1).
2. **"Backed by gold" is contradicted by the project's own site**, which says $GOLDEN "is not backed by, does not represent, and cannot be redeemed for gold or $GLD". What IS verifiable: the main pool is quoted in, and holds, tokenized gold (GLD) (Open question 2).
3. **Gold is not a base that only goes up.** The GLD ETF is about 21% below its February 2026 monthly close at read time. Over about two years it is up about 50% (Open question 3).

**Source access notes (read before citing):**
- `robinhoodchain.blockscout.com` (the explorer) sits behind a Cloudflare challenge: API and page fetches returned "Just a moment". On-chain figures were read instead straight from the official public RPC `https://rpc.mainnet.chain.robinhood.com` (RPC URL from docs.robinhood.com/chain/connecting) with `eth_call`. The receipt-capturer needs a real browser for explorer screenshots.
- `web.archive.org` cannot be fetched by the tool. The 2015 Robinhood post was read through X's public embed endpoint (`cdn.syndication.twimg.com/tweet-result?id=679773248020594688`) and its attached image was downloaded and viewed.
- Product Hunt's Medium post "The Golden Kitty Awards: 2015 Winners" (medium.com/@producthunt/...9e19cce3d683) returned 403. The 2015 facts come from Product Hunt's hall of fame page, Product Hunt's Robinhood awards page, Robinhood's own posts, and a Dec 28, 2015 press write-up.
- `producthunt.com/golden-kitty-awards/hall-of-fame` (no year) and `?year=2018` exceed the fetch size limit; `?year=2015` opened but truncated after the first categories.
- Robinhood's Q2 2026 press release (investors.robinhood.com) timed out twice. The Q2 figures below are from Investing.com's write-up of the release (opened) and match the release's search snippet. Treat as HIGH but re-confirm on the primary page at capture time.
- Benzinga (SEC tokenized-stock pathway) returned 403: NOT opened, NOT cited as fact (Open question 6).
- The X timeline of @golden_kitty_rh and the Telegram member count could not be read without a logged-in browser (Open question 5).
- The project site goldenkitty.vip was read from its raw HTML, including the inline script that feeds its "Gold treasury" widget, and the widget's data endpoint was opened directly.
- Scratch images used to view the tweet photo were saved to the OS temp folder and deleted; nothing was written to the repo except this file.

---

## 1. The thesis, sourced

Each row: statement · source URL · read date · confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | "The Golden Kitty is a real trophy with a real history." Product Hunt's Golden Kitty Awards ran for ten years. Product Hunt: "after ten years, we're officially sunsetting the Golden Kitty Awards." The first edition was 2015: "its first annual awards for the coolest things to come out in the year, named 'The Golden Kitty Awards.'" | https://www.producthunt.com/newsletters/archive/45536-rip-golden-kitty-awards (Nov 17, 2025) · https://pctechmag.com/2015/12/product-hunt-users-say-these-are-the-10-best-tech-products-of-2015/ (Dec 28, 2015, citing Business Insider) | 2026-10-01 | HIGH |
| T2 | Robinhood won one. Robinhood's own post, Dec 23, 2015: "Thanks to YOU, Robinhood won the Golden Kitty Award for the Sexiest Product of the Year!!" Robinhood newsroom, Jan 7, 2016: "the coveted Golden Kitty Award from Product Hunt". Product Hunt lists Robinhood: Golden Kitty 2015, "Sexiest Product". | https://x.com/RobinhoodApp/status/679773248020594688 · https://robinhood.com/us/en/newsroom/robinhoodrewind-2015/ · https://www.producthunt.com/products/robinhood/awards | 2026-10-01 | HIGH (primary, verbatim) |
| T3 | "Vlad Tenev, the CEO of Robinhood, was photographed holding one up." | NOT FOUND. Four targeted searches plus the project site, Robinhood's 2015 post, and Robinhood's newsroom post. None shows or names Vlad Tenev with the trophy. | 2026-10-01 | **UNSOURCED. Do not air as fact (Open question 1)** |
| T4 | "That image became a token on Robinhood's own chain." What is sourced: $GOLDEN is a token on Robinhood Chain (chain ID 4663) whose site says it is "a fan dedication to Robinhood winning Product Hunt's 2015 Golden Kitty award for Sexiest Product of the Year." It is dedicated to the TROPHY and the award. The site never mentions Vlad Tenev. | https://goldenkitty.vip/ · DexScreener API pair record | 2026-10-01 | HIGH for "trophy became a token"; the "Vlad image" part is unsourced |
| T5 | "It is paired to tokenized gold." Main pool: GOLDEN / GLD on Uniswap v4, quote token "SPDR Gold Trust • Robinhood Token" (GLD, 0xC9a981FEE1F9DEc688bb123ccDeCc63D0deBFC4e). Site: "$GOLDEN's pool on Robinhood Chain trades against tokenized gold ($GLD), so $GOLDEN is quoted in gold". | https://api.dexscreener.com/latest/dex/pairs/robinhood/0x2b2f171fe944df3f8b230272682755b7d5c8adb0e2d76aabb621f1f870251841 · https://goldenkitty.vip/ | 2026-10-01 | HIGH |
| T6 | "Its base is tied to the value of gold instead of a coin that can bleed." Supported: the USD price of GOLDEN = (GOLDEN price in GLD) x (GLD price in USD), so gold's move passes through. NOT supported: that the base cannot fall. GLD itself has fallen about 21% from its Feb 2026 monthly close. The site's wording is one-directional ("when gold climbs, the price of $GOLDEN goes up"); the reverse is equally true mechanically. | section 2, Pillar 3 | 2026-10-01 | MEDIUM (mechanism HIGH, "can't bleed" framing not supported; Open question 3) |
| T7 | "A brand-new chain." Robinhood Chain public mainnet launched July 1, 2026 (Robinhood newsroom, dated July 1, 2026, London). | https://robinhood.com/us/en/newsroom/robinhood-accelerates-global-expansion-robinhood-chain-mainnet-stock-tokens-agentic-trading/ | 2026-10-01 | HIGH (primary) |
| T8 | Title claim "Backed by Gold". The project site: "It trades in a pool paired with tokenized gold ($GLD) but is not backed by, does not represent, and cannot be redeemed for gold or $GLD." | https://goldenkitty.vip/ (footer disclaimer) | 2026-10-01 | **CONTRADICTED by the project itself (Open question 2)** |

---

## 2. Pillar facts

### Pillar 1: the backstory of the Golden Kitty trophy

- **Who awards it:** Product Hunt. The project site's FAQ: "The Golden Kitty is the trophy Product Hunt hands out at its yearly Golden Kitty Awards." (https://goldenkitty.vip/, read 2026-10-01).
- **Since when:** 2015 was the first edition. "This year, Product Hunt decided to hold its first annual awards for the coolest things to come out in the year, named 'The Golden Kitty Awards.'" Voting began December 9, 2015; users nominated and voted "in a variety of categories, from best maker to most WTF product" (PC Tech Magazine citing Business Insider, Dec 28, 2015, https://pctechmag.com/2015/12/product-hunt-users-say-these-are-the-10-best-tech-products-of-2015/, read 2026-10-01).
- **How it works:** community nomination and vote. For the 2022 edition: "The community nominated products across 24 categories, and we all voted for our favorites amongst them." (Product Hunt newsletter, https://www.producthunt.com/newsletters/archive/18243-product-of-the-year-is, read 2026-10-01).
- **2015 winners that are sourced:** Product of the Year: Slash Keyboard 2.0. Maker of the Year: levelsio (@levelsio). Categories that year included Mac App, Game, Podcast Episode, Sexiest Product, Book, WTF (https://www.producthunt.com/golden-kitty-awards/hall-of-fame?year=2015, read 2026-10-01; page truncated after the first categories). Top 10 products of the 2015 vote: Slash Keyboard, Raspberry Pi Zero, Tesla Powerwall, Periscope, Be My Eyes, Startup Stash, Apple Watch, Overcast 2.0, Lily Drone Camera, Facebook M (PC Tech Magazine, same URL).
- **Other notable winners that are sourced:** 2022 edition: ChatGPT (AI Product of the Year), Wordle (Most Viral), Amie (Best Designed), daily.dev (Best Community & Social Product), Spark (Best Productivity Tool) (https://www.producthunt.com/newsletters/archive/18243-product-of-the-year-is, read 2026-10-01). 2018 edition: Coinbase Wallet won "Crypto Product of the Year" (Product Hunt newsletter, Jan 17, 2019, https://www.producthunt.com/newsletters/archive/2411-and-the-golden-kitty-award-winners-are, read 2026-10-01).
- **Household-name winners (added 2026-10-01 for CH2 Beat 4, Mike's pick to replace Wordle; all read 2026-10-01):**
  - **Telegram**, Breakout Product of the Year, 2017 edition. Product Hunt newsletter, Jan 28, 2018: "Congrats to Telegram for winning Breakout Product of the Year, followed closely by category favorite, Coinbase" (https://www.producthunt.com/newsletters/archive/540-golden-kitty-awards-winners). HIGH (primary).
  - **TikTok**, Product of the Year, 2018 edition. Product Hunt newsletter, Jan 17, 2019: "Product of the Year: Tik Tok" (https://www.producthunt.com/newsletters/archive/2411-and-the-golden-kitty-award-winners-are); Product Hunt's TikTok awards page lists 2018 "Product of the Year". Same newsletter: Hardware Product of the Year: Apple Watch Series 4; Smart Home Product of the Year: Google Home Hub. HIGH (primary).
  - **Tesla**, Model S P100D, "Sexiest Product", 2016 edition (the category Robinhood won in 2015). Product Hunt's Tesla Model S awards page lists 2016 "Sexiest Product" (https://www.producthunt.com/products/tesla-model-s/awards); the winner list (Model S P100D ahead of Spectacles; Tesla Solar Roof winning Most Breakthrough Product) is from Webrazzi, Dec 20, 2016 (https://webrazzi.com/2016/12/20/product-hunta-gore-yilin-en-iyi-teknolojik-urunleri/). Corroboration: Product Hunt's Jan 28, 2018 newsletter calls Elon Musk a "2x Golden Kitty Award winner". MEDIUM-HIGH (Product Hunt's own 2016 announcement was not opened; a Product Hunt awards-page entry can also mean a top-three placement).
  - **Apple**, AirPods Pro, Product of the Year, 2019 edition; MacBook Pro 16", Hardware Product of the Year, 2019. Product Hunt, "Announcing the 2019 Golden Kitty Award Winners", Jan 29, 2020 (https://www.producthunt.com/stories/announcing-the-2019-golden-kitty-award-winners). HIGH (primary).
  - **Google**, Gboard, Product of the Year, 2016 edition, runner-up Pokemon GO (https://www.producthunt.com/golden-kitty-awards/hall-of-fame?year=2016). HIGH (primary).
  - Also sourced, not scripted: Brave (Privacy-Focused Product of the Year, 2019, same Jan 29, 2020 post); Clubhouse (Product of the Year, 2020, newsletter Jan 28, 2021, https://www.producthunt.com/newsletter/7919-golden-kitty-winners); Reddit Collectible Avatars (Best Web3 Product, 2022) and Canva Visual Worksuite (Best Design Tool, 2022) (newsletter 18243); Threads by Meta (Community & Social, 2023) and GPT-4 (AI Model, 2023) (newsletter Jan 29, 2024, https://www.producthunt.com/newsletters/archive/27186-and-the-award-goes-to); Cursor (Product of the Year, 2024, newsletter Jan 29, 2025, https://www.producthunt.com/newsletters/archive/37218-and-the-award-goes-to).
  - On-screen rule: the spoken line names the COMPANY ("Tesla", "Apple", "Google"); the winners container shows the PRODUCT that won and its category and year, exactly as above.
- **The awards are retired:** Product Hunt, Nov 17, 2025: "after ten years, we're officially sunsetting the Golden Kitty Awards." Reason given: "the ecosystem has changed. AI moves fast, new categories show up constantly, and a once-a-year award no longer reflects how products actually grow." Replaced by the quarterly Orbit Awards. Forum post by Rajiv Ayyangar (https://www.producthunt.com/p/producthunt/rip-golden-kitty-awards-long-live-orbit-awards and https://www.producthunt.com/newsletters/archive/45536-rip-golden-kitty-awards, read 2026-10-01). Story value: no more Golden Kitties will be handed out, which makes the existing trophies a closed set. That inference is ours, not Product Hunt's wording.
- **Robinhood's win, the receipts:**
  - Robinhood's post on X, 2015-12-23 21:19 UTC, @RobinhoodApp: "Thanks to YOU, Robinhood won the Golden Kitty Award for the Sexiest Product of the Year!!" 73 likes at read. Attached media: ONE image, a dark graphic reading "The GOLDEN KITTY AWARDS" with a cartoon gold cat on a podium and party emoji. **It is a graphic. No person and no physical trophy appear in it.** (https://x.com/RobinhoodApp/status/679773248020594688, read via X embed endpoint 2026-10-01; image https://pbs.twimg.com/media/CW8KKrLUsAAJ-I6.jpg viewed.)
  - Robinhood newsroom, "#RobinhoodRewind 2015", Jan 7, 2016: "We've also been recognized with several awards, including the Apple Design Award (Robinhood is the first finance company to ever earn this distinction) and the coveted Golden Kitty Award from Product Hunt." Signed "The Robinhood Team". No person is named; the page's one image has the alt text "image-asset" and was not identifiable as a trophy photo (https://robinhood.com/us/en/newsroom/robinhoodrewind-2015/, read 2026-10-01).
  - Product Hunt's Robinhood page lists two Golden Kitty entries: "2015: Robinhood, Sexiest Product" and "2018: Robinhood Crypto, Crypto" (https://www.producthunt.com/products/robinhood/awards, read 2026-10-01). The same page shows Robinhood's first Product Hunt launch on December 14, 2013 and "Robinhood for iOS" on December 11, 2014.
  - 2018: the project site says Robinhood Crypto took "a top-three Golden Kitty badge in Crypto". Product Hunt's page confirms a 2018 Crypto-category Golden Kitty entry for Robinhood Crypto; the category WINNER was Coinbase Wallet. The exact placement (second or third) was not confirmed on a page we could open.
- **What the physical trophy looks like (from photos viewed):** a chrome-gold seated cat wearing a visor-style headset, a "P" medallion on its collar, on a round base lettered "Product Hunt" and "Golden Kitty". The site describes it as "a chrome-gold cat with a visor" (https://goldenkitty.vip/, images viewed 2026-10-01).
- **Real-trophy photos with a traceable original post (usable as receipts):**
  - @NivDror, 2016-03-07: "Up close with the Golden Kitty Trophy" (video) https://x.com/NivDror/status/706934541315760128
  - @matcarpenter, 2016-03-14: "Thanks @ProductHunt @rrhoover for not shipping my Golden Kitty trophy with glitter." (photo) https://x.com/matcarpenter/status/709502760023003137
  - @arthcmr, 2017-01-11: "Got the golden kitty award trophy today for @TobyForTabs (Best Chrome Extension of the Year)." (photo) https://x.com/arthcmr/status/818976934478516224
  - All three read via the X embed endpoint 2026-10-01. None of them is Robinhood or Vlad Tenev.
- **The "held up for the camera" photo on the project site:** `goldenkitty.vip/images/kitty-irl-held.jpg`, captioned only "A real one, held up for the camera.", alt text "Someone holding a Golden Kitty trophy up to the camera". It shows a man in glasses, a dark cap and a hoodie holding the trophy in front of two monitors. **The site names no one and links no source post for it.** We do not identify him. If this is the image the brief means, the site itself does not claim it is Vlad Tenev.
- **The Vlad Tenev connection: what is and is not sourced.** Sourced: Vlad Tenev is Robinhood's CEO and co-founder; Robinhood, the company, won the 2015 award. NOT sourced: any photo, clip, or post of Vlad Tenev holding a Golden Kitty; any statement by him about the trophy; any acknowledgement by him or by Robinhood of the $GOLDEN token.
- **Plain-language summary the sources support (for the strategist, not a quote):** In December 2015 Product Hunt ran its first-ever Golden Kitty Awards, voted by its community. Robinhood, then a two-year-old trading app, won "Sexiest Product of the Year" and bragged about it publicly. The awards ran ten years, crowned products like ChatGPT and Wordle along the way, and were retired in November 2025. In 2026 Robinhood launched its own chain, and a fan token dedicated to that 2015 trophy launched on it.

### Pillar 2: the token itself

- **Identity:** Golden Kitty, ticker GOLDEN, contract 0x92e4B008161aC64a7D0C5e540F453F8e6B8Bd8D7, Robinhood Chain (chain ID 4663) (DexScreener API + https://goldenkitty.vip/, read 2026-10-01).
- **What the project says it is:** "a crypto meme coin on Robinhood Chain: a memecoin made as a fan dedication to Robinhood winning Product Hunt's 2015 Golden Kitty award for Sexiest Product of the Year. It has no utility and no intrinsic value. It exists for fun." Hero line: "Robinhood's first crypto award." Sub line: "Independent fan token. Not affiliated with Robinhood." Footer: "an independent fan dedication, not affiliated with, endorsed by, or officially connected with Robinhood Markets, Inc. or Product Hunt." (https://goldenkitty.vip/, read 2026-10-01).
- **Launch:** the GOLDEN / GLD pool was created 2026-09-04 13:50 UTC (DexScreener `pairCreatedAt` 1788529833000). GeckoTerminal records a launchpad graduation completed at the same second, 2026-09-04T13:50:33Z, migrating into this pool (https://api.geckoterminal.com/api/v2/networks/robinhood/tokens/0x92e4b008161ac64a7d0c5e540f453f8e6b8bd8d7/info, read 2026-10-01). The launchpad's NAME is not in the record: do not name one.
- **Supply:** 1,000,000,000 max, total and circulating (CoinGecko API `coins/golden-kitty`, read 2026-10-01). On-chain `totalSupply()` returned 999,999,938.66 GOLDEN (RPC read 2026-10-01 14:20 UTC). Say "one billion".
- **Holders [VERIFY]:** 2,221 holders; top 10 wallets hold 39.99%, wallets 11 to 30 hold 22.26% (GeckoTerminal token info, its own timestamp 2026-10-01 05:55 UTC). The largest "holders" on a DEX token usually include the pool itself; the explorer could not be opened to label them.
- **Developer wallet [VERIFY]:** GeckoTerminal flags developer address 0x96e8c4e0883f8f51fbc626b63a8757d0b707a137 holding 6.82% of supply. RPC `balanceOf` confirms 68,244,514 GOLDEN in that wallet, and 27.12 GLD (read 2026-10-01 14:20 UTC). GeckoTerminal also reports `is_honeypot: false`, no mint authority, no freeze authority.
- **Pools [VERIFY] (DexScreener token API, read 2026-10-01 14:15 UTC):**
  - GOLDEN / GLD, Uniswap v4: liquidity $181,405 (21,417,615 GOLDEN + 237.65 GLD), 24h volume $80,559. This is the main pool by a wide margin.
  - GOLDEN / USDG, Uniswap v4, created 2026-09-27: liquidity $12,504, 24h volume $3,257.
  - GOLDEN / ETH, Uniswap v4, created 2026-09-13: liquidity $205.
- **Price and cap [VERIFY]:** see section 5.
- **How it has traded since launch (GeckoTerminal daily candles for the GLD pool, USD, read 2026-10-01 14:20 UTC; [VERIFY], screencap the real chart rather than restating these):**
  - Launch day 2026-09-04: closed about $0.000274, volume about $318K.
  - 2026-09-13: closed about $0.00193.
  - 2026-09-14: spiked to a high near $0.0119, closed about $0.0115, volume about $1.18M.
  - 2026-09-15: fell to a low near $0.00067 and closed about $0.0019, volume about $1.44M (the heaviest day).
  - 2026-09-16 to 2026-09-28: a steady climb from about $0.0028 to closes between $0.0046 and $0.0056.
  - 2026-10-01 at read: about $0.0042.
  - Launch-day close to read price is roughly 15x (0.004234 / 0.000274). Derived, [VERIFY].
- **Listings and trackers the site links:** CoinGecko, CoinMarketCap, DexScreener, Blockscout, plus Coinbase and MEXC price pages in its metadata (https://goldenkitty.vip/, read 2026-10-01). A price PAGE is not an exchange listing: do not say "listed on Coinbase".
- **How the site tells people to buy:** through the Fomo app (fomo.family), then search "Golden Kitty" on Robinhood Chain (https://goldenkitty.vip/, read 2026-10-01). It does not say the token is in the Robinhood app.
- **Community:** X @golden_kitty_rh, Telegram t.me/golden_kitty (DexScreener profile + site). Follower and member counts were NOT readable this run (Open question 5). CoinGecko shows 221 watchlist users (CoinGecko API, read 2026-10-01) [VERIFY].
- **Acknowledgement by Robinhood or Vlad Tenev:** NONE FOUND. The site states the opposite of an endorsement three times. Related context that IS sourced: Vlad Tenev on X, quoted by Fortune on 2026-07-13: "While we're building Robinhood Chain to be the best chain for RWA [real-world assets]… it works great for memes, too." (https://fortune.com/crypto/2026/07/13/robinhood-chain-memecoin-trading-cash-cat-vlad-tenev-crypto/, read 2026-10-01). That is about memes on the chain in general, not about $GOLDEN.

### Pillar 3: paired to gold

- **What GLD on Robinhood Chain is:** a Robinhood Stock Token. Token name on chain data: "SPDR Gold Trust • Robinhood Token", symbol GLD, contract 0xC9a981FEE1F9DEc688bb123ccDeCc63D0deBFC4e (DexScreener API, read 2026-10-01).
- **What "SPDR" means (added 2026-10-01, Mike asked):** pronounced "spider"; "The name is an acronym for the first member of the family, the Standard & Poor's Depositary Receipts"; SPDR funds are "managed by State Street Global Advisors (SSGA)" (https://en.wikipedia.org/wiki/SPDR, read 2026-10-01). SPDR Gold Shares, "also known as SPDR Gold Trust", listed on the New York Stock Exchange in November 2004 and is "designed to initially track the price of a tenth of a troy ounce of gold" (https://en.wikipedia.org/wiki/SPDR_Gold_Shares, read 2026-10-01). Secondary source; fine for pronunciation and a gloss, re-confirm on State Street's own page before any size claim ("largest gold fund") airs.
- **Who issues it and what it legally is:** "Stock Tokens are tokenized debt securities issued by Robinhood Assets (Jersey) Limited." (https://robinhood.com/rhj/stocktokens/, read 2026-10-01). The docs call them "tokenised debt securities" that are "standard ERC-20 tokens", covering "underlying securities like US shares and ETFs" (https://docs.robinhood.com/chain/stock-tokens/, read 2026-10-01).
- **What backs it:** "Every single Stock Token in circulation is backed 1:1 by the corresponding underlying equity." "The underlying shares are held securely by our US-based custody partner." (https://robinhood.com/rhj/stocktokens/, read 2026-10-01). For GLD the underlying is a share of the SPDR Gold Trust ETF, which is the fund that holds physical gold. So the chain is: gold bars, held by the ETF, whose share backs the Robinhood token. The token is NOT a direct claim on bars.
- **Holder rights:** Stock Tokens "do not grant investors any legal or beneficial rights in, or against the issuer of, those underlying securities." Redemption: "You can sell your Stock Tokens from time to time in the secondary market. You can also redeem them directly with the Issuer." (https://robinhood.com/rhj/stocktokens/, read 2026-10-01). That redemption language is about GLD holders and the issuer. It gives GOLDEN holders nothing.
- **U.S. restriction (matters for a U.S. audience):** "Stock Tokens are not registered under U.S. securities laws and may not be offered, sold, or delivered...in the United States or to...U.S. persons." (https://robinhood.com/rhj/stocktokens/, read 2026-10-01; same restriction in the docs, which also list Canada, UK and Switzerland). The video is about GOLDEN, not a pitch to buy GLD; keep it that way.
- **GLD on chain, size [VERIFY]:** on-chain supply 23,604.59 GLD tokens (RPC `totalSupply()`, read 2026-10-01 14:20 UTC); DexScreener shows a GLD market cap of about $8.92M and a GLD / USDG pool with about $1.29M liquidity and about $1.80M 24h volume, price $380.89 (DexScreener `tokens/v1/robinhood/<GLD>`, read 2026-10-01 14:18 UTC).
- **What "paired to GLD" means mechanically (verifiable):**
  - The pool holds two assets: GOLDEN and GLD. At read: 21,417,615 GOLDEN and 237.65 GLD (DexScreener, 14:15 UTC).
  - GOLDEN is quoted in GLD: 0.00001109 GLD per GOLDEN (`priceNative`). Its dollar price is that number times GLD's dollar price.
  - Consequence: if the GOLDEN / GLD ratio holds still and gold rises 10%, GOLDEN's dollar price rises 10%. If gold falls 10%, it falls 10%. The site states only the up direction: "when gold climbs, the price of $GOLDEN goes up."
  - Buyers put GLD into the pool, sellers take GLD out. The GLD in the pool is trading liquidity. It is not locked for holders and it is not a floor.
  - Scale check: the pool's GLD side is about $90.7K against a market cap of about $4.23M, about 2% (derived from the vault endpoint and DexScreener, read 2026-10-01). [VERIFY]
  - Contrast the sources support: most Robinhood Chain memecoins are paired against ETH or a stablecoin (GOLDEN's own minor pools are USDG and ETH). A gold-quoted main pool is the differentiator. A second example of a stock-token-paired meme exists: a "$MEME" coin "paired with tokenized AMC stock" (The Crypto Times, 2026-09-07, https://www.cryptotimes.io/2026/09/07/robinhood-ceo-follow-sends-amc-paired-meme-coin-surging-150/, read 2026-10-01), so do NOT say "the only" or "the first" asset-paired token.
- **The "Gold treasury": exactly what it is.** The site has a "Gold treasury" panel fed by `https://golden-stats.memesites.workers.dev/vault.json` (opened 2026-10-01, its own stamp 14:18 UTC). It is the SUM of two things:
  - **Liquidity pool:** 237.65 GLD (about $90,732, about 21.82 oz of gold equivalent).
  - **Fees earned:** 235.89 GLD (about $90,060, about 21.66 oz), of which 233.90 GLD already CLAIMED in 40 claims (last claim 2026-09-30 20:41 UTC) and 1.99 GLD unclaimed.
  - **Total shown:** 473.54 GLD, about $180,791, about 43.47 oz. [VERIFY]
  - The site's own code comment describes it as: "Gold vault: fees earned in GLD + GLD in the pool".
  - **State it plainly:** this is a running tally of trading fees the pool has earned in GLD plus the GLD sitting in the pool. It is the project's self-reported figure. No source shows a separate, locked, or holder-owned treasury wallet. The flagged developer wallet held 27.12 GLD at read (RPC), far less than the 233.90 GLD reported as claimed, so where the claimed fees sit is NOT verified. No source describes any policy for those fees (hold, sell, buy back, add to liquidity).
  - Derived ratio: 1 GLD token is about 0.0918 oz of gold (43.47 / 473.54), consistent with GLD $381.79 against spot $4,158.80.
- **How gold has performed (Yahoo Finance chart data, GLD ETF and gold futures GC=F, monthly closes, read 2026-10-01 14:20 UTC; [VERIFY], show as a real-site screencap):**
  - GLD ETF: about $253.51 at the October 2024 monthly close; about $396.31 at the December 2025 close; a monthly-close peak of about $483.75 in February 2026; about $380.96 at read.
  - So: up about 50% over roughly two years; about 3.9% below the December 2025 close (down year to date); about 21% below the February 2026 monthly close.
  - Gold futures: about $2,749 at the October 2024 monthly close; about $4,745 at the January 2026 close; $4,188.60 at read. Spot gold $4,158.80 per oz (https://api.gold-api.com/price/XAU, stamp 2026-10-01 14:18 UTC).
  - Since GOLDEN launched (2026-09-04): GLD's September monthly close was about $391.69 and it was $380.96 at read, so gold was slightly DOWN across the token's life while GOLDEN rose. The token's gains so far came from the GOLDEN / GLD ratio, not from gold.
- **Plain-language summary the sources support (for the strategist, not a quote):** GOLDEN's main pool is quoted in Robinhood's tokenized gold ETF token, so every trade is priced in gold and the pool's reserve asset is tokenized gold. Trading fees accrue in tokenized gold too, about 236 GLD so far per the project's own tracker. Compared with a meme paired to ETH, the quote asset here is gold, which has roughly a 50% gain over two years behind it and far lower volatility than ETH (the volatility comparison is general knowledge, not sourced in this file). It is still a memecoin: no backing, no redemption, no peg, no floor, and the project says so itself.

### Pillar 4: the Robinhood Chain

- **Launch:** public mainnet July 1, 2026, announced from the Old Royal Naval College in London (https://robinhood.com/us/en/newsroom/robinhood-accelerates-global-expansion-robinhood-chain-mainnet-stock-tokens-agentic-trading/, read 2026-10-01). The testnet "processed more than 200 million transactions" before mainnet (Arbitrum forum factsheet, July 6, 2026, https://forum.arbitrum.foundation/t/arbitrumdao-factsheet-robinhood-chain-mainnet-launch/31041, read 2026-10-01).
- **What it is built on:** Robinhood docs: "A permissionless, Ethereum-compatible Layer-2 blockchain built to support a new era of onchain financial infrastructure", built on Arbitrum technology with "ETH as its native gas token"; it uses a "first-come, first-served sequencing model" (https://docs.robinhood.com/chain/, read 2026-10-01). Chain ID 4663, explorer robinhoodchain.blockscout.com (https://docs.robinhood.com/chain/connecting, read 2026-10-01). It settles to Ethereum (Arbitrum forum factsheet). Arbitrum's factsheet cites "100ms latency through configurable block times and preconfirmations".
- **What it is for:** bringing "traditional markets, crypto, and real-world assets together on a fast, efficient, and open network" (docs). Stock Tokens: "tokenised debt securities, held in self-custody through the Robinhood Wallet, with 24/7 trading in more than 120 countries" (Arbitrum forum factsheet).
- **Day-one stack (Robinhood newsroom, July 1, 2026):** Uniswap (dedicated AMM) and Pleiades (proprietary AMM) as day-one partners; integrations with Alchemy, BitGo, Chainlink; Stock Tokens tradable 24/7 via Uniswap, Rialto, Lighter, Arcus, 1inch; Robinhood Earn rolling out to eligible U.S. users at an estimated 7% APY on USDG through Morpho; perpetuals in Robinhood Wallet on Lighter.
- **Arbitrum revenue share:** 10% of protocol net revenue goes to Arbitrum (8% DAO treasury, 2% Arbitrum Developer Guild) (Arbitrum forum factsheet, read 2026-10-01).
- **Numbers [VERIFY] (DefiLlama API, read 2026-10-01 14:17 to 14:21 UTC):**
  - DeFi TVL: about $1.04B (the highest daily value in DefiLlama's series so far).
  - DEX volume: about $1.51B in 24h, about $9.44B over 7 days, about $55.99B over 30 days, about $99.02B all time (three months of life).
  - **How the all-time figure is built (re-checked 2026-10-01, DefiLlama API `api.llama.fi/overview/dexs/Robinhood%20Chain`):** `totalAllTime` = $98.97B is the SUM of 110 protocols' own all-time totals, and that list includes a trading app (GMGN, $6.41B) and an aggregator (0x, $0.48B) whose trades are routed through the DEXs already counted, so it likely double-counts about $6.9B. DefiLlama's own daily chain DEX-volume chart sums to $92.14B (first real day 2026-06-30; peak day 2026-09-04 at $3.67B). The conservative, defensible spoken figure is "more than ninety billion"; "about ninety-nine billion" is the headline number with the likely overlap in it. DexScreener shows a chain's 24h volume only, no all-time total. [VERIFY]
  - Top DEXs by 24h volume: Uniswap V3 about $622M, Uniswap V4 about $558M.
- **Growth timeline (Chainstack, updated 2026-09-21, https://chainstack.com/robinhood-chain-growth/, read 2026-10-01; secondary, corroborating):** July 9: a $568M trading day; July 21: TVL passed $430M; Aug 31: "Daily app revenue beats Ethereum's"; Sept 1: a $1.92M revenue day. As of Sept 21 per Arbitrum's ecosystem dashboard: total asset market cap $2.19B, tokenized RWA value $170.6M (up 342% in 30 days); per DefiLlama: bridged TVL $3.31B.
- **Early memecoin wave (Fortune, 2026-07-13, read 2026-10-01):** trading volume went from just over $200,000 on July 1 to more than $500 million within nine days; the Cash Cat memecoin reached about a $150 million market cap.
- **Number of tokens (secondary):** "around 646,000 token launches since July" on the Pons launchpad (ETHNews, https://ethnews.com/robinhood-chain-volume-halves-as-free-gas-ends-tvl-stays-at-1b/, read 2026-10-01). Secondary only; say "hundreds of thousands of tokens" at most. A trader or address count was NOT sourced.
- **Robinhood's distribution (the growth engine):** "28 million customers across 38 countries, 3 continents" (Robinhood newsroom, July 1, 2026). Q2 2026: 28.4 million funded customers, $369 billion total platform assets, 4.84 million Gold subscribers, record revenue $1.31 billion (Investing.com on the Q2 release, 2026-07-29, https://www.investing.com/news/company-news/robinhood-q2-2026-slides-record-revenue-13-business-lines-top-100m-93CH-4822025, read 2026-10-01).
- **The honest counterweights (the strategist needs these to avoid a false line, not to air as bearish):**
  - Free gas for Robinhood Wallet users ended September 29, 2026. Daily DEX volume was $947M on Sept 28, down from $1.88B on Sept 13; TVL held about $1.02B (ETHNews, read 2026-10-01). Cryptoticker (2026-10-01): TVL "crossed $1 billion on September 22"; chain fees fell about 31% week on week after the subsidy ended (https://cryptoticker.io/en/robinhood-chain-memecoins-explained/, read 2026-10-01).
  - Activity is memecoin-led: ETHNews cites an estimate that only "1%-2% of chain transactions" came from Robinhood app users. Bullish reading the sources allow: the 28.4 million funded customers have barely arrived on the chain yet.

### Pillar 5: what happens next

| Date | Event | Source (read 2026-10-01) |
|---|---|---|
| 2015-12-23 | Robinhood posts its Golden Kitty win ("Sexiest Product of the Year") | https://x.com/RobinhoodApp/status/679773248020594688 |
| 2025-11-17 | Product Hunt retires the Golden Kitty Awards after ten years | https://www.producthunt.com/newsletters/archive/45536-rip-golden-kitty-awards |
| 2026-07-01 | Robinhood Chain public mainnet; Stock Tokens in 120+ countries | Robinhood newsroom (URL above) |
| 2026-07-13 | Fortune reports Tenev: the chain "works great for memes, too" | https://fortune.com/crypto/2026/07/13/robinhood-chain-memecoin-trading-cash-cat-vlad-tenev-crypto/ |
| 2026-09-01 | Tenev replies with an ear emoji to a "Memecoins on Robinhood" proposal; Robinhood "has not announced any new memecoin listing, launch date, or expanded product offering publicly" | https://crypto.news/robinhood-memecoin-expansion-teased-by-ceo-vlad-tenev/ |
| 2026-09-04 | GOLDEN / GLD pool created (13:50 UTC) | DexScreener API |
| 2026-09-07 | Tenev follows the account of an AMC-token-paired memecoin; its cap jumps from $40M to $150M in an hour. "neither Tenev nor Robinhood published a statement endorsing the token." | https://www.cryptotimes.io/2026/09/07/robinhood-ceo-follow-sends-amc-paired-meme-coin-surging-150/ |
| 2026-09-22 | Chain TVL crosses $1B (secondary) | https://cryptoticker.io/en/robinhood-chain-memecoins-explained/ |
| 2026-09-29 | Free-gas subsidy ends (secondary) | ETHNews (URL above) |

**Shipped vs planned (one-line ledger for the close):**
- SHIPPED: Robinhood Chain mainnet (2026-07-01); Stock Tokens with 24/7 trading in 120+ countries; Uniswap, Morpho, Lighter, USDG on chain; Robinhood Earn rolling out to eligible U.S. users; Canada launch (2026-07-01).
- IN PROGRESS / ANNOUNCED AS COMING (Robinhood newsroom, July 1, 2026): agentic trading for crypto, "coming soon to eligible US traders"; UK crypto launch "planned soon"; Singapore capital markets services licence received.
- STATED AMBITION (older, 2025): Tenev to Bloomberg, "We'd like to have thousands of private companies on the platform, accessible to retail," and that the U.S. market shouldn't be "too far behind" (CoinMarketCap Academy, undated "1 year ago", https://coinmarketcap.com/academy/article/crypto-news-robinhood-plans-thousands-of-private-company-stock-tokens, read 2026-10-01). Use as vision, not as a dated roadmap item.
- NOT ANNOUNCED: memecoins from Robinhood Chain inside the Robinhood app as a general product (one precedent is reported: Cash Cat got a Robinhood listing on 2026-08-06 and rose about 90% in 24 hours, per Cryptoticker, secondary). Any Robinhood listing or acknowledgement of $GOLDEN.
- **The conditional bullish case the sources support:** IF Robinhood routes more of its 28.4 million funded customers onto the chain, and IF tokenized-asset volume keeps growing, then early tokens native to the chain sit in front of that flow; the two reported cases of Tenev attention and a Robinhood listing moved those tokens sharply. A token whose name is Robinhood's own first trophy, quoted in Robinhood's own tokenized gold, is thematically close to the brand. All of that is Mike's opinion layered on sourced facts, and it stays conditional.

### Pillar 6: the stonk narrative (added 2026-10-01 at Mike's request; all read 2026-10-01)

- **What it is:** meme coins launched with a tokenized asset as the other side of their pool (a stock token, a pre-IPO token, a blue chip crypto, gold) instead of ETH, SOL or a stablecoin. "The stonk narrative" is Mike's name for it; the press calls them "stock-paired memecoins" (DeFiPrime, The Block) or "stock-locked memes" (U.Today).
- **It started on Robinhood Chain with stocks:**
  - "Long arrived on the chain on July 14, letting a creator pick a stock token as the pricing"; four launchpads now offer it as their default product; 432 live liquidity pools with tokenized equities as quote assets; $8.84M in stock tokens held in pools against $51.5M total onchain float (17.2%) (DeFiPrime, "Inside the Stock-Paired Memecoin Boom", 2026-09-01, https://defiprime.com/stock-paired-memecoins). Secondary, single source for the pool count. [VERIFY]
  - "The chain's other dominant launchpad is LONG (long.xyz), which facilitates tokens (mainly memecoins) paired against tokenized stocks." "Memecoins paired against tokenized stocks now account for roughly a quarter of all stock-linked trading volume on Robinhood Chain." "The AI memecoin had grown from a $1.5 million market cap on Aug. 1 to a peak of $135 million on Aug. 30, as it now holds over ~$3.3 million of liquidity in its NVDA pool." AI = "Artificial Inu, paired against tokenized NVDA". Same article: a record $989 million single-day DEX volume and a record $708 million TVL (The Block, Ivan Wu and Bryan Samsoedin, 2026-08-31, https://www.theblock.co/news/markets/2026-08-31-robinhood-chain-activity-surges-in-august-as-dex-volume-near-1-billion-413136). HIGH.
  - 2026-09-30 status: Artificial Inu about $200 million market cap, "locks more than $2.6 million in NVDA"; MEME "holds more than 35% of the AMC stock tokens"; caveat quoted: "Locked tokens are not equivalent to ownership of the underlying shares." (U.Today, 2026-09-30, https://u.today/meme-coin-digest-for-september-30-stock-locked-memes-hold-their-ground; EconoTimes, 2026-09-30, https://econotimes.com/Robinhood-Chain-Meme-Coins-Slide-as-Stock-Token-Locks-Rise-1753486).
  - Headline only, body did not load: "Robinhood Chain Tops Solana in Tokenized Stock Volume Via Memecoin Pairs" (The Defiant, https://thedefiant.io/news/blockchains/robinhood-chain-tops-solana-in-tokenized-stock-volume-via-memecoin-pairs). Not cited as fact.
- **Solana followed (StonkFun):**
  - "StonkFun allows users to create tokens paired with other assets, including tokenized stocks and exchange-traded funds." STONK about $0.16, market cap about $140 million, up 250% in 24 hours, all-time high $0.212, about $135 million daily volume; 78 tokens bought and burned by its buyback program (The Block, Zack Abrams, 2026-09-06, https://www.theblock.co/news/defi/2026-09-06-stonk-surges-250-to-140-million-market-cap-as-stock-paired-solana-launchpad-stonkfun-pulls-volume-to-raydium-and-jupiter-413621). HIGH.
  - "Stonk Fun is a Solana launchpad where anyone can create a coin priced in tokenized stocks, pre-IPO tokens, or crypto assets." STONK launched July 23, 2026, traded in SPYx. Quote assets: tokenized stocks SPYx, NVDAx, QQQx (Backed Finance); pre-IPO OPENAI, ANTHROPIC (PreStocks); crypto ZEC, WBTC, HYPE, TAO, SOL. Token ownership gives "no claim to shares, dividends, or voting rights." About 60% of platform revenue buys and burns STONK. $1.47 billion cumulative volume, STONK about $230 million market cap at $0.27 (Datawallet, updated 2026-09-14, https://www.datawallet.com/crypto/stonk-fun-explained). Secondary. [VERIFY]
  - Its own site: "Create and discover onchain coins paired with memes, stocks, currencies, commodities & more." (https://stonkfun.xyz/). Rewards page: reward tokens are "distributed to holders in whatever their coin is paired against — or in the coin itself"; funded by "a transfer tax on every transfer (1% or 3%, set at launch)" on newer launches (https://stonkfun.xyz/rewards). Primary. This is a StonkFun feature. It is NOT how Golden Kitty works.
- **Gold arrives on StonkFun:** @LaunchOnSF (display name "Stonk"), 2026-10-01 15:47 UTC: "We like our gold liquid. You can now launch coins paired with $GOLD from @orogoldapp on StonkFun." with a graphic "$GOLD Listed on StonkFun" (https://x.com/LaunchOnSF/status/2105685951418954188, 314 likes at read, read via the X embed endpoint; image viewed). GOLD is Oro's tokenized gold on Solana (described in search results as one troy ounce per token, backed 1:1; Oro's own page was NOT opened, so make no backing claim).
- **The tweet Mike shared:** @cryptogalaxycc ("Crypto Galaxy"), 2026-10-01 16:10 UTC, quoting the StonkFun post: "Tokenized gold narrative incoming robinhood:0x92e4b008161ac64a7d0c5e540f453f8e6b8bd8d7" (the GOLDEN contract) (https://x.com/cryptogalaxycc/status/2105691844449345820, 48 likes at read). One account; a receipt that the link is being drawn, not proof of a trend.
- **Timing that is sourced:** Long, July 14, 2026 (Robinhood Chain, stocks) · STONK, July 23, 2026 (Solana) · GOLDEN / GLD pool, September 4, 2026 · StonkFun gold pairs, October 1, 2026. So Golden Kitty traded against tokenized gold 27 days before StonkFun offered gold pairs.
- **Golden Kitty is NOT the only or the biggest gold-paired token on Robinhood Chain [VERIFY]** (DexScreener `token-pairs/v1/robinhood/<GLD>`, read 2026-10-01; the endpoint returns at most 30 pairs): tokens with a pool against GLD include UBIK (about $24.3M market cap), GOLDEN (about $4.16M), SCHIFFY (about $3.44M), Goldstein GLDSTN (about $3.18M), Aurum AUR (about $0.95M), Golden Goose GG (about $0.40M), plus smaller ones. GOLDEN is second by market cap in that list.
- **Plain-language summary the sources support (for the strategist, not a quote):** pairing a meme coin to a tokenized stock started on Robinhood Chain in mid July 2026 and became about a quarter of the chain's stock trading within six weeks. Solana's StonkFun runs the same model and widened it to pre-IPO tokens and blue chip cryptos, with reward tokens that pay holders in the paired asset, and on October 1, 2026 it added gold. Golden Kitty has been priced in tokenized gold since September 4, 2026. That a gold-paired token benefits from the narrative is Mike's opinion, not a sourced fact.

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **Golden Kitty** ($GOLDEN) (X: @golden_kitty_rh) | Fan memecoin on Robinhood Chain, contract 0x92e4B008161aC64a7D0C5e540F453F8e6B8Bd8D7 | goldenkitty.vip; DexScreener; persona `project_handles` |
| **Golden Kitty Awards** | Product Hunt's annual community-voted awards, 2015 to 2024 editions, retired Nov 17, 2025 | Product Hunt newsletter 45536; PC Tech Magazine Dec 28, 2015 |
| **Product Hunt** | The awarding body | same |
| **Rajiv Ayyangar** | Posted Product Hunt's retirement announcement | producthunt.com forum post (his Product Hunt title was not read; do not state one) |
| **Vlad Tenev** (X: @vladtenev) | CEO and co-founder of Robinhood | Fortune 2026-07-13; Robinhood Comms. NO sourced link to the trophy photo |
| **Robinhood Markets, Inc.** | Won the 2015 Golden Kitty for "Sexiest Product of the Year"; launched Robinhood Chain | Robinhood posts; Product Hunt |
| **Robinhood Chain** | Arbitrum-based Ethereum layer 2, chain ID 4663, mainnet 2026-07-01 | docs.robinhood.com; newsroom |
| **Robinhood Assets (Jersey) Limited** | Issuer of Stock Tokens, including GLD | robinhood.com/rhj/stocktokens |
| **GLD** ("SPDR Gold Trust • Robinhood Token") | Robinhood Stock Token tracking the SPDR Gold Trust ETF, contract 0xC9a981FEE1F9DEc688bb123ccDeCc63D0deBFC4e | DexScreener API |
| **Johann Kerbrat** | Robinhood SVP and GM of Crypto and International; the one executive quoted in the July 1 release | Robinhood newsroom |
| **Uniswap** (v4) | DEX hosting the GOLDEN / GLD pool | DexScreener `labels: v4` |
| **Fomo** (fomo.family) | The app the project site sends buyers to | goldenkitty.vip |
| **@NivDror, @matcarpenter, @arthcmr** | Past trophy recipients whose trophy posts the site uses | X posts, section 2 |

Terminology for captions/graphics: "Golden Kitty" (two words, capitals), ticker "$GOLDEN"; "Robinhood Chain"; "GLD" for the tokenized gold token, described as "tokenized gold" or "Robinhood's tokenized gold ETF token"; "Product Hunt"; "Sexiest Product of the Year" in quotes; "Vlad Tenev". Robinhood elements in lime green (about #CCFF00) or Robinhood yellow, gold elements in gold, never Kaspa greenish cyan. No em dashes.

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| "Product Hunt retired the Golden Kitty Awards" / "no new Golden Kitties are coming" | True and sourced, but Mike cut it from the video on 2026-10-01: it could lessen the excitement. | Leave the retirement out entirely, spoken and on screen. |
| "Golden Kitty holders earn rewards in gold" | Holder rewards are a StonkFun reward-token feature on Solana. Golden Kitty's pool fees are claimed by the project (section 2, Pillar 3). | "Some of these coins are set up to pay their holders rewards" (about StonkFun), and for Golden Kitty only "the fees get paid in gold, per the project's tracker". |
| "The first / only / biggest gold-paired token" | UBIK (about $24.3M), SCHIFFY, Goldstein and others also trade against GLD on Robinhood Chain. | "Paired to gold since September 4th", "a gold-paired token". |
| "The stonk narrative will pump Golden Kitty" / any price promise | Opinion, not a fact; persona verified-claims-only. | "Here's what I think", "sitting in a prime spot for it". |
| "About thirty percent of all trading on the chain is stock-paired" | The 31.3% figure's denominator is unclear in the one secondary source; The Block's figure is a quarter of STOCK-LINKED volume. | "About a quarter of all the stock trading on the chain." |
| "Vlad Tenev held up the Golden Kitty" / "the trophy Vlad Tenev held up is now a token" (**the brief's hook and an alternate title**) | No primary source found. Robinhood's 2015 post has a graphic, not a photo. The site's "held up for the camera" photo names no one. | "Robinhood won it. Robinhood bragged about it." Show the 2015 post. Add Vlad only if Mike supplies the original post (Open question 1). |
| Showing the site's "held up" photo as Vlad Tenev | The site does not identify the man; presenting him as Tenev would be an invented attribution. | Use it only as "a real Golden Kitty", or skip it for the three attributed trophy posts. |
| "Backed by gold" (**the brief's working title**) | The project: "not backed by, does not represent, and cannot be redeemed for gold or $GLD". | "Paired with gold", "priced in gold", "trades against tokenized gold". |
| "A gold treasury under the token" as a holder-owned reserve | The site's figure is fees earned in GLD plus the pool's GLD, self-reported; 233.90 GLD of fees are already claimed and their location is unverified. | "The pool has earned about 236 GLD in fees, and holds about 238 GLD, per the project's own tracker." [VERIFY] |
| "A price floor", "a peg", "redeemable for gold" | Mike's hard constraint, and the site denies redemption. The pool's GLD is about 2% of market cap. | "The other side of every trade is gold." |
| "Gold can't bleed" / "a base that only goes up" | GLD is about 21% below its Feb 2026 monthly close and down year to date. | "Gold is up about 50% in two years" [VERIFY], with gold's pullback left unspoken or stated once. |
| "The first / only token paired to a real-world asset on Robinhood Chain" | An AMC-stock-token-paired memecoin is reported (2026-09-07). | "One of the few tokens priced in a real-world asset." |
| "Robinhood's official token" / "endorsed by Robinhood" / "Vlad follows it" | Site: "Not affiliated with Robinhood." No endorsement found. | "An independent fan token." |
| "Listed on Coinbase / MEXC / Robinhood" | Only price pages are linked. | "It trades on Uniswap on Robinhood Chain." |
| "All-time high $0.006" (CoinGecko) or "$0.0119" (GeckoTerminal candle) as a hard number | The two sources disagree: CoinGecko says ATH $0.00609 on 2026-09-27; the pool's own candles show a spike to about $0.0119 on 2026-09-14. | Show the real chart (screencap); do not speak an ATH figure. |
| "646,000 tokens on Robinhood Chain" as a precise fact | Single secondary source, and it counts launches on one launchpad. | "Hundreds of thousands of tokens launched." |
| "Robinhood Crypto won the 2018 Golden Kitty" | Coinbase Wallet won Crypto Product of the Year 2018; Robinhood Crypto holds a Crypto-category badge, placement unconfirmed. | "Robinhood showed up again in 2018 in the Crypto category." |
| "$310M TVL in two weeks", "$175.82M TVL" (launch-era articles) | Stale and mutually inconsistent. | Use the dated DefiLlama read in section 5. |
| The SEC "five-year pathway" for tokenized stocks | Source could not be opened (403). | Leave out unless re-verified (Open question 6). |
| The "$VLAD / Vladhood" token | Reported in search results as a hack of Tenev's X account promoting a fake token (CoinDesk headline 2026-07-23, Robinhood Comms post); pages NOT opened this run. Any "Vlad launched a memecoin" claim is false per those headlines. | Do not mention. |
| The orientation snapshot numbers in PROJECT-LOG.md | The brief marks them not airable. | Section 5, re-pulled at render. |

---

## 5. Market snapshot

Pulled 2026-10-01 14:15 to 14:21 UTC. All [VERIFY] at render.

| Figure | Value at read | Note |
|---|---|---|
| GOLDEN price (USD) | $0.004234 | DexScreener pair API, 14:21 UTC [VERIFY] |
| GOLDEN price in gold | 0.00001109 GLD | same [VERIFY] |
| GOLDEN market cap = FDV | $4,234,949 | same [VERIFY] |
| GOLDEN / GLD pool liquidity | $181,405 (21,417,615 GOLDEN + 237.65 GLD) | same [VERIFY] |
| GOLDEN 24h volume (GLD pool) | $80,431 (248 buys, 336 sells) | same [VERIFY] |
| GOLDEN 24h price change | -1.8% | same [VERIFY] |
| GOLDEN 7d price change | +2.66% | CoinGecko API, 14:17 UTC [VERIFY] |
| GOLDEN holders | 2,221 (top 10 = 39.99%) | GeckoTerminal, its stamp 05:55 UTC [VERIFY] |
| Developer wallet share | 6.82% (68,244,514 GOLDEN) | GeckoTerminal + RPC 14:20 UTC [VERIFY] |
| "Gold treasury" per site | 473.54 GLD, $180,791, 43.47 oz | vault.json, stamp 14:18 UTC; self-reported [VERIFY] |
| of which fees earned | 235.89 GLD ($90,060); 233.90 claimed in 40 claims | same [VERIFY] |
| of which pool GLD | 237.65 GLD ($90,732) | same [VERIFY] |
| GLD token price on chain | $381.79 (site worker) / $380.89 (DexScreener) | 14:18 UTC [VERIFY] |
| GLD token supply on chain | 23,604.59 GLD | RPC 14:20 UTC [VERIFY] |
| Spot gold | $4,158.80 per oz | gold-api.com, 14:18 UTC [VERIFY] |
| GLD ETF | $380.96 | Yahoo Finance chart data, 14:20 UTC [VERIFY] |
| Robinhood Chain DeFi TVL | about $1.04B | DefiLlama, 14:17 UTC [VERIFY] |
| Robinhood Chain DEX volume | $1.51B (24h), $9.44B (7d), $55.99B (30d), $99.02B (all time) | DefiLlama, 14:17 UTC [VERIFY] |
| Robinhood funded customers | 28.4 million (Q2 2026) | quarterly; next update with Q3 results |
| Robinhood total platform assets | $369 billion (Q2 2026) | quarterly |
| Total supply | 1,000,000,000 GOLDEN | primary, not drifting |
| Pool created | 2026-09-04 13:50 UTC | primary, not drifting |
| Robinhood Chain mainnet | 2026-07-01 | primary, not drifting |
| Robinhood's Golden Kitty post | 2015-12-23 | primary, not drifting |

---

## CHART-SOURCE INDEX

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | THE system-design diagram: GOLDEN <-> GLD pool on Uniswap v4. Nodes: "GOLDEN" (gold cat), "Pool", "GLD: tokenized gold ETF token" (issuer Robinhood Assets (Jersey) Limited), "SPDR Gold Trust ETF share", "gold bars". Arrows: buy = GLD in, GOLDEN out; sell = reverse; fees accrue in GLD. Label: "priced in gold". No "backed", no "floor", no "redeem". | section 2, Pillar 3 | **code** (Type 2, static states) |
| C2 | Price formula strip: "GOLDEN in dollars = GOLDEN in gold x gold in dollars", with the live values | section 2 Pillar 3, section 5 | **code** (Type 1 animated) [VERIFY] |
| C3 | "Gold treasury" breakdown: fees earned in GLD vs GLD in the pool, with the oz equivalent, labeled "per the project's tracker" | section 2 Pillar 3 (vault.json) | **code** (Type 1 animated) [VERIFY]; or C10 screencap |
| C4 | Timeline ladder: 2013 first Product Hunt launch, 2015 Golden Kitty win, 2026-07-01 chain mainnet, 2026-09-04 GOLDEN pool (NO "2025 awards retired" rung: Mike cut the retirement from the video, 2026-10-01) | section 2 Pillars 1, 2, 4 | **code** (Type 2) |
| C5 | Receipt: Robinhood's 2015-12-23 post "Thanks to YOU, Robinhood won the Golden Kitty Award for the Sexiest Product of the Year!!" | https://x.com/RobinhoodApp/status/679773248020594688 | **screencap** |
| C6 | Receipt: Robinhood newsroom "#RobinhoodRewind 2015", crop to "the coveted Golden Kitty Award from Product Hunt" | https://robinhood.com/us/en/newsroom/robinhoodrewind-2015/ | **screencap** |
| C7 | Receipt: Product Hunt's Robinhood awards page (Golden Kitty 2015 "Sexiest Product", 2018 "Crypto") | https://www.producthunt.com/products/robinhood/awards | **screencap** |
| C8 | Receipt: Product Hunt Golden Kitty hall of fame, 2015 | https://www.producthunt.com/golden-kitty-awards/hall-of-fame?year=2015 | **screencap** |
| C9 | NOT USED (Mike cut the retirement beat, 2026-10-01; do not capture). Was: receipt "RIP Golden Kitty Awards", crop to "after ten years, we're officially sunsetting the Golden Kitty Awards" | https://www.producthunt.com/newsletters/archive/45536-rip-golden-kitty-awards | **screencap** |
| C10 | Receipt: goldenkitty.vip hero + the "Priced in gold" paragraph + the "Gold treasury" panel | https://goldenkitty.vip/ | **screencap** [VERIFY] |
| C11 | Receipts: real trophies (the three attributed posts) | X URLs in section 2, Pillar 1 | **screencap** |
| C12 | GOLDEN / GLD price chart since launch | https://dexscreener.com/robinhood/0x2b2f171fe944df3f8b230272682755b7d5c8adb0e2d76aabb621f1f870251841 | **screencap** [VERIFY]; never restyle |
| C13 | Receipt: DexScreener pair header showing the quote token "SPDR Gold Trust • Robinhood Token" | same DexScreener URL | **screencap** |
| C14 | Receipt: market cap + holders in one view, re-sourced by the cover plan to the GeckoTerminal pool panel (no Cloudflare wall): https://www.geckoterminal.com/robinhood/pools/0x2b2f171fe944df3f8b230272682755b7d5c8adb0e2d76aabb621f1f870251841 [VERIFY]. Never the supply line (cut by Mike). Was: the Blockscout explorer token page | https://robinhoodchain.blockscout.com/token/0x92e4B008161aC64a7D0C5e540F453F8e6B8Bd8D7 | **screencap** [VERIFY] (needs a real browser, Cloudflare) |
| C15 | Gold price chart, two years | TradingView or Yahoo Finance GLD / XAUUSD page | **screencap** [VERIFY]; never restyle |
| C16 | Receipt: Stock Tokens page, crop to "backed 1:1" and the issuer line | https://robinhood.com/rhj/stocktokens/ | **screencap** |
| C17 | Receipt: Robinhood newsroom July 1, 2026 mainnet announcement headline | Robinhood newsroom URL in T7 | **screencap** |
| C18 | Robinhood Chain TVL and DEX volume | https://defillama.com/chain/robinhood-chain (confirm the slug in the browser) | **screencap** [VERIFY] |
| C19 | Count-up stat cards: "$1B+ TVL", "$90B+ DEX volume in 3 months" (the conservative daily-chart sum, Mike 2026-10-01; never the $99B headline total), "28.4M funded customers", "120+ countries" | sections 2 and 5 | **code** (Type 1 animated) [VERIFY] |
| C20 | Receipt: Fortune headline + the Tenev quote "it works great for memes, too" | https://fortune.com/crypto/2026/07/13/robinhood-chain-memecoin-trading-cash-cat-vlad-tenev-crypto/ | **screencap** |
| C21 | Robinhood Chain stack diagram: Robinhood app users -> Robinhood Wallet -> Robinhood Chain (Arbitrum tech, settles to Ethereum) -> Uniswap / Morpho / Lighter -> Stock Tokens, GLD, memecoins | section 2 Pillar 4 | **code** (Type 2) |
| C23 | Receipt: The Block, 2026-08-31, cropped to "Memecoins paired against tokenized stocks now account for roughly a quarter of all stock-linked trading volume on Robinhood Chain" and to the Artificial Inu sentence | https://www.theblock.co/news/markets/2026-08-31-robinhood-chain-activity-surges-in-august-as-dex-volume-near-1-billion-413136 | **screencap** |
| C24 | Receipt: The Block headline, 2026-09-06, "STONK surges 250% to $140 million market cap as stock-paired Solana launchpad StonkFun pulls volume to Raydium and Jupiter" | https://www.theblock.co/news/defi/2026-09-06-stonk-surges-250-to-140-million-market-cap-as-stock-paired-solana-launchpad-stonkfun-pulls-volume-to-raydium-and-jupiter-413621 | **screencap** |
| C25 | Receipt: StonkFun's post "We like our gold liquid. You can now launch coins paired with $GOLD from @orogoldapp on StonkFun." | https://x.com/LaunchOnSF/status/2105685951418954188 | **screencap** |
| C26 | Receipt: the Crypto Galaxy post "Tokenized gold narrative incoming" with the GOLDEN contract | https://x.com/cryptogalaxycc/status/2105691844449345820 | **screencap** |
| C27 | The pairing ladder: four rungs lit one at a time, STOCKS (Long, Robinhood Chain, July 14, 2026) · PRE-IPO · BLUE CHIP CRYPTO (WBTC, SOL, TAO) · GOLD; the Golden Kitty token art lands on GOLD. No prices. | section 2 Pillar 6 | **code** (Type 2, static states) |
| C28 | Receipt: StonkFun rewards page, cropped to "distributed to holders in whatever their coin is paired against" | https://stonkfun.xyz/rewards | **screencap** |
| C5b | Receipt: the graphic Robinhood attached to its 2015 Golden Kitty post (a separate capture from C5) | https://x.com/RobinhoodApp/status/679773248020594688/photo/1 | **screencap** |
| C10b | Receipt: goldenkitty.vip footer disclaimer, "is not backed by, does not represent, and cannot be redeemed for gold or $GLD" (a separate capture from C10) | https://goldenkitty.vip/ | **screencap** |
| C11a / C11b / C11c | Receipts: the three attributed real-trophy posts, one capture each (@matcarpenter photo, @NivDror video, @arthcmr photo) | X URLs in section 2, Pillar 1 | **screencap** |
| C23b | Receipt: the Artificial Inu sentence of the same The Block article as C23 (1.5M on Aug 1 to a peak of 135M on Aug 30), a separate crop | same URL as C23 | **screencap** |
| C29 | Receipt: The Crypto Times headline, the AMC-paired meme coin (40M to 150M in an hour after Tenev followed its account); a DIFFERENT token, label it so | https://www.cryptotimes.io/2026/09/07/robinhood-ceo-follow-sends-amc-paired-meme-coin-surging-150/ | **screencap** |
| C30 | Receipt: Product Hunt homepage leaderboard, a short scroll recording (what Product Hunt is). Must show no "RIP Golden Kitty" / Orbit Awards banner | https://www.producthunt.com/ | **screencap** (recording) |
| C31 | Receipt: stonkfun.xyz hero line "Create and discover onchain coins paired with memes, stocks, currencies, commodities & more." | https://stonkfun.xyz/ | **screencap** |
| C32 | Receipt: Robinhood Chain docs landing, the purpose line (traditional markets, crypto and real-world assets together) | https://docs.robinhood.com/chain/ | **screencap** |
| C22 | A REAL photo of "Vlad Tenev holding the Golden Kitty" | NO SOURCE (Open question 1) | **blocked** as a receipt. Mike's ruling 2026-10-02 allows AI ILLUSTRATIONS instead (COVER-PLAN G11 / G12 / G13): Pixar-style, tagged 'AI ILLUSTRATION' on screen, the trophy only, on the Robinhood-won-it lines |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. Code-built graphics are text-accurate and trace to section 2; everything else is a real-site capture. An image model must never render Vlad Tenev holding a trophy AS IF IT WERE THE REAL PHOTO: the allowed AI illustrations (Mike, 2026-10-02) are a stylized cartoon carrying an on-screen 'AI ILLUSTRATION' tag, and nothing spoken says he held it.

---

## Open questions for Mike

1. **The Vlad Tenev photo (the heart of CH1 and CH2) has no source.** Searched: Robinhood's 2015 post (a graphic), the newsroom rewind post (no person named), the project site (a photo of an unnamed man, captioned "A real one, held up for the camera."), and four web searches. Nothing shows or names Vlad Tenev with the trophy. If Mike has seen the image, the original post URL is needed (who posted it, when). Without it, recommendation: hook on what is proven, "Robinhood won this trophy in 2015 and bragged about it, and it is now a token on Robinhood's own chain, priced in gold", and drop the alternate title "The Trophy Vlad Tenev Held Up Is Now a Token".
2. **Title: "Backed by Gold" is denied by the project itself** ("not backed by ... cannot be redeemed for gold or $GLD"). Recommendation: "Paired With Gold" or "Priced in Gold" (the brief's third alternate, "The Gold-Paired Token on Robinhood Chain", already fits).
3. **Brief contradiction check, the gold base:** the brief says the base is tied to gold "instead of to a coin that can bleed". Gold has pulled back about 21% from its Feb 2026 monthly close and is down year to date; over two years it is up about 50%. The angle survives as "priced in the oldest store of value, up about 50% in two years, versus a meme priced in ETH", but not as "a base that cannot fall".
4. **How the "gold treasury" can truthfully be worded:** it is the project's self-reported tally of GLD fees earned (about 236 GLD, almost all already claimed) plus the GLD in the pool (about 238 GLD). No separate treasury wallet, lock, or policy was found; the flagged developer wallet held 27.12 GLD. Airable: "the pool has earned about 236 GLD in trading fees, paid in tokenized gold, per the project's tracker". Not airable: "a gold reserve backing holders". If Mike knows the fee wallet or a stated policy from the team, supply the source.
5. **Community size not read:** @golden_kitty_rh follower count and the Telegram member count need a logged-in browser; the receipt-capturer can capture them live with a timestamp. Until then, no community number airs (holders 2,221 [VERIFY] is the only one sourced).
6. **Sources that could not be opened:** the Product Hunt 2015 winners post on Medium (403), the 2018 hall of fame page (too large), Robinhood's Q2 2026 release on the investor site (timeout; Investing.com's write-up used), Benzinga on an SEC tokenized-stock pathway (403, so that item is left out entirely), the Blockscout explorer (Cloudflare; RPC used).
7. **U.S. audience and GLD:** Robinhood states Stock Tokens "may not be offered, sold, or delivered ... to ... U.S. persons". The video should describe GLD as the pool's quote asset and not tell viewers to buy GLD.
8. **Runtime:** the sourced material comfortably fills 7:00. It does not earn 10:00 while the Vlad moment is unsourced, since CH2's planned centerpiece is missing.
9. **Token risk facts the strategist should know even in a bullish video:** developer wallet 6.82% of supply, top 10 wallets about 40%, and a single-day round trip on 2026-09-14 to 2026-09-15 (about $0.0119 high to about $0.00067 low). Not for airing as bearish; for avoiding lines like "it has only gone up".
