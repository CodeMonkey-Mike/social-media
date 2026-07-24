// _probe-withdraw-dom.js — read-only: dump the DOM of one sent-invitation card
// so we can see exactly how the Withdraw control is rendered (new 2026 UI).
const S = require('../lib/_li-session');

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/sent/', { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await S.pause(page, 3000, 5000, 'render');

    const info = await page.evaluate(() => {
      const a = [...document.querySelectorAll('a[href*="/in/"]')].find(x => /\/in\//.test(x.getAttribute('href') || ''));
      if (!a) return { err: 'no profile anchor found' };
      // climb to the card that contains "Withdraw"
      let node = a, card = null;
      for (let i = 0; i < 8 && node.parentElement; i++) {
        node = node.parentElement;
        if (/withdraw/i.test(node.innerText || '')) { card = node; break; }
      }
      if (!card) return { err: 'no card with Withdraw text' };
      // every element in the card whose OWN text or aria-label mentions withdraw
      const hits = [...card.querySelectorAll('*')]
        .filter(el => /withdraw/i.test((el.getAttribute('aria-label') || '')) ||
                      (el.children.length === 0 && /withdraw/i.test(el.textContent || '')))
        .map(el => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 120),
            role: el.getAttribute('role'),
            aria: (el.getAttribute('aria-label') || '').slice(0, 120),
            text: (el.textContent || '').trim().slice(0, 60),
            rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            visible: !!(r.width && r.height),
          };
        });
      return { hits, cardHtml: card.outerHTML.slice(0, 3500) };
    });
    console.log(JSON.stringify(info, null, 2));
  } finally {
    await browser.close();
  }
})();
