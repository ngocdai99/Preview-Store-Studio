#!/usr/bin/env python3
"""
Store Preview Studio · High-Craft Open Graph Social Card Generator
Generates a 1200x630 social share card for Facebook, Zalo, Twitter, LinkedIn.
Outputs: docs/og-image.png
"""

import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

# Base canvas
base = Image.new("RGBA", (W, H), (9, 13, 22, 255))

# 1. Background Gradients & Glows via Alpha Composite
glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
g_draw = ImageDraw.Draw(glow_layer)

# Purple Glow at top right
cx, cy, max_r = 920, 160, 420
for r in range(max_r, 0, -6):
    factor = (1.0 - r / max_r) ** 2.2
    alpha = int(55 * factor)
    g_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(139, 92, 246, alpha))

# Blue-Indigo Glow at bottom left
cx2, cy2, max_r2 = 240, 520, 380
for r in range(max_r2, 0, -6):
    factor = (1.0 - r / max_r2) ** 2.2
    alpha = int(50 * factor)
    g_draw.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=(59, 130, 246, alpha))

base = Image.alpha_composite(base, glow_layer)

# Subtle grid pattern
grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
grid_draw = ImageDraw.Draw(grid_layer)
for x in range(0, W, 48):
    grid_draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 7), width=1)
for y in range(0, H, 48):
    grid_draw.line([(0, y), (W, y)], fill=(255, 255, 255, 7), width=1)
base = Image.alpha_composite(base, grid_layer)

draw = ImageDraw.Draw(base)

# Fonts
def get_font(size, bold=False):
    paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/SFNS.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

font_badge = get_font(14, bold=True)
font_title = get_font(54, bold=True)
font_sub = get_font(21, bold=False)
font_pill = get_font(14, bold=True)
font_footer = get_font(15, bold=False)
font_phone_title = get_font(16, bold=True)
font_phone_sub = get_font(12, bold=False)
font_phone_btn = get_font(12, bold=True)
font_phone_stat = get_font(12, bold=True)
font_phone_lbl = get_font(10, bold=False)

# ── Left Column: Text & Branding ──
X = 75

# (A) App Logo Icon (76x76)
icon_size = 76
icon_x, icon_y = X, 72

icon_bg = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
idraw = ImageDraw.Draw(icon_bg)
# Diagonal gradient: #3b82f6 -> #8b5cf6
for y in range(icon_size):
    for x in range(icon_size):
        t = (x + y) / (icon_size * 2)
        r = int(59 * (1 - t) + 139 * t)
        g = int(130 * (1 - t) + 92 * t)
        b = 246
        idraw.point((x, y), fill=(r, g, b, 255))

# Round mask
mask = Image.new("L", (icon_size, icon_size), 0)
mdraw = ImageDraw.Draw(mask)
mdraw.rounded_rectangle([0, 0, icon_size, icon_size], radius=18, fill=255)

# Inner shapes on icon
inner = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
indraw = ImageDraw.Draw(inner)
# phone outlines in icon
indraw.rounded_rectangle([26, 11, 64, 53], radius=6, fill=(255, 255, 255, 45), outline=(255, 255, 255, 220), width=3)
indraw.rounded_rectangle([12, 19, 40, 64], radius=7, fill=(99, 102, 241, 240), outline=(255, 255, 255, 255), width=3)
indraw.rectangle([16, 29, 36, 47], fill=(255, 255, 255, 110))
indraw.rectangle([16, 51, 36, 59], fill=(255, 255, 255, 170))

icon_bg.paste(inner, (0, 0), inner)

# Drop shadow for app icon
for s in range(12, 0, -2):
    draw.rounded_rectangle([icon_x - s, icon_y - s + 4, icon_x + icon_size + s, icon_y + icon_size + s + 4], radius=22, fill=(99, 102, 241, 10))

base.paste(icon_bg, (icon_x, icon_y), mask)

# (B) Hero Pill Badge
badge_x = X + icon_size + 22
badge_y = icon_y + 20
badge_text = "Mockup Studio cho App Store & Google Play"
bbox = font_badge.getbbox(badge_text)
bw = (bbox[2] - bbox[0]) + 38
bh = 36

