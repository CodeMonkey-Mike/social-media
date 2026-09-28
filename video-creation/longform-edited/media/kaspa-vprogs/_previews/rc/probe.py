import sys
from playwright.sync_api import sync_playwright
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
urls={'R3':'https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698','R4':'https://kasmagazine.com/article/sneakpeaks-and-developments','R5':'https://docs.kaspa.org/toccata','R7':'https://kaspa.org/build'}
with sync_playwright() as p:
    b=p.chromium.launch()
    for k,u in urls.items():
        c=b.new_context(user_agent=UA,viewport={'width':1920,'height':1080},device_scale_factor=1)
        pg=c.new_page()
        try:
            r=pg.goto(u,wait_until='domcontentloaded',timeout=60000)
        except Exception as e:
            r=None
            print(k,'ERR',e); 
        pg.wait_for_timeout(6000)
        t=pg.inner_text('body')
        open(f'C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/kaspa-vprogs/_previews/rc/{k}.txt','w',encoding='utf-8').write(t)
        print(k,pg.title(),len(t),r.status if r else None)
        c.close()
    b.close()
