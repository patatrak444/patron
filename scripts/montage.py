# Unisce i ritagli di artifacts/direzioni in una tavola 8 × 2 (controllo UX 10).
# Uso: python3 scripts/montage.py
from pathlib import Path
from PIL import Image

src = Path('artifacts/direzioni')
cells = [[Image.open(src / f'{n}-{k}.png') for k in range(8)] for n in (1, 4)]
w, h = cells[0][0].size
out = Image.new('RGB', (w * 8, h * 2), 'white')
for r, row in enumerate(cells):
    for c, im in enumerate(row):
        out.paste(im, (c * w, r * h))
out.save('artifacts/13-direzioni.png')
print('artifacts/13-direzioni.png')
