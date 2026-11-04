#!/usr/bin/env python3
"""
Store Preview Studio · 4K Ultra HD Open Graph & Social Card Generator

Automates the end-to-end generation of 4K (3840x2160) Open Graph social cards,
cover banners, and dual-phone mockup raster assets directly from vector sources
and the Banner Studio HTML canvas using Chrome Headless.

Target Outputs:
  - marketing/public/og-image.png (3840x2160 RGBA)
  - marketing/og-image.png (3840x2160 RGBA)
  - marketing/out/og-image.png (3840x2160 RGBA)
  - core/docs/og-image.png (3840x2160 RGBA)
  - core/cloudflare/og-image.png (3840x2160 RGBA)
  - core/assets/cover-banner-1280x720.png (3840x2160 RGB)
  - core/docs/assets/cover-banner-1280x720.png (3840x2160 RGB)
  - marketing/public/banner-dual-mockup.png (3072x3048 RGB)
  - core/assets/banner-dual-mockup.png (1024x1016 RGB)
  - core/docs/assets/banner-dual-mockup.png (1024x1016 RGB)

Usage:
  python3 core/scripts/generate-og-image.py
  python3 core/scripts/generate-og-image.py --check-only
"""

import os
import sys
import glob
import shutil
import hashlib
import tempfile
import subprocess
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CORE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
ROOT_DIR = os.path.abspath(os.path.join(CORE_DIR, ".."))
MARKETING_DIR = os.path.join(ROOT_DIR, "marketing")

def find_chrome():
    candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        shutil.which("chromium-browser"),
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    ]
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return None

def run_chrome_screenshot(chrome_bin, html_path, output_png, width, height, scale_factor=3):
    tmp_user_dir = tempfile.mkdtemp(prefix="chrome-og-profile-")
    cmd = [
        chrome_bin,
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        f"--user-data-dir={tmp_user_dir}",
        f"--screenshot={output_png}",
        f"--window-size={width},{height}",
        f"--force-device-scale-factor={scale_factor}",
        f"file://{os.path.abspath(html_path)}"
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)
        if not os.path.exists(output_png) or os.path.getsize(output_png) == 0:
            err = res.stderr.decode("utf-8", errors="ignore")
            raise RuntimeError(f"Chrome screenshot failed: {err}")
    finally:
        shutil.rmtree(tmp_user_dir, ignore_errors=True)

def ensure_banner_build():
    banner_html = os.path.join(MARKETING_DIR, "out", "banner.html")
    if not os.path.exists(banner_html):
        print("[!] marketing/out/banner.html not found, running build...")
        subprocess.check_call(["npm", "--prefix", MARKETING_DIR, "run", "build"])
    return banner_html

