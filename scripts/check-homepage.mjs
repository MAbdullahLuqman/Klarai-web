import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const base = process.env.HOME_CHECK_URL || 'http://localhost:3000';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
try {
  const page = await browser.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewport({ width, height: 1000 });
    await page.goto(base, { waitUntil: 'networkidle2' });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      fits: document.documentElement.scrollWidth <= innerWidth,
      mainCount: document.querySelectorAll('main').length,
      headline: document.querySelector('h1')?.textContent,
      media: document.querySelectorAll('video, iframe').length,
      brands: document.querySelectorAll('.home-brand').length,
      unfinishedLink: document.querySelector('.home-brand:last-child a'),
      headingFont: getComputedStyle(document.querySelector('h1')).fontFamily,
      buttonsFit: [...document.querySelectorAll('.home-hero .home-button')].every(element => element.getBoundingClientRect().height >= 44),
    }));
    assert(layout.fits, `Overflow at ${width}px`);
    assert.equal(layout.mainCount, 1);
    assert.match(layout.headline, /BUILD.*BRANDS.*GET.*FOUND/s);
    assert.equal(layout.media, 0);
    assert.equal(layout.brands, 5);
    assert.equal(layout.unfinishedLink, null);
    assert(layout.buttonsFit);
    await page.screenshot({ path: `/tmp/klarai-home-${width}.png`, fullPage: true });
  }
  assert.equal(await page.$$eval('.home-brand-logo img', images => images.length), 4);
  await page.waitForFunction(() => document.documentElement.classList.contains('lenis'));
  await page.$eval('.home-service-card', element => element.scrollIntoView({ block: 'center' }));
  await page.hover('.home-service-card');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-service-surface')).transform !== 'none');
  assert.equal(await page.$eval('.home-service-cursor', element => getComputedStyle(element).opacity), '1');
  await page.screenshot({ path: '/tmp/klarai-services-hover.png' });
  await page.mouse.move(0, 0);
  await page.$eval('.home-menu-toggle', element => element.scrollIntoView());
  await page.click('.home-menu-toggle');
  assert(await page.$eval('#home-menu', element => element.open));
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#home-menu').open);
  assert(await page.$eval('.home-menu-toggle', element => element === document.activeElement));
  await page.click('.home-menu-toggle');
  await page.$eval('#home-menu nav a[href="/"]', element => element.click());
  await page.waitForFunction(() => !document.querySelector('#home-menu').open);
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  await page.$eval('.home-faq-list summary', element => element.click());
  assert(await page.$eval('.home-faq-list details', element => element.open));
  assert.equal(await page.$eval('.home-services-grid a', element => element.getAttribute('href')), '/services/aeo-services');
  await page.$eval('.home-audit-form input', element => { element.value = 'example.co.uk'; element.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click('.home-audit-form input', { clickCount: 3 });
  await page.type('.home-audit-form input', 'example.co.uk');
  await Promise.all([page.waitForFunction(() => location.pathname === '/seoauditor'), page.click('.home-audit-form button')]);
  assert.equal(new URL(page.url()).searchParams.get('url'), 'example.co.uk');
  assert.equal(new URL(page.url()).searchParams.get('auto'), 'true');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base, { waitUntil: 'networkidle2' });
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('lenis')), false);
  await page.$eval('.home-service-card', element => element.scrollIntoView({ block: 'center' }));
  await page.hover('.home-service-card');
  assert.equal(await page.$eval('.home-service-surface', element => getComputedStyle(element).transform), 'none');
  assert.equal(await page.$eval('.home-button', element => getComputedStyle(element).transitionDuration), '0s');
  await page.setJavaScriptEnabled(false);
  await page.reload({ waitUntil: 'networkidle2' });
  assert(await page.$eval('h1', element => getComputedStyle(element).opacity === '1'));
  assert.equal(await page.$eval('.home-hero .home-button', element => element.getAttribute('href')), '/seoauditor');
  assert(!requests.some(url => /\.mp4(?:\?|$)/.test(url)), 'Homepage requested video');
  assert.deepEqual(errors, []);
  console.log('Homepage checks passed: four widths, navigation, FAQ, audit routing, reduced motion, and no-JS rendering.');
} finally {
  await browser.close();
}
