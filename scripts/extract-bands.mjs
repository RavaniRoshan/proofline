import { chromium } from '@playwright/test';
import fs from 'fs';

async function extractBands() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  console.log('Navigating to composio.dev...');
  await page.goto('https://composio.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const bandsData = {};

  // ==========================================
  // BAND 2: USE CASES (#use-cases)
  // ==========================================
  console.log('Inspecting Band 2 (Use Cases)...');
  const band2Loc = page.locator('#use-cases');
  await band2Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await band2Loc.screenshot({
    path: 'docs/composio-reference/03-band2-use-cases.png'
  });

  bandsData.band2 = await page.evaluate(() => {
    const section = document.querySelector('#use-cases');
    if (!section) return null;

    // Outer card container
    const cardContainer = section.querySelector('[class*=\"border\"][class*=\"rounded\"], .border') || section.querySelector('.grid');
    const csCard = cardContainer ? window.getComputedStyle(cardContainer) : null;

    // Tabs / Checklist
    const buttons = Array.from(section.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      className: b.className,
      style: b.getAttribute('style'),
      cs: {
        background: window.getComputedStyle(b).backgroundColor,
        color: window.getComputedStyle(b).color,
        border: window.getComputedStyle(b).border,
        borderRadius: window.getComputedStyle(b).borderRadius,
        fontFamily: window.getComputedStyle(b).fontFamily,
        fontSize: window.getComputedStyle(b).fontSize
      }
    }));

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
      containerClasses: cardContainer?.className,
      cardStyles: csCard ? {
        borderRadius: csCard.borderRadius,
        border: csCard.border,
        backgroundColor: csCard.backgroundColor,
        padding: `${csCard.paddingTop} ${csCard.paddingRight} ${csCard.paddingBottom} ${csCard.paddingLeft}`,
        boxShadow: csCard.boxShadow
      } : null,
      buttons,
      innerHTMLSnippet: section.innerHTML.substring(0, 3000)
    };
  });

  // ==========================================
  // BAND 3: AGENTS / APPS (#agents)
  // ==========================================
  console.log('Inspecting Band 3 (Agents/Apps)...');
  const band3Loc = page.locator('#agents');
  await band3Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await band3Loc.screenshot({
    path: 'docs/composio-reference/04-band3-agents-grid.png'
  });

  bandsData.band3 = await page.evaluate(() => {
    const section = document.querySelector('#agents');
    if (!section) return null;

    const cards = Array.from(section.querySelectorAll('h3')).map(h => {
      const card = h.closest('div, a, li');
      const cs = card ? window.getComputedStyle(card) : null;
      const icon = card?.querySelector('svg, img');
      const iconCs = icon ? window.getComputedStyle(icon) : null;

      return {
        name: h.innerText,
        cardTag: card?.tagName,
        cardClasses: card?.className,
        borderRadius: cs?.borderRadius,
        border: cs?.border,
        backgroundColor: cs?.backgroundColor,
        padding: cs ? `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}` : null,
        boxShadow: cs?.boxShadow,
        iconTag: icon?.tagName,
        iconWidth: iconCs?.width,
        iconHeight: iconCs?.height,
        iconClasses: icon?.className
      };
    });

    const grid = section.querySelector('.grid, [class*=\"grid-cols\"]');
    const csGrid = grid ? window.getComputedStyle(grid) : null;

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
      gridClasses: grid?.className,
      gridCols: csGrid?.gridTemplateColumns,
      gridGap: csGrid?.gap,
      cardsCount: cards.length,
      sampleCards: cards
    };
  });

  // ==========================================
  // BAND 4: HARDER JOBS (#harder-jobs)
  // Sticky scroll mechanism & 520px card
  // ==========================================
  console.log('Inspecting Band 4 (Harder Jobs - Sticky Scroll)...');
  const band4Loc = page.locator('#harder-jobs');
  await band4Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Scroll into the middle of harder-jobs to show sticky state
  await page.evaluate(() => {
    const sec = document.querySelector('#harder-jobs');
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + 600);
  });
  await page.waitForTimeout(800);

  // Screenshot the sticky viewport
  await page.screenshot({
    path: 'docs/composio-reference/05-band4-sticky-timeline.png'
  });

  bandsData.band4 = await page.evaluate(() => {
    const section = document.querySelector('#harder-jobs');
    if (!section) return null;

    // Check sticky containers
    const stickyEls = Array.from(section.querySelectorAll('*')).filter(el => {
      const cs = window.getComputedStyle(el);
      return cs.position === 'sticky';
    }).map(el => ({
      tagName: el.tagName,
      className: el.className,
      style: el.getAttribute('style'),
      top: window.getComputedStyle(el).top,
      height: window.getComputedStyle(el).height,
      rect: el.getBoundingClientRect()
    }));

    // Find the 520px visual card (receipt/CSV audit ledger)
    const auditCard = Array.from(section.querySelectorAll('div')).find(d => {
      const cs = window.getComputedStyle(d);
      const r = d.getBoundingClientRect();
      return (r.width >= 450 && r.width <= 650) && (cs.borderRadius !== '0px' || cs.borderWidth !== '0px') && d.innerText.includes('CSV');
    }) || Array.from(section.querySelectorAll('[class*=\"border\"][class*=\"rounded\"]')).find(d => d.getBoundingClientRect().height > 200);

    const csAudit = auditCard ? window.getComputedStyle(auditCard) : null;

    // Timeline steps (3 items)
    const steps = Array.from(section.querySelectorAll('h3')).map(h => {
      const parent = h.closest('div, li');
      return {
        title: h.innerText,
        className: parent?.className,
        styles: parent ? {
          opacity: window.getComputedStyle(parent).opacity,
          transform: window.getComputedStyle(parent).transform,
          color: window.getComputedStyle(parent).color
        } : null,
        desc: parent?.querySelector('p')?.innerText
      };
    });

    return {
      sectionHeight: section.getBoundingClientRect().height,
      stickyEls,
      steps,
      auditCard: auditCard ? {
        className: auditCard.className,
        rect: auditCard.getBoundingClientRect(),
        styles: csAudit ? {
          width: csAudit.width,
          maxWidth: csAudit.maxWidth,
          height: csAudit.height,
          borderRadius: csAudit.borderRadius,
          border: csAudit.border,
          backgroundColor: csAudit.backgroundColor,
          boxShadow: csAudit.boxShadow,
          fontFamily: csAudit.fontFamily
        } : null,
        innerHTMLSnippet: auditCard.innerHTML.substring(0, 1500)
      } : null
    };
  });

  // ==========================================
  // BAND 5: TEAMS/ORG (#teams)
  // Permissions flow / diagram (nodes, connector lines, badge pills)
  // ==========================================
  console.log('Inspecting Band 5 (Teams Permissions Diagram)...');
  const band5Loc = page.locator('#teams');
  await band5Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await band5Loc.screenshot({
    path: 'docs/composio-reference/06-band5-permissions-diagram.png'
  });

  bandsData.band5 = await page.evaluate(() => {
    const section = document.querySelector('#teams');
    if (!section) return null;

    // Find cards in section
    const subCards = Array.from(section.querySelectorAll('section, [class*=\"rounded-3xl\"], [class*=\"rounded-2xl\"]')).map(c => ({
      heading: c.querySelector('h3')?.innerText,
      className: c.className,
      borderRadius: window.getComputedStyle(c).borderRadius,
      border: window.getComputedStyle(c).border,
      backgroundColor: window.getComputedStyle(c).backgroundColor,
      padding: `${window.getComputedStyle(c).paddingTop} ${window.getComputedStyle(c).paddingRight} ${window.getComputedStyle(c).paddingBottom} ${window.getComputedStyle(c).paddingLeft}`
    }));

    // Find badge pills
    const badges = Array.from(section.querySelectorAll('span, div')).filter(s => {
      const cs = window.getComputedStyle(s);
      return (cs.borderRadius === '9999px' || s.className.includes('rounded-full')) && s.innerText.trim().length > 1 && s.innerText.trim().length < 30;
    }).map(b => ({
      text: b.innerText.trim(),
      className: b.className,
      background: window.getComputedStyle(b).backgroundColor,
      color: window.getComputedStyle(b).color,
      border: window.getComputedStyle(b).border,
      borderRadius: window.getComputedStyle(b).borderRadius
    }));

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
      subCards,
      badges: badges.slice(0, 12),
      innerHTMLSnippet: section.innerHTML.substring(0, 2500)
    };
  });

  // ==========================================
  // BAND 6: TRUST / ENTERPRISE (#trust)
  // Security cards, compliance badges, deployment grid
  // ==========================================
  console.log('Inspecting Band 6 (Trust / Security)...');
  const band6Loc = page.locator('#trust');
  await band6Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await band6Loc.screenshot({
    path: 'docs/composio-reference/07-band6-trust-security.png'
  });

  bandsData.band6 = await page.evaluate(() => {
    const section = document.querySelector('#trust');
    if (!section) return null;

    const cards = Array.from(section.querySelectorAll('h3')).map(h => {
      const card = h.closest('div[class*=\"border\"], div[class*=\"rounded\"], div[class*=\"bg-\"]');
      const cs = card ? window.getComputedStyle(card) : null;
      return {
        title: h.innerText,
        className: card?.className,
        borderRadius: cs?.borderRadius,
        border: cs?.border,
        backgroundColor: cs?.backgroundColor,
        padding: cs ? `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}` : null,
        desc: card?.querySelector('p')?.innerText
      };
    });

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
      cards,
      innerHTMLSnippet: section.innerHTML.substring(0, 2000)
    };
  });

  // ==========================================
  // BAND 7: API / DEV PLATFORM (#build)
  // Terminal window styling, window buttons, code block typography, line height
  // ==========================================
  console.log('Inspecting Band 7 (Terminal Window)...');
  const band7Loc = page.locator('#build');
  await band7Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await band7Loc.screenshot({
    path: 'docs/composio-reference/08-band7-terminal-card.png'
  });

  bandsData.band7 = await page.evaluate(() => {
    const section = document.querySelector('#build');
    if (!section) return null;

    const terminal = section.querySelector('pre, code')?.closest('[class*=\"rounded\"], .border') ||
                     Array.from(section.querySelectorAll('div')).find(d => d.querySelector('code, pre'));

    const csTerm = terminal ? window.getComputedStyle(terminal) : null;
    const code = section.querySelector('code, pre');
    const csCode = code ? window.getComputedStyle(code) : null;

    // Window buttons
    const windowButtons = Array.from(terminal ? terminal.querySelectorAll('span[class*=\"rounded-full\"], div[class*=\"rounded-full\"], span[class*=\"size-\"]') : []).map(b => ({
      className: b.className,
      backgroundColor: window.getComputedStyle(b).backgroundColor,
      borderRadius: window.getComputedStyle(b).borderRadius,
      width: window.getComputedStyle(b).width,
      height: window.getComputedStyle(b).height
    }));

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
      terminalClasses: terminal?.className,
      terminalStyles: csTerm ? {
        borderRadius: csTerm.borderRadius,
        border: csTerm.border,
        backgroundColor: csTerm.backgroundColor,
        boxShadow: csTerm.boxShadow,
        padding: `${csTerm.paddingTop} ${csTerm.paddingRight} ${csTerm.paddingBottom} ${csTerm.paddingLeft}`
      } : null,
      codeStyles: csCode ? {
        fontFamily: csCode.fontFamily,
        fontSize: csCode.fontSize,
        lineHeight: csCode.lineHeight,
        color: csCode.color,
        letterSpacing: csCode.letterSpacing
      } : null,
      windowButtons,
      innerHTMLSnippet: terminal ? terminal.outerHTML.substring(0, 2000) : null
    };
  });

  // ==========================================
  // BAND 11: FAQ ACCORDION (#faq)
  // ==========================================
  console.log('Inspecting Band 11 (FAQ Accordion)...');
  const band11Loc = page.locator('#faq');
  await band11Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Click first FAQ item
  const firstFaqTrigger = page.locator('#faq button, #faq h3').first();
  await firstFaqTrigger.click({ force: true });
  await page.waitForTimeout(600);

  await band11Loc.screenshot({
    path: 'docs/composio-reference/09-band11-faq-accordion.png'
  });

  bandsData.band11 = await page.evaluate(() => {
    const section = document.querySelector('#faq');
    if (!section) return null;

    const items = Array.from(section.querySelectorAll('h3, [data-state]')).slice(0, 5).map(el => {
      const trigger = el.tagName === 'H3' ? el.querySelector('button') || el : el;
      const cs = window.getComputedStyle(trigger);
      const icon = trigger.querySelector('svg, span:last-child');
      const panel = trigger.closest('div')?.querySelector('[role=\"region\"], p, [class*=\"content\"]');
      const csPanel = panel ? window.getComputedStyle(panel) : null;

      return {
        text: trigger.innerText.trim(),
        triggerClasses: trigger.className,
        triggerStyles: {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          color: cs.color,
          padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
          borderBottom: `${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`
        },
        iconClasses: icon?.className,
        panelClasses: panel?.className,
        panelStyles: csPanel ? {
          fontFamily: csPanel.fontFamily,
          fontSize: csPanel.fontSize,
          lineHeight: csPanel.lineHeight,
          color: csPanel.color
        } : null
      };
    });

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
      items
    };
  });

  // ==========================================
  // BAND 12: BOTTOM CTA BANNER (#start)
  // ==========================================
  console.log('Inspecting Band 12 (Bottom CTA Banner)...');
  const band12Loc = page.locator('#start');
  await band12Loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await band12Loc.screenshot({
    path: 'docs/composio-reference/10-band12-bottom-cta.png'
  });

  bandsData.band12 = await page.evaluate(() => {
    const section = document.querySelector('#start');
    if (!section) return null;

    const card = section.querySelector('.rounded-3xl, [class*=\"rounded\"], .border') || section;
    const cs = window.getComputedStyle(card);
    const canvas = card.querySelector('canvas');
    const gl = canvas ? (canvas.getContext('webgl2') || canvas.getContext('webgl')) : null;

    const ctas = Array.from(card.querySelectorAll('a, button')).map(b => ({
      text: b.innerText.trim(),
      className: b.className,
      styles: {
        backgroundColor: window.getComputedStyle(b).backgroundColor,
        color: window.getComputedStyle(b).color,
        border: window.getComputedStyle(b).border,
        borderRadius: window.getComputedStyle(b).borderRadius,
        fontFamily: window.getComputedStyle(b).fontFamily,
        padding: `${window.getComputedStyle(b).paddingTop} ${window.getComputedStyle(b).paddingRight} ${window.getComputedStyle(b).paddingBottom} ${window.getComputedStyle(b).paddingLeft}`
      }
    }));

    return {
      sectionHeading: section.querySelector('h2')?.innerText,
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
      outerHTMLSnippet: card.outerHTML.substring(0, 1500)
    };
  });

  fs.writeFileSync('docs/composio-reference/bands-extraction.json', JSON.stringify(bandsData, null, 2));
  console.log('Finished extracting all bands successfully!');

  await browser.close();
}

extractBands().catch(console.error);
