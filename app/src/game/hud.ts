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
import { renderText } from './text';

declare const PIXI: any;

/* Displays a single item along with a quantity value */
class ItemSlot
{
    public container: any;
    private _quantity: number = null;

    constructor(itemTexture)
    {
        this.container = new PIXI.Container();
        this.holderSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'holder')
        );
        this.container.addChild(this.holderSprite);

        this.itemSprite = new PIXI.Sprite(itemTexture);
        this.itemSprite.anchor.set(0.5);
        this.itemSprite.position.set(
            this.holderSprite.texture.width/2, 5.5
        );
        this.container.addChild(this.itemSprite);

        this.textContainer = new PIXI.Container();
        this.textContainer.x = 3;
        this.textContainer.y = 11.5;
        this.container.addChild(this.textContainer);

        this.quantity = 123;
    }

    // Update the quantity displayed for this item
    set quantity(value)
    {
        if (this._quantity !== value)
        {
            this._quantity = value;
            this.textContainer.removeChildren();
            this.textContainer.addChild(
                renderText(
                    '' + value, -1,
                    { color: 0 }
                )
            );
        }
    }

    update(dt) {
    }
}

/* The "heads-up display" GUI that shows basic game state and gives
 * the player something to click on. */
export class HUD
{
    public container: any;
    private food: any;
    private water: any;
    private money: any;
    private health: any;
    private player: any;

    constructor(player)
    {
        this.player = player;
        this.container = new PIXI.Container();
        this.food = new ItemSlot(
            getTexture(Resource.ITEMS, 'radish')
        );
        this.water = new ItemSlot(
            getTexture(Resource.ITEMS, 'waterdrop')
        );
        this.money = new ItemSlot(
            getTexture(Resource.ITEMS, 'coin')
        );

        this.food.container.x = 0;
        this.water.container.x = 13;
        this.money.container.x = 26;

        this.container.addChild(this.food.container);
        this.container.addChild(this.water.container);
        this.container.addChild(this.money.container);
    }

    update(dt)
    {
        if (this.player) {
            this.food.quantity = this.player.food;
            this.water.quantity = this.player.water;
            this.money.quantity = this.player.money;
        }
    }
}

