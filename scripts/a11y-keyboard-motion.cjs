/**
 * Keyboard + reduced-motion accessibility check (headless Chromium).
 *
 * Runs against the live dev server and asserts, per route:
 *
 *   keyboard (desktop, 1280×900)
 *     - the first Tab stop is the "Skip to content" link, and Enter moves focus
 *       into <main>
 *     - every Tab stop is visible and paints a focus indicator (outline or ring)
 *     - focus never stalls on <body> and reaches the <main> landmark
 *     - Shift+Tab walks back through focusable elements
 *     - a visible aria-expanded control toggles with Space and with Enter
 *
 *   keyboard (mobile, 390×844)
 *     - Tab reaches the menu trigger, Space opens it (aria-expanded + dialog)
 *       and Escape closes it again
 *
 *   reduced motion
 *     - matchMedia("(prefers-reduced-motion: reduce)") is true
 *     - no canvas is mounted (the decorative particle field stays off)
 *     - no animation is still running and the ambient light does not drift
 *     - reveal wrappers are visible instead of waiting for a scroll trigger
 *     - every visible text node of <main> still renders (same unique lines as
 *       the default-motion run, ignoring aria-hidden decoration)
 *     - keyboard traversal still starts at the skip link
 *
 * The sandbox has no browser on the host, but the puppeteer image ships
 * Chromium. It runs as root here only so the root-owned repo mount is readable:
 *
 *   docker run --rm --user root --network host -v "$PWD:/repo" -w /repo \
 *     -e NODE_PATH=/home/pptruser/node_modules \
 *     -e PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
 *     ghcr.io/puppeteer/puppeteer:23.11.1 \
 *     node scripts/a11y-keyboard-motion.cjs http://localhost:3000
 *
 * CommonJS on purpose: ESM ignores NODE_PATH, and puppeteer lives in the
 * image's global node_modules.
 */

const puppeteer = require("puppeteer");

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const ROUTES = ["/", "/work", "/resume", "/achievements", "/contact"];
const MAX_TABS = 30;

const problems = [];
const fail = (route, message) => problems.push(`${route}: ${message}`);
const ok = (message) => console.log(`  ok   ${message}`);
const note = (message) => console.log(`  --   ${message}`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Puppeteer has no "Shift+Tab" key, so hold Shift around Tab. */
async function shiftTab(page) {
  await page.keyboard.down("Shift");
  await page.keyboard.press("Tab");
  await page.keyboard.up("Shift");
}

/** Everything this script needs to know about the focused element. */
function focused() {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    id: el.id,
    tag: el.tagName,
    label: (el.getAttribute("aria-label") ?? el.textContent ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60),
    inMain: Boolean(el.closest("main")),
    visible: rect.width > 1 && rect.height > 1 && rect.bottom > 0,
    ring:
      (parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== "none") ||
      (cs.boxShadow !== "none" && cs.boxShadow !== ""),
  };
}

/** Visible text of <main>, ignoring decoration and duplicated marquee copies. */
function mainText() {
  const lines = new Set();
  const walk = (el) => {
    if (el.getAttribute("aria-hidden") === "true") return;
    for (const node of el.childNodes) {
      if (node.nodeType === 3) {
        const text = node.textContent.replace(/\s+/g, " ").trim();
        if (text) lines.add(text);
        continue;
      }
      if (node.nodeType !== 1) continue;
      const cs = getComputedStyle(node);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      walk(node);
    }
  };
  const main = document.querySelector("main");
  if (main) walk(main);
  return [...lines].sort();
}

/** The first visible button[aria-expanded] on the page, or null. */
function visibleExpander() {
  const button = [...document.querySelectorAll("button[aria-expanded]")].find(
    (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.width > 1 &&
        rect.height > 1 &&
        getComputedStyle(el).visibility !== "hidden"
      );
    },
  );
  if (!button) return null;
  return {
    label: (button.getAttribute("aria-label") ?? button.textContent ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50),
    expanded: button.getAttribute("aria-expanded"),
  };
}

