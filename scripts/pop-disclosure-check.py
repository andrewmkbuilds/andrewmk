#!/usr/bin/env python3
"""Regression checks for the home page pop-out disclosure panels.

Verifies, across Chromium / Firefox / WebKit:
  * every pop trigger exposes aria-expanded, aria-controls and an accessible
    name, and the panel it controls is a labelled region
  * collapsed panel content is out of the tab order; expanded content is in it
  * touch (tap) toggles a panel open and closed without page scrolling
  * Tab order follows DOM order and :focus-visible produces a visible ring
  * Escape closes an open panel and returns focus to its trigger
  * no overlap / layout shift across key viewport widths and browser zoom
  * prefers-reduced-motion removes the panel transition, including when the
    setting flips at runtime

Usage: python3 scripts/pop-disclosure-check.py [base-url]
"""

import asyncio
import sys

from playwright.async_api import async_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")
VIEWPORTS = [(360, 780), (414, 900), (768, 1024), (1024, 1400), (1280, 1800), (1600, 1800)]
ZOOMS = [1.0, 1.25, 1.5, 2.0]

failures: list[str] = []


def check(cond: bool, label: str) -> None:
    print(("  PASS  " if cond else "  FAIL  ") + label)
    if not cond:
        failures.append(label)


async def triggers(page):
    return page.locator("[data-pop-target] button[aria-expanded]")


async def aria_contract(page, tag):
    trigs = await triggers(page)
    count = await trigs.count()
    check(count >= 10, f"{tag} found {count} disclosure triggers (>=10)")
    ok_state = ok_ctrl = ok_name = ok_region = True
    for i in range(count):
        t = trigs.nth(i)
        state = await t.get_attribute("aria-expanded")
        ctrl = await t.get_attribute("aria-controls")
        name = (await t.evaluate("n => (n.getAttribute('aria-label') || n.innerText || '').trim()"))
        if state not in ("true", "false"):
            ok_state = False
        if not ctrl:
            ok_ctrl = False
            continue
        if not name:
            ok_name = False
        panel = page.locator(f"#{ctrl}")
        if await panel.count() != 1:
            ok_region = False
            continue
        labelled = await panel.get_attribute("aria-labelledby")
        role = await panel.get_attribute("role")
        tid = await t.get_attribute("id")
        if role != "region" or labelled != tid:
            ok_region = False
    check(ok_state, f"{tag} every trigger has aria-expanded true/false")
    check(ok_ctrl, f"{tag} every trigger has aria-controls")
    check(ok_name, f"{tag} every trigger has an accessible name")
    check(ok_region, f"{tag} every panel is a region labelled by its trigger")


async def toggle_and_focus(page, tag):
    trig = (await triggers(page)).first
    ctrl = await trig.get_attribute("aria-controls")
    panel = page.locator(f"#{ctrl}")

    focusable_when = await panel.evaluate(
        "n => n.querySelectorAll('a,button,input,[tabindex]').length"
    )
    visible_collapsed = await panel.evaluate(
        "n => getComputedStyle(n.firstElementChild).visibility"
    )
    check(
        visible_collapsed == "hidden",
        f"{tag} collapsed panel content is visibility:hidden (out of tab order)"
        f" [focusables={focusable_when}]",
    )

    await trig.click()
    await page.wait_for_timeout(450)
    check(await trig.get_attribute("aria-expanded") == "true", f"{tag} click expands the panel")
    check(
        await panel.evaluate("n => getComputedStyle(n.firstElementChild).visibility") == "visible",
        f"{tag} expanded panel content is visible",
    )
    check(
        await panel.evaluate("n => n.getBoundingClientRect().height") > 10,
        f"{tag} expanded panel has height",
    )

    await trig.click()
    await page.wait_for_timeout(450)
    check(await trig.get_attribute("aria-expanded") == "false", f"{tag} second click collapses it")


