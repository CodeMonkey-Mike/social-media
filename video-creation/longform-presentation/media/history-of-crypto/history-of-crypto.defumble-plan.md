# history-of-crypto: defumble cut plan

Source: `2026-10-13 19-51-15.mkv` (48:37.8, 1080p30). Method: `video-creation/skills/defumbler/defumbler.md` (chunk map, keep the LAST clean take of every line, every cut edge at the midpoint of a detected silence, never on a word timestamp).

- Chunk map: 760 chunks (-42 dB / 0.30 s segmentation, Whisper medium per chunk).
- **118 cuts, 287 chunks dropped (two of them tail drops: [161], [372]), 1099.7 s removed** -> expected output about 30:18.11 (from 48:37.8).
- Every cut edge measured at or below -50 dB (all but two are digital silence, -240 dB; the hottest is -62 dB at 2387.055).
- Machine list for `remove_spans.py --cuts-file`: `history-of-crypto.defumble-cuts.txt` (one `start-end` per line, source seconds).
- Indices are chunk-map indices (`2026-10-13 19-51-15._chunkmap.txt`); times are source seconds (m:ss in parentheses).

1. **cut 40.442-43.672** (0:40.44-0:43.67, 3.23 s): partial/restart of [009]
   - DROP [008] "It was a culmination of ideas."
2. **cut 60.258-63.419** (1:00.26-1:03.42, 3.16 s): cut-off partial (“per-”), retaken in [012]
   - DROP [011] "and it puts you in a much more informed per-"
3. **cut 67.776-71.165** (1:07.78-1:11.17, 3.39 s): clean take superseded by retake [014]
   - DROP [013] "Let's start at the beginning."
4. **cut 126.336-128.938** (2:06.34-2:08.94, 2.60 s): misspoken take (“a tool ... the right”), retaken in [025]
   - DROP [024] "was a tool that could protect the right."
5. **cut 134.938-141.294** (2:14.94-2:21.29, 6.36 s): misspeak (“Maryland list”), retaken in [027]-[028]
   - DROP [026] "They communicated through the Cypherpunk Maryland list."
6. **cut 154.945-158.856** (2:34.94-2:38.86, 3.91 s): misspeak/partial (“think”), retaken in [033]
   - DROP [032] "Some of the most important think in the history of digital."
7. **cut 175.078-185.579** (2:55.08-3:05.58, 10.50 s): stumbled take (garbled “transact” + muttered fragment), retaken in [044]
   - DROP [040] "which laid out the vision for a future where cryptography would allow people to"
   - DROP [041] "I'm Zach."
   - DROP [042] "anonymously."
   - DROP [043] "Push late out of."
8. **cut 194.978-200.397** (3:14.98-3:20.40, 5.42 s): two “Eric Hughes” false starts + fragment, retaken in [049]
   - DROP [046] "Eric Hughes?"
   - DROP [047] "Eric Hughes?"
   - DROP [048] "Row challenge"
9. **cut 208.202-212.352** (3:28.20-3:32.35, 4.15 s): take broke before “in the electronic age”, retaken in [053]-[054]
   - DROP [051] "Privacy is necessary for an open society."
   - DROP [052] "And I'd like to."
10. **cut 249.488-256.811** (4:09.49-4:16.81, 7.32 s): partial, retaken in [063]
   - DROP [062] "The core belief running through all of this was..."
11. **cut 273.642-291.409** (4:33.64-4:51.41, 17.77 s): false start + superseded take (missing “own”) + false start, final take [068]
   - DROP [065] "People."
   - DROP [066] "People needed tools to protect their financial privacy."
   - DROP [067] "People needed tools."
12. **cut 309.655-324.445** (5:09.65-5:24.44, 14.79 s): partials (“...create doge-”), retaken in [073]-[074]
   - DROP [070] "Before Bitcoin."
   - DROP [071] "There were several."
   - DROP [072] "Before Bitcoin, there were several serious attempts to create doge-"
13. **cut 334.721-337.488** (5:34.72-5:37.49, 2.77 s): cut-off partial (“what big-”), retaken in [078]
   - DROP [077] "and their failures directly shape what big..."
14. **cut 353.265-357.892** (5:53.26-5:57.89, 4.63 s): partials (“They use crypto” / “and use cryptographic protocols”), retaken in [085]
   - DROP [083] "a new script."
   - DROP [084] "and use cryptographic protocols."
