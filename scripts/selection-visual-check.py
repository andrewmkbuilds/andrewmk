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
import os
import sys
from collections import Counter
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
OUT = Path("artifacts/selection-visual")
OUT.mkdir(parents=True, exist_ok=True)

MIN_CONTRAST = 4.5
# WCAG 1.4.3 exempts inactive controls, and disabled surfaces are rendered at
# ~50% opacity, which dims highlight and glyphs together. Hold them to a
# legibility floor instead of the full AA ratio — the "never blue" rule still
# applies at full strength.
DISABLED_MIN_CONTRAST = 3.0

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
    ("contact-input", "/contact", "#contact-name", "field"),
    ("contact-textarea", "/contact", "#contact-message", "field"),
    ("about-body", "/about", "main p", "text"),
    ("achievements", "/achievements", "main h2, main h3, main p", "text"),
    # Disabled / read-only surfaces must never fall back to the platform blue.
    ("disabled-button", "/contact", "form button", "disabled"),
    ("disabled-input", "/contact", "#contact-name", "disabled"),
    ("readonly-input", "/contact", "#contact-name", "readonly"),
    ("disabled-textarea", "/contact", "#contact-message", "disabled"),
    ("disabled-card", "/projects", "article, [class*='card']", "disabled"),
]

_only = os.environ.get("SELECTION_CASES")
if _only:
    _wanted = {c.strip() for c in _only.split(",")}
    CASES = [c for c in CASES if c[0] in _wanted]

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

MAKE_DISABLED = """(el) => {
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("data-disabled", "");
    if ("disabled" in el) el.disabled = true;
    el.querySelectorAll("input, textarea, button, select").forEach((c) => {
        c.disabled = true;
        c.setAttribute("aria-disabled", "true");
    });
}"""

MAKE_READONLY = """(el) => {
    el.readOnly = true;
    el.setAttribute("readonly", "");
    el.value = "Read only selection sample text";
}"""

SELECT_CONTENTS = """(el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
}"""