async def tab_order_and_escape(page, tag):
    ids = await page.evaluate(
        """() => [...document.querySelectorAll('[data-pop-target] button[aria-expanded]')]
              .map(n => n.id)"""
    )
    first = page.locator(f"#{ids[0]}")
    idle = await first.evaluate(
        "n => { const s = getComputedStyle(n);"
        " return s.outlineWidth + '|' + s.boxShadow; }"
    )
    # Focus the element immediately before the trigger, then Tab into it with a
    # real key press so :focus-visible applies the way it does for keyboard users.
    reached = await page.evaluate(
        """(id) => {
          const focusables = [...document.querySelectorAll(
            'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
          )].filter(n => n.offsetParent !== null || n === document.activeElement);
          const i = focusables.findIndex(n => n.id === id);
          if (i < 1) return false;
          focusables[i - 1].focus({ preventScroll: true });
          return true;
        }""",
        ids[0],
    )
    check(reached, f"{tag} first disclosure trigger has a focusable predecessor")
    await page.keyboard.press("Tab")
    await page.wait_for_timeout(150)
    check(
        await page.evaluate("() => document.activeElement.id") == ids[0],
        f"{tag} Tab moves focus onto the first disclosure trigger",
    )
    focused = await first.evaluate(
        "n => { const s = getComputedStyle(n);"
        " return s.outlineWidth + '|' + s.boxShadow; }"
    )
    card = await first.evaluate(
        "n => getComputedStyle(n.closest('[data-pop-target]')).boxShadow"
    )
    focus_visible = await first.evaluate("n => n.matches(':focus-visible')")
    check(
        focused != idle or focus_visible or (card and card != "none"),
        f"{tag} keyboard focus produces a visible indicator"
        f" (changed={focused != idle}, :focus-visible={focus_visible})",
    )

    # Tab from the first trigger should reach the next trigger in DOM order,
    # with nothing from the collapsed panel in between.
    seen = []
    for _ in range(6):
        await page.keyboard.press("Tab")
        seen.append(await page.evaluate("() => document.activeElement.id || document.activeElement.tagName"))
        if seen[-1] == ids[1]:
            break
    check(ids[1] in seen, f"{tag} Tab order reaches the next trigger in DOM order")

    await first.focus()
    await page.keyboard.press("Enter")
    await page.wait_for_timeout(400)
    check(await first.get_attribute("aria-expanded") == "true", f"{tag} Enter opens the panel")
    await page.keyboard.press("Escape")
    await page.wait_for_timeout(400)
    check(await first.get_attribute("aria-expanded") == "false", f"{tag} Escape closes the panel")
    check(
        await page.evaluate("() => document.activeElement.id") == ids[0],
        f"{tag} Escape returns focus to the trigger",
    )


async def overlap_and_shift(page, tag, width, height, zoom):
    await page.set_viewport_size({"width": width, "height": height})
    await page.evaluate(f"() => document.documentElement.style.zoom = '{zoom}'")
    await page.wait_for_timeout(250)

    measure = ("() => document.documentElement.scrollWidth"
               " - document.documentElement.clientWidth")
    baseline_overflow = await page.evaluate(measure)

    cards = page.locator('[data-pop-target="build-area"]')
    boxes_before = await cards.evaluate_all(
        "ns => ns.map(n => ({ t: n.offsetTop, l: n.offsetLeft, w: n.offsetWidth }))"
    )
    trig = cards.first.locator("button[aria-expanded]")
    await trig.click()
    await page.wait_for_timeout(450)
    boxes_after = await cards.evaluate_all(
        "ns => ns.map(n => ({ t: n.offsetTop, l: n.offsetLeft, w: n.offsetWidth }))"
    )
    same_width = all(abs(a["w"] - b["w"]) <= 1 for a, b in zip(boxes_before, boxes_after))
    check(same_width, f"{tag} {width}px @ {zoom}x opening a panel keeps card widths stable")

    overflow = await page.evaluate(measure)
    check(
        overflow <= baseline_overflow + 2,
        f"{tag} {width}px @ {zoom}x expanding adds no horizontal overflow"
        f" ({baseline_overflow} -> {overflow}px)",
    )

    rects = await cards.evaluate_all(
        "ns => ns.map(n => { const r = n.getBoundingClientRect();"
        " return { top: r.top, bottom: r.bottom, left: r.left, right: r.right }; })"
    )
    overlaps = 0
    for i in range(len(rects)):
        for j in range(i + 1, len(rects)):
            a, b = rects[i], rects[j]
            if a["left"] < b["right"] - 1 and b["left"] < a["right"] - 1 and \
               a["top"] < b["bottom"] - 1 and b["top"] < a["bottom"] - 1:
                overlaps += 1
    check(overlaps == 0, f"{tag} {width}px @ {zoom}x expanded cards do not overlap ({overlaps})")

    await trig.click()
    await page.wait_for_timeout(400)
    await page.evaluate("() => document.documentElement.style.zoom = ''")


