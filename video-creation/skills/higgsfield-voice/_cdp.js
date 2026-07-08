// Shared CDP connect helper for the Higgsfield voice skill.
// Reuses the Playwright install from schedule-tweets (no separate install needed).
const PW = 'C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/node_modules/playwright';
const { chromium } = require(PW);

const CDP = process.env.HF_CDP || 'http://localhost:9333';

async function connect() {
  const browser = await chromium.connectOverCDP(CDP);
  const ctx = browser.contexts()[0];
  const pages = ctx.pages();
  const page = pages.find(p => !p.url().startsWith('chrome')) || pages[0];
  return { browser, ctx, page };
}

module.exports = { connect };
