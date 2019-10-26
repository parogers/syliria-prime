#!/usr/bin/env python3

import PIL, PIL.Image
import sys
import os
import json

ALPHA = 3

padding = 1
spacing = 1

def parse_size(txt):
    w, h = txt.split('x')
    return int(w), int(h)

def is_col_blank(img, x, y1, y2):
    assert y1 < y2
    assert x < img.size[0], (x, img.size[0])

    return all(
        img.getpixel((x, y))[ALPHA] == 0
        for y in range(y1, y2+1)
    )

def get_tileset_info(img):
    class Info:
        # The height is fixed over all character tiles
        height = 0
        tile_rows = None

    def is_row_blank(img, y):
        return all(
            img.getpixel((x, y))[ALPHA] == 0
            for x in range(img.size[0])
        )

    info = Info()
    info.tile_rows = [[]]

    # Calculate the tile height by looking at the pixel spacing between
    # blank rows in the image.
    assert is_row_blank(img, 0)
    for y in range(1, img.size[1]):
        if is_row_blank(img, y):
            info.height = y-1
            break

    # TODO - verify on subsequent rows

    data = img.info['Comment'].split('\n')
    for tile in data:
        if tile == '':
            info.tile_rows.append([])
        else:
            info.tile_rows[-1].append(tile)

    return info

src = sys.argv[1]

img = PIL.Image.open(src)

tileset = get_tileset_info(img)

# cols = (img.size[0] - 2*padding + spacing) // (tileset.width + spacing)
# rows = (img.size[1] - 2*padding + spacing) // (tileset.height + spacing)

# assert 2*padding + cols*tileset.width + (cols-1)*spacing == img.size[0]
# assert 2*padding + rows*tileset.height + (rows-1)*spacing == img.size[1]

def calc_char_width(img, x_start, y_start, tile_height):
    '''Calculates the width of the character starting at the given position'''

    assert tile_height > 0

    width = 0
    for x in range(x_start, img.size[0]):
        if is_col_blank(img, x, y_start, y_start+tile_height-1):
            return width
        width += 1
    return 0

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
        # Calculate the width of the next tile
        if tile_name == ' ':
            tile_width = 4
        else:
            # Skip over blank columns to find the start of the next letter
            while is_col_blank(img, x, y, y + tileset.height-1):
                x += 1

            tile_width = calc_char_width(img, x, y, tileset.height)

        assert tile_width > 0

        doc['frames'][tile_name] = {
            'frame' : {
                'x' : x,
                'y' : y,
                'w' : tile_width,
                'h' : tileset.height
            },
            'rotated' : False,
            'trimmed' : False,
            'spriteSourceSize' : {
                'x' : 0,
                'y' : 0,
                'w' : tile_width,
                'h' : tileset.height
            },
            'sourceSize' : {
                'w' : tile_width,
                'h' : tileset.height
            },
        }        
        x += tile_width + spacing
    y += tileset.height + spacing

dest = os.path.splitext(src)[0] + '.json'
open(dest, 'w').write(json.dumps(doc, indent=4))
