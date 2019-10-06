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
import { FadeInText } from './text';
import { Player } from './player';
import { randint, choice } from './random';
import { Scenery } from './scenery';

declare var PIXI: any;

/* The play screen is where most of the gameplay happens. It features a scrolling 
 * background and the player advancing to the right. */
export class PlayScreen
{
    public stage: any;
    public scenery: any;
    private trees: any;
    private bushes: any;
    private player: any;
    private roadPosX: number = 10;
    private roadPosY: number = 65;

    constructor() {
    }

    start()
    {
        this.stage = new PIXI.Container();

        this.scenery = new Scenery(
            [
                getTexture(Resource.FOREST),
            ],
            {
                count: 2,
                tightFit: true,
            }
        );

        this.trees = new Scenery(
            [
                getTexture(Resource.VEGETATION, 'tree1.png'),
                getTexture(Resource.VEGETATION, 'tree2.png'),
                getTexture(Resource.VEGETATION, 'tree3.png'),
                getTexture(Resource.VEGETATION, 'tree4.png'),
            ],
            {
                count: 10,
                anchor: [0.5, 1],
                offsetFunc: function() {
                    return {
                        x: randint(-5, 5),
                        y: randint(0, -1),
                    }
                },
            }
        );

        this.bushes = new Scenery(
            [
                getTexture(Resource.VEGETATION, 'bush1.png'),
                getTexture(Resource.VEGETATION, 'bush2.png'),
                getTexture(Resource.VEGETATION, 'bush3.png'),
            ],
            {
                count: 20,
                anchor: [0.5, 1],
                offsetFunc: function() {
                    return {
                        x: randint(-5, 5),
                        y: randint(-2, 2),
                    }
                },
            }
        );

        this.stage.addChild(this.scenery.container);
        this.stage.addChild(this.trees.container);
        this.stage.addChild(this.bushes.container);

        this.trees.container.y = 46;
        this.bushes.container.y = 48;

        // Example text
        let textScale = 0.5;
        let text = new FadeInText('HELLO WORLD THIS IS A LARGER AMOUNT OF TEXT THAT SHOULD SPLIT MULTIPLE LINES. ANOTHER LINE HERE.', 200);
        text.container.scale.set(textScale);
        text.container.x = 5;
        text.container.y = 5;
        this.stage.addChild(text.container);
        this.text = text;

        /*
        let sprite = new PIXI.Sprite(
            getTexture(Resource.CHARS, 'player1.png')
        );
        sprite.x = 10;
        sprite.y = 10;
        this.stage.addChild(sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('pointerdown', () => {
            console.log('click');
        });*/

        this.player = new Player();
        this.stage.addChild(this.player.sprite);
    }

    update(dt) {
        this.player.sprite.x = this.roadPosX;
        this.player.sprite.y = this.roadPosY;
        this.player.update(dt);
        
        this.scenery.scroll(-20*dt);
        this.trees.scroll(-20*dt);
        this.bushes.scroll(-20*dt);

        this.text.update(dt);
    }
}
