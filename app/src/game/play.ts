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

declare var PIXI: any;

const STATE_PLAYER_ENTER = 0;
const STATE_GAMEPLAY = 1;
const STATE_PLAYER_EXIT = 2;

/* The play screen is where most of the gameplay happens. It features a scrolling 
 * background and the player advancing to the right. */
export class PlayScreen
{
    private state: number;
    private _level: Level;

    constructor() {
        this.state = STATE_PLAYER_ENTER;
        this.stage = new PIXI.Container();
    }

    start()
    {
        this.player = new Player();
        this.level = new ForestLevel();

        // Example text
        let textScale = 0.5;
        let text = new FadeInText('WELCOME TO THE SYLIRIA PRIME GAME JAM DEMO! THIS IS CURRENTLY A WORK IN PROGRESS.', 175);
        text.container.scale.set(textScale);
        text.container.x = 5;
        text.container.y = 5;
        this.stage.addChild(text.container);
        this.text = text;

        this.window = new DialogWindow('THIS IS SOMETHING', ['YES', 'NO']);
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
        if (this.state === STATE_PLAYER_ENTER) {
            // Player is entering the level
            this.player.sprite.x += this.player.movementSpeed*dt;
            this.player.sprite.y = this.level.roadPosY;

            if (this.player.sprite.x > this.level.roadPosX) {
                this.player.sprite.x = this.level.roadPosX;
                this.state = STATE_GAMEPLAY;
            }
            this.player.update(dt);
        }
        else if (this.state === STATE_GAMEPLAY) {
            // Normal gameplay
            this.player.sprite.x = this.level.roadPosX;
            this.player.sprite.y = this.level.roadPosY;
            this.player.update(dt);

            this.level.update(dt);
            if (this.level.done) {
                this.state = STATE_PLAYER_EXIT;
            }
        }
        else if (this.state === STATE_PLAYER_EXIT) {
            // Player is leaving the level
            this.player.sprite.x += this.player.movementSpeed*dt;
            if (this.player.sprite.x > VIEW_WIDTH + 10)
            {
                // Next level
                // ...
            }
            this.player.update(dt);
        }
        this.text.update(dt);
        this.window.update(dt);
    }
}