15. **cut 363.399-392.716** (6:03.40-6:32.72, 29.32 s): repeated failed takes of “but it required banks to participate as intermediaries ... centrally controlled ... never gained”, final take [094]-[095]
   - DROP [086] "but it allowed banks to"
   - DROP [087] "but it allowed banks to participate."
   - DROP [088] "but it required banks to participate as intermediaries."
   - DROP [089] "It was sent."
   - DROP [090] "but it required banks to participate."
   - DROP [091] "But it required banks to participate as intermediaries."
   - DROP [092] "It was centrally controlled."
   - DROP [093] "and I never gained."
16. **cut 407.168-411.683** (6:47.17-6:51.68, 4.51 s): misspeak (“launched in 1990s”), retaken in [100]-[101]
   - DROP [098] "Then there was Eagle."
   - DROP [099] "which launched in 1990s."
17. **cut 433.244-448.102** (7:13.24-7:28.10, 14.86 s): superseded take + partial (“his found-”), final take [110]
   - DROP [107] "and the US government eventually prosecuted his founders."
   - DROP [108] "for running an unlicensed money transaction in business."
   - DROP [109] "and the US government eventually prosecuted his found."
18. **cut 464.234-479.426** (7:44.23-7:59.43, 15.19 s): misspeak (“became the closest”), retaken in [114]-[116]
   - DROP [112] "Two proposals from 1998 are particularly interesting because"
   - DROP [113] "They became the closest to what Bitcoin eventually became."
19. **cut 494.204-509.307** (8:14.20-8:29.31, 15.10 s): two failed takes of the Szabo description, final take [121]
   - DROP [118] "A computer scientist and legal scholar who many people suspect"
   - DROP [119] "Maybe Satoshi Nakamoto."
   - DROP [120] "A computer scientist and legal scholar who many people suspect may be actually"
20. **cut 519.822-521.885** (8:39.82-8:41.88, 2.06 s): partial, retaken in [124]
   - DROP [123] "I had many of-"
21. **cut 525.177-535.626** (8:45.18-8:55.63, 10.45 s): two earlier takes of the feature list, final take [130]-[132]
   - DROP [125] "proof of work system."
   - DROP [126] "a decentralized layer."
   - DROP [127] "proof of work system."
   - DROP [128] "A decentralized ledger."
   - DROP [129] "and a capped supply."
22. **cut 554.076-562.996** (9:14.08-9:23.00, 8.92 s): misspeak + partial, retaken in [137]
   - DROP [135] "which also describe the digital currency."
   - DROP [136] "which also described its"
23. **cut 580.026-590.590** (9:40.03-9:50.59, 10.56 s): superseded take + garbled partial, final take [143]
   - DROP [141] "either relied on an essential authority that could be shut down."
   - DROP [142] "They either relied on a central or short."
24. **cut 657.399-662.269** (10:57.40-11:02.27, 4.87 s): misspeak (“by the names”), retaken in [159]-[160]
   - DROP [157] "a person or a group."
   - DROP [158] "by the names Satoshi Nakamoto."
25. **cut 668.845-671.016** (11:08.85-11:11.02, 2.17 s): TAIL DROP (added after the post-render QA): a 0.8 s “to a crypto-” false start glued to the end of [161] after a 0.3 s micro-pause; the first-pass per-chunk Whisper silently omitted it, the QA pass heard “for cryptography”, a word-aligned check heard “for Cryptovac”. Retaken in [162] “to a cryptography mailing list”. Cut starts in the micro-pause 668.70-668.99 (silent at -50 dB, found by re-running chunk_map.py on the region with --sil-d 0.15)
   - DROP [161] "...for crypto- (0.8 s tail fragment only; “publish a nine page document” is KEPT)"
26. **cut 679.857-685.279** (11:19.86-11:25.28, 5.42 s): partial, retaken in [165]
   - DROP [164] "That document is now."
27. **cut 696.036-704.783** (11:36.04-11:44.78, 8.75 s): two failed takes (“laid out a-”, “double spinster”), final take [172]-[173]
   - DROP [167] "in it."
   - DROP [168] "Satoshi laid out a-"
   - DROP [169] "in it."
   - DROP [170] "Satoshi laid out a complete working solution."
   - DROP [171] "a double spinster."
28. **cut 736.788-739.783** (12:16.79-12:19.78, 3.00 s): partial, retaken in [184]
   - DROP [183] "To this day, the true identity..."
