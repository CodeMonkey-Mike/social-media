from playwright.sync_api import sync_playwright
from cap import UA
with sync_playwright() as p:
    b=p.chromium.launch(); c=b.new_context(user_agent=UA,viewport={'width':1920,'height':1080}); pg=c.new_page()
    pg.goto('https://docs.kaspa.org/toccata',wait_until='domcontentloaded'); pg.wait_for_timeout(5000)
    print(pg.evaluate("""()=>{const p=[...document.querySelectorAll('p')].find(e=>e.innerText.includes('active on mainnet'));return p.innerHTML}"""))
    b.close()