async function keyboardPass(page, route) {
  // 1: skip link is the first stop, and Enter lands in <main>
  await page.keyboard.press("Tab");
  const first = await page.evaluate(focused);
  if (!first) {
    fail(route, "Tab from the top of the page does not move focus");
    return;
  }
  if (!/skip to content/i.test(first.label)) {
    fail(route, `first Tab stop is "${first.label}", expected the skip link`);
  } else {
    ok("first Tab stop is the skip link");
  }
  await page.keyboard.press("Enter");
  await sleep(200);
  const landed = await page.evaluate(focused);
  if (!landed || landed.id !== "main") {
    fail(
      route,
      `Enter on the skip link focused "${landed ? landed.tag + "#" + landed.id : "nothing"}" instead of <main>`,
    );
  } else {
    ok("Enter on the skip link moves focus into <main>");
  }

  // 2: forward traversal — visibility, focus indicator, order, no stall
  const stops = [];
  for (let i = 0; i < MAX_TABS; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(focused);
    if (!info) {
      if (i < 8)
        fail(route, `focus fell back to <body> after ${i + 1} Tab presses`);
      break;
    }
    stops.push(info);
  }
  const hidden = stops.filter((s) => !s.visible);
  const ringless = stops.filter((s) => !s.ring);
  if (hidden.length)
    fail(
      route,
      `focused but invisible: ${hidden.map((s) => s.label).join(", ")}`,
    );
  if (ringless.length) {
    fail(
      route,
      `no visible focus indicator on: ${ringless.map((s) => `${s.tag} "${s.label}"`).join(", ")}`,
    );
  }
  if (!stops.some((s) => s.inMain))
    fail(route, `focus never reaches <main> within ${MAX_TABS} Tab presses`);
  if (stops.length < 8)
    fail(route, `only ${stops.length} focusable stops found`);
  if (stops.length >= 8 && !hidden.length && !ringless.length) {
    ok(`${stops.length} Tab stops, all visible with a focus ring`);
  }

  // 3: backwards traversal
  let backwards = 0;
  for (let i = 0; i < 5; i += 1) {
    await shiftTab(page);
    const info = await page.evaluate(focused);
    if (!info) {
      fail(route, `Shift+Tab lost focus after ${i + 1} presses`);
      break;
    }
    backwards += 1;
  }
  if (backwards === 5) ok("Shift+Tab walks back through focusables");

  // 4: Space and Enter both activate an expandable control
  const target = await page.evaluate(visibleExpander);
  if (!target) {
    note(
      "no visible aria-expanded control at desktop width (covered on mobile)",
    );
    return;
  }
  const expanded = () =>
    page.evaluate(() => {
      const button = [
        ...document.querySelectorAll("button[aria-expanded]"),
      ].find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
      });
      return button?.getAttribute("aria-expanded") ?? null;
    });
  const handle = await page.evaluateHandle(() =>
    [...document.querySelectorAll("button[aria-expanded]")].find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    }),
  );
  const element = handle.asElement();
  if (!element) {
    note("expandable control is not focusable");
    return;
  }
  const before = await expanded();
  await element.focus();
  await page.keyboard.press("Space");
  await sleep(300);
  const afterSpace = await expanded();
  await page.keyboard.press("Enter");
  await sleep(300);
  const afterEnter = await expanded();
  if (afterSpace === before)
    fail(route, `Space does not toggle "${target.label}"`);
  else if (afterEnter === afterSpace)
    fail(route, `Enter does not toggle "${target.label}"`);
  else ok(`Space and Enter both toggle "${target.label}"`);
}

async function mobileMenuPass(page, route) {
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2" });
  await page.waitForSelector("h1");
  await sleep(500);

  const trigger = await page.evaluate(visibleExpander);
  if (!trigger) {
    fail(route, "mobile: no visible menu trigger (button[aria-expanded])");
    return;
  }

  // Tab until the trigger is focused, proving it is reachable from the skip link.
  let reached = false;
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(focused);
    if (info && info.label === trigger.label) {
      reached = true;
      break;
    }
  }
  if (!reached)
    fail(
      route,
      `mobile: Tab never reaches the menu trigger "${trigger.label}"`,
    );
  else ok("mobile: Tab reaches the menu trigger");

  await page.keyboard.press("Space");
  await sleep(400);
  const opened = await page.evaluate(() => ({
    expanded: [...document.querySelectorAll("button[aria-expanded]")]
      .find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
      })
      ?.getAttribute("aria-expanded"),
    dialog: Boolean(
      [...document.querySelectorAll('[role="dialog"]')].find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 1 && getComputedStyle(el).visibility !== "hidden";
      }),
    ),
  }));
  if (opened.expanded !== "true" || !opened.dialog) {
    fail(
      route,
      `mobile: Space did not open the menu (expanded=${opened.expanded}, dialog=${opened.dialog})`,
    );
  } else {
    ok("mobile: Space opens the menu");
  }
  await page.keyboard.press("Escape");
  await sleep(400);
  const closed = await page.evaluate(() =>
    [...document.querySelectorAll("button[aria-expanded]")]
      .find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
      })
      ?.getAttribute("aria-expanded"),
  );
  if (closed === "true") fail(route, "mobile: Escape does not close the menu");
  else ok("mobile: Escape closes the menu");

  await page.setViewport({ width: 1280, height: 900 });
}