29. **cut 744.922-755.577** (12:24.92-12:35.58, 10.65 s): partial + noise + misspeak (“have suggested”), final take [188]
   - DROP [185] "Multiple people have to..."
   - DROP [186] "urt!"
   - DROP [187] "Multiple people have suggested over the years."
30. **cut 759.397-766.951** (12:39.40-12:46.95, 7.55 s): first pass of the name list (Nick Szabo / Hal Finney / Craig Wright) broke off, retaken in [192]-[194]
   - DROP [189] "Next sample."
   - DROP [190] "I'll finny."
   - DROP [191] "Right, right."
31. **cut 776.467-793.774** (12:56.47-13:13.77, 17.31 s): five failed takes of “but none of it has ever been conclusively proven”, final take [200]
   - DROP [195] "but none of it has ever been proven consistent."
   - DROP [196] "but none of it has ever been conclusively."
   - DROP [197] "but none of it has ever been coped."
   - DROP [198] "but none of it has ever been proven conclusively."
   - DROP [199] "none of it has ever been clear."
32. **cut 797.658-801.766** (13:17.66-13:21.77, 4.11 s): misspeak (“kept their head”), retaken in [202]
   - DROP [201] "Satoshi deliberately kept their head."
33. **cut 811.191-819.873** (13:31.19-13:39.87, 8.68 s): misspeak (“October 3rd”), retaken in [206]-[207]
   - DROP [204] "on October 3rd, 2009."
   - DROP [205] "Satoshi Mai in the very first block."
34. **cut 825.913-827.257** (13:45.91-13:47.26, 1.34 s): 0.6 s false start of “known as” (Whisper: “Noina”), retaken in [209] [JUDGMENT CALL]
   - DROP [208] "Noina"
35. **cut 833.449-846.156** (13:53.45-14:06.16, 12.71 s): partials, retaken in [212]
   - DROP [210] "and embedded directly."
   - DROP [211] "and embed it directly into the."
36. **cut 862.976-866.148** (14:22.98-14:26.15, 3.17 s): partial, retaken in [218]
   - DROP [217] "Bitcoin was born."
37. **cut 881.461-885.041** (14:41.46-14:45.04, 3.58 s): partial, retaken in [223]
   - DROP [222] "a first ever Bitcoin transaction between two"
38. **cut 902.388-908.546** (15:02.39-15:08.55, 6.16 s): clean take superseded by retake [230]-[231]
   - DROP [228] "Then in 2010."
   - DROP [229] "something remarkable happened."
39. **cut 913.200-927.077** (15:13.20-15:27.08, 13.88 s): partials (“So Toshi began hand-”), final take [235]
   - DROP [232] "Satoshi."
   - DROP [233] "So Toshi began hand-"
   - DROP [234] "Satoshi began handing off control of the Bitcoin."
40. **cut 941.266-944.194** (15:41.27-15:44.19, 2.93 s): partial, retaken in [243]
   - DROP [242] "and crucially."
41. **cut 965.469-973.489** (16:05.47-16:13.49, 8.02 s): clean take superseded by retake [248]-[249]
   - DROP [246] "in the very early days."
   - DROP [247] "Bitcoin was essentially worthless in monetary terms."
42. **cut 1027.811-1031.972** (17:07.81-17:11.97, 4.16 s): partials, retaken in [265]
   - DROP [263] "Someone took it up."
   - DROP [264] "Someone took her."
43. **cut 1072.020-1075.514** (17:52.02-17:55.51, 3.49 s): partial, retaken in [281]
   - DROP [280] "that Bitcoin could be used."
44. **cut 1081.591-1090.371** (18:01.59-18:10.37, 8.78 s): take broke off (“Mt. Gox ... launch”), retaken in [285]-[287]
   - DROP [282] "Also in 2010."
   - DROP [283] "website called Mt. Gox."
   - DROP [284] "launch."
45. **cut 1105.915-1112.495** (18:25.91-18:32.49, 6.58 s): partials, retaken in [292]
   - DROP [290] "because."
   - DROP [291] "because that would."
46. **cut 1133.789-1136.893** (18:53.79-18:56.89, 3.10 s): partial (“through 20-”), retaken in [298]
   - DROP [297] "through 20."
47. **cut 1160.757-1165.712** (19:20.76-19:25.71, 4.95 s): partials, retaken in [307]
   - DROP [305] "A milestone."
   - DROP [306] "A milestone that felt significant."
