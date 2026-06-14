#!/usr/bin/env bash
# Cut muted loop assets from the HW Media Showreel 2025 master.
# Segments chosen from /tmp/hwm-sheet.jpg contact sheet (5s grid, 83s reel).
set -euo pipefail

SRC="/Users/georgewoodhead/Web Dev AIOS/Clients/hw-media/assets/HW Media Showreel 2025.mp4"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$OUT/posters"

# name|start|duration
SEGMENTS=(
  "hero-loop|9.5|20"     # driver tunnel -> city runner -> embrace (montage span)
  "loop-01|10|8"         # motorsport: helmet walk-out  (Norton/doc placeholder)
  "loop-02|4.2|6"        # spitfire propeller + sky     (heritage aviation)
  "loop-03|49|8"         # ferrari wheel / automotive   (brand film)
  "loop-04|30|10"        # gig red light + festival     (events)
  "loop-05|69|7"         # skier jump                   (action / promo)
)

for seg in "${SEGMENTS[@]}"; do
  IFS='|' read -r name start dur <<<"$seg"
  ffmpeg -y -v error -ss "$start" -t "$dur" -i "$SRC" -an \
    -vf "scale=1920:-2" -c:v libx264 -crf 27 -preset slow -movflags +faststart \
    "$OUT/$name.mp4"
  ffmpeg -y -v error -ss "$(echo "$start + 1" | bc)" -i "$SRC" -frames:v 1 \
    -vf "scale=1920:-2" -q:v 4 "$OUT/posters/$name.jpg"
  echo "cut $name"
done

# About-section B&W placeholder still (driver in tunnel, 12s)
ffmpeg -y -v error -ss 12 -i "$SRC" -frames:v 1 -vf "scale=1600:-2,hue=s=0" \
  "$(dirname "$OUT")/images/harry-bw.jpg" 2>/dev/null || {
    mkdir -p "$(dirname "$OUT")/images"
    ffmpeg -y -v error -ss 12 -i "$SRC" -frames:v 1 -vf "scale=1600:-2,hue=s=0" \
      "$(dirname "$OUT")/images/harry-bw.jpg"
  }

# Gold HW script logo end-card (~81.5s) — full-res frame for cropping
ffmpeg -y -v error -ss 81.5 -i "$SRC" -frames:v 1 "$(dirname "$OUT")/images/logo-endcard.png"

du -h "$OUT"/*.mp4
