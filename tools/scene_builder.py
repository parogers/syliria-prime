#!/usr/bin/env python3

import PIL, PIL.Image
import bpy
import sys
import json
import os
import argparse
import collections

VISIBLE_LAYER = 0
INVISIBLE_LAYER = 1
TMP_FILE = '/tmp/out.png'

def build_spritesheet(sprites, dest_img_path, dest_json_path, scene_data=None):
    # Allocate a large image to contain the whole spritesheet
    padding = 1
    spacing = 1
    width = 0
    height = 0

    for sprite_name, img in sprites:
        width = max(width, img.size[0])
        height += img.size[1]

    width += 2*padding
    height += (len(sprites) - 1)*spacing + 2*padding

    # Now draw the sprites onto the sheet
    x = padding
    y = padding
    mapping = {}
    dest_img = PIL.Image.new('RGBA', (width, height))
    for sprite_name, img in sprites:
        mapping[sprite_name] = {
            'frame' : {
                'x' : x,
                'y' : y,
                'w' : img.size[0],
                'h' : img.size[1]
            },
            'rotated' : False,
            'trimmed' : False,
            'spriteSourceSize' : {
                'x' : 0,
                'y' : 0,
                'w' : img.size[0],
                'h' : img.size[1]
            },
            'sourceSize' : {
                'w' : img.size[0],
                'h' : img.size[1]
            },
        }
        dest_img.paste(img, (x, y))
        y += spacing + img.size[1]

    # Now output the spritesheet and accompanying json file
    dest_img.save(dest_img_path)

    doc = {
        'frames' : {
            sprite_name : mapping[sprite_name]
            for sprite_name, sprite_img in sprites
        },
        'meta' : {
            'app': 'build_scene.py',
            'version': '1.0',
            'image': os.path.basename(dest_img_path),
            'format': 'RGBA8888',
            'size': {'w' : width, 'h' : height},
            'scale': 1,
        },
    }

    if scene_data:
        doc['scene'] = {
            sprite_name: {
                'x' : x,
                'y' : y,
            }
            for sprite_name, (x, y) in scene_data.items()
        }

    open(dest_json_path, 'w').write(json.dumps(doc, indent=4))

def parse_args():
    try:
        i = sys.argv.index('--')
    except ValueError:
        pass
    else:
        args = sys.argv[i+1:]
        if args:
            return args[0]
    return None

def make_invisible(group):
    for obj in group:
        obj.layers[INVISIBLE_LAYER] = True
        obj.layers[VISIBLE_LAYER] = False

def make_visible(group):
    for obj in group:
        obj.layers[VISIBLE_LAYER] = True
        obj.layers[INVISIBLE_LAYER] = False

def render_scene(dest=None):
    if not dest:
        dest = TMP_FILE
    bpy.context.scene.render.resolution_x = 300
    bpy.context.scene.render.resolution_y = 300
    bpy.context.scene.render.resolution_percentage = 100
    #bpy.context.scene.frame_start = 1
    #bpy.context.scene.frame_end = 1
    #bpy.context.scene.frame_step = 1
    bpy.context.scene.render.pixel_aspect_x = 1
    bpy.context.scene.render.pixel_aspect_y = 1
    bpy.context.scene.render.use_file_extension = True
    bpy.context.scene.render.image_settings.color_mode = 'RGBA'
    bpy.context.scene.render.image_settings.file_format = 'PNG' 
    bpy.context.scene.render.filepath = dest
    #bpy.context.scene.render.image_settings.compression = 90
    bpy.ops.render.render(animation=False, write_still=True)

    img = PIL.Image.open(dest)
    img.load()
    return img

def difference_image(img1, img2):
    '''Given two images, returns the pixel difference from the first
    image to the second image, such that the returned image could be
    pasted on top of the first to produce the second.'''

    assert img1.size == img2.size

    x_min = sys.maxsize
    x_max = -sys.maxsize
    y_min = sys.maxsize
    y_max = -sys.maxsize

    diff_img = PIL.Image.new('RGBA', img1.size)
    for x in range(img1.size[0]):
        for y in range(img1.size[1]):
            col1 = img1.getpixel((x, y))
            col2 = img2.getpixel((x, y))
            if col1 != col2:
                diff_img.putpixel((x, y), col2)
                x_min = min(x_min, x)
                x_max = max(x_max, x)
                y_min = min(y_min, y)
                y_max = max(y_max, y)

    # Expand the crop box to give it a little border
    border = 1
    x_min -= border
    x_max += border
    y_min -= border
    y_max += border

    return (x_min, y_min), diff_img.crop((x_min, y_min, x_max, y_max))

def get_thing_groups():
    try:
        state_text = bpy.data.texts['states']
    except KeyError:
        # Every thing is in it's own grouping
        return {
            obj.name : [obj]
            for obj in bpy.context.scene.objects
            if obj.name.startswith('obj_')
        }

    # Otherwise build the specified groups of objects
    groups = collections.defaultdict(list)
    state = ''
    for line in state_text.as_string().split('\n'):
        if not line:
            continue

        if line.endswith(':'):
            state = line[0:-1]
        else:
            obj_name = line.strip()
            obj = bpy.data.objects[obj_name]
            groups[state].append(obj)

    return groups

if __name__ == '__main__':
    dest_json_path = parse_args()
    if not dest_json_path:
        print('you must include an output json path')
        sys.exit()

    if not dest_json_path.endswith('.json'):
        print('target output must be .json')
        sys.exit()

    # Collect the interactable things in the scene
    thing_groups = get_thing_groups()

    # Make all things invisible
    for group in thing_groups.values():
        make_invisible(group)

    # Render the scene without any things in it (background only)
    bg_img = render_scene()

    sprites = [
        ('background', bg_img),
    ]
    scene_data = {}
    for group_name, group in thing_groups.items():
        # Make the thing visible, render the scene, find out how it differs from
        # the background image and save those changes.
        make_visible(group)

        thing_img = render_scene()
        (x, y), diff_img = difference_image(bg_img, thing_img)
        sprites.append(
            (group_name, diff_img)
        )

        scene_data[group_name] = (x, y)

        make_invisible(group)

    dest_img_path = os.path.splitext(dest_json_path)[0] + '.png'
    build_spritesheet(
        sprites,
        dest_img_path,
        dest_json_path,
        scene_data=scene_data,
    )

    print('Saved spritesheet: {}'.format(dest_json_path))
