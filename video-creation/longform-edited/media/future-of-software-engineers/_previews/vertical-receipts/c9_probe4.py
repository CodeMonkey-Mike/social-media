import urllib.request, io
from PIL import Image
import numpy as np
base = "https://d341ezm4iqaae0.cloudfront.net/hiringlaborg/2026/07/07143746/titleword2_sw_rebound_decomposition-"
UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
for suf in ["2048x1170.png", "1536x878.png"]:
    req = urllib.request.Request(base + suf, headers={"User-Agent": UA})
    data = urllib.request.urlopen(req, timeout=60).read()
    open("explore2/c9-chart-" + suf, "wb").write(data)
    im = Image.open(io.BytesIO(data)).convert("RGB")
    a = np.asarray(im).astype(int)
    ink = (np.abs(a - 255).max(axis=2) > 24)
    ys, xs = np.where(ink)
    print(suf, im.size, "ink bbox x", xs.min(), xs.max(), "y", ys.min(), ys.max())
