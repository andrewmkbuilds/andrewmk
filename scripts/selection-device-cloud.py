#!/usr/bin/env python3
"""Run the ::selection visual regression on REAL mobile devices.

Playwright's bundled WebKit/Chromium are desktop engines with a mobile
viewport — they cannot prove how Safari on iOS or an Android WebView paints
`::selection`. This runner drives the same cases against a device cloud
(BrowserStack or LambdaTest) over Playwright's remote-connect endpoint.

Usage:
  python3 scripts/selection-device-cloud.py [base_url]

Environment:
  DEVICE_CLOUD=browserstack | lambdatest        (default: browserstack)
  BROWSERSTACK_USERNAME / BROWSERSTACK_ACCESS_KEY
  LT_USERNAME / LT_ACCESS_KEY
  DEVICE_CLOUD_BUILD    optional build name shown in the provider dashboard
  DEVICE_MATRIX         optional comma-separated subset of the matrix keys

The public base_url must be reachable from the cloud (a published/preview URL,
or a local tunnel such as BrowserStackLocal / LambdaTest Tunnel — set
`DEVICE_CLOUD_LOCAL=true` once the tunnel is running).

Without credentials the script exits 0 with a SKIPPED notice so CI stays green
on forks and local runs; set DEVICE_CLOUD_REQUIRED=1 to make that a failure.

Artifacts: artifacts/selection-device-cloud/<device>-<case>.png
"""
from __future__ import annotations

import asyncio
import importlib.util
import json
import os
import sys
import urllib.parse
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent
OUT = Path("artifacts/selection-device-cloud")

# Reuse the local suite's cases + image analysis so both runners assert the
# exact same thing (theme-green highlight, 4.5:1 selected-text contrast).
_spec = importlib.util.spec_from_file_location(
    "selection_visual_check", ROOT / "selection-visual-check.py"
)
_local = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_local)  # guarded by __main__, so nothing runs

BASE = (sys.argv[1] if len(sys.argv) > 1 else os.environ.get("DEVICE_CLOUD_BASE_URL", "")).rstrip("/")
PROVIDER = os.environ.get("DEVICE_CLOUD", "browserstack").lower()
BUILD = os.environ.get("DEVICE_CLOUD_BUILD", "selection-visual")
USE_LOCAL = os.environ.get("DEVICE_CLOUD_LOCAL", "").lower() in ("1", "true", "yes")
REQUIRED = os.environ.get("DEVICE_CLOUD_REQUIRED", "").lower() in ("1", "true", "yes")

# Real hardware: iOS Safari (WebKit) and Android Chrome/WebView (Blink).
BROWSERSTACK_MATRIX = {
    "ios-safari-iphone15": {
        "os": "ios", "osVersion": "17", "deviceName": "iPhone 15",
        "browserName": "playwright-webkit", "realMobile": "true",
    },
    "ios-safari-ipad": {
        "os": "ios", "osVersion": "16", "deviceName": "iPad 10th",
        "browserName": "playwright-webkit", "realMobile": "true",
    },
    "android-webview-pixel8": {
        "os": "android", "osVersion": "14", "deviceName": "Google Pixel 8",
        "browserName": "playwright-chromium", "realMobile": "true",
    },
    "android-webview-galaxy-s23": {
        "os": "android", "osVersion": "13", "deviceName": "Samsung Galaxy S23",
        "browserName": "playwright-chromium", "realMobile": "true",
    },
}

LAMBDATEST_MATRIX = {
    "ios-safari-iphone15": {
        "platform": "ios", "deviceName": "iPhone 15", "platformVersion": "17",
        "browserName": "pw-webkit", "isRealMobile": True,
    },
    "android-webview-pixel8": {
        "platform": "android", "deviceName": "Pixel 8", "platformVersion": "14",
        "browserName": "pw-chromium", "isRealMobile": True,
    },
}


