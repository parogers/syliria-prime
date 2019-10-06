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

import { Resource, getTexture, VIEW_HEIGHT } from './resource';
import { renderText } from './text';
import { Health } from './player';

declare const PIXI: any;

/* Maps a health state onto the corresponding heart texture
 * (eg good health returns a red heart) 
 */
function getTextureFromHealth(health)
{
    let name = '';

    if (health === Health.GOOD) {
        name = 'red-heart';

    } else if (health === Health.FAIR) {
        name = 'orange-heart';

    } else if (health === Health.POOR) {
        name = 'yellow-heart';

    } else if (health === Health.BAD) {
        name = 'gray-heart';

    }
    return getTexture(Resource.ITEMS, name);
}

class HealthSlot
{
    public container: any;
    private _condition: number;

    constructor()
    {
        this.container = new PIXI.Container();
        this.holderSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'holder2')
        );
        this.container.addChild(this.holderSprite);

        this.heartSprite = new PIXI.Sprite();
        this.heartSprite.anchor.set(0.5);
        this.heartSprite.position.set(
            this.holderSprite.texture.width/2,
            this.holderSprite.texture.height/2
        );
        this.container.addChild(this.heartSprite);
    }

    set condition(value)
    {
        if (this._condition !== value)
        {
            this._condition = value;
            this.heartSprite.texture = getTextureFromHealth(value);
        }
    }

    update(dt) {
    }
}

/* Displays a single item along with a quantity value */
class ItemSlot
{
    public container: any;
    private _quantity: number = null;
    private pulseTimer: number;
    private pulseTimeout: number;

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
            // Have the item "pulse" in response to the change in quantity
            this.pulseTimer = 0;
            this.pulseTimeout = 0.15;
        }
    }

    update(dt)
    {
        if (this.pulseTimer < this.pulseTimeout)
        {
            this.pulseTimer += dt;
            if (this.pulseTimer >= this.pulseTimeout)
            {
                // Done pulsing
                this.itemSprite.scale.set(1);
            }
            else
            {
                // Scale up a little according to a sine curve
                let scale = 1 + 0.15*Math.sin(
                    Math.PI * this.pulseTimer / this.pulseTimeout
                );
                this.itemSprite.scale.set(scale);
            }
        }
    }
}

class ProgressBar
{
    public container: any;
    public totalDistance: number = 100;
    public distance: number = 0;
    private travelStartX: number = 7;
    private travelLength: number = 86;

    constructor()
    {
        this.container = new PIXI.Container();
        this.backgroundSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'progress')
        );
        this.container.addChild(this.backgroundSprite);

        this.markerSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'mapmarker')
        );
        this.markerSprite.anchor.set(0.5);
        this.markerSprite.y = this.backgroundSprite.texture.height/2;
        this.container.addChild(this.markerSprite);
    }

    update(dt)
    {
        let pos = this.distance/this.totalDistance;
        pos = Math.min(pos, 1);
        pos = Math.max(pos, 0);

        this.markerSprite.x = (
            this.travelStartX +
            this.travelLength*pos
        );
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
    private progress: any;
    public level: any = null;

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
        this.health = new HealthSlot();
        this.progress = new ProgressBar();

        this.food.container.position.set(1, 1);
        this.water.container.position.set(14, 1);
        this.money.container.position.set(27, 1);
        this.health.container.position.set(40, 1);
        this.progress.container.position.set(0, VIEW_HEIGHT - 9);

        this.container.addChild(this.food.container);
        this.container.addChild(this.water.container);
        this.container.addChild(this.money.container);
        this.container.addChild(this.health.container);
        this.container.addChild(this.progress.container);
    }

    update(dt)
    {
        if (this.player) {
            this.food.quantity = this.player.food;
            this.water.quantity = this.player.water;
            this.money.quantity = this.player.money;
            this.health.condition = this.player.health;
            if (this.level) {
                this.progress.totalDistance = this.level.totalDistance;
                this.progress.distance = this.level.distance;
            }
        }
        this.food.update(dt);
        this.water.update(dt);
        this.money.update(dt);
        this.health.update(dt);
        this.progress.update(dt);
    }
}