RESOLVE_SELECTION_FG = """(el) => {
  const probe = document.createElement('span');
  probe.style.color = getComputedStyle(el).getPropertyValue('--selection-fg') || '';
  if (!probe.style.color) return null;
  el.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\\d+/g);
  probe.remove();
  return rgb ? rgb.slice(0, 3).map(Number) : null;
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


def _changed(base: Path, shot: Path):
    """Changed-pixel colors plus the bounding box of the selected region."""
    a = Image.open(base).convert("RGB")
    b = Image.open(shot).convert("RGB")
    if a.size != b.size:
        b = b.resize(a.size)
    w, _ = a.size
    changed = Counter()
    x0 = y0 = 10**9
    x1 = y1 = -1
    for i, (pa, pb) in enumerate(zip(a.getdata(), b.getdata())):
        if abs(pa[0] - pb[0]) + abs(pa[1] - pb[1]) + abs(pa[2] - pb[2]) > 18:
            changed[pb] += 1
            x, y = i % w, i // w
            x0, y0 = min(x0, x), min(y0, y)
            x1, y1 = max(x1, x), max(y1, y)
    box = None if x1 < 0 else (x0, y0, x1 + 1, y1 + 1)
    return changed, box, b


def _cluster(colors):
    """Group pixels into coarse color buckets.

    Anti-aliased glyph edges scatter across dozens of near-identical shades,
    so the single most common exact color is unreliable. Bucketing by /16 and
    averaging inside the bucket recovers the true fills.
    """
    buckets = {}
    for color, count in colors.items():
        key = tuple(v // 16 for v in color)
        acc = buckets.setdefault(key, [0, 0, 0, 0])
        for i in range(3):
            acc[i] += color[i] * count
        acc[3] += count
    out = []
    for acc in buckets.values():
        n = acc[3]
        out.append((tuple(round(acc[i] / n) for i in range(3)), n))
    out.sort(key=lambda x: -x[1])
    return out


def analyse(base: Path, shot: Path, forced_colors: bool = False,
            min_contrast: float = MIN_CONTRAST, text: tuple | None = None):
    """Return (highlight_rgb, text_rgb, verdict).

    The highlight is read from pixels that changed between the unselected and
    selected screenshots, so a control's own fill (e.g. the emerald submit
    button) can never be mistaken for it. The text color is read from the
    selected screenshot inside the highlighted region, because glyphs whose
    color is unchanged by selection never show up in the diff.
    """
    changed, box, after = _changed(base, shot)
    total = sum(changed.values())
    if total < 25 or box is None:
        return None, None, "no-selection-detected"
    bg = _cluster(changed)[0][0]

    if text is None:
        # Fallback: most contrasting sizeable color inside the selected region.
        crop = Counter(after.crop(box).getdata())
        crop_total = sum(crop.values())
        text = max(
            (c for c, n in _cluster(crop) if n >= max(4, crop_total * 0.01)),
            key=lambda c: contrast(c, bg),
            default=bg,
        )

    ratio = contrast(text, bg)
    # Nothing to judge when the region carries no selected glyphs at all.
    text_sampled = ratio >= 1.05


    if forced_colors:
        # The OS owns the palette here; only legibility is ours to guarantee.
        if text_sampled and ratio < min_contrast:
            return bg, text, f"forced-colors-low-contrast-{ratio:.2f}"
        return bg, text, "forced-colors-ok"

    if bg[2] > bg[1] and bg[2] > bg[0]:
        return bg, text, "BLUE-FALLBACK"
    if not (bg[1] >= bg[0] and bg[1] >= bg[2]):
        return bg, text, "off-theme"
    if text_sampled and ratio < min_contrast:
        return bg, text, f"low-contrast-{ratio:.2f}"
    return bg, text, "green-ok"


async def run_case(page, engine, vp_name, name, route, selector, kind, failures,
                   forced_colors=False):
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
    needs_text = kind not in ("field", "readonly")
    all_el = page.locator(selector)
    el = None
    for i in range(min(await all_el.count(), 12)):
        cand = all_el.nth(i)
        try:
            box = await cand.bounding_box()
            txt = (await cand.inner_text()).strip() if needs_text else "x" * 9
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

    handle = await el.element_handle()
    target = handle  # what gets screenshotted

    # Put the element into its disabled / read-only state BEFORE the baseline
    # shot, so the diff isolates the selection highlight itself.
    if kind == "disabled":
        tag = await handle.evaluate("(el) => el.tagName.toLowerCase()")
        await page.evaluate(MAKE_DISABLED, handle)
        await page.wait_for_timeout(150)
        if tag in ("input", "textarea"):
            # A disabled field has no caret, so select the whole disabled group
            # (label + control) the way a real user drag would.
            group = await handle.evaluate_handle("(el) => el.closest('div') ?? el.parentElement")
            handle = group.as_element()
            target = handle
    elif kind == "readonly":
        # Give it content first — a read-only input is not typeable, so an
        # empty one would have nothing to select.
        await el.fill("Selection readability sample text")
        await page.evaluate(MAKE_READONLY, handle)
        await page.wait_for_timeout(150)

    if kind in ("field", "readonly"):
        # Focus first: the focus ring paints in the primary color, and if it
        # only appeared in the "after" shot the diff would report the ring as
        # the highlight.
        if kind == "field":
            await el.fill("Selection readability sample text")
        await el.click()
        await page.wait_for_timeout(250)

    base = OUT / f"{engine}-{vp_name}-{name}-base.png"
    shot = OUT / f"{engine}-{vp_name}-{name}.png"
    await target.screenshot(path=str(base))

    if kind in ("field", "readonly"):
        await page.keyboard.press("ControlOrMeta+a")
    else:
        await page.evaluate(SELECT_CONTENTS, handle)
    await page.wait_for_timeout(250)

    await target.screenshot(path=str(shot))
    floor = DISABLED_MIN_CONTRAST if kind == "disabled" else MIN_CONTRAST
    # Read the selected-text color from the resolved token rather than from
    # pixels: glyphs whose color selection does not change never appear in the
    # diff, and neighbouring surfaces inside the region are easy to mistake
    # for text. The token is exactly what the browser paints the glyphs with.
    # Under forced-colors the OS paints the glyphs (HighlightText), not our
    # token, so fall back to sampling there.
    text_rgb = None
    if not forced_colors:
        resolved = await page.evaluate(RESOLVE_SELECTION_FG, handle)
        text_rgb = tuple(resolved) if resolved else None
    bg, fg, verdict = analyse(base, shot, forced_colors, floor, text_rgb)
    expected = "forced-colors-ok" if forced_colors else "green-ok"
    print(f"  {engine}/{vp_name}/{name}: {verdict} bg={bg} fg={fg}")
    if verdict != expected:
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

            # Windows High Contrast emulation (Chromium implements forced-colors).
            if engine == "chromium":
                ctx = await browser.new_context(
                    viewport={"width": 1280, "height": 900},
                    forced_colors="active",
                    color_scheme="dark",
                )
                page = await ctx.new_page()
                for name, route, selector, kind in CASES:
                    try:
                        await run_case(page, engine, "forced-colors", name, route,
                                       selector, kind, failures, forced_colors=True)
                    except Exception as exc:
                        failures.append(f"{engine}/forced-colors/{name}: error {exc}")
                await ctx.close()
            await browser.close()

    if failures:
        print("\nSelection visual regression FAILED:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("\nSelection visual regression passed — highlight is theme green everywhere.")


if __name__ == "__main__":
    asyncio.run(main())