def generate_banner_html(banner_html_path, temp_html_path):
    css_files = glob.glob(os.path.join(MARKETING_DIR, "out", "_next", "static", "css", "*.css"))
    css_content = ""
    for f in css_files:
        with open(f, "r", encoding="utf-8") as fp:
            css_content += fp.read() + "\n"

    with open(banner_html_path, "r", encoding="utf-8") as f:
        html = f.read()

    start_marker = "style=\"width:1280px;height:720px;min-width:1280px;min-height:720px\""
    idx = html.find(start_marker)
    if idx == -1:
        raise ValueError(f"Could not locate banner canvas with marker: {start_marker}")
    
    start_div = html.rfind("<div", 0, idx)

    pos = start_div + 4
    depth = 1
    while depth > 0 and pos < len(html):
        next_open = html.find("<div", pos)
        next_close = html.find("</div", pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            pos = next_close + 6

    banner_div = html[start_div:pos]

    # Clean up shadows for flush full-bleed 1280x720 canvas
    banner_div = banner_div.replace("shadow-[0_30px_90px_rgba(0,0,0,0.9)]", "shadow-none")

    # Point mockup image to absolute public SVG
    mockup_svg = os.path.join(MARKETING_DIR, "public", "banner-dual-mockup.svg")
    banner_div = banner_div.replace("src=\"/banner-dual-mockup.svg\"", f"src=\"file://{mockup_svg}\"")

    standalone_html = f"""<!DOCTYPE html>
<html lang="en" class="dark" data-theme="dark">
<head>
<meta charset="utf-8"/>
<style>
* {{ box-sizing: border-box; }}
html, body {{
  margin: 0;
  padding: 0;
  width: 1280px;
  height: 720px;
  overflow: hidden;
  background-color: #131413;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}}
{css_content}
</style>
</head>
<body style="margin:0;padding:0;background:#131413;">
{banner_div}
</body>
</html>
"""
    with open(temp_html_path, "w", encoding="utf-8") as out:
        out.write(standalone_html)

def check_existing_assets():
    required_files = [
        os.path.join(MARKETING_DIR, "public", "og-image.png"),
        os.path.join(MARKETING_DIR, "og-image.png"),
        os.path.join(CORE_DIR, "docs", "og-image.png"),
        os.path.join(CORE_DIR, "cloudflare", "og-image.png"),
        os.path.join(CORE_DIR, "assets", "cover-banner-1280x720.png"),
        os.path.join(CORE_DIR, "docs", "assets", "cover-banner-1280x720.png"),
    ]
    all_ok = True
    for f in required_files:
        if not os.path.exists(f):
            print(f"[✗] Missing asset: {f}")
            all_ok = False
            continue
        try:
            im = Image.open(f)
            if im.size != (3840, 2160):
                print(f"[✗] Invalid dimensions: {f} is {im.size}, expected (3840, 2160)")
                all_ok = False
            else:
                h = hashlib.md5(open(f, "rb").read()).hexdigest()
                rel = os.path.relpath(f, ROOT_DIR)
                print(f"[✓] {rel}: {im.size} {im.mode} (md5={h[:8]}...)")
        except Exception as e:
            print(f"[✗] Failed to open {f}: {e}")
            all_ok = False
    return all_ok

def main():
    if "--check-only" in sys.argv:
        print("Checking Open Graph and banner assets...")
        success = check_existing_assets()
        sys.exit(0 if success else 1)

    chrome_bin = find_chrome()
    if not chrome_bin:
        print("[✗] Error: Google Chrome or Chromium executable not found on system PATH.")
        print("    Please install Chrome to render native 4K Ultra HD assets.")
        sys.exit(1)

    print(f"[*] Found Chrome renderer at: {chrome_bin}")

    banner_html_path = ensure_banner_build()

    # 1. Render Dual Mockup raster assets from banner-dual-mockup.svg
    mockup_svg = os.path.join(MARKETING_DIR, "public", "banner-dual-mockup.svg")
    tmp_mockup_3072 = os.path.join(tempfile.gettempdir(), "banner-dual-mockup-3072.png")
    
    print("[*] Rendering 3072x3048 raster from banner-dual-mockup.svg...")
    run_chrome_screenshot(chrome_bin, mockup_svg, tmp_mockup_3072, 3072, 3048, scale_factor=1)

    im_mockup_3072 = Image.open(tmp_mockup_3072)
    mockup_pub_png = os.path.join(MARKETING_DIR, "public", "banner-dual-mockup.png")
    im_mockup_3072.save(mockup_pub_png, optimize=True)
    print(f"[✓] Saved {mockup_pub_png} (3072x3048)")

    im_mockup_1024 = im_mockup_3072.resize((1024, 1016), Image.Resampling.LANCZOS)
    for p in [
        os.path.join(CORE_DIR, "assets", "banner-dual-mockup.png"),
        os.path.join(CORE_DIR, "docs", "assets", "banner-dual-mockup.png"),
    ]:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        im_mockup_1024.save(p, optimize=True)
        print(f"[✓] Saved {p} (1024x1016)")

    # 2. Render 4K Banner Canvas
    temp_html_path = os.path.join(tempfile.gettempdir(), "sps_banner_export.html")
    generate_banner_html(banner_html_path, temp_html_path)

    tmp_og_4k = os.path.join(tempfile.gettempdir(), "sps_og_4k.png")
    print("[*] Rendering 3840x2160 (4K Ultra HD) Open Graph banner...")
    run_chrome_screenshot(chrome_bin, temp_html_path, tmp_og_4k, 1280, 720, scale_factor=3)

    im_og = Image.open(tmp_og_4k)
    assert im_og.size == (3840, 2160), f"Expected 3840x2160, got {im_og.size}"

    # 3. Synchronize RGBA outputs
    im_rgba = im_og.convert("RGBA")
    rgba_targets = [
        os.path.join(MARKETING_DIR, "public", "og-image.png"),
        os.path.join(MARKETING_DIR, "og-image.png"),
        os.path.join(MARKETING_DIR, "out", "og-image.png"),
        os.path.join(CORE_DIR, "docs", "og-image.png"),
        os.path.join(CORE_DIR, "cloudflare", "og-image.png"),
    ]
    for p in rgba_targets:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        im_rgba.save(p, optimize=True)
        print(f"[✓] Synchronized RGBA: {os.path.relpath(p, ROOT_DIR)}")

    # 4. Synchronize RGB outputs
    im_rgb = im_og.convert("RGB")
    rgb_targets = [
        os.path.join(CORE_DIR, "assets", "cover-banner-1280x720.png"),
        os.path.join(CORE_DIR, "docs", "assets", "cover-banner-1280x720.png"),
    ]
    for p in rgb_targets:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        im_rgb.save(p, optimize=True)
        print(f"[✓] Synchronized RGB:  {os.path.relpath(p, ROOT_DIR)}")

    # Clean up temp files
    for tmp in [tmp_mockup_3072, temp_html_path, tmp_og_4k]:
        if os.path.exists(tmp):
            os.remove(tmp)

    print("\n[✓] All 4K Open Graph and Banner assets generated and validated successfully!")

if __name__ == "__main__":
    main()