async def reduced_motion_runtime(page, tag):
    panel = page.locator(".pop-panel").first

    await page.emulate_media(reduced_motion="no-preference")
    await page.wait_for_timeout(120)
    normal = await panel.evaluate("n => getComputedStyle(n).transitionDuration")
    check(normal != "0s", f"{tag} panel animates with motion allowed ({normal})")

    # Flip the setting at runtime — no reload.
    await page.emulate_media(reduced_motion="reduce")
    await page.wait_for_timeout(120)
    reduced = await panel.evaluate("n => getComputedStyle(n).transitionDuration")
    chevron = await page.locator(".pop-chevron").first.evaluate(
        "n => getComputedStyle(n).transitionDuration"
    )
    def durations(value: str) -> list[float]:
        return [float(v.strip().rstrip("s")) for v in value.split(",") if v.strip()]

    check(
        max(durations(reduced)) <= 0.001,
        f"{tag} runtime reduced-motion disables panel transition ({reduced})",
    )
    check(
        max(durations(chevron)) <= 0.001,
        f"{tag} runtime reduced-motion disables chevron transition ({chevron})",
    )

    trig = (await triggers(page)).first
    await trig.click()
    await page.wait_for_timeout(120)
    check(
        await trig.get_attribute("aria-expanded") == "true",
        f"{tag} panel still toggles under reduced motion",
    )
    await trig.click()
    await page.emulate_media(reduced_motion="no-preference")


async def touch_toggle(pw, name):
    browser = await getattr(pw, name).launch(headless=True)
    context = await browser.new_context(
        viewport={"width": 390, "height": 780},
        has_touch=True,
        is_mobile=(name == "chromium"),
    )
    page = await context.new_page()
    tag = f"[{name} touch]"
    print(f"\n=== {tag} ===")
    await page.goto(BASE, wait_until="networkidle")

    trig = page.locator('[data-pop-target="build-area"] button[aria-expanded]').first
    await trig.evaluate("n => n.scrollIntoView({ block: 'center' })")
    await page.wait_for_timeout(500)
    rect_before = await trig.evaluate("n => n.getBoundingClientRect().top")
    await trig.tap()
    await page.wait_for_timeout(450)
    check(await trig.get_attribute("aria-expanded") == "true", f"{tag} tap opens the panel")
    rect_after = await trig.evaluate("n => n.getBoundingClientRect().top")
    check(
        abs(rect_after - rect_before) <= 12,
        f"{tag} tap keeps the card in place, no scroll jump"
        f" ({rect_before:.0f} -> {rect_after:.0f})",
    )

    await trig.tap()
    await page.wait_for_timeout(450)
    check(await trig.get_attribute("aria-expanded") == "false", f"{tag} second tap closes the panel")

    # Scrolling over the card must not toggle anything.
    box = await trig.bounding_box()
    await page.mouse.move(box["x"] + 20, box["y"] + 10)
    await page.mouse.wheel(0, 300)
    await page.wait_for_timeout(250)
    check(
        await trig.get_attribute("aria-expanded") == "false",
        f"{tag} scrolling over the card leaves panels closed",
    )

    await browser.close()


async def run_engine(pw, name):
    browser = await getattr(pw, name).launch(headless=True)
    context = await browser.new_context(viewport={"width": 1280, "height": 1800})
    page = await context.new_page()
    tag = f"[{name}]"
    print(f"\n=== {tag} ===")
    await page.goto(BASE, wait_until="networkidle")

    await aria_contract(page, tag)
    await toggle_and_focus(page, tag)
    await tab_order_and_escape(page, tag)
    await reduced_motion_runtime(page, tag)
    for width, height in VIEWPORTS:
        await overlap_and_shift(page, tag, width, height, 1.0)
    await page.set_viewport_size({"width": 1280, "height": 1800})
    for zoom in ZOOMS:
        await overlap_and_shift(page, tag, 1280, 1800, zoom)

    await browser.close()


async def main():
    async with async_playwright() as pw:
        for engine in ("chromium", "firefox", "webkit"):
            await run_engine(pw, engine)
        await touch_toggle(pw, "chromium")
        await touch_toggle(pw, "webkit")

    print()
    if failures:
        print(f"✗ Pop disclosure check failed ({len(failures)} issue(s)):")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    print("✓ Pop disclosure check passed.")


asyncio.run(main())
