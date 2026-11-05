import { chromium } from '@playwright/test';
import fs from 'fs';

async function extractFaqAndCta() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  console.log('Navigating to composio.dev...');
  await page.goto('https://composio.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // ==========================================
  // BAND 11: FAQ ACCORDION
  // ==========================================
  console.log('Locating FAQ section...');
  const faqH2 = page.locator('h2:has-text("Frequently asked questions")');
  await faqH2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Locate the section containing this H2
  const faqSection = page.locator('section:has(h2:has-text("Frequently asked questions"))');

  // Click first FAQ item to expand
  const firstFaqTrigger = faqSection.locator('button, h3').first();
  await firstFaqTrigger.click({ force: true });
  await page.waitForTimeout(600);

  await faqSection.screenshot({
    path: 'docs/composio-reference/09-band11-faq-accordion.png'
  });
  console.log('Captured 09-band11-faq-accordion.png');

  const faqData = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Frequently asked questions'));
    const section = h2?.closest('section');
    if (!section) return null;

    // Check all accordion items
    const items = Array.from(section.querySelectorAll('button, [data-state]')).filter(el => el.innerText.includes('?')).map(btn => {
      const cs = window.getComputedStyle(btn);
      const icon = btn.querySelector('svg, span:last-child');
      const csIcon = icon ? window.getComputedStyle(icon) : null;
      const parent = btn.parentElement;
      const panel = parent?.querySelector('[role="region"], p, [class*="content"]') || parent?.nextElementSibling;
      const csPanel = panel ? window.getComputedStyle(panel) : null;

      return {
        question: btn.innerText.trim(),
        btnClasses: btn.className,
        btnStyles: {
          padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
          borderBottom: `${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          color: cs.color
        },
        iconSVG: icon?.outerHTML,
        iconClasses: icon?.className,
        iconTransform: csIcon?.transform,
        panelClasses: panel?.className,
        panelStyles: csPanel ? {
          fontFamily: csPanel.fontFamily,
          fontSize: csPanel.fontSize,
          lineHeight: csPanel.lineHeight,
          color: csPanel.color
        } : null,
        outerHTML: parent?.outerHTML?.substring(0, 800)
      };
    });

    return {
      h2Text: h2.innerText,
      sectionClasses: section.className,
      items
    };
  });

  // ==========================================
  // BAND 12: BOTTOM CTA BANNER
  // ==========================================
  console.log('Locating Bottom CTA section...');
  const ctaH2 = page.locator('h2:has-text("Give your AI what it needs")');
  await ctaH2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const ctaSection = page.locator('section:has(h2:has-text("Give your AI what it needs"))');

  await ctaSection.screenshot({
    path: 'docs/composio-reference/10-band12-bottom-cta.png'
  });
  console.log('Captured 10-band12-bottom-cta.png');

  const bottomCtaData = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Give your AI what it needs'));
    const section = h2?.closest('section');
    if (!section) return null;

    const card = section.querySelector('[class*="rounded"], .border') || section;
    const cs = window.getComputedStyle(card);
    const canvas = card.querySelector('canvas');
    const gl = canvas ? (canvas.getContext('webgl2') || canvas.getContext('webgl')) : null;

    const ctas = Array.from(card.querySelectorAll('a, button')).map(b => ({
      text: b.innerText.trim(),
      className: b.className,
      href: b.getAttribute('href'),
      styles: {
        backgroundColor: window.getComputedStyle(b).backgroundColor,
        color: window.getComputedStyle(b).color,
        border: window.getComputedStyle(b).border,
        borderRadius: window.getComputedStyle(b).borderRadius,
        fontFamily: window.getComputedStyle(b).fontFamily,
        fontSize: window.getComputedStyle(b).fontSize,
        padding: `${window.getComputedStyle(b).paddingTop} ${window.getComputedStyle(b).paddingRight} ${window.getComputedStyle(b).paddingBottom} ${window.getComputedStyle(b).paddingLeft}`
      }
    }));

    return {
      h2Text: h2.innerText,
      cardClasses: card.className,
      cardRect: card.getBoundingClientRect(),
      cardStyles: {
        width: cs.width,
        height: cs.height,
        borderRadius: cs.borderRadius,
        border: cs.border,
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        boxShadow: cs.boxShadow
      },
      hasCanvas: !!canvas,
      isWebGL: !!gl,
      ctas,
      outerHTMLSnippet: card.outerHTML.substring(0, 2000)
    };
  });

  fs.writeFileSync('docs/composio-reference/faq-and-cta.json', JSON.stringify({ faqData, bottomCtaData }, null, 2));
  console.log('Saved faq-and-cta.json successfully!');

  await browser.close();
}

extractFaqAndCta().catch(console.error);
