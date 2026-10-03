# C2, Type 1 ANIMATED price formula (CH4 219.45-230.86, 11.4s)
Spoken: "Its dollar price is its price in gold times the price of gold. So if that ratio just holds and gold goes up, like let's say 10%, Golden Kitty goes up 10% in dollars."
States: start, mid, example-gold, payoff.
- 219.70 `start`: the term 1 card (GOLDEN IN DOLLARS), label only.
- 219.70-223.32 build term by term: '=' + term 2 (on "price in gold"), then 'x' + term 3 (on "price of gold"). Each card fades and slides up 20px over 8f. Values count in over 0.6s each in mono (fixed decimals 6 / 8 / 2). End = `mid`.
- 227.18 "gold goes up": term 3 border goes lime, '+10%' chip pops (scale 0.8 to 1.0), 'EXAMPLE, NOT A FORECAST' fades in = `example-gold`.
- 229.64 "goes up 10% in dollars": term 1 border goes lime with its '+10%' chip, and the 'HOLDS' chip appears under term 2 = `payoff`. Hold to 230.86.
The read values stay put; +10% is a chip, never a computed new price (no derived number on screen).
Numbers: $0.004234, 0.00001109 GLD, $381.79 (DATA section 5 / Pillar 3; 0.00001109 x 381.79 = 0.004234). VERIFY at render, and re-pull all three from one moment so the product holds.

2026-10-02 palette: the +10% chips and the lit borders are GREEN (#00e68a, the bullish token), not lime. Lime is reserved for Robinhood and Robinhood Chain elements; a price move is neither. Build the animation in green.
