import { chromium } from '@playwright/test';
import fs from 'fs';

async function extractHero() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  
  await page.goto('https://composio.dev/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Take hero screenshot
  await page.screenshot({
    path: 'docs/composio-reference/02-hero-section.png',
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });

  const heroDetails = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const heroSection = h1.closest('section') || h1.parentElement;

    // Word rotator inspection: check all children of h1
    const h1Children = Array.from(h1.querySelectorAll('*')).map(child => ({
      tagName: child.tagName,
      className: child.className,
      style: child.getAttribute('style'),
      text: child.innerText,
      outerHTML: child.outerHTML
    }));

    // Check background canvas / shaders
    const canvases = Array.from(heroSection.querySelectorAll('canvas')).map(c => {
      const gl = c.getContext('webgl') || c.getContext('webgl2');
      const ctx2d = c.getContext('2d');
      return {
        width: c.width,
        height: c.height,
        className: c.className,
        style: c.getAttribute('style'),
        isWebGL: !!gl,
        is2D: !!ctx2d,
        rect: c.getBoundingClientRect()
      };
    });

    // Check background svgs or divs or gradients
    const bgElements = Array.from(heroSection.querySelectorAll('div, svg')).filter(el => {
      const cs = window.getComputedStyle(el);
      return cs.position === 'absolute' && (cs.backgroundImage !== 'none' || el.tagName === 'SVG' || el.tagName === 'CANVAS');
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      style: el.getAttribute('style'),
      backgroundImage: window.getComputedStyle(el).backgroundImage,
      backgroundColor: window.getComputedStyle(el).backgroundColor,
      maskImage: window.getComputedStyle(el).maskImage || window.getComputedStyle(el).webkitMaskImage,
      rect: el.getBoundingClientRect()
    }));

    // Find CTAs in hero
    const ctaContainer = document.querySelector('h1 + div') || h1.parentElement.querySelector('.grid, .flex:has(a)');
    const ctas = Array.from(heroSection.querySelectorAll('a, button')).filter(el => {
      const r = el.getBoundingClientRect();
      return r.top < 850 && r.height > 30 && r.width > 50 && el.innerText.trim().length > 0;
    }).map(el => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.innerText.trim(),
        tagName: el.tagName,
        href: el.getAttribute('href'),
        className: el.className,
        rect: el.getBoundingClientRect(),
        styles: {
          display: cs.display,
          padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
          border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
          borderRadius: cs.borderRadius,
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          letterSpacing: cs.letterSpacing,
          boxShadow: cs.boxShadow,
          transition: cs.transition
        },
        parentOuterHTML: el.parentElement ? el.parentElement.outerHTML.split('>')[0] + '>' : null,
        parentClasses: el.parentElement?.className,
        parentDisplay: el.parentElement ? window.getComputedStyle(el.parentElement).display : null,
        parentGridCols: el.parentElement ? window.getComputedStyle(el.parentElement).gridTemplateColumns : null,
        parentWidth: el.parentElement ? window.getComputedStyle(el.parentElement).width : null
      };
    });

    return {
      h1OuterHTML: h1.outerHTML,
      h1Classes: h1.className,
      h1Styles: {
        fontSize: window.getComputedStyle(h1).fontSize,
        lineHeight: window.getComputedStyle(h1).lineHeight,
        letterSpacing: window.getComputedStyle(h1).letterSpacing,
        fontWeight: window.getComputedStyle(h1).fontWeight,
        fontFamily: window.getComputedStyle(h1).fontFamily,
        color: window.getComputedStyle(h1).color,
      },
      h1Children,
      canvases,
      bgElements,
      ctas
    };
  });

  // Watch word rotator over 5 seconds to capture words and animations
  console.log('Sampling word rotator...');
  const wordSamples = [];
  for (let i = 0; i < 15; i++) {
    const sample = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const spans = Array.from(h1.querySelectorAll('span')).map(s => ({
        text: s.innerText,
        style: s.getAttribute('style'),
        className: s.className,
        transform: window.getComputedStyle(s).transform,
        opacity: window.getComputedStyle(s).opacity
      }));
      return {
        h1Text: h1.innerText,
        spans
      };
    });
    wordSamples.push(sample);
    await page.waitForTimeout(400);
  }

  // Hover over primary CTA and secondary CTA to check hover states
  const primaryCTA = page.locator('a:has-text("GET STARTED"), a:has-text("START BUILDING"), a:has-text("TRY IT"), a:has-text("GET API KEY")').first();
  let ctaHoverState = null;
  if (await primaryCTA.count() > 0) {
    const beforeHover = await primaryCTA.evaluate(el => window.getComputedStyle(el).backgroundColor);
    await primaryCTA.hover();
    await page.waitForTimeout(300);
    const afterHover = await primaryCTA.evaluate(el => ({
      bg: window.getComputedStyle(el).backgroundColor,
      border: window.getComputedStyle(el).border,
      transform: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow
    }));
    ctaHoverState = { beforeBg: beforeHover, afterHover };
  }

  fs.writeFileSync('docs/composio-reference/hero-details.json', JSON.stringify({ heroDetails, wordSamples, ctaHoverState }, null, 2));
  console.log('Hero extraction completed.');

  await browser.close();
}

extractHero().catch(console.error);
