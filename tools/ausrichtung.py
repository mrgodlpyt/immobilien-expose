#!/usr/bin/env python3
"""Standort und Blickrichtung der 360°-Aufnahmen aus Messpunkten bestimmen.

Für jede Szene: Liste von (yaw im Panorama, x, y im Grundrissbild in Pixeln).
yaw liest man mit tools/yawgrid.swift ab (0 = Bildmitte, positiv nach rechts),
x/y im Grundriss (2000 px breit). Gesucht: Kamerastandort (cx, cy) und
blickrichtung b (Grad im Uhrzeigersinn ab "oben im Plan"), sodass für alle
Punkte gilt:  Peilung(Kamera -> Punkt) = b + yaw.

Aufruf: python3 tools/ausrichtung.py
"""
import math

PLAN = {"eg": (2000, 990), "ug": (2000, 1170), "dg": (2000, 918)}

# Szene: (Etage, Suchbereich (x0, y0, x1, y1), [(yaw, x, y), ...])
SZENEN = {
    # ---------------- Erdgeschoss ----------------
    "flur-eg": ("eg", (1640, 550, 1890, 880), [
        (-17, 1650, 540), (19, 1765, 540),          # Tür zur Küche (oben)
        (-109, 1622, 740), (-51, 1622, 630),        # Tür zum Bad (links)
        (166, 1760, 885), (-152, 1640, 885),        # Haustür (unten)
    ]),
    "bad": ("eg", (1335, 545, 1610, 875), [
        (54, 1555, 880), (108, 1395, 880),          # Fenster (unten)
        (-36, 1620, 630), (5, 1620, 740),           # Tür zum Flur (rechts)
    ]),
    "wohnen": ("eg", (875, 105, 1545, 870), [
        (-126, 965, 95), (-67, 1255, 95),           # Fenster Gartenseite (oben)
        (-9, 1552, 405),                            # Durchgang zur Küche
        (33, 1315, 525),                            # Ecke der Bad-Wand
        (71, 1195, 880), (104, 955, 880),           # Fenster Straßenseite (unten)
    ]),
    "kueche": ("eg", (1570, 115, 1900, 525), [
        (156, 1665, 105), (-157, 1825, 105),        # Fenster (oben)
        (-9, 1765, 535), (19, 1650, 535),           # Tür zum Flur (unten)
        (50, 1555, 465), (76, 1555, 345),           # Durchgang zum Wohnen (links)
    ]),
    "garage": ("eg", (100, 95, 800, 865), [
        (-15, 330, 85), (10, 580, 85),              # Fenster (oben)
        (144, 700, 875), (-146, 185, 875),          # Tor (unten)
    ]),
    "einfahrt": ("eg", (100, 600, 800, 985), [
        (-110, 185, 875), (103, 700, 875),          # Torpfosten
        (-11, 330, 85), (4, 580, 85),               # Fenster hinten
    ]),
    # ---------------- Untergeschoss ----------------
    "raum-garten": ("ug", (110, 285, 800, 675), [   # Raum 2
        (56, 265, 285), (76, 380, 285),             # Terrassentür
        (82, 385, 285), (131, 620, 285),            # Fenster
        (-140, 710, 685),                           # Durchgang zum Vorraum
    ]),
    "raum-kochnische": ("ug", (880, 300, 1295, 670), [  # Raum 3
        (-123, 965, 290), (-60, 1210, 290),         # Fenster
        (50, 1265, 690), (69, 1150, 690),           # Tür zum Flur
        (143, 870, 650), (171, 870, 540),           # Tür zu Raum 2
    ]),
    "raum-terrasse": ("ug", (1315, 310, 1890, 690), [   # Raum 4
        (63, 1480, 300), (86, 1590, 300),           # Terrassentür
        (93, 1600, 300), (142, 1840, 300),          # Fenster
        (-58, 1505, 700), (-41, 1395, 700),         # Tür zum Flur
    ]),
    "raum-1": ("ug", (100, 720, 570, 1020), [
        (-25, 575, 715), (36, 575, 1025), (144, 95, 1025), (-146, 95, 715),   # Raumecken
        (-14, 575, 820), (11, 575, 940),            # Tür zum Vorraum
        (164, 95, 890), (-165, 95, 760),            # Fenster
    ]),
    "vorraum": ("ug", (590, 730, 790, 1025), [
        (-120, 580, 940), (-55, 580, 820),          # Tür zu Raum 1
        (-14, 650, 705), (42, 770, 705),            # Tür zu Raum 2
        (-88, 95, 825),                             # Fenster von Raum 1 (durch die Tür)
    ]),
    "keller": ("ug", (1150, 875, 1365, 1045), [
        (-22, 1175, 865), (43, 1290, 865),          # Tür
        (119, 1330, 1055), (168, 1200, 1055),       # Fenster
    ]),
    "terrasse": ("ug", (900, 0, 1990, 235), [
        (-158, 1840, 240), (-141, 1590, 240), (-123, 1480, 240),   # Raum 4: Fenster, Tür
        (-48, 1210, 245), (-24, 965, 245),          # Fenster Raum 3
    ]),
    "gartenseite": ("ug", (100, 0, 900, 235), [
        (14, 620, 240), (95, 385, 240),             # Fenster Raum 2
        (108, 380, 240), (151, 265, 240),           # Terrassentür Raum 2
    ]),
    # ---------------- Dachgeschoss ----------------
    "dg-flur": ("dg", (1585, 230, 1900, 720), [
        (-17, 1912, 400), (17, 1912, 550),          # Fenster (rechts)
        (174, 1568, 345),                           # Tür zum Zimmer
    ]),
    "dg-zimmer": ("dg", (870, 215, 1555, 710), [
        (-26, 855, 535), (13, 855, 380),            # Fenster (links)
        (178, 1565, 345),                           # Tür zum Flur
    ]),
}


