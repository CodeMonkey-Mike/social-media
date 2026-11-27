from kit import *
import time
with sync_playwright() as p:
    br = launch(p)
    page = new_page(br, w=1920, h=1080, dsf=1)
    goto(page, "https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director", 7)
    print(page.evaluate("""() => { const out = []; document.elementsFromPoint(45, 1050).slice(0, 4).forEach(e => out.push(e.tagName + '#' + (e.id || '') + '.' + String(e.className).slice(0, 50) + ' pos=' + getComputedStyle(e).position)); return out; }"""))
    print(page.evaluate("""() => { const out = []; document.elementsFromPoint(1890, 1050).slice(0, 4).forEach(e => out.push(e.tagName + '#' + (e.id || '') + '.' + String(e.className).slice(0, 50) + ' pos=' + getComputedStyle(e).position)); return out; }"""))
    br.close()
