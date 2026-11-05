import { chromium } from '@playwright/test';
import fs from 'fs';

async function extractNav() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to composio.dev for Nav extraction...');
  await page.goto('https://composio.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Inspect Header / Nav container
  const navDetails = await page.evaluate(() => {
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav') || document.querySelector('nav');
    
    function getStyles(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        width: cs.width,
        height: cs.height,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        backgroundColor: cs.backgroundColor,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
        letterSpacing: cs.letterSpacing,
        position: cs.position,
        top: cs.top,
        zIndex: cs.zIndex
      };
    }

    return {
      headerOuterHTML: header ? header.outerHTML.split('>')[0] + '>' : null,
      headerStyles: getStyles(header),
      headerRect: header?.getBoundingClientRect(),
      navOuterHTML: nav ? nav.outerHTML.split('>')[0] + '>' : null,
      navStyles: getStyles(nav),
      navRect: nav?.getBoundingClientRect(),
      menuButtons: Array.from(document.querySelectorAll('header button, nav button')).map(b => ({
        text: b.innerText.trim(),
        className: b.className,
        styles: getStyles(b),
        rect: b.getBoundingClientRect()
      }))
    };
  });

  // Take screenshot of default navbar
  await page.screenshot({
    path: 'docs/composio-reference/01-navbar-default.png',
    clip: { x: 0, y: 0, width: 1440, height: 160 }
  });
  console.log('Saved 01-navbar-default.png');

  // Let's test hovering over PRODUCTS, SOLUTIONS, RESOURCES
  const menus = ['PRODUCTS', 'SOLUTIONS', 'RESOURCES'];
  const menuExtractions = {};

  for (const menuName of menus) {
    const btn = page.locator(`header button:has-text("${menuName}"), nav button:has-text("${menuName}")`).first();
    if (await btn.count() > 0) {
      console.log(`Hovering over ${menuName}...`);
      await btn.hover();
      await page.waitForTimeout(600); // wait for framer motion animation

      // Capture screenshot
      await page.screenshot({
        path: `docs/composio-reference/01-megamenu-${menuName.toLowerCase()}.png`,
        clip: { x: 0, y: 0, width: 1440, height: 650 }
      });

      // Extract mega menu popover DOM and styles
      const dropdownInfo = await page.evaluate((name) => {
        // Look for popover / dropdown element that became visible or has high z-index
        const allElements = Array.from(document.querySelectorAll('header *'));
        // Find visible containers with links
        const dropdown = document.querySelector('[role="dialog"], [data-radix-menu-content], [data-state="open"], .absolute') ||
                         Array.from(document.querySelectorAll('header div, nav div')).find(d => {
                           const rect = d.getBoundingClientRect();
                           return rect.height > 100 && rect.width > 300 && rect.top < 200;
                         });

        // Let's find all menu items currently visible under header
        const links = Array.from(document.querySelectorAll('header a')).filter(a => {
          const r = a.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.left > 0 && r.top > 80 && r.top < 600;
        }).map(a => {
          const title = a.querySelector('.font-mono, h4, h5, p, span')?.innerText || a.innerText;
          const desc = a.querySelector('.text-muted-foreground, p, span:last-child')?.innerText || '';
          const cs = window.getComputedStyle(a);
          return {
            href: a.getAttribute('href'),
            text: a.innerText.replace(/\n+/g, ' | '),
            className: a.className,
            padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
            backgroundColor: cs.backgroundColor,
            borderRadius: cs.borderRadius,
            border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
            rect: a.getBoundingClientRect()
          };
        });

        // Also check if there's an outer wrapper morphing
        let container = null;
        if (links.length > 0) {
          let p = document.querySelector(`header a[href="${links[0].href}"]`)?.parentElement;
          while (p && p.tagName !== 'HEADER' && p.tagName !== 'BODY') {
            const cs = window.getComputedStyle(p);
            if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderWidth !== '0px' || cs.boxShadow !== 'none' || cs.borderRadius !== '0px') {
              container = {
                tagName: p.tagName,
                className: p.className,
                styleAttr: p.getAttribute('style'),
                borderRadius: cs.borderRadius,
                border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
                backgroundColor: cs.backgroundColor,
                backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
                boxShadow: cs.boxShadow,
                width: cs.width,
                height: cs.height,
                transform: cs.transform,
                transition: cs.transition
              };
              break;
            }
            p = p.parentElement;
          }
        }

        return {
          menuName: name,
          linksCount: links.length,
          links,
          container
        };
      }, menuName);

      menuExtractions[menuName] = dropdownInfo;
    }
  }

  // Now test mobile viewport (390px width)
  console.log('Testing mobile menu...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);

  // Take screenshot of mobile navbar closed
  await page.screenshot({
    path: 'docs/composio-reference/01-navbar-mobile-closed.png',
    clip: { x: 0, y: 0, width: 390, height: 120 }
  });

  // Find mobile hamburger button
  const mobileMenuButton = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header button, nav button')).filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    return buttons.map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      className: b.className,
      innerHTML: b.innerHTML,
      rect: b.getBoundingClientRect()
    }));
  });

  // Click hamburger
  const hamburger = page.locator('header button[aria-label*="menu" i], header button:has(svg)').last();
  if (await hamburger.count() > 0) {
    await hamburger.click();
    await page.waitForTimeout(600);

    await page.screenshot({
      path: 'docs/composio-reference/01-navbar-mobile-open.png'
    });

    const mobileDrawerData = await page.evaluate(() => {
      // Find open drawer
      const dialog = document.querySelector('[role="dialog"], [data-state="open"]') ||
                     Array.from(document.querySelectorAll('div')).find(d => {
                       const cs = window.getComputedStyle(d);
                       return (cs.position === 'fixed' || cs.position === 'absolute') && cs.zIndex > 10 && d.getBoundingClientRect().height > 300;
                     });

      const drawerLinks = Array.from(document.querySelectorAll('header a, nav a, [role="dialog"] a, [data-state="open"] a')).map(a => ({
        text: a.innerText.trim().replace(/\n+/g, ' '),
        href: a.getAttribute('href'),
        className: a.className
      }));

      const accordions = Array.from(document.querySelectorAll('button[data-state], [data-radix-collection-item], [aria-expanded]')).map(b => ({
        text: b.innerText.trim(),
        ariaExpanded: b.getAttribute('aria-expanded'),
        className: b.className
      }));

      return {
        drawerFound: !!dialog,
        drawerClasses: dialog?.className,
        drawerStyles: dialog ? {
          backgroundColor: window.getComputedStyle(dialog).backgroundColor,
          backdropFilter: window.getComputedStyle(dialog).backdropFilter,
          border: window.getComputedStyle(dialog).border,
          boxShadow: window.getComputedStyle(dialog).boxShadow
        } : null,
        drawerLinks,
        accordions
      };
    });

    fs.writeFileSync('docs/composio-reference/nav-mobile-extraction.json', JSON.stringify({ mobileMenuButton, mobileDrawerData }, null, 2));
  }

  fs.writeFileSync('docs/composio-reference/nav-desktop-extraction.json', JSON.stringify({ navDetails, menuExtractions }, null, 2));
  console.log('Saved nav extractions.');

  await browser.close();
}

extractNav().catch(console.error);