48. **cut 1219.744-1221.681** (20:19.74-20:21.68, 1.94 s): partial (“A darknet mar-”), retaken in [319]
   - DROP [318] "A dark night mad..."
49. **cut 1227.159-1228.677** (20:27.16-20:28.68, 1.52 s): false start “Silk Road.” (Whisper: “Sicko bro”), retaken in [322]
   - DROP [321] "Sicko bro."
50. **cut 1235.892-1238.470** (20:35.89-20:38.47, 2.58 s): partial, retaken in [326]
   - DROP [325] "because of its pseudonym."
51. **cut 1242.037-1246.250** (20:42.04-20:46.25, 4.21 s): partial, retaken in [328]
   - DROP [327] "At its peak, it was doing hundreds of millions of"
52. **cut 1252.886-1263.522** (20:52.89-21:03.52, 10.64 s): misspeak (“arrested his father”), retaken in [331]-[332]
   - DROP [329] "The FBI shut it down in 2013."
   - DROP [330] "and arrestes his father."
53. **cut 1304.661-1306.755** (21:44.66-21:46.76, 2.09 s): partial, retaken in [343]
   - DROP [342] "due to what it claimed to..."
54. **cut 1323.849-1325.509** (22:03.85-22:05.51, 1.66 s): false start “It was catastr-” (Whisper: “He was kind of struck”), retaken in [349]
   - DROP [348] "He was kind of struck."
55. **cut 1334.834-1339.966** (22:14.83-22:19.97, 5.13 s): misspeak (“recurrent theme”), retaken in [354]-[355]
   - DROP [352] "which, as you'll see,"
   - DROP [353] "became something of a recurrent theme."
56. **cut 1387.388-1390.492** (23:07.39-23:10.49, 3.10 s): partial, retaken in [369]
   - DROP [368] "Ethereum opened a door to program..."
57. **cut 1393.835-1397.102** (23:13.84-23:17.10, 3.27 s): partial, retaken in [371]
   - DROP [370] "The idea that you could build if..."
58. **cut 1407.405-1420.043** (23:27.40-23:40.04, 12.64 s): TAIL DROP: “DeFi, NFTs.” glued to the end of [372] (keeps “Everything that came after”) + [373] partial list; final take [374]. Cut starts in the 0.2 s micro-pause 1407.31-1407.50 (silent at -50 dB, found by re-running chunk_map.py on the region with --sil-d 0.15)
   - DROP [372] "...DeFi, NFTs. (tail only; “Everything that came after” is KEPT)"
   - DROP [373] "DeFi, NFTs, DAOs, TokenEco."
59. **cut 1429.147-1447.838** (23:49.15-24:07.84, 18.69 s): superseded take + partials of “Also during this period, the halving mechanism ...”, final take [381]-[382]
   - DROP [376] "Also, the-"
   - DROP [377] "Also, during this period..."
   - DROP [378] "bitcoin's having mechanism began to play out."
   - DROP [379] "during this period."
   - DROP [380] "Bitcoin's having a good."
60. **cut 1465.278-1506.342** (24:25.28-25:06.34, 41.06 s): superseded takes + partials of “This supply shock has historically preceded major price increases”, final take [390]
   - DROP [385] "the supply chart."
   - DROP [386] "This supply shock has..."
   - DROP [387] "The supply shock has historically preceded major price increases."
   - DROP [388] "the supply shock."
   - DROP [389] "The supply shock has historically preceded major"
61. **cut 1522.055-1535.715** (25:22.06-25:35.71, 13.66 s): clean take superseded by retake [395]
   - DROP [393] "We'll cover this having in much more detail."
   - DROP [394] "later on."
62. **cut 1548.400-1555.888** (25:48.40-25:55.89, 7.49 s): slide-title misread (“The first time...”), retaken in [397]
   - DROP [396] "The first time..."
63. **cut 1610.320-1627.869** (26:50.32-27:07.87, 17.55 s): misspeaks (“from around 32 dollars”) + partials, final take [406]
   - DROP [401] "Bitcoin's place."
   - DROP [402] "Bitcoin's price climbed from essentially zero."
   - DROP [403] "around $32 and..."
   - DROP [404] "Bitcoin's price climbed from essentially zero from around $32 in June of 2011."
   - DROP [405] "Bitcoin's price."
64. **cut 1646.220-1651.807** (27:26.22-27:31.81, 5.59 s): misspeak (“fell down”), retaken in [411]
   - DROP [410] "From $32, Bitcoin fell down around 93%."