async function reducedMotionPass(page, route, baseline) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.reload({ waitUntil: "networkidle2" });
  await page.waitForSelector("h1");
  await sleep(2500);

  const state = await page.evaluate(() => {
    const running = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (
        cs.animationName !== "none" &&
        cs.animationPlayState === "running" &&
        parseFloat(cs.animationDuration) > 0.01
      ) {
        running.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 28)}`,
        );
      }
    }
    const reveals = [
      ...document.querySelectorAll(
        ".reveal, .reveal-word, .reveal-mask, .reveal-clip",
      ),
    ]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < innerHeight && rect.bottom > 0;
      })
      .map((el) => Number(getComputedStyle(el).opacity));
    return {
      matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
      canvases: document.querySelectorAll("canvas").length,
      running: running.slice(0, 5),
      runningCount: running.length,
      revealMin: reveals.length ? Math.min(...reveals) : null,
      ambientAnimation: getComputedStyle(
        document.querySelector(".ambient-key") ?? document.body,
      ).animationName,
      ambientTransform: getComputedStyle(
        document.querySelector(".ambient-key") ?? document.body,
      ).transform,
    };
  });

  if (!state.matches)
    fail(route, "reduce: media query not applied to the page");
  if (state.canvases > 0)
    fail(route, `reduce: ${state.canvases} canvas still mounted`);
  else ok("reduce: decorative canvas stays unmounted");
  if (state.runningCount > 0) {
    fail(
      route,
      `reduce: ${state.runningCount} animation(s) still running (${state.running.join(", ")})`,
    );
  } else {
    ok("reduce: no animation is running");
  }
  if (state.ambientAnimation !== "none") {
    fail(
      route,
      `reduce: ambient light still animates (${state.ambientAnimation})`,
    );
  } else {
    ok("reduce: ambient light drift is off");
  }
  if (state.revealMin !== null && state.revealMin < 0.99) {
    fail(
      route,
      `reduce: a reveal wrapper is still hidden (opacity ${state.revealMin})`,
    );
  } else {
    ok("reduce: reveal wrappers are visible");
  }

  const reduced = await page.evaluate(mainText);
  const reducedSet = new Set(reduced);
  const missing = baseline.filter((line) => !reducedSet.has(line));
  if (missing.length) {
    fail(
      route,
      `reduce: ${missing.length} text line(s) missing, e.g. "${missing.slice(0, 4).join('", "')}"`,
    );
  } else {
    ok(`reduce: all ${baseline.length} visible text lines still render`);
  }

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    document.documentElement.scrollTop = 0;
  });
  await sleep(200);
  await page.keyboard.press("Tab");
  const first = await page.evaluate(focused);
  if (!first || !/skip to content/i.test(first.label)) {
    fail(
      route,
      `reduce: keyboard traversal no longer starts at the skip link ("${first ? first.label : "none"}")`,
    );
  } else {
    ok("reduce: keyboard traversal still starts at the skip link");
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    for (const route of ROUTES) {
      console.log(`\n${route}`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2" });
      await page.waitForSelector("h1");
      await sleep(600);

      const baseline = await page.evaluate(mainText);
      await keyboardPass(page, route);
      await mobileMenuPass(page, route);
      await reducedMotionPass(page, route, baseline);
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log("");
  if (problems.length) {
    console.error(`FAIL — ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(
    "PASS — keyboard and reduced-motion checks passed on every route.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
