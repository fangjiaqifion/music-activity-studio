"""Derive enclosed interior masks; preserve original PNGs and highlight bubbles."""
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
for shape in ("round", "heart", "star", "bunny"):
    image = Image.open(ROOT / "assets" / f"balloon_{shape}.png").convert("RGBA")
    width, height = image.size
    pixels = image.load()
    # Dark outline pixels are barriers even when the body itself is transparent.
    barrier = lambda x, y: pixels[x, y][3] > 60 and min(pixels[x, y][:3]) < 190
    seed = (width // 2, int(height * .62))
    queue = deque([seed])
    seen = {seed}
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0 <= nx < width and 0 <= ny < height and (nx,ny) not in seen and not barrier(nx,ny):
                seen.add((nx,ny))
                queue.append((nx,ny))
    assert all(0 < x < width-1 and 0 < y < height-1 for x,y in seen), shape
    mask = Image.new("RGBA", image.size, (255,255,255,0))
    for point in seen:
        mask.putpixel(point, (255,255,255,255))
    mask.save(ROOT / "assets" / f"balloon_{shape}_mask.png")
