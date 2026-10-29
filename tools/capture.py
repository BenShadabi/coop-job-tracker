#!/usr/bin/env python3
"""Rebuild the screenshots and the demo GIF in docs/img from the demo data.

Needs: pip install playwright pillow  (uses your installed Chrome, no browser download)
Run from the repo root: python tools/capture.py
"""
import http.server
import io
import socketserver
import threading
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "img"
OUT.mkdir(parents=True, exist_ok=True)


def serve():
    handler = lambda *a, **k: http.server.SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    handler.log_message = lambda *a: None
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]


def main():
    srv, port = serve()
    base = f"http://127.0.0.1:{port}/index.html"
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        ctx = b.new_context(viewport={"width": 1100, "height": 900}, device_scale_factor=2)
        pg = ctx.new_page()
        for tab in ("hot", "jobs", "events", "timeline", "trends"):
            pg.goto(f"{base}?tab={tab}&theme=light")
            pg.wait_for_timeout(1400)
            pg.screenshot(path=str(OUT / f"{tab}.png"), full_page=True)
        pg.goto(f"{base}?tab=hot&theme=dark")
        pg.wait_for_timeout(1400)
        pg.screenshot(path=str(OUT / "hot-dark.png"), full_page=True)

        m = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True).new_page()
        m.goto(f"{base}?tab=hot&theme=light")
        m.wait_for_timeout(1400)
        m.screenshot(path=str(OUT / "mobile-hot.png"))

        # Demo GIF: open each tab, then mark the hottest role as applied.
        frames = []

        def snap(page, ms=900):
            page.wait_for_timeout(ms)
            im = Image.open(io.BytesIO(page.screenshot())).convert("RGB")
            im = im.resize((im.width // 2, im.height // 2))
            frames.append(im)

        g = b.new_context(viewport={"width": 1100, "height": 760}, device_scale_factor=2).new_page()
        g.goto(f"{base}?tab=hot&theme=light")
        snap(g, 1500)
        g.select_option("select[data-sel]", "applied")
        snap(g, 250)
        snap(g, 700)
        for tab in ("jobs", "events", "timeline", "trends"):
            g.click(f"#t-{tab}")
            snap(g, 900)
        g.click("#t-hot")
        snap(g, 900)
        frames[0].save(OUT / "demo.gif", save_all=True, append_images=frames[1:], duration=1300, loop=0, optimize=True)
        b.close()
    srv.shutdown()
    print("wrote", sorted(x.name for x in OUT.iterdir()))


if __name__ == "__main__":
    main()
