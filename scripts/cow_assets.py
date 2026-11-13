"""Export cow activity regions and exact licensed glyph bounds; leave AI sources intact."""
import argparse
import json
import math
import subprocess
import tempfile
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = next(p for p in Path(__file__).resolve().parents if (p / '.git').exists())
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', nargs='?', type=Path, help='Optional original PDF-compatible cow new.ai')
args = parser.parse_args()
if args.source:
    with tempfile.TemporaryDirectory() as directory:
        target = Path(directory) / 'cow'
        subprocess.run(['pdftoppm', '-scale-to', '1400', '-singlefile', '-png', str(args.source.resolve()), str(target)], check=True)
        artwork = Image.open(target.with_suffix('.png')).convert('RGB').crop((200, 200, 1260, 820))
    artwork.save(ROOT / 'assets/cow.png')
artwork = Image.open(ROOT / 'assets/cow.png').convert('RGB')
# All fifteen original enclosed white patches, including the back and four legs.
seeds = [(430,220),(597,220),(740,170),(510,363),(670,350),(640,460),
         (400,100),(610,50),(850,90),(785,335),(900,395),
         (355,480),(500,480),(710,540),(820,525)]
# Five new outlined patches in otherwise blank forehead, muzzle, body, and flank.
draw = ImageDraw.Draw(artwork)
for index, (cx, cy, rx, ry) in enumerate([(195,155,30,28),(151,329,36,30),(320,407,35,23),(602,126,36,25),(862,226,31,33)]):
    points=[]
    for step in range(121):
        angle=step*math.tau/120
        wobble=1+0.08*math.sin(3*angle+index)+0.05*math.cos(5*angle)
        points.append((cx+rx*math.cos(angle)*wobble,cy+ry*math.sin(angle)*wobble))
    draw.polygon(points,fill='white')
    draw.line(points,fill=(36,32,30),width=3,joint='curve')
    seeds.append((cx,cy))
artwork.save(ROOT / 'assets/cow_activity.png')
regions=[]
for index, seed in enumerate(seeds):
    mask=Image.new('RGBA',artwork.size,(0,0,0,0)); queue,seen=deque([seed]),set(); filled=[]
    while queue:
        point=queue.popleft()
        if point in seen: continue
        seen.add(point); x,y=point
        if not (0<=x<artwork.width and 0<=y<artwork.height) or min(artwork.getpixel(point))<190: continue
        filled.append(point); mask.putpixel(point,(255,255,255,255))
        queue.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
    if not 300<len(filled)<20000: raise ValueError(f'Region {index} is not enclosed: {len(filled)}')
    mask.save(ROOT / f'assets/cow_spot_{index}.png')
    # Fit an ink slot fully inside the patch, as near its area centroid as possible.
    alpha=np.asarray(mask)[:,:,3]>0
    integral=np.pad(alpha.astype(int),((1,0),(1,0))).cumsum(0).cumsum(1)
    mean=np.mean(filled,axis=0); best=None
    for x,y in [min(filled, key=lambda point: math.hypot(point[0]-mean[0], point[1]-mean[1]))]:
        for height in range(60,11,-2):
            width=round(height*.8); x0=x-width//2; y0=y-height//2; x1=x0+width; y1=y0+height
            if x0<0 or y0<0 or x1>=artwork.width or y1>=artwork.height: continue
            area=integral[y1,x1]-integral[y0,x1]-integral[y1,x0]+integral[y0,x0]
            if area==width*height:
                score=height-0.17*math.hypot(x-mean[0],y-mean[1])
                if best is None or score>best[0]: best=(score,x,y,width*.82,height*.82)
                break
    if best is None: raise ValueError(f'No safe glyph slot in {index}')
    _,x,y,width,height=best
    regions.append(dict(x=x,y=y,width=round(width,2),height=round(height,2)))
font=TTFont(ROOT/'assets/BravuraText.woff2'); glyphs=font.getGlyphSet(); clefs={}
for clef,code in [('treble',0xE050),('bass',0xE062)]:
    glyph=glyphs[font.getBestCmap()[code]]; path=SVGPathPen(glyphs); glyph.draw(path)
    bounds=BoundsPen(glyphs); glyph.draw(bounds); x0,y0,x1,y1=bounds.bounds
    clefs[clef]=dict(path=path.getCommands(),viewBox=f'{x0} {-y1} {x1-x0} {y1-y0}')
(ROOT/'src/cow_regions.mjs').write_text('// Derived by scripts/cow_assets.py from original cow patches and licensed Bravura glyphs.\nexport const cowRegions = '+json.dumps(regions)+';\nexport const clefGlyphs = '+json.dumps(clefs)+';\n')
print(f'Exported {len(regions)} enclosed patches with safe centered glyph slots.')
