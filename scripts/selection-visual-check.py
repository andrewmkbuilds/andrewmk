#!/usr/bin/env python3
"""Visual regression guard for text-selection styling.

Selects real text across the site (hero, project cards, contact, form inputs,
modal content) in Chromium, Firefox and WebKit — plus a mobile WebView profile —
captures element screenshots, and asserts the highlight is the theme's green
accent rather than the browser-default blue. Also enforces a readability
contrast ratio between the highlight background and the selected text.

Usage: python3 scripts/selection-visual-check.py [base_url]
Artifacts: artifacts/selection-visual/<engine>-<viewport>-<case>.png
"""
import asyncio
import sys
from collections import Counter
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
OUT = Path("artifacts/selection-visual")
OUT.mkdir(parents=True, exist_ok=True)

MIN_CONTRAST = 4.5

# (case name, route, selector, kind)
#   kind "text"  -> select the element's text contents
#   kind "field" -> type into the field, then select all of it
#   kind "modal" -> open the first project card, then select inside the dialog
CASES = [
    ("hero", "/", "h1", "text"),
    ("hero-body", "/", "main p", "text"),
    ("project-card", "/projects", "h3", "text"),
    ("project-modal", "/projects", "[role='dialog'] h2, [role='dialog'] h3", "modal"),
    ("contact-heading", "/contact", "h1", "text"),
    ("contact-input", "/contact", "input[type='text'], input[name='name']", "field"),
    ("contact-textarea", "/contact", "textarea", "field"),
    ("about-body", "/about", "main p", "text"),
    ("achievements", "/achievements", "main h2, main h3, main p", "text"),
]

VIEWPORTS = [
    ("desktop", {"viewport": {"width": 1280, "height": 900}}),
    (
        "mobile-webview",
        {
            "viewport": {"width": 390, "height": 844},
            "is_mobile": True,
            "has_touch": True,
            "device_scale_factor": 2,
        },
    ),
]

SELECT_CONTENTS = """(el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
}"""


def _lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = c
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def contrast(a, b):
    la, lb = _lum(a), _lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def analyse(path: Path):
    """Return (highlight_rgb, text_rgb, verdict) for a selection screenshot."""
    img = Image.open(path).convert("RGB")
    counts = Counter(img.getdata()).most_common()
    colored = [
        (n, c) for c, n in counts
        if max(c) > 30 and (max(c) - min(c)) > 10
    ]
    if not colored:
        return None, None, "no-selection-detected"
    _, bg = colored[0]
    if bg[2] > bg[1] and bg[2] > bg[0]:
        return bg, None, "BLUE-FALLBACK"
    if not (bg[1] >= bg[0] and bg[1] >= bg[2]):
        return bg, None, "off-theme"
    # Text pixels: the highest-contrast frequent color against the highlight.
    text = max((c for c, _ in counts[:40]), key=lambda c: contrast(c, bg))
    if contrast(text, bg) < MIN_CONTRAST:
        return bg, text, f"low-contrast-{contrast(text, bg):.2f}"
    return bg, text, "green-ok"


async def run_case(page, engine, vp_name, name, route, selector, kind, failures):
    await page.goto(BASE + route, wait_until="domcontentloaded")
    await page.wait_for_timeout(1800)

    if kind == "modal":
        card = page.locator("button:has(h3), [role='button']:has(h3), article button").first
        try:
            await card.click(timeout=5000)
            await page.wait_for_timeout(800)
        except Exception:
            print(f"  {engine}/{vp_name}/{name}: skipped (no openable card)")
            return

    # Pick the first visible candidate that actually carries selectable text.
    all_el = page.locator(selector)
    el = None
    for i in range(min(await all_el.count(), 12)):
        cand = all_el.nth(i)
        try:
            box = await cand.bounding_box()
            txt = (await cand.inner_text()).strip()
        except Exception:
            continue
        if box and box["width"] > 40 and box["height"] > 8 and len(txt) > 8:
            el = cand
            break
    if el is None:
        print(f"  {engine}/{vp_name}/{name}: skipped (selector not present)")
        return

    try:
        await el.scroll_into_view_if_needed(timeout=5000)
    except Exception:
        pass
    await page.wait_for_timeout(400)

    if kind == "field":
        await el.click()
        await el.fill("Selection readability sample text")
        await page.keyboard.press("ControlOrMeta+a")
    else:
        await page.evaluate(SELECT_CONTENTS, await el.element_handle())
    await page.wait_for_timeout(250)

    shot = OUT / f"{engine}-{vp_name}-{name}.png"
    await el.screenshot(path=str(shot))
    bg, fg, verdict = analyse(shot)
    print(f"  {engine}/{vp_name}/{name}: {verdict} bg={bg} fg={fg}")
    if verdict != "green-ok":
        failures.append(f"{engine}/{vp_name}/{name}: {verdict} bg={bg} ({shot})")


async def main():
    failures = []
    async with async_playwright() as p:
        engines = [("chromium", p.chromium), ("firefox", p.firefox), ("webkit", p.webkit)]
        for engine, launcher in engines:
            browser = await launcher.launch(headless=True)
            for vp_name, ctx_args in VIEWPORTS:
                args = dict(ctx_args)
                if engine == "firefox":
                    args.pop("is_mobile", None)  # unsupported in Firefox
                ctx = await browser.new_context(**args)
                page = await ctx.new_page()
                for name, route, selector, kind in CASES:
                    try:
                        await run_case(page, engine, vp_name, name, route,
                                       selector, kind, failures)
                    except Exception as exc:  # keep sweeping the rest
                        failures.append(f"{engine}/{vp_name}/{name}: error {exc}")
                await ctx.close()
            await browser.close()

    if failures:
        print("\nSelection visual regression FAILED:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("\nSelection visual regression passed — highlight is theme green everywhere.")


asyncio.run(main())
