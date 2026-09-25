import { chromium, devices } from 'playwright';
const iPhone = devices['iPhone 14'];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ ...iPhone });
const page = await ctx.newPage();
await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

// Screenshot default view
await page.screenshot({ path: 'scratch/m1-default.png', fullPage: false });

// Audit
const metrics = await page.evaluate(() => {
  const docEl = document.documentElement;
  const hasHScroll = docEl.scrollWidth > docEl.clientWidth;
  const overflowing = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth + 2) {
      overflowing.push({ tag: el.tagName, cls: el.className.toString().slice(0,80), w: Math.round(r.width), r: Math.round(r.right), vw: window.innerWidth });
      if (overflowing.length > 8) break;
    }
  }
  const smallBtns = [...document.querySelectorAll('button')].map(b => {
    const r = b.getBoundingClientRect();
    return { text: (b.innerText||b.title||'').slice(0,25).trim(), w: Math.round(r.width), h: Math.round(r.height) };
  }).filter(t => (t.w > 0 && t.w < 44) || (t.h > 0 && t.h < 44));
  return {
    vp: { w: window.innerWidth, h: window.innerHeight },
    hasHScroll, docScrollW: docEl.scrollWidth,
    overflowing,
    smallBtns,
    totalBtns: document.querySelectorAll('button').length,
  };
});
console.log('METRICS:', JSON.stringify(metrics, null, 2));

// Drawer test
const hamburger = page.locator('button[title="Chọn thuật toán"]');
if (await hamburger.count() > 0) {
  await hamburger.click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/m2-drawer.png', fullPage: false });
  // close drawer by clicking overlay
  const overlay = page.locator('[class*="fixed inset-0 bg-dark-900"]');
  if (await overlay.count() > 0) await overlay.click({ force: true });
  await page.waitForTimeout(300);
}

// Code pane
const codeTab = page.locator('button:has-text("Code")').first();
if (await codeTab.count() > 0) {
  await codeTab.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/m3-code.png', fullPage: false });
  // back to visualizer
  const vizTab = page.locator('button:has-text("Mô phỏng")').first();
  if (await vizTab.count() > 0) await vizTab.click();
  await page.waitForTimeout(300);
}

// Catalog modal
const catBtn = page.locator('button[title*="14 thuật toán"]');
if (await catBtn.count() > 0) {
  await catBtn.click({ force: true });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'scratch/m4-catalog.png', fullPage: false });
  // close
  const closeBtn = page.locator('[class*="fixed inset-0 z-50"] button').first();
  if (await closeBtn.count()) await closeBtn.click({ force: true });
}

// Full page scroll
await page.screenshot({ path: 'scratch/m5-fullpage.png', fullPage: true });

await browser.close();
console.log('DONE - screenshots in scratch/');
