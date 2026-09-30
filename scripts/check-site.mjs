import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const base = process.env.SITE_CHECK_URL || 'http://localhost:3001';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const paths = ['/services', '/services/seo-services', '/services/aeo-services', '/services/web-development', '/industries', '/about', '/portfolio', '/case-studies', '/case-studies/pitchside-ai-free-tools-strategy', '/case-studies/klarai-zero-domain-authority-geo-aeo-growth', '/blog', '/contact', '/seoauditor', '/privacy-policy', '/terms-and-conditions', '/seo-result'];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: 1000 });
    for (const path of paths) {
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle2', timeout: 90000 });
      assert.equal(response.status(), 200, `${path}: HTTP status`);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({
        fits: document.documentElement.scrollWidth <= innerWidth,
        mainCount: document.querySelectorAll('main').length,
        h1Count: document.querySelectorAll('h1').length,
        logoWidth: document.querySelector('.home-nav-bar img').getBoundingClientRect().width,
        font: getComputedStyle(document.querySelector('h1')).fontFamily,
        overflow: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('dialog')).slice(0, 5).map(e => e.className),
      }));
      assert(layout.fits, `${path} overflow at ${width}: ${JSON.stringify(layout.overflow)}`);
      assert.equal(layout.mainCount, 1, `${path}: nested main`);
      assert.equal(layout.h1Count, 1, `${path}: headline count`);
      assert.equal(layout.logoWidth, 96, `${path}: logo size`);
      assert.match(layout.font, /manrope/i, `${path}: heading font`);
      await page.screenshot({ path: `/tmp/klarai-site-${path.replaceAll('/', '-').slice(1)}-${width}.png`, fullPage: true });
      console.log(`${width}px ${path}: passed`);
    }
  }
  for (const path of ['/services', '/services/seo-services', '/services/aeo-services', '/services/web-development']) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle2' });
    await page.$eval('.home-service-card', e => e.scrollIntoView({ block: 'center' }));
    await page.hover('.home-service-card');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-service-surface')).transform !== 'none');
    assert.equal(await page.$eval('.home-service-cursor', e => getComputedStyle(e).opacity), '1');
    await page.screenshot({ path: `/tmp/klarai-site-hover-${path.replaceAll('/', '-')}.png` });
  }
  await page.goto(`${base}/contact`, { waitUntil: 'networkidle2' });
  await page.type('input[autocomplete="name"]', 'Design check');
  await page.click('button.home-menu-toggle');
  await page.keyboard.press('Escape');
  await page.$$eval('button', buttons => buttons.find(b => b.textContent === 'Next').click());
  await page.type('input[type="email"]', 'invalid');
  await page.$$eval('button', buttons => buttons.find(b => b.textContent === 'Next').click());
  assert(await page.$('input[type="email"]'), 'Invalid email should stay on email step');
  await page.click('input[type="email"]', { clickCount: 3 });
  await page.type('input[type="email"]', 'design@example.com');
  await page.$$eval('button', buttons => buttons.find(b => b.textContent === 'Next').click());
  assert.match(await page.$eval('main h2', e => e.textContent), /What do you need/);
  // No real enquiry is sent during this check.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${base}/services/seo-services`, { waitUntil: 'networkidle2' });
  await page.$eval('.home-service-card', e => e.scrollIntoView({ block: 'center' }));
  await page.hover('.home-service-card');
  assert.equal(await page.$eval('.home-service-surface', e => getComputedStyle(e).transform), 'none');
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('lenis')), false);
  await page.setJavaScriptEnabled(false);
  await page.goto(`${base}/services/seo-services`, { waitUntil: 'networkidle2' });
  assert(await page.$eval('h1', e => getComputedStyle(e).opacity === '1' && e.textContent.trim().length > 0));
  assert.deepEqual(errors, []);
  console.log('Public site checks passed: layouts, smaller logo, service effects, form validation, reduced motion, and no-JS content.');
} finally { await browser.close(); }
