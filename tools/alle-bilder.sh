#!/bin/bash
# Erzeugt alle Bilder der Website neu: Panoramen aus den DNGs entwickeln, daraus Vorschauen,
# Galeriefotos (mit Kleinbild) und das Titelbild.
#
#   tools/alle-bilder.sh "<Ordner mit den DNGs>" [Arbeitsordner] [Aufnahme …]
#
# - Der DNG-Ordner ist der vom USB-Stick („Ben Bilder Raumbach“). Die DNGs werden zuerst in den
#   Arbeitsordner kopiert; sobald „Kopieren fertig“ erscheint, kann der Stick wieder ab.
# - Mit "-" als DNG-Ordner wird nichts entwickelt, nur Vorschauen/Galerie/Titelbild aus den
#   vorhandenen Panoramen neu erzeugt.
# - Ohne Aufnahme-Liste werden alle 21 verarbeitet.
set -euo pipefail

SRC="${1:?Ordner mit den DNG-Dateien angeben (oder - für: nur aus vorhandenen Panoramen)}"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${2:-${TMPDIR:-/tmp}/expose-bilder}"
shift $(( $# > 2 ? 2 : $# ))

# Aufnahme:yaw:pitch:Bildwinkel für das Galeriefoto
SPECS="125353:108:-5:100 125816:-80:-4:100 130043:100:-3:100 130222:18:-8:100 130329:36:-3:105
130607:-108:-3:100 130719:144:-3:95 130859:60:-3:105 131119:100:-3:95 131302:-90:-3:95
131600:90:-3:95 131847:-54:0:100 132101:80:-3:95 132200:-72:-3:95 132642:-30:2:110
132741:25:3:110 133314:108:-3:95 134600:0:-3:95 134709:-90:-3:95 135222:-126:-3:100
135617:126:-2:100"
NUR=" $* "

PANO_BREITE=5120
PANO_QUALITAET=0.80

mkdir -p "$WORK/bin" "$WORK/dng"
for t in develop reframe; do
  if [ ! -x "$WORK/bin/$t" ] || [ "$REPO/tools/$t.swift" -nt "$WORK/bin/$t" ]; then
    echo "baue $t …"; swiftc -O "$REPO/tools/$t.swift" -o "$WORK/bin/$t"
  fi
done

gewaehlt() { [ "$NUR" = "  " ] || [[ "$NUR" == *" $1 "* ]]; }

if [ "$SRC" != "-" ]; then
  for spec in $SPECS; do
    id="${spec%%:*}"; gewaehlt "$id" || continue
    [ -s "$WORK/dng/$id.dng" ] && continue
    # Panorama-DNG = die Datei mit „(n)“ im Namen; die ohne Klammer ist das Flachbild
    f="$(ls "$SRC"/IMG_*_"$id"_*\(*\).dng 2>/dev/null | head -1 || true)"
    [ -n "$f" ] || { echo "FEHLT: kein Panorama-DNG für $id in $SRC" >&2; exit 1; }
    echo "kopiere $id"; cp "$f" "$WORK/dng/$id.part" && mv "$WORK/dng/$id.part" "$WORK/dng/$id.dng"
  done
  echo "Kopieren fertig – der Stick wird nicht mehr gebraucht."
  for spec in $SPECS; do
    id="${spec%%:*}"; gewaehlt "$id" || continue
    echo "== entwickle $id"
    "$WORK/bin/develop" "$WORK/dng/$id.dng" "$REPO/assets/panoramas/$id.jpg" "$PANO_BREITE" "$PANO_QUALITAET" 2>/dev/null
  done
fi

for spec in $SPECS; do
  IFS=: read -r id yaw pitch fov <<< "$spec"; gewaehlt "$id" || continue
  p="$REPO/assets/panoramas/$id.jpg"
  sips -Z 1024 -s format jpeg -s formatOptions 70 "$p" --out "$REPO/assets/panoramas/$id-vorschau.jpg" >/dev/null
  "$WORK/bin/reframe" "$p" "$REPO/assets/images/$id.jpg" "$yaw" "$pitch" "$fov" 1800 1200 0.8 >/dev/null
  sips -Z 800 -s format jpeg -s formatOptions 74 "$REPO/assets/images/$id.jpg" --out "$REPO/assets/images/$id-klein.jpg" >/dev/null
done

# Titelbild aus dem Terrassen-Panorama
if gewaehlt 131847; then
  "$WORK/bin/reframe" "$REPO/assets/panoramas/131847.jpg" "$REPO/assets/images/hero.jpg" -35 3 110 2400 1350 0.8 >/dev/null
fi
echo "fertig."
