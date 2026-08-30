#!/usr/bin/env python3
"""Visual + behavioural regression checks for the "Start a Website Project" CTA.

Covers, across Chromium / Firefox / WebKit:
  1. rest -> hover: the CTA lifts, scales and gains an emerald glow.
  2. keyboard :focus-visible reproduces the hover state without layout shift
     and without clipping the focus ring.
  3. prefers-reduced-motion: no transform/animation, static emphasis instead.
  4. coarse/touch pointers: the 3D lift never triggers (hover media query).

Usage: python3 scripts/cta-visual-check.py [base-url]
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")
PAGES = [("websites", "/websites"), ("home", "/")]
SHOTS = Path("/tmp/browser/cta-visual/screenshots")
SHOTS.mkdir(parents=True, exist_ok=True)

CTA_TEXT = "Start a Website Project"

METRICS = """(el) => {
  const cs = getComputedStyle(el);
  return {
    transform: cs.transform,
    boxShadow: cs.boxShadow,
    transition: cs.transitionDuration,
    // Layout box ignores transforms, so it detects real layout shift.
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}"""

failures: list[str] = []


async def settled(locator):
    """Sample until the transform stops changing (transition finished)."""
    previous = None
    for _ in range(15):
        current = await locator.evaluate(METRICS)
        if previous is not None and current["transform"] == previous["transform"]:
            return current
        previous = current
        await locator.page.wait_for_timeout(120)
    return previous


def check(name: str, condition: bool, detail: str = "") -> None:
    status = "PASS" if condition else "FAIL"
    print(f"  [{status}] {name}{(' — ' + detail) if detail else ''}")
    if not condition:
        failures.append(f"{name}{(' — ' + detail) if detail else ''}")


def has_transform(t: str) -> bool:
    if t in ("none", ""):
        return False
    nums = [abs(float(v)) for v in t[t.find("(") + 1 : -1].split(",")] if "(" in t else []
    if len(nums) >= 6:
        # Meaningful lift or scale, not a sub-pixel resting value.
        return abs(nums[0] - 1) > 0.005 or nums[5] > 0.5
    return True


def nums(t: str) -> list[float]:
    return [float(v) for v in t[t.find("(") + 1 : -1].split(",")] if "(" in t else []


def close(a: str, b: str, tol: float = 0.01) -> bool:
    na, nb = nums(a), nums(b)
    return len(na) == len(nb) and all(abs(x - y) <= tol for x, y in zip(na, nb))


def glow(shadow: str) -> bool:
    return shadow not in ("none", "")


async def run_page(browser_name, browser, path_name, path, reduced=False, touch=False):
    label = f"{browser_name}/{path_name}" + ("/reduced-motion" if reduced else "") + (
        "/touch" if touch else ""
    )
    print(f"\n{label}")
    ctx_args: dict = {"viewport": {"width": 1280, "height": 1800}}
    if reduced:
        ctx_args["reduced_motion"] = "reduce"
    if touch:
        ctx_args["has_touch"] = True
        ctx_args["is_mobile"] = browser_name == "chromium"
        ctx_args["viewport"] = {"width": 390, "height": 844}

    context = await browser.new_context(**ctx_args)
    page = await context.new_page()
    await page.goto(f"{BASE}{path}", wait_until="networkidle")

    cta = page.get_by_role("link", name=CTA_TEXT).first
    await cta.scroll_into_view_if_needed()
    await page.wait_for_timeout(400)

    rest = await settled(cta)
    await page.screenshot(path=str(SHOTS / f"{label.replace('/', '_')}_rest.png"))

    if touch:
        # A tap must not leave the element stuck in the lifted 3D state.
        await cta.dispatch_event("touchstart")
        await page.wait_for_timeout(400)
        after = await cta.evaluate(METRICS)
        check("touch: no 3D lift applied", not has_transform(after["transform"]), after["transform"])
        await context.close()
        return

    fine_pointer = await page.evaluate(
        "() => matchMedia('(hover: hover)').matches && matchMedia('(pointer: fine)').matches"
    )

    hovered = None
    for attempt in range(6):
        box = await cta.bounding_box()
        assert box
        cx, cy = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        # Firefox headless needs a real movement path before it applies :hover.
        await page.mouse.move(cx - 40, cy - 40)
        await page.mouse.move(cx, cy, steps=8)
        await page.wait_for_timeout(250)
        if await cta.evaluate("(el) => el.matches(':hover')"):
            hovered = await settled(cta)
            break
        await page.mouse.move(0, 0)
        await page.wait_for_timeout(250)
    check("hover: :hover state registered", hovered is not None)
    if hovered is None:
        await context.close()
        return

    if not fine_pointer:
        # Engine reports a non-hover pointer (headless Firefox, touch devices):
        # the guarded 3D/glow effect must stay off.
        check("coarse pointer: 3D lift correctly suppressed",
              not has_transform(hovered["transform"]), hovered["transform"])
    await page.screenshot(path=str(SHOTS / f"{label.replace('/', '_')}_hover.png"))

    if reduced:
        check("reduced motion: no transform on hover", not has_transform(hovered["transform"]),
              hovered["transform"])
        longest = max(float(d.replace("s", "")) for d in hovered["transition"].split(", "))
        check("reduced motion: transitions effectively disabled", longest <= 0.01,
              hovered["transition"])
        check("reduced motion: static emphasis still present", glow(hovered["boxShadow"]))
    elif fine_pointer:
        check("hover: lift/scale applied", has_transform(hovered["transform"]), hovered["transform"])
        check("hover: emerald glow applied", glow(hovered["boxShadow"]))
        check("hover: no size change (no layout shift)",
              (hovered["width"], hovered["height"]) == (rest["width"], rest["height"]))

    # Keyboard focus-visible.
    await page.mouse.move(0, 0)
    await page.wait_for_timeout(300)
    is_focus_visible = False
    focused = rest
    for _ in range(3):
        await cta.evaluate("(el) => el.focus())".replace("))", ")"))
        await page.keyboard.press("Shift+Tab")
        await page.keyboard.press("Tab")
        focused = await settled(cta)
        is_focus_visible = await cta.evaluate("(el) => el.matches(':focus-visible')")
        if is_focus_visible:
            break
    await page.screenshot(path=str(SHOTS / f"{label.replace('/', '_')}_focus.png"))

    check("keyboard: CTA reachable and :focus-visible", bool(is_focus_visible))
    if is_focus_visible and not reduced and fine_pointer:
        check("focus-visible matches hover transform", close(focused["transform"], hovered["transform"]),
              f"{focused['transform']} vs {hovered['transform']}")
        check("focus-visible matches hover glow",
              glow(focused["boxShadow"]) and focused["boxShadow"].count("rgb") == hovered["boxShadow"].count("rgb"),
              focused["boxShadow"][:80])
    check("focus: no layout shift",
          (focused["width"], focused["height"]) == (rest["width"], rest["height"]))

    # Focus ring must not be clipped by an overflow:hidden ancestor.
    clipped = await cta.evaluate(
        """(el) => {
          const r = el.getBoundingClientRect();
          let p = el.parentElement;
          while (p && p !== document.body) {
            const cs = getComputedStyle(p);
            if (cs.overflow !== 'visible' && cs.overflow !== '') {
              const pr = p.getBoundingClientRect();
              if (r.left - 6 < pr.left || r.right + 6 > pr.right ||
                  r.top - 6 < pr.top || r.bottom + 6 > pr.bottom) return true;
            }
            p = p.parentElement;
          }
          return false;
        }"""
    )
    check("focus ring not clipped by an ancestor", not clipped)

    await context.close()


async def main() -> int:
    async with async_playwright() as pw:
        for browser_name in ("chromium", "firefox", "webkit"):
            browser = await getattr(pw, browser_name).launch(headless=True)
            for path_name, path in PAGES:
                await run_page(browser_name, browser, path_name, path)
                await run_page(browser_name, browser, path_name, path, reduced=True)
            await run_page(browser_name, browser, "websites", "/websites", touch=True)
            await browser.close()

    print("\n" + "=" * 60)
    if failures:
        print(f"{len(failures)} CTA visual check(s) failed:")
        for f in failures:
            print(f" - {f}")
        return 1
    print("All CTA hover / focus-visible / reduced-motion / touch checks passed.")
    print(f"Screenshots: {SHOTS}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
