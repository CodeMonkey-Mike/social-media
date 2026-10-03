# C19a, Type 1 ANIMATED stat cards (CH6 386.00-393.00, 7.0s)
Spoken: "Three months in, over a billion dollars locked in its apps and more than 90 billion dollars in total trading volume."
States: start, mid, payoff. Same layout as C19b on purpose, so the pair reads as one system.
- 386.00 `start`: card 1 lit at $0, card 2 dimmed (opacity .16).
- 387.62 "billion dollars locked": $0 to $1B (0.9s ease-out, 0.1B steps), '+' on the final frame = `mid`.
- 390.22 "90 billion": card 2 lifts to full opacity (8f) and counts $0 to $90B+ (1.1s) = `payoff`. Hold to 393.00.
Numbers: $1B+ TVL (DATA: about 1.04B) and $90B+ DEX volume over 3 months (daily-chart sum). Never 99B. VERIFY, and 'three months' must still be true at render.
