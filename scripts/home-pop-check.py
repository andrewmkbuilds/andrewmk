#!/usr/bin/env python3
"""Regression checks for the home page card "pop" interaction.

Verifies, across Chromium/Firefox/WebKit:
  * featured project cards, What I Build cards, How I Think cards and the
    Get in Touch CTA are present and interactive
  * hover and :focus-visible each produce a visible pop (shadow/transform)
  * only the hovered/focused card pops (independent behaviour)
  * hover/focus cause no layout shift (bounding boxes unchanged)
  * keyboard navigation reaches the cards and the CTA link still navigates
  * prefers-reduced-motion disables transforms while keeping focus visible
  * removed commercial sections have NOT come back
"""

import asyncio
import re
import sys

from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
FORBIDDEN = [
    "how we work",
    "start a website project",
    "business websites",
    "get a quote",
    "request a quote",
    "pricing",
    "starting at",
    "hire me for",
]

failures: list[str] = []


def check(cond: bool, label: str) -> None:
    print(("  PASS  " if cond else "  FAIL  ") + label)
    if not cond:
        failures.append(label)


def box_equal(a, b, tol=0.75) -> bool:
    return all(abs(a[k] - b[k]) <= tol for k in ("x", "y", "width", "height"))


async def shadow_and_transform(el):
    return await el.evaluate(
        "n => { const s = getComputedStyle(n);"
        " return { shadow: s.boxShadow, transform: s.transform }; }"
    )


async def run_engine(pw, name, reduced: bool):
    browser = await getattr(pw, name).launch(headless=True)
    context = await browser.new_context(
        viewport={"width": 1280, "height": 1800},
        reduced_motion="reduce" if reduced else "no-preference",
    )
    page = await context.new_page()
    tag = f"[{name}{' reduced-motion' if reduced else ''}]"
    print(f"\n=== {tag} ===")

    await page.goto(BASE, wait_until="networkidle")

    # --- presence -------------------------------------------------------
    featured = page.locator("#work .pop-card")
    build = page.locator('[data-pop-target="build-area"]')
    principles = page.locator('[data-pop-target="principle"]')
    cta_card = page.locator('[data-pop-target="get-in-touch"]')
    cta_link = cta_card.get_by_role("link", name=re.compile("get in touch", re.I))

    check(await featured.count() > 0, f"{tag} featured project cards present")
    check(await build.count() > 0, f"{tag} What I Build cards present")
    check(await principles.count() > 0, f"{tag} How I Think cards present")
    check(await cta_link.count() == 1, f"{tag} Get in Touch CTA present")

    # --- no commercial content ------------------------------------------
    body = (await page.inner_text("body")).lower()
    for phrase in FORBIDDEN:
        check(phrase not in body, f"{tag} commercial content absent: '{phrase}'")

    # --- hover pop, independence, layout stability ----------------------
    first, second = build.nth(0), build.nth(1)
    base_first = await first.bounding_box()
    base_second = await second.bounding_box()
    rest_first = await shadow_and_transform(first)
    rest_second = await shadow_and_transform(second)

    await first.hover()
    await page.wait_for_timeout(500)
    hov_first = await shadow_and_transform(first)
    hov_second = await shadow_and_transform(second)

    check(hov_first["shadow"] != rest_first["shadow"], f"{tag} hover changes card shadow")
    check(
        hov_second["shadow"] == rest_second["shadow"]
        and hov_second["transform"] == rest_second["transform"],
        f"{tag} sibling card unaffected by hover (independent pop)",
    )
    check(
        box_equal(await first.bounding_box(), base_first)
        and box_equal(await second.bounding_box(), base_second),
        f"{tag} hover causes no layout shift",
    )
    if reduced:
        check(
            hov_first["transform"] in ("none", "matrix(1, 0, 0, 1, 0, 0)"),
            f"{tag} reduced-motion disables hover transform",
        )
    else:
        check(
            hov_first["transform"] not in ("none", "matrix(1, 0, 0, 1, 0, 0)"),
            f"{tag} hover applies a 3D lift transform",
        )

    await page.mouse.move(0, 0)
    await page.wait_for_timeout(400)

    # --- keyboard focus -------------------------------------------------
    for locator, label in ((build.nth(0), "What I Build card"), (principles.nth(0), "How I Think card")):
        box_before = await locator.bounding_box()
        await locator.evaluate("n => n.focus()")
        await page.keyboard.press("Shift")  # marks focus-visible in all engines
        await page.wait_for_timeout(450)
        focused = await shadow_and_transform(locator)
        check(
            focused["shadow"] != "none" and focused["shadow"] != rest_first["shadow"],
            f"{tag} {label} shows a visible focus state",
        )
        check(
            box_equal(await locator.bounding_box(), box_before),
            f"{tag} {label} focus causes no layout shift",
        )
        if reduced:
            check(
                focused["transform"] in ("none", "matrix(1, 0, 0, 1, 0, 0)"),
                f"{tag} reduced-motion disables focus transform on {label}",
            )
        await locator.evaluate("n => n.blur()")

    # cards are tab-reachable
    reachable = await build.nth(0).evaluate("n => n.tabIndex >= 0")
    check(reachable, f"{tag} What I Build cards are keyboard reachable")

    # --- CTA focus + navigation -----------------------------------------
    await cta_link.focus()
    await page.wait_for_timeout(400)
    cta_focus = await shadow_and_transform(cta_link)
    check(cta_focus["shadow"] != "none", f"{tag} CTA shows a visible focus state")
    card_focus = await shadow_and_transform(cta_card)
    check(card_focus["shadow"] != "none", f"{tag} Get in Touch card pops on focus-within")

    await cta_link.press("Enter")
    await page.wait_for_url("**/contact", timeout=8000)
    check(page.url.rstrip("/").endswith("/contact"), f"{tag} CTA navigates to /contact")

    await browser.close()


async def main():
    async with async_playwright() as pw:
        for engine in ("chromium", "firefox", "webkit"):
            await run_engine(pw, engine, reduced=False)
        await run_engine(pw, "chromium", reduced=True)

    print("\n" + ("ALL CHECKS PASSED" if not failures else f"{len(failures)} FAILED:"))
    for f in failures:
        print("  - " + f)
    sys.exit(1 if failures else 0)


asyncio.run(main())
