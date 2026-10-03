# cap-vs-volume, Type 1 ANIMATED (CH3 162.48-167.43, 4.95s)
Spoken: "4 million dollars on a chain has already done more than 90 billion dollars in trading volume."
States: start, mid, payoff (the PNGs are the design spec; build it as a real useCurrentFrame component).
- 162.48 enter (cross-fade + scale-in 0.96 to 1.0, 10f) on `start`: both labels, $0 values, empty tracks.
- 162.48-163.40 GOLDEN value counts $0 to $4.2M (ease-out, 1 decimal, M suffix); gold sliver grows 0 to 6px = `mid`. The sliver is a MINIMUM VISIBLE width, not to scale (true ratio about 0.005%).
- 165.12 "90 billion": volume counts $0 to $90B+ (integer B, the '+' appears on the final frame) while the lime bar races 0 to 1640px (ease-in-out, 1.1s) = `payoff`. Hold to 167.43.
Numbers: $4.2M (DATA section 5: 4,234,949) and $90B+ (DATA Pillar 4: daily-chart sum 92.14B). Never 98.97B or 99.02B. VERIFY both at render.
