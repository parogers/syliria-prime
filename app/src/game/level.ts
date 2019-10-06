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
import { Scenery } from './scenery';
import { randint } from './random';

declare var PIXI: any;

export class ForestLevel
{
    public stage: any;
    public scenery: any;
    private trees: any;
    private bushes: any;
    private roadPosX: number = 10;
    private roadPosY: number = 65;
    public player: any;
    private distanceToEnd: number = 100;
    private distance: number = 0;

    constructor()
    {
        this.stage = new PIXI.Container();
        this.scenery = new Scenery(
            [
                getTexture(Resource.FOREST),
            ],
            {
                count: 3,
            }
        );
        this.scenery.scroll(-1);

        this.trees = new Scenery(
            [
                getTexture(Resource.VEGETATION, 'tree1'),
                getTexture(Resource.VEGETATION, 'tree2'),
                getTexture(Resource.VEGETATION, 'tree3'),
                getTexture(Resource.VEGETATION, 'tree4'),
            ],
            {
                initialX: 1.5*VIEW_WIDTH,
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
                getTexture(Resource.VEGETATION, 'bush1'),
                getTexture(Resource.VEGETATION, 'bush2'),
                getTexture(Resource.VEGETATION, 'bush3'),
            ],
            {
                initialX: 1.2*VIEW_WIDTH,
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
    }

    get done()
    {
        return this.distance >= this.distanceToEnd;
    }

    update(dt)
    {
        let speed = this.player.movementSpeed;
        this.scenery.scroll(-speed*dt);
        this.trees.scroll(-speed*dt);
        this.bushes.scroll(-speed*dt);

        let oldDistance = this.distance;
        this.distance += speed*dt;

        if (oldDistance < 50 && this.distance > 50) {
            console.log('event');
        }
    }
}


export class SwampLevel
{
    public stage: any;
    public scenery: any;
    private roadPosX: number = 10;
    private roadPosY: number = 62;
    public player: any;
    private distanceToEnd: number = 2000;
    private distance: number = 0;

    constructor()
    {
        this.stage = new PIXI.Container();
        this.scenery = new Scenery(
            [
                getTexture(Resource.SWAMP),
            ],
            {
                count: 3,
            }
        );
        this.stage.addChild(this.scenery.container);
    }

    get done()
    {
        return this.distance >= this.distanceToEnd;
    }

    update(dt)
    {
        let speed = this.player.movementSpeed;
        this.scenery.scroll(-speed*dt);
        this.distance += speed*dt;
    }
}


export class DesertLevel
{
    public stage: any;
    public scenery: any;
    private roadPosX: number = 10;
    private roadPosY: number = 68;
    public player: any;
    private distanceToEnd: number = 2000;
    private distance: number = 0;

    constructor()
    {
        this.stage = new PIXI.Container();
        this.scenery = new Scenery(
            [
                getTexture(Resource.DESERT),
            ],
            {
                count: 3,
            }
        );
        this.stage.addChild(this.scenery.container);
    }

    get done()
    {
        return this.distance >= this.distanceToEnd;
    }

    update(dt)
    {
        let speed = this.player.movementSpeed;
        this.scenery.scroll(-speed*dt);
        this.distance += speed*dt;
    }
}