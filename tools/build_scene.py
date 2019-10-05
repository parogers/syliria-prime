#!/usr/bin/env python3

import PIL, PIL.Image
import bpy
import sys

VISIBLE_LAYER = 0
INVISIBLE_LAYER = 1
TMP_FILE = '/tmp/out.png'

def make_invisible(obj):
    obj.layers[INVISIBLE_LAYER] = True
    obj.layers[VISIBLE_LAYER] = False

def make_visible(obj):
    obj.layers[VISIBLE_LAYER] = True
    obj.layers[INVISIBLE_LAYER] = False

def render_scene(dest=None):
    if not dest:
        dest = TMP_FILE
    bpy.context.scene.render.resolution_x = 100
    bpy.context.scene.render.resolution_y = 100
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

# Collect the interactable things in the scene
things = []
for obj in bpy.context.scene.objects:
    if obj.name.startswith('obj_'):
        things.append(obj)

# Make all things invisible
for obj in things:
    make_invisible(obj)

# Render the scene without any things in it (background only)
bg_img = render_scene()

for count, obj in enumerate(things):
    # Make the thing visible, render the scene, find out how it differs from
    # the background image and save those changes.
    make_visible(obj)

    thing_img = render_scene()
    (x, y), diff_img = difference_image(bg_img, thing_img)

    make_invisible(obj)