65. **cut 1665.360-1672.888** (27:45.36-27:52.89, 7.53 s): take broke off (“And then-”), retaken in [419]
   - DROP [416] "Over two years."
   - DROP [417] "over the next two years Bitcoin recovered."
   - DROP [418] "And then."
66. **cut 1689.060-1710.947** (28:09.06-28:30.95, 21.89 s): four failed takes of “This time the catalysts included ...”, final take [426]
   - DROP [422] "This time, the catalysts included growing mainstream media awareness."
   - DROP [423] "This time the catalyst included growing mainstream."
   - DROP [424] "This time the catalyst included."
   - DROP [425] "This time the catalyst included."
67. **cut 1736.879-1739.231** (28:56.88-28:59.23, 2.35 s): misspeak, retaken in [438]
   - DROP [437] "This is one of the."
68. **cut 1750.991-1762.820** (29:10.99-29:22.82, 11.83 s): partial + broken take (“initial coin-off-”), final take [443]-[444]
   - DROP [441] "This."
   - DROP [442] "This cycle coincided with the ICO, initial coin-off."
69. **cut 1792.565-1799.810** (29:52.57-29:59.81, 7.24 s): partial + superseded take (missing “by the end of 2018”), final take [455]
   - DROP [453] "with Bitcoin for all."
   - DROP [454] "with Bitcoin falling all the way back down to $3,200."
70. **cut 1819.988-1829.637** (30:19.99-30:29.64, 9.65 s): partial + incomplete take (missing “the previous cycle began”), final take [462]-[464]
   - DROP [460] "After each crash, the-"
   - DROP [461] "After each crash, the price bottomed out at a level significantly higher than where it had been before."
71. **cut 1844.971-1851.446** (30:44.97-30:51.45, 6.47 s): misspeak (“come to recognize and expect”), retaken in [469]
   - DROP [468] "This is the pattern of Bitcoin traders and long-term holders I've come to recognize and expect."
72. **cut 1863.566-1871.241** (31:03.57-31:11.24, 7.67 s): slide-title misread (Whisper: “METTURATION AND INCIDENCE”), retaken in [471]
   - DROP [470] "METTURATION AND INCIDENCE"
73. **cut 1874.420-1916.796** (31:14.42-31:56.80, 42.38 s): six failed takes of “After the brutal bear market of 2018, the industry spent 2019 ...” incl. asides “How is it?” / “Oh my god, dude.”, final take [482]-[483]
   - DROP [472] "After the brutal bear market of 2018, the industry spent..."
   - DROP [473] "After the brutal bear market of 2018."
   - DROP [474] "the industry span."
   - DROP [475] "After the brutal bear market of 2018, the industry spent."
   - DROP [476] "How is it?"
   - DROP [477] "After the brutal bear market of 2018, the injuries we spent 2000-"
   - DROP [478] "Oh my god, dude."
   - DROP [479] "After the brutal bear market of 2018, the interest we spent..."
   - DROP [480] "2019."
   - DROP [481] "2019."
74. **cut 1935.288-1951.270** (32:15.29-32:31.27, 15.98 s): broken takes of “The summer of 2020 saw the rise of ... DeFi”, final take [493]-[494]
   - DROP [489] "The summer of 2020 saw the rise of what became known as"
   - DROP [490] "the summer of 2020."
   - DROP [491] "The summer of 2020."
   - DROP [492] "the rise of what became known as DeFi."
75. **cut 1968.092-1971.075** (32:48.09-32:51.08, 2.98 s): misspeak (“or Decentral-”), retaken in [501]
   - DROP [500] "without using any bank or Decentral."
76. **cut 1986.760-2003.382** (33:06.76-33:23.38, 16.62 s): two earlier takes of “It was chaotic, risky, and genuinely revolutionary”, final take [512]-[514]
   - DROP [505] "It was chaotic."
   - DROP [506] "Risky."
   - DROP [507] "and genuinely revolution."
   - DROP [508] "and genuinely revolutionary."
   - DROP [509] "It was chaotic."
   - DROP [510] "Risky."
   - DROP [511] "and genuinely a revolutionary."
77. **cut 2018.662-2019.907** (33:38.66-33:39.91, 1.24 s): false start “began to en-” (Whisper: “Be kind to her”), retaken in [519]
   - DROP [518] "Be kind to her."
