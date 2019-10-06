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

import { choice } from './random';

declare var PIXI: any;

export class Scenery
{
    public container: any;
    private sprites: any;
    private textureFunc: any;
    private textures: any;
    private offsetFunc: any;
    private tightFit: any;

    constructor(textures, args)
    {
        this.textures = textures;
        this.offsetFunc = args && args.offsetFunc || null;
        this.container = new PIXI.Container();
        this.sprites = [];
        this.tightFit = args && args.tightFit || false;
        let count = args && args.count || 1;
        let anchor = args && args.anchor || [0, 0];

        for (let n = 0; n < count; n++)
        {
            let sprite = new PIXI.Sprite();
            sprite.anchor.set(anchor[0], anchor[1]);
            this.sprites.push(sprite);
            this.container.addChild(sprite);
        }
        for (let n = 0; n < count; n++) {
            this.scroll(0);
        }
    }

    scroll(amount)
    {
        for (let sprite of this.sprites) {
            sprite.x += amount;
        }
        let first = this.sprites[0];
        let last = this.sprites[this.sprites.length-1];
        if (!first.texture || first.x + first.texture.width <= 0)
        {
            // Move the first sprite off the screen, and after the last sprite
            first.texture = choice(this.textures);
            this.sprites.shift();

            first.x = last.x + last.width;
            if (!this.tightFit) {
                first.x = Math.max(first.x, 100);
            }
            
            if (this.offsetFunc)
            {
                let offset = this.offsetFunc();
                first.x += offset.x;
                first.y = offset.y;
            }
            this.sprites.push(first);
        }
    }
}

