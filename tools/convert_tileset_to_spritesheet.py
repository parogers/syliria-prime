#!/usr/bin/env python3

'''
Generates a spritesheet given a tileset. Note the tileset must contain a 
comment with the first line giving the tile size (eg 3x4) and the following
lines having the name of each tile as it appears on the sheet. (row order
first, with a blank line signifying the end of a row)
'''

import PIL, PIL.Image
import sys
import os
import json

def parse_size(txt):
    w, h = txt.split('x')
    return int(w), int(h)

def get_tileset_info(img):
    class Info:
        width = 0
        height = 0
        tile_rows = None

    data = img.info['Comment'].split('\n')

    info = Info()
    info.width, info.height = parse_size(data[0])
    info.tile_rows = [[]]

    for tile in data[1:]:
        if tile == '':
            info.tile_rows.append([])
        else:
            info.tile_rows[-1].append(tile)

    return info

src = sys.argv[1]

padding = 1
spacing = 1

img = PIL.Image.open(src)

tileset = get_tileset_info(img)

cols = (img.size[0] - 2*padding + spacing) // (tileset.width + spacing)
rows = (img.size[1] - 2*padding + spacing) // (tileset.height + spacing)

assert 2*padding + cols*tileset.width + (cols-1)*spacing == img.size[0]
assert 2*padding + rows*tileset.height + (rows-1)*spacing == img.size[1]

doc = {
    'frames' : {
    },
    'meta' : {
        'app': 'tileset converter',
        'version': '1.0',
        'image': os.path.basename(src),
        'format': 'RGBA8888',
        'size': {'w' : img.size[0], 'h' : img.size[1]},
        'scale': 1,
    },
}
y = padding
for row in tileset.tile_rows:
    x = padding
    for tile_name in row:
        doc['frames'][tile_name] = {
            'frame' : {
                'x' : x,
                'y' : y,
                'w' : tileset.width,
                'h' : tileset.height
            },
            'rotated' : False,
            'trimmed' : False,
            'spriteSourceSize' : {
                'x' : 0,
                'y' : 0,
                'w' : tileset.width,
                'h' : tileset.height
            },
            'sourceSize' : {
                'w' : tileset.width,
                'h' : tileset.height
            },
        }        
        x += tileset.width + spacing
    y += tileset.height + spacing

dest = os.path.splitext(src)[0] + '.json'
open(dest, 'w').write(json.dumps(doc, indent=4))
