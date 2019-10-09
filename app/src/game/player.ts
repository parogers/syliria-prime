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

declare const PIXI: any;

export const Health = {
    GOOD: 4,
    FAIR: 3,
    POOR: 2,
    BAD: 1,
};

export class Player
{
    private anim: Animation;
    // Player resources
    public food: number = 0;
    public water: number = 0;
    public money: number = 0;
    // Player condition
    public health: number;
    private charSprite: any;
    private shadowSprite: any;
    public sprite: any;

    constructor()
    {
        this.health = Health.GOOD;
        this.anim = new Animation([
            getTexture(Resource.CHARS, 'player2'),
            getTexture(Resource.CHARS, 'player3'),
        ], 8);
        this.sprite = new PIXI.Container();

        this.charSprite = new PIXI.Sprite();
        this.charSprite.texture = this.anim.update(0);
        this.charSprite.anchor.set(0.6, 1)

        this.shadowSprite = new PIXI.Sprite(
            getTexture(Resource.CHARS, 'shadow')
        );
        this.shadowSprite.anchor.set(0.5, 0.6)
        this.shadowSprite.scale.set(1.2, 1);

        this.sprite.addChild(this.shadowSprite);
        this.sprite.addChild(this.charSprite)
    }

    get movementSpeed() {
        return 20;
    }

    update(dt) {
        this.charSprite.texture = this.anim.update(dt);
    }
}
