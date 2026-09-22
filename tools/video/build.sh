#!/usr/bin/env bash
# Dung lai video man mo dau tu video goc Dreamina.
# Dung:  tools/video/build.sh "<duong dan video goc .mp4>"
# Can:   node, ffmpeg, ffprobe (hoac dat FFMPEG / FFPROBE tro toi file thuc thi)
set -euo pipefail
SRC="${1:?Can duong dan video goc}"
FF="${FFMPEG:-ffmpeg}"
FP="${FFPROBE:-ffprobe}"
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$HERE/work"
OUT="$HERE/../../posters"
mkdir -p "$WORK/raw" "$WORK/clean" "$WORK/uniq" "$WORK/loop"

echo "1/5 tach frame"
"$FF" -v error -y -i "$SRC" "$WORK/raw/r%04d.png"

echo "2/5 xoa vat thua tung frame"
node "$HERE/clean.js" "$WORK/raw" "$WORK/clean"

echo "3/5 bo frame lap"
KEPT=$(node "$HERE/dedupe.js" "$WORK/clean" "$WORK/uniq")
DUR=$("$FP" -v error -show_entries format=duration -of csv=p=0 "$SRC")
FPS=$(node -e "console.log(($KEPT/$DUR).toFixed(2))")
echo "    $KEPT frame duy nhat / ${DUR}s = $FPS fps chuyen dong that"

ENC=(-an -c:v libx264 -profile:v high -level 4.0 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart)
# mci = bu chuyen dong. Da so voi blend: blend nhoe va ghep doi o vien soi day.
INTERP="minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1"

echo "4/5 noi suy 60fps -> posters/intro.mp4 (chay mot luot, dung cho man mo dau)"
"$FF" -v error -y -framerate "$FPS" -i "$WORK/uniq/u%04d.png" -vf "$INTERP" "${ENC[@]}" "$OUT/intro.mp4"
"$FF" -v error -y -i "$OUT/intro.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT/intro-poster.webp"

echo "5/5 ban lap mot huong -> tools/video/work/orbit-loop.mp4 (tuy chon, khong dung tren site)"
node "$HERE/crossfade.js" "$WORK/uniq" "$WORK/loop"
"$FF" -v error -y -framerate "$FPS" -i "$WORK/loop/x%04d.png" -vf "$INTERP" "${ENC[@]}" "$WORK/orbit-loop.mp4"
echo "xong"
