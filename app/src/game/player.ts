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
import { Animation } from './anim';

export class Player
{
    // Player resources:
    private food: number;
    private water: number;
    private money: number;
    private firstAidKits: number;
    private anim: Animation;

    constructor()
    {
        this.anim = new Animation([
            getTexture(Resource.CHARS, 'player2'),
            getTexture(Resource.CHARS, 'player3'),
        ], 8);
        this.sprite = new PIXI.Container();

        this.charSprite = new PIXI.Sprite();
        this.charSprite.texture = this.anim.update(0);
        this.charSprite.anchor.set(0.5, 1)

        this.sprite.addChild(this.charSprite)
    }

    update(dt) {
        this.charSprite.texture = this.anim.update(dt);
    }
}
