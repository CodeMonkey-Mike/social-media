from playwright.sync_api import sync_playwright
from cap import UA
import datetime
with sync_playwright() as p:
    b=p.chromium.launch(); c=b.new_context(user_agent=UA,viewport={'width':1920,'height':1080},device_scale_factor=2); pg=c.new_page()
    pg.goto('https://kasmagazine.com/article/sneakpeaks-and-developments',wait_until='domcontentloaded'); pg.wait_for_timeout(6000)
    pg.screenshot(path='../../assets/receipts/R8-masthead-date-supplement.png',clip=dict(x=0,y=0,width=1920,height=1080))
    print(datetime.datetime.now().isoformat())
    b.close()