# Pill bg
draw.rounded_rectangle([badge_x, badge_y, badge_x + bw, badge_y + bh], radius=18, fill=(18, 25, 42, 240), outline=(147, 51, 234, 140), width=1)
# Cyan glowing dot
draw.ellipse([badge_x + 14, badge_y + 14, badge_x + 22, badge_y + 22], fill=(56, 189, 248, 255))
draw.text((badge_x + 30, badge_y + 9), badge_text, fill=(241, 245, 249), font=font_badge)

# (C) Title
title_y = 185
draw.text((X, title_y), "Store Preview Studio", fill=(255, 255, 255), font=font_title)

# (D) Subtitle
sub_y = title_y + 76
draw.text((X, sub_y), "Không gian làm việc 100% offline giúp bạn thiết kế,", fill=(203, 213, 225), font=font_sub)
draw.text((X, sub_y + 34), "kiểm tra và xem trước trang ứng dụng trên thiết bị chân thực.", fill=(203, 213, 225), font=font_sub)

# (E) Feature Badges (3 elegant dark glassmorphism pills)
pills_y = sub_y + 94
features = [
    ("100% Offline & Bảo Mật", (59, 130, 246)),
    ("Chuẩn Ký Tự Apple & Google", (168, 85, 247)),
    ("Mockup iPhone & Android", (16, 185, 129)),
]

curr_x = X
for text, col in features:
    tbox = font_pill.getbbox(text)
    pw = (tbox[2] - tbox[0]) + 36
    ph = 36
    draw.rounded_rectangle([curr_x, pills_y, curr_x + pw, pills_y + ph], radius=10, fill=(18, 26, 44, 230), outline=(col[0], col[1], col[2], 120), width=1)
    # Colored indicator dot
    draw.ellipse([curr_x + 13, pills_y + 14, curr_x + 21, pills_y + 22], fill=col)
    draw.text((curr_x + 27, pills_y + 9), text, fill=(241, 245, 249), font=font_pill)
    curr_x += pw + 12

# (F) Footer divider & links
draw.line([(X, H - 70), (W - 75, H - 70)], fill=(255, 255, 255, 30), width=1)
draw.text((X, H - 48), "preview-studio-app-vi.surge.sh", fill=(148, 163, 184), font=font_footer)
draw.text((W - 350, H - 48), "Hỗ trợ iOS 18 · iPadOS · Android 15", fill=(148, 163, 184), font=font_footer)

# ── Right Column: Sleek Realistic Phone Mockup ──
phone_w, phone_h = 320, 484
phone_x = 790
phone_y = 62

# Outer device shadow
for s in range(20, 0, -3):
    draw.rounded_rectangle([phone_x - s, phone_y - s + 10, phone_x + phone_w + s, phone_y + phone_h + s + 10], radius=46, fill=(0, 0, 0, 25))

# Outer device bezel
draw.rounded_rectangle([phone_x, phone_y, phone_x + phone_w, phone_y + phone_h], radius=44, fill=(15, 23, 42), outline=(255, 255, 255, 65), width=2)
# Inner screen
sc_pad = 10
sc_x, sc_y = phone_x + sc_pad, phone_y + sc_pad
sc_w, sc_h = phone_w - sc_pad * 2, phone_h - sc_pad * 2
draw.rounded_rectangle([sc_x, sc_y, sc_x + sc_w, sc_y + sc_h], radius=36, fill=(10, 14, 24))

# Dynamic Island
di_w, di_h = 86, 22
di_x = sc_x + (sc_w - di_w) // 2
di_y = sc_y + 11
draw.rounded_rectangle([di_x, di_y, di_x + di_w, di_y + di_h], radius=11, fill=(0, 0, 0), outline=(255, 255, 255, 35), width=1)

# App Info Row inside Screen
app_y = sc_y + 52
# Mini App Icon inside phone (58x58 with gradient)
m_icon_x = sc_x + 18
m_icon_layer = Image.new("RGBA", (58, 58), (0, 0, 0, 0))
midraw = ImageDraw.Draw(m_icon_layer)
for i in range(58):
    t = i / 58
    r = int(37 * (1 - t) + 124 * t)
    g = int(99 * (1 - t) + 58 * t)
    b = 237
    midraw.line([(0, i), (58, i)], fill=(r, g, b, 255))
