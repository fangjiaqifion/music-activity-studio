"""Export derived cow artwork and enclosed spot masks without modifying AI sources."""
import argparse
import subprocess
import tempfile
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.git').exists())
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Original PDF-compatible cow new.ai file')
args = parser.parse_args()
with tempfile.TemporaryDirectory() as directory:
    target = Path(directory) / 'cow'
    subprocess.run(['pdftoppm', '-scale-to', '1400', '-singlefile', '-png', str(args.source.resolve()), str(target)], check=True)
    artwork = Image.open(target.with_suffix('.png')).convert('RGB').crop((200, 200, 1260, 820))
artwork.save(ROOT / 'assets/cow.png')
for index, seed in enumerate([(430, 220), (597, 220), (740, 170), (510, 363), (670, 350), (640, 460)]):
    mask = Image.new('RGBA', artwork.size, (0, 0, 0, 0))
    queue, seen = deque([seed]), set()
    while queue:
        point = queue.popleft()
        if point in seen:
            continue
        seen.add(point)
        x, y = point
        if not (0 <= x < artwork.width and 0 <= y < artwork.height) or min(artwork.getpixel(point)) < 190:
            continue
        mask.putpixel(point, (255, 255, 255, 255))
        queue.extend([(x-1, y), (x+1, y), (x, y-1), (x, y+1)])
    mask.save(ROOT / f'assets/cow_spot_{index}.png')