78. **cut 2022.850-2030.495** (33:42.85-33:50.49, 7.64 s): partial (“Digi-”) + broken take, final take [523]-[525]
   - DROP [520] "Diddle."
   - DROP [521] "digital artists, musicians."
   - DROP [522] "and creators were starting to use blockchain."
79. **cut 2040.364-2074.609** (34:00.36-34:34.61, 34.24 s): four broken takes of the Beeple line, final take [534]-[536] [SEE FLAG]
   - DROP [526] "in March 2021."
   - DROP [527] "My daughter's cold."
   - DROP [528] "in March 2021."
   - DROP [529] "My daughter's called Beepley."
   - DROP [530] "March 2021."
   - DROP [531] "An artist called Beeple."
   - DROP [532] "So digital artwork as NFT."
   - DROP [533] "in March 2021."
80. **cut 2104.076-2119.334** (35:04.08-35:19.33, 15.26 s): misspeaks (“A decision is CEO ...”), final take [547]-[548]
   - DROP [543] "A decision is."
   - DROP [544] "A decision is CEO Michael Saylor made public."
   - DROP [545] "A decision that's"
   - DROP [546] "A decision is CEO Michael Saylor made public and the Fed in"
81. **cut 2125.512-2130.231** (35:25.51-35:30.23, 4.72 s): broken take, retaken in [551]-[552]
   - DROP [549] "Tesla Follow."
   - DROP [550] "Announcing 1.5 billion."
82. **cut 2136.548-2141.694** (35:36.55-35:41.69, 5.15 s): broken take, retaken in [555]
   - DROP [553] "Square, PayPal."
   - DROP [554] "and a wave of other companies began."
83. **cut 2148.364-2153.493** (35:48.36-35:53.49, 5.13 s): broken take (“El Salvador made history about-”), retaken in [558]-[560]
   - DROP [556] "in June 2021."
   - DROP [557] "Al Salvador, main history about-"
84. **cut 2162.764-2166.772** (36:02.76-36:06.77, 4.01 s): partial, retaken in [562]
   - DROP [561] "meaning it must be accepted as payment for goods."
85. **cut 2172.547-2187.330** (36:12.55-36:27.33, 14.78 s): two earlier takes of “Whatever you think of the policy ... legitimacy” + fragment, final take [568]-[570]
   - DROP [563] "Whatever you think of the policy."
   - DROP [564] "It was a landmark moment for Bitcoin's legitimacy on the stage."
   - DROP [565] "Whatever you think of the policy."
   - DROP [566] "It was a landmark moment for Bitcoin's legitimacy."
   - DROP [567] "Bye, listen."
86. **cut 2196.462-2202.469** (36:36.46-36:42.47, 6.01 s): partial, retaken in [572]
   - DROP [571] "All of this drove bitcoin to new all-time highs."
87. **cut 2211.588-2222.060** (36:51.59-37:02.06, 10.47 s): clean take superseded by retake [577]-[579]
   - DROP [573] "The previous cycle's peak."
   - DROP [574] "of 20,000."
   - DROP [575] "which had seemed unimaginable a few years earlier."
   - DROP [576] "had been left far behind."
88. **cut 2246.104-2251.122** (37:26.10-37:31.12, 5.02 s): slide-title date read (“2022 - today”), re-read in [586]-[587]
   - DROP [584] "2022."
   - DROP [585] "today."
89. **cut 2262.624-2271.528** (37:42.62-37:51.53, 8.90 s): partial + superseded take, final take [591]
   - DROP [589] "What followed in-"
   - DROP [590] "What followed the November 2021 peak was one of the most destructive periods in crypto's history."
90. **cut 2291.980-2295.158** (38:11.98-38:15.16, 3.18 s): partial (“algorithm-”), retaken in [599]
   - DROP [598] "Terror was a so-called algorithm."
91. **cut 2323.341-2329.561** (38:43.34-38:49.56, 6.22 s): partials, retaken in [610]
   - DROP [608] "It was a crush."
   - DROP [609] "It was a catastrophic failure this end."
92. **cut 2335.927-2348.576** (38:55.93-39:08.58, 12.65 s): earlier take of “The contagion spread. Three Arrows Capital ...”, final take [615]-[618]
   - DROP [611] "The contagion spread."
   - DROP [612] "Three arrows capital."
   - DROP [613] "one of the most prominent crypto hedge funds in the world."
   - DROP [614] "had massive exposure to terror."
