# Manual-polygon inpaint of the leaked green glyph on the $IF coin's right glove (5a094cad).
import cv2, numpy as np, sys
src, dst, S = sys.argv[1], sys.argv[2], 8  # supersample factor for sub-pixel polygons
im = cv2.imread(src)
polys = [
  [(978.0,649.6),(985,644.6),(997.2,644.2),(997.8,648.0),(987.5,653.3),(984.0,653.8),(978.8,651.6)],  # green strokes
  [(977.2,647.2),(982.5,642.2),(992.0,641.6),(993.2,645.2),(985.0,648.4)],                               # olive halo in the knuckle shadow
  [(994.6,652.6),(1000.8,648.4),(1002.0,650.0),(995.8,654.2)],                                           # dark tick
]
big = np.zeros((im.shape[0]*S, im.shape[1]*S), np.uint8)
for p in polys:
    cv2.fillPoly(big, [np.array([(int(x*S), int(y*S)) for x, y in p], np.int32)], 255)
m = cv2.resize(big, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_AREA)
m = (m > 20).astype(np.uint8) * 255
m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=int(sys.argv[3]) if len(sys.argv) > 3 else 1)
out = cv2.inpaint(im, m, 3, cv2.INPAINT_TELEA)
cv2.imwrite(dst, out); cv2.imwrite(dst.replace('.png', '_mask.png'), m)
print('masked px', int((m > 0).sum()))
