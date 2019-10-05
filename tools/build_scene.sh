#!/bin/bash

SRC=$1
DEST=$2

usage()
{
    echo "usage: $0 src.blend dest.json"
    exit
}

if [ "$SRC" = "" ]; then
    usage
fi

if [ "$DEST" = "" ]; then
    usage
fi

blender -b $SRC -P ./tools/scene_builder.py -- $DEST