93. **cut 2387.055-2402.015** (39:47.05-40:02.01, 14.96 s): two broken takes of the FTX line, final take [632]-[633]
   - DROP [629] "At the time, the world's second largest crypto exchange"
   - DROP [630] "At the time, the world's second largest crypto exchange run by Sam Beckman Fried"
   - DROP [631] "collapse and specularize."
94. **cut 2409.565-2412.881** (40:09.57-40:12.88, 3.32 s): clean take superseded by retake [635]
   - DROP [634] "collapse in a spectacular fashion."
95. **cut 2416.287-2420.272** (40:16.29-40:20.27, 3.99 s): misspeak (“had been secured”), retaken in [637]
   - DROP [636] "It emerged that customer funds had been secured."
96. **cut 2440.531-2447.838** (40:40.53-40:47.84, 7.31 s): partial + superseded take, final take [645]-[646]
   - DROP [643] "Once again, the meeting."
   - DROP [644] "Once again, the media declared crypto dead."
97. **cut 2456.305-2467.736** (40:56.30-41:07.74, 11.43 s): superseded by retake [648] (adds “industry”)
   - DROP [647] "Now this is where those standard definitions on the slide became important."
98. **cut 2476.532-2508.546** (41:16.53-41:48.55, 32.01 s): six takes of “We use specific technical benchmarks to define market conditions ...”, final take [658]-[660]
   - DROP [650] "We use specific technical benchmarks to find market."
   - DROP [651] "we use specific technical benchmarks."
   - DROP [652] "this."
   - DROP [653] "We use specific technical benchmarks."
   - DROP [654] "We use specific technical benchmarks."
   - DROP [655] "to define market conditions."
   - DROP [656] "rather than just rely on gut feeding."
   - DROP [657] "we use specific technical benchmarks."
99. **cut 2517.928-2530.502** (41:57.93-42:10.50, 12.57 s): three broken takes of “A crypto winter is defined as”, final take [666]-[667]
   - DROP [661] "A crypto winter."
   - DROP [662] "is defined as."
   - DROP [663] "A crypto winter."
   - DROP [664] "is defined I pick."
   - DROP [665] "A crypto winter is defined as"
100. **cut 2543.996-2552.228** (42:24.00-42:32.23, 8.23 s): partial + misspeak (“has been given back”), final take [671]-[672]
   - DROP [669] "and pro-"
   - DROP [670] "When the price drops to that level, it signals that the market has been given back years of gain."
101. **cut 2559.289-2564.517** (42:39.29-42:44.52, 5.23 s): misspeak partial, retaken in [674]
   - DROP [673] "and its long true history to-"
102. **cut 2570.568-2581.748** (42:50.57-43:01.75, 11.18 s): superseded take + fragment, final take [677]-[679]
   - DROP [675] "Historically, these periods have represented the best long-term buying opportunities for Bitcoin in history."
   - DROP [676] "Mr. Barkley."
103. **cut 2588.912-2624.380** (43:08.91-43:44.38, 35.47 s): three earlier takes of the bear-market definition, final take [690]-[692]
   - DROP [680] "A bear market."
   - DROP [681] "a bear market."
   - DROP [682] "more broadly defined as"
   - DROP [683] "a bear market, more broadly."
   - DROP [684] "is defined as Bitcoin trading below."
   - DROP [685] "it's 50 week SMA."
   - DROP [686] "and or the 200."
   - DROP [687] "bear market."
   - DROP [688] "More broadly defined as Bitcoin trading below its 50 week SMA."
   - DROP [689] "and or the 200 day SMA."
104. **cut 2637.065-2647.470** (43:57.07-44:07.47, 10.40 s): partial + misspeak (“medium term impact”), final take [695]
   - DROP [693] "These are moving averages that traders watch."
   - DROP [694] "These are moving averages that traders watch most closely to determine the medium term impact."
105. **cut 2653.766-2660.424** (44:13.77-44:20.42, 6.66 s): false start + misspeak (“conditions are bar-”), final take [698]
   - DROP [696] "when they're bright."
   - DROP [697] "When the price is below them, contitions are barric."
106. **cut 2670.032-2692.054** (44:30.03-44:52.05, 22.02 s): misspeak (“technical on it”) + superseded clean take + false start, final take [703]
   - DROP [700] "We'll go much deeper into moving averages and how to use them in a technical on it."
   - DROP [701] "We'll go much deeper into moving averages and how to use them in the technical analysis section of this course."
   - DROP [702] "Well, go on, March."
107. **cut 2703.497-2711.042** (45:03.50-45:11.04, 7.55 s): misspeak (“from the 2020”), retaken in [705]
   - DROP [704] "to recovery from the 2020."
