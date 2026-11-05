import { chromium } from '@playwright/test';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to composio.dev...');
  await page.goto('https://composio.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Extract page structure, headers, navigation, sections, scripts, fonts
  const data = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    // Find all sections or major containers
    const sections = Array.from(document.querySelectorAll('section, main > div, [data-section]'));
    
    // Inspect navigation menu items
    const navLinks = Array.from(document.querySelectorAll('nav a, header a, nav button, header button')).map(el => ({
      text: el.innerText.trim(),
      tagName: el.tagName,
      className: el.className,
      href: el.getAttribute('href'),
      ariaExpanded: el.getAttribute('aria-expanded'),
      ariaHasPopup: el.getAttribute('aria-haspopup'),
      rect: el.getBoundingClientRect()
    }));

    // Find headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
      tag: h.tagName,
      text: h.innerText.replace(/\n+/g, ' ').trim(),
      className: h.className,
      rect: h.getBoundingClientRect()
    }));

    // Detect color theme / dark mode
    const htmlClasses = document.documentElement.className;
    const bodyClasses = document.body.className;
    const computedBody = window.getComputedStyle(document.body);
    const computedHtml = window.getComputedStyle(document.documentElement);

    return {
      title: document.title,
      htmlClasses,
      bodyClasses,
      themeColors: {
        bodyBg: computedBody.backgroundColor,
        bodyColor: computedBody.color,
        fontFamily: computedBody.fontFamily,
      },
      navLinks,
      headings,
      sectionsCount: sections.length,
      sectionSummaries: sections.map((s, idx) => ({
        idx,
        tag: s.tagName,
        id: s.id,
        className: s.className,
        textSnippet: s.innerText.substring(0, 150).replace(/\n+/g, ' '),
        rect: s.getBoundingClientRect()
      }))
    };
  });

  fs.writeFileSync('docs/composio-reference/page-overview.json', JSON.stringify(data, null, 2));
  console.log('Saved page-overview.json. Headings found:', data.headings.length);
  data.headings.forEach((h, i) => console.log(`${i}: [${h.tag}] ${h.text}`));

  await browser.close();
}

run().catch(console.error);