m_mask = Image.new("L", (58, 58), 0)
mmdraw = ImageDraw.Draw(m_mask)
mmdraw.rounded_rectangle([0, 0, 58, 58], radius=14, fill=255)
# Mini logo shapes
midraw.rounded_rectangle([20, 8, 48, 40], radius=4, outline=(255, 255, 255, 180), width=2)
midraw.rounded_rectangle([10, 15, 32, 48], radius=5, fill=(99, 102, 241, 230), outline=(255, 255, 255, 255), width=2)
base.paste(m_icon_layer, (m_icon_x, app_y), m_mask)

# Title & subtitle
draw.text((m_icon_x + 70, app_y + 6), "Preview Studio", fill=(255, 255, 255), font=font_phone_title)
draw.text((m_icon_x + 70, app_y + 26), "Store Mockup Studio", fill=(148, 163, 184), font=font_phone_sub)

# Get / NHẬN button
btn_w, btn_h = 66, 26
btn_x = m_icon_x + 70
btn_y = app_y + 46
draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=13, fill=(37, 99, 235), outline=(96, 165, 250), width=1)
draw.text((btn_x + 14, btn_y + 5), "NHẬN", fill=(255, 255, 255), font=font_phone_btn)

# Rating & Age Row
mat_y = app_y + 90
draw.line([(sc_x + 16, mat_y), (sc_x + sc_w - 16, mat_y)], fill=(255, 255, 255, 25), width=1)
# Column 1: Rating
draw.text((sc_x + 28, mat_y + 8), "4.9 / 5.0", fill=(255, 255, 255), font=font_phone_stat)
draw.text((sc_x + 28, mat_y + 24), "12K ĐÁNH GIÁ", fill=(148, 163, 184), font=font_phone_lbl)
# Column 2: Age
draw.text((sc_x + 185, mat_y + 8), "4+", fill=(255, 255, 255), font=font_phone_stat)
draw.text((sc_x + 185, mat_y + 24), "TUỔI", fill=(148, 163, 184), font=font_phone_lbl)
draw.line([(sc_x + 16, mat_y + 42), (sc_x + sc_w - 16, mat_y + 42)], fill=(255, 255, 255, 25), width=1)

# Screenshots Gallery
shot_y = mat_y + 54
shot_w, shot_h = 126, 204

# Card 1: Purple theme screenshot
draw.rounded_rectangle([sc_x + 16, shot_y, sc_x + 16 + shot_w, shot_y + shot_h], radius=12, fill=(20, 26, 40), outline=(139, 92, 246, 150), width=1)
draw.rounded_rectangle([sc_x + 22, shot_y + 12, sc_x + 16 + shot_w - 6, shot_y + 30], radius=5, fill=(139, 92, 246, 90))
for by in range(shot_y + 42, shot_y + shot_h - 18, 22):
    draw.rounded_rectangle([sc_x + 24, by, sc_x + 16 + shot_w - 8, by + 14], radius=4, fill=(255, 255, 255, 30))

# Card 2: Blue theme screenshot
draw.rounded_rectangle([sc_x + 16 + shot_w + 12, shot_y, sc_x + 16 + shot_w * 2 + 12, shot_y + shot_h], radius=12, fill=(20, 26, 40), outline=(59, 130, 246, 150), width=1)
draw.rounded_rectangle([sc_x + 22 + shot_w + 12, shot_y + 12, sc_x + 16 + shot_w * 2 + 6, shot_y + 30], radius=5, fill=(59, 130, 246, 90))
for by in range(shot_y + 42, shot_y + shot_h - 18, 22):
    draw.rounded_rectangle([sc_x + 24 + shot_w + 12, by, sc_x + 16 + shot_w * 2 + 4, by + 14], radius=4, fill=(255, 255, 255, 30))

# Save image
output_path = "docs/og-image.png"
base = base.convert("RGB")
base.save(output_path, "PNG", optimize=True)
print(f"[✓] Generated 1200x630 OG image successfully at {output_path}")