def credentials() -> tuple[str, str] | None:
    if PROVIDER == "lambdatest":
        user, key = os.environ.get("LT_USERNAME"), os.environ.get("LT_ACCESS_KEY")
    else:
        user, key = os.environ.get("BROWSERSTACK_USERNAME"), os.environ.get("BROWSERSTACK_ACCESS_KEY")
    return (user, key) if user and key else None


def ws_endpoint(device_key: str, caps_extra: dict, user: str, key: str) -> str:
    """Build the provider's Playwright websocket endpoint for one device."""
    if PROVIDER == "lambdatest":
        caps = {
            **LAMBDATEST_MATRIX[device_key],
            "user": user,
            "accessKey": key,
            "build": BUILD,
            "name": f"selection::{device_key}",
            "network": False,
            "video": True,
            "console": True,
            "tunnel": USE_LOCAL,
            **caps_extra,
        }
        return ("wss://cdp.lambdatest.com/playwright?capabilities="
                + urllib.parse.quote(json.dumps(caps)))

    caps = {
        **BROWSERSTACK_MATRIX[device_key],
        "browserstack.username": user,
        "browserstack.accessKey": key,
        "buildName": BUILD,
        "sessionName": f"selection::{device_key}",
        "browserstack.local": "true" if USE_LOCAL else "false",
        "client.playwrightVersion": "1.4x",
        **caps_extra,
    }
    return ("wss://cdp.browserstack.com/playwright?caps="
            + urllib.parse.quote(json.dumps(caps)))


def matrix_keys() -> list[str]:
    table = LAMBDATEST_MATRIX if PROVIDER == "lambdatest" else BROWSERSTACK_MATRIX
    wanted = os.environ.get("DEVICE_MATRIX")
    if not wanted:
        return list(table)
    keys = [k.strip() for k in wanted.split(",") if k.strip()]
    unknown = [k for k in keys if k not in table]
    if unknown:
        sys.exit(f"Unknown DEVICE_MATRIX entries for {PROVIDER}: {', '.join(unknown)}")
    return keys


async def run_device(pw, device_key: str, user: str, key: str, failures: list[str]):
    endpoint = ws_endpoint(device_key, {}, user, key)
    print(f"\n{device_key} ({PROVIDER})")
    browser = None
    try:
        browser = await pw.chromium.connect(endpoint, timeout=180_000)
        ctx = await browser.new_context()
        page = await ctx.new_page()
        for name, route, selector, kind in _local.CASES:
            try:
                await _local.run_case(page, PROVIDER, device_key, name, route,
                                      selector, kind, failures)
            except Exception as exc:
                failures.append(f"{device_key}/{name}: error {exc}")
        await ctx.close()
    except Exception as exc:
        failures.append(f"{device_key}: session failed — {exc}")
    finally:
        if browser:
            await browser.close()


async def main():
    creds = credentials()
    if not creds:
        msg = (f"SKIPPED: no {PROVIDER} credentials in the environment "
               f"(set {'LT_USERNAME/LT_ACCESS_KEY' if PROVIDER == 'lambdatest' else 'BROWSERSTACK_USERNAME/BROWSERSTACK_ACCESS_KEY'}).")
        print(msg)
        sys.exit(1 if REQUIRED else 0)
    if not BASE or "localhost" in BASE and not USE_LOCAL:
        sys.exit("A publicly reachable base URL is required (or start a provider "
                 "tunnel and set DEVICE_CLOUD_LOCAL=true).")

    OUT.mkdir(parents=True, exist_ok=True)
    _local.BASE = BASE
    _local.OUT = OUT  # write device-cloud artifacts to their own folder

    user, key = creds
    failures: list[str] = []
    async with async_playwright() as pw:
        for device_key in matrix_keys():
            await run_device(pw, device_key, user, key, failures)

    if failures:
        print("\nReal-device selection regression FAILED:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("\nReal-device selection regression passed — ::selection is theme green "
          "on every device in the matrix.")


if __name__ == "__main__":
    asyncio.run(main())