def wrap(a):
    return (a + 180) % 360 - 180


def bearing(cx, cy, x, y):
    """Peilung im Uhrzeigersinn ab 'oben' (y wächst nach unten)."""
    return math.degrees(math.atan2(x - cx, -(y - cy)))


def fit(pts, box):
    best = None
    x0, y0, x1, y1 = box
    step = 8
    cand = [(x, y) for x in range(x0, x1 + 1, step) for y in range(y0, y1 + 1, step)]
    for refine in range(3):
        for cx, cy in cand:
            # optimales b für festen Standort: Kreismittel der Differenzen
            s = c = 0.0
            for yaw, x, y in pts:
                d = math.radians(bearing(cx, cy, x, y) - yaw)
                s += math.sin(d); c += math.cos(d)
            b = math.degrees(math.atan2(s, c))
            err = sum(wrap(bearing(cx, cy, x, y) - yaw - b) ** 2 for yaw, x, y in pts)
            if best is None or err < best[0]:
                best = (err, cx, cy, b)
        _, bx, by, _ = best
        step = max(1, step // 3)
        cand = [(bx + i * step, by + j * step) for i in range(-4, 5) for j in range(-4, 5)
                if x0 <= bx + i * step <= x1 and y0 <= by + j * step <= y1]
    return best


if __name__ == "__main__":
    for name, (floor, box, pts) in SZENEN.items():
        err, cx, cy, b = fit(pts, box)
        W, H = PLAN[floor]
        rms = math.sqrt(err / len(pts))
        res = ", ".join(f"{wrap(bearing(cx, cy, x, y) - yaw - b):+.0f}" for yaw, x, y in pts)
        print(f"{name:16s} {floor}  x: {cx / W * 100:5.1f}, y: {cy / H * 100:5.1f}, blickrichtung: {b % 360:5.1f}"
              f"   (RMS {rms:4.1f}°; Abweichungen {res})")