108. **cut 2715.203-2717.594** (45:15.20-45:17.59, 2.39 s): partial, retaken in [707]
   - DROP [706] "rebuilding confidence."
109. **cut 2722.202-2724.391** (45:22.20-45:24.39, 2.19 s): partial, retaken in [709]
   - DROP [708] "and a landmark."
110. **cut 2727.497-2740.238** (45:27.50-45:40.24, 12.74 s): two broken takes of the SEC line, final take [714]-[715] + [717]
   - DROP [710] "In January 2024."
   - DROP [711] "U.S. Securities Exchange Commission."
   - DROP [712] "in January 2024."
   - DROP [713] "the U.S. Securities and Exchange Commission approved Bitcoin."
111. **cut 2746.315-2748.642** (45:46.32-45:48.64, 2.33 s): partial (“Approved bitcoins”), retaken in [717]
   - DROP [716] "Approved bitcoins."
112. **cut 2754.814-2766.526** (45:54.81-46:06.53, 11.71 s): broken take, final take [722]
   - DROP [719] "and it meant that ordinary investors could..."
   - DROP [720] "It meant that ordinary investors could gain exposure to Bitcoin."
   - DROP [721] "traditional brokerage account."
113. **cut 2794.381-2829.008** (46:34.38-47:09.01, 34.63 s): first take of the halving ad-lib + “And I did that” false start, final take [732]-[733]
   - DROP [726] "And it did that."
   - DROP [727] "even before they're having."
   - DROP [728] "was put."
   - DROP [729] "Which put bitcoins for your cycle?"
   - DROP [730] "in question."
   - DROP [731] "And I did that."
114. **cut 2836.363-2844.001** (47:16.36-47:24.00, 7.64 s): two earlier takes, superseded by retake [736]
   - DROP [734] "And that brings us to today."
   - DROP [735] "And that brings us to today."
115. **cut 2851.998-2854.056** (47:32.00-47:34.06, 2.06 s): partial, retaken in [741]
   - DROP [740] "and more integrated into the..."
116. **cut 2871.052-2875.767** (47:51.05-47:55.77, 4.71 s): partial + misspeak (“opportunity is set”), retaken in [749]
   - DROP [747] "and therefore."
   - DROP [748] "and the opportunity is set."
117. **cut 2883.733-2898.949** (48:03.73-48:18.95, 15.22 s): broken take + superseded take + misspeak (“next lesson”), final take [754]
   - DROP [750] "in the next lecture."
   - DROP [751] "We'll look at how crypto companies."
   - DROP [752] "In the next lecture, we'll look at how crypto compares to traditional financial systems."
   - DROP [753] "in the next lesson."
118. **cut 2900.649-2906.040** (48:20.65-48:26.04, 5.39 s): superseded by retake [757]-[758]
   - DROP [755] "We'll look at how crypto compares."
   - DROP [756] "the traditional financial system."

## Flags

- **[534]-[536] Beeple line (kept final take):** Whisper reads the kept take as “In March 2021, it was actually digital artwork sold as an NFT for 69 million dollars” (same with a names prompt), so it may not name Beeple, which the earlier broken takes [530]-[532] did (“An artist called Beeple ...”). Kept per the last-take rule; worth one listen at about 2075.6 s source.
- **[208] “Noina” (0.6 s):** dropped as a false start of “known as” right before [209] “known as the Genesis Block”. Judgment call from text alone.
- **Blips removed with drops:** six sub-0.25 s voiced blips sat between a dropped take and the adjacent kept line (819.1, 914.0, 966.3, 1418.8 “oh my”, 2467.1, 2507.8 s). Those edges sit in the silence touching the kept chunk, so the blips go with the drop.
- **Kept single takes that differ from the script** (no retake exists, so nothing to cut): [166] “documents I have ever read” (script: written); [743] “Wild Wild West” inside one chunk (no pause to cut on, likely the idiom).
- **For the desilencer (next step, not done here):** long silences remain by design, e.g. 26 s before [015], 22 s before [398], 21 s between [398] and [399], 6.7 s lead-in before [000] and 4.6 s tail after [759].

Status: rendered to `history-of-crypto DEFUMBLED.mp4` (libx264 crf 18). Cut 25 ([161] tail) was added after the first render’s QA chunk map exposed the hidden fragment; the file was re-rendered once from the master with all 118 cuts.
