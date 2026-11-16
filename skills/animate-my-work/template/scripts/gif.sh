#!/usr/bin/env bash
# Frames (PNG, in order) -> looping GIF with a fresh palette per frame (a global palette wrecks colours).
# usage: scripts/gif.sh <frames_dir> <out.gif> [seconds_per_frame=1.1] [width=1200]
set -e; D="$1"; OUT="$2"; S="${3:-1.1}"; W="${4:-1200}"; L="$D/_list.txt"; : > "$L"
for f in $(ls "$D"/*.png | sort); do echo "file '$(realpath "$f")'" >> "$L"; echo "duration $S" >> "$L"; done
echo "file '$(realpath "$(ls "$D"/*.png | sort | tail -1)")'" >> "$L"
ffmpeg -v error -y -f concat -safe 0 -i "$L" -vf "scale=$W:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=256:stats_mode=single[p];[b][p]paletteuse=new=1:dither=sierra2_4a" -fps_mode vfr -loop 0 "$OUT"
ls -la "$OUT"; echo "X limit: 15 MB"
