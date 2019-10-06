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

import { Resource, getTexture, VIEW_WIDTH } from './resource';
import { FadeInText } from './text';
import { Player } from './player';
import { randint, choice } from './random';
import { ForestLevel, SwampLevel, DesertLevel } from './level';
import { DialogWindow } from './dialog';
import { renderText } from './text';

declare var PIXI: any;

class ItemHolder
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
            let display = '--';
            if (value > 0) display = '' + value;

            this._quantity = value;
            this.textContainer.removeChildren();
            this.textContainer.addChild(
                renderText(
                    display, -1,
                    { color: 0 }
                )
            );
        }
    }

    update(dt) {
    }
}

class HUD
{
    public container: any;
    private food: any;
    private water: any;
    private health: any;
    private player: any;

    constructor(player)
    {
        this.player = player;
        this.container = new PIXI.Container();
        this.food = new ItemHolder(
            getTexture(Resource.ITEMS, 'radish')
        );
        this.water = new ItemHolder(
            getTexture(Resource.ITEMS, 'waterdrop')
        );

        this.food.container.x = 0;
        this.food.container.y = 0;

        this.water.container.x = 14;

        this.container.addChild(this.food.container);
        this.container.addChild(this.water.container);
    }

    update(dt)
    {
        if (this.player) {
            this.food.quantity = this.player.food;
            this.water.quantity = this.player.water;
        }
    }
}

/* The play screen is where most of the gameplay happens. It features a scrolling 
 * background and the player advancing to the right. */
export class PlayScreen
{
    private STATE_INFO_DUMP = 0;
    private STATE_PLAYER_ENTER = 1;
    private STATE_GAMEPLAY = 2;
    private STATE_PLAYER_EXIT = 3;

    private state: number;
    private _level: Level;
    private hud: any;

    constructor() {
        this.state = this.STATE_INFO_DUMP;
        this.stage = new PIXI.Container();
    }

    start()
    {
        this.player = new Player();
        this.level = new ForestLevel();

        this.hud = new HUD();
        this.hud.container.x = 2;
        this.hud.container.y = 1;
        this.hud.player = this.player;
        this.stage.addChild(this.hud.container);

        /*// Example text
        let textScale = 0.5;
        let text = new FadeInText('WELCOME TO THE SYLIRIA PRIME GAME JAM DEMO! THIS IS CURRENTLY A WORK IN PROGRESS.', 80);
        text.container.scale.set(textScale);
        text.container.x = 5;
        text.container.y = 5;
        this.stage.addChild(text.container);
        this.text = text;*/

        this.window = new DialogWindow();
        this.window.showContent('THIS IS THE INTRODUCTORY TEXT. THIS IS WHERE THE PLOT IS EXPLAINED.', ['OK']);
        this.window.on('selected', response => {
            this.window.close();
            this.window = null;
            this.state = this.STATE_PLAYER_ENTER;
        });
        this.stage.addChild(this.window.container);

        /*
        let sprite = new PIXI.Sprite(
            getTexture(Resource.CHARS, 'player1')
        );
        sprite.x = 10;
        sprite.y = 10;
        this.stage.addChild(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('pointerdown', () => {
            console.log('click');
        });*/

    }

    set level(level)
    {
        this._level = level;
        this.stage.removeChildren();
        this.stage.addChild(this._level.stage);
        // The player starts off screen
        this.player.sprite.x = -10;
        this._level.player = this.player;
        this._level.stage.addChild(this.player.sprite);
    }

    get level() {
        return this._level;
    }

    update(dt)
    {
        if (this.state === this.STATE_PLAYER_ENTER) {
            // Player is entering the level
            this.player.sprite.x += this.player.movementSpeed*dt;
            this.player.sprite.y = this.level.roadPosY;

            if (this.player.sprite.x > this.level.roadPosX) {
                this.player.sprite.x = this.level.roadPosX;
                this.state = this.STATE_GAMEPLAY;
            }
            this.player.update(dt);
        }
        else if (this.state === this.STATE_GAMEPLAY) {
            // Normal gameplay
            this.player.sprite.x = this.level.roadPosX;
            this.player.sprite.y = this.level.roadPosY;
            this.player.update(dt);
            //this.text.update(dt);

            this.level.update(dt);
            if (this.level.done) {
                this.state = this.STATE_PLAYER_EXIT;
            }
        }
        else if (this.state === this.STATE_PLAYER_EXIT) {
            // Player is leaving the level
            this.player.sprite.x += this.player.movementSpeed*dt;
            if (this.player.sprite.x > VIEW_WIDTH + 10)
            {
                // Next level
                // ...
            }
            this.player.update(dt);
        }
        if (this.window) this.window.update(dt);
        this.hud.update(dt);
    }
}
