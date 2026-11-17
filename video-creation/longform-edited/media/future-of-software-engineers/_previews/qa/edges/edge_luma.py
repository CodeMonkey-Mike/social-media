import re, subprocess, sys
edges = [5.355, 22.555, 25.955, 123.322, 125.255, 250.508, 256.741, 289.741, 292.608, 317.975, 321.908, 350.481, 353.481, 437.348, 442.281, 460.181, 465.148]
sel = '+'.join(f"between(t,{e-0.12:.3f},{e+0.12:.3f})" for e in edges)
cmd = ['ffmpeg', '-v', 'info', '-i', 'assets/spine.mp4', '-vf', f"select='{sel}',signalstats,metadata=print:key=lavfi.signalstats.YAVG", '-an', '-f', 'null', '-']
out = subprocess.run(cmd, capture_output=True, text=True).stderr
rows = []
pts = None
for line in out.splitlines():
    m = re.search(r'pts_time:([\d.]+)', line)
    if m and 'Parsed_metadata' in line: pts = float(m.group(1))
    m = re.search(r'YAVG=([\d.]+)', line)
    if m and pts is not None: rows.append((pts, float(m.group(1)))); pts = None
for e in edges:
    seg = [(p, y) for p, y in rows if e - 0.13 <= p <= e + 0.13]
    print(f"edge {e}: " + ' '.join(f"{p:.3f}({'B' if y < 17 else 'F'})" for p, y in seg))
