import { chromium } from '@playwright/test';
import fs from 'fs';

async function extractBandsJson() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.goto('https://composio.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const bands = await page.evaluate(() => {
    function getStyles(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        width: cs.width,
        height: cs.height,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        border: cs.border,
        borderRadius: cs.borderRadius,
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        boxShadow: cs.boxShadow,
        display: cs.display,
        gap: cs.gap
      };
    }

    // Band 2
    const sec2 = document.querySelector('#use-cases');
    const b2Card = sec2?.querySelector('.border, [class*="rounded"]');
    const b2Buttons = Array.from(sec2?.querySelectorAll('button') || []).map(b => ({
      text: b.innerText.trim(),
      className: b.className,
      styles: getStyles(b)
    }));

    // Band 3
    const sec3 = document.querySelector('#agents');
    const b3Grid = sec3?.querySelector('.grid, [class*="grid-cols"]');
    const b3Cards = Array.from(sec3?.querySelectorAll('h3') || []).map(h => {
      const card = h.closest('div, a, li');
      const icon = card?.querySelector('svg, img');
      return {
        title: h.innerText,
        card: getStyles(card),
        icon: icon ? {
          tag: icon.tagName,
          width: window.getComputedStyle(icon).width,
          height: window.getComputedStyle(icon).height,
          className: icon.className
        } : null
      };
    });

    // Band 4
    const sec4 = document.querySelector('#harder-jobs');
    const stickyContainer = sec4?.querySelector('[class*="sticky"]') || Array.from(sec4?.querySelectorAll('*') || []).find(e => window.getComputedStyle(e).position === 'sticky');
    const b4Cards = Array.from(sec4?.querySelectorAll('h3') || []).map(h => ({
      title: h.innerText,
      parent: getStyles(h.closest('div, li'))
    }));
    const auditCard = Array.from(sec4?.querySelectorAll('div') || []).find(d => {
      const r = d.getBoundingClientRect();
      return r.width >= 480 && r.width <= 600 && window.getComputedStyle(d).borderWidth !== '0px';
    }) || sec4?.querySelector('[class*="border"]');

    // Band 5
    const sec5 = document.querySelector('#teams');
    const b5Cards = Array.from(sec5?.querySelectorAll('section, [class*="rounded-3xl"]') || []).map(c => ({
      h3: c.querySelector('h3')?.innerText,
      styles: getStyles(c)
    }));
    const b5Badges = Array.from(sec5?.querySelectorAll('span, div') || []).filter(s => {
      return (s.className.includes('rounded-full') || window.getComputedStyle(s).borderRadius === '9999px') && s.innerText.trim().length > 1 && s.innerText.trim().length < 30;
    }).map(b => ({
      text: b.innerText.trim(),
      styles: getStyles(b)
    }));

    // Band 6
    const sec6 = document.querySelector('#trust');
    const b6Cards = Array.from(sec6?.querySelectorAll('h3') || []).map(h => ({
      title: h.innerText,
      parent: getStyles(h.closest('div[class*="border"], div[class*="rounded"]'))
    }));

    // Band 7
    const sec7 = document.querySelector('#build');
    const terminal = sec7?.querySelector('pre, code')?.closest('[class*="rounded"], .border') ||
                     Array.from(sec7?.querySelectorAll('div') || []).find(d => d.querySelector('code, pre'));
    const codeEl = sec7?.querySelector('code, pre');
    const windowDots = Array.from(terminal?.querySelectorAll('span[class*="rounded-full"], div[class*="rounded-full"]') || []).map(d => getStyles(d));

    return {
      band2: {
        heading: sec2?.querySelector('h2')?.innerText,
        card: getStyles(b2Card),
        buttons: b2Buttons,
        fullOuterHTML: b2Card ? b2Card.outerHTML.substring(0, 3000) : null
      },
      band3: {
        heading: sec3?.querySelector('h2')?.innerText,
        gridStyles: getStyles(b3Grid),
        cards: b3Cards
      },
      band4: {
        heading: sec4?.querySelector('h2')?.innerText,
        sticky: getStyles(stickyContainer),
        steps: b4Cards,
        auditCard: getStyles(auditCard),
        auditCardHTML: auditCard ? auditCard.outerHTML.substring(0, 3000) : null
      },
      band5: {
        heading: sec5?.querySelector('h2')?.innerText,
        cards: b5Cards,
        badges: b5Badges.slice(0, 10),
        fullOuterHTML: sec5 ? sec5.outerHTML.substring(0, 3000) : null
      },
      band6: {
        heading: sec6?.querySelector('h2')?.innerText,
        cards: b6Cards
      },
      band7: {
        heading: sec7?.querySelector('h2')?.innerText,
        terminal: getStyles(terminal),
        code: getStyles(codeEl),
        windowDots,
        fullOuterHTML: terminal ? terminal.outerHTML.substring(0, 3000) : null
      }
    };
  });

  fs.writeFileSync('docs/composio-reference/bands-extraction.json', JSON.stringify(bands, null, 2));
  console.log('Saved bands-extraction.json successfully!');

  await browser.close();
}

extractBandsJson().catch(console.error);
