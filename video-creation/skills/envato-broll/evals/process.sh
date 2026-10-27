# process.sh <id>: trim (ss, head handle, slot dur + 1s tail), 1080p H.264, no audio -> assets/vid/BR-<id>-<slug>.mp4
cd /c/Users/mnede/Documents/Claude/social-media
W=video-creation/skills/envato-broll/evals; P=video-creation/longform-edited/media/evals
id=$1
slug=$(awk -F'\t' -v i=$id '$1==i{print $4}' $W/picks.tsv)
read ss head dur < <(awk -F'\t' -v i=$id '$1==i{print $2, $3, $4}' $W/trims.tsv)
src=$(ls $P/raw/envato/BR-$id-orig.* 2>/dev/null | grep -v '\.zip$' | head -1)
[ -z "$src" ] && { echo "BR-$id: no source"; exit 1; }
sdur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
len=$(python -c "print(round(min($head+$dur+1.0, $sdur-$ss), 3))")
out=$P/assets/vid/BR-$id-$slug.mp4
ffmpeg -v error -y -ss $ss -i "$src" -t $len -vf "scale=-2:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset medium -crf 18 -an -movflags +faststart "$out" && \
echo "BR-$id ok src=$(basename "$src") ss=$ss len=$len -> $(basename $out)"
