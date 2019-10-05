/* Syliria Prime
 * Copyright (C) 2019  Peter Rogers (peter.rogers@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * See LICENSE.txt for the full text of the license.
 */

import { Resource, getTexture } from './resource';

declare var PIXI: any;

/* 
 * Renders a block of text using the given font, under the maximum width 
 * provided. This returns a PIXI container holding the rendered text as
 * a collection of sprites. 
 */
export function renderText(text, font, maxWidth)
{
    let vspacing = 2, hspacing = 1;
    let container = new PIXI.Container();
    let x = 0;
    let y = 0;
    let word = [];
    let wordWidth = 0;
    let wordHeight = 0;

    text += ' ';
    for (let n = 0; n < text.length; n++)
    {
        let char = text.charAt(n);
        let texture = getTexture(font, char);

        if (char === ' ')
        {
            // Emit the word
            if (x + wordWidth > maxWidth) {
                x = 0;
                y += vspacing + wordHeight;
            }
            for (let other of word) {
                let sprite = new PIXI.Sprite(other);
                //sprite.tint = 0xFF0000;
                sprite.x = x;
                sprite.y = y;
                x += other.width + hspacing;
                container.addChild(sprite);
            }
            word = [];
            wordWidth = 0;
            wordHeight = 0;
            x += texture.width;

        } else {
            word.push(texture)
            wordWidth += texture.width + hspacing;
            wordHeight = texture.height;
        }
    }

    return container;
}
