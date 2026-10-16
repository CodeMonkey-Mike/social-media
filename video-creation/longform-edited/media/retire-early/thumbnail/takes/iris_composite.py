"""Composite ONLY the irises of the Nano Banana edit into the original thumbnail (Mike 2026-10-11: everything else exactly
the same), recoloured to the hue / saturation MEASURED on Mike's real eyes (intro frame 0:02.5), with the brightness kept
close to the original iris so it sits in the photo's lighting (every-job lesson: generated green eyes read too bright)."""
import sys
import numpy as np
from PIL import Image, ImageFilter
import colorsys

thumb_p, gen_p, ref_p, out_p = sys.argv[1:5]
v_gain = float(sys.argv[5]) if len(sys.argv) > 5 else 0.42     # iris value vs the EDIT's iris (every-job v9b, approved: x0.42)
o = np.asarray(Image.open(thumb_p).convert("RGB"), dtype=np.float32) / 255
g_img = Image.open(gen_p).convert("RGB").resize((o.shape[1], o.shape[0]), Image.LANCZOS)
g = np.asarray(g_img, dtype=np.float32) / 255
ref = np.asarray(Image.open(ref_p).convert("RGB"), dtype=np.float32) / 255


def hsv(a):
    mx, mn = a.max(-1), a.min(-1)
    v = mx
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    r, gg, b = a[..., 0], a[..., 1], a[..., 2]
    d = np.maximum(mx - mn, 1e-6)
    h = np.where(mx == r, ((gg - b) / d) % 6, np.where(mx == gg, (b - r) / d + 2, (r - gg) / d + 4)) / 6
    return h, s, v


def from_hsv(h, s, v):
    i = np.floor(h * 6).astype(int) % 6
    f = h * 6 - np.floor(h * 6)
    p, q, t = v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)
    out = np.zeros(h.shape + (3,), np.float32)
    for k, (a, b, c) in enumerate([(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]):
        m = i == k
        out[m] = np.stack([a[m], b[m], c[m]], -1)
    return out


# 1. Mike's real iris colour: the saturated cyan-to-green pixels of the reference crop (skin is red-orange, whites are grey)
rh, rs, rv = hsv(ref)
boxes = np.zeros(rh.shape, bool)
boxes[215:290, 320:400] = True   # left iris in the reference crop (measured on a grid)
boxes[230:305, 880:960] = True   # right iris
iris_ref = boxes & (rh > 0.25) & (rh < 0.55) & (rs > 0.15) & (rv > 0.12) & (rv < 0.85)
ref_h = float(np.median(rh[iris_ref])); ref_s = float(np.median(rs[iris_ref])); ref_v = float(np.median(rv[iris_ref]))
print(f"reference iris: {iris_ref.sum()} px, hue {ref_h * 360:.0f} deg, sat {ref_s:.2f}, val {ref_v:.2f}")

# 2. Iris mask = where the edit turned the eye green, inside the eye band of the face only
gh, gs, gv = hsv(g)
band = np.zeros(gh.shape, bool)
band[230:330, 800:1080] = True
green = band & (gh > 0.2) & (gh < 0.5) & (gs > 0.3) & ((g[..., 1] - np.maximum(g[..., 0], g[..., 2])) > 0.05)
m = Image.fromarray((green * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
mask = np.asarray(m, dtype=np.float32)[..., None] / 255
print(f"iris mask: {green.sum()} px core, bbox x {np.where(green.any(0))[0].min()}-{np.where(green.any(0))[0].max()}, "
      f"y {np.where(green.any(1))[0].min()}-{np.where(green.any(1))[0].max()}")

# 3. Recolour the edit's iris texture: Mike's hue and saturation, brightness tied to the ORIGINAL iris (same lighting)
oh, os_, ov = hsv(o)
orig_v = float(np.median(ov[green])); gen_v = float(np.median(gv[green]))
target_v = gen_v * v_gain
new_v = np.clip(gv * (target_v / max(gen_v, 1e-6)), 0, 1)
new = from_hsv(np.full(gh.shape, ref_h, np.float32), np.clip(gs * (ref_s / max(float(np.median(gs[green])), 1e-6)), 0, 1), new_v)
print(f"iris value: original {orig_v:.2f}, edit {gen_v:.2f} -> {target_v:.2f} (gain {v_gain})")

out = o * (1 - mask) + new * mask
Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(out_p)
diff = np.abs(out - o).max(-1)
print(f"changed pixels: {(diff > 1 / 255).sum()} of {diff.size} ({100 * (diff > 1 / 255).mean():.3f}%), all inside the eye band: "
      f"{bool(((diff > 1 / 255) & ~band).sum() == 0)}")
