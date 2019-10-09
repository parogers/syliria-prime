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
import { randint, choice } from './random';
import { Story } from './stories';
import { getArg } from './args';

declare var PIXI: any;

/* Manages the occurance of events within a level */
class EventManager
{
    private randomEvents: any;
    private scripptedEvents: any;
    // The distance at which the next random event occurs
    private nextEventDistance: any;
    // Min/max period for occurance of random events
    private randomEventPeriod: number;

    constructor(args)
    {
        this.randomEvents = [];
        this.scriptedEvents = [];
        this.randomEventPeriod = getArg(
            args,
            'randomEventPeriod',
            [100, 150]
        );
        this.nextEventDistance = randint(
            this.randomEventPeriod[0],
            this.randomEventPeriod[1]
        );
    }

    addRandomEvent(func)
    {
        this.randomEvents.push(func);
    }

    addScriptedEvent(distance, func)
    {
        this.scriptedEvents.push({
            distance: distance,
            func: func,
        });
        // Sort the scripted events by distance, so they are presented in the order
        // they should appear.
        function cmp(a, b) {
            return a.distance - b.distance;
        }
        this.scriptedEvents.sort(cmp);
    }

    // Returns the next event (function) to be triggered at or before the given distance.
    // (or null if there is no such event)
    getNextEvent(distance)
    {
        // Process scripted events first. Only when there are no more should we
        // check for randomly generated events.
        if (this.scriptedEvents.length > 0)
        {
            let scripted = this.scriptedEvents[0];
            if (scripted.distance <= distance)
            {
                this.scriptedEvents.shift();

                this.nextEventDistance = distance + randint(
                    this.randomEventPeriod[0],
                    this.randomEventPeriod[1]
                );
                
                return scripted.func;
            }
            return null;
        }

        // Now process randomly occuring events
        if (this.randomEvents.length === 0) {
            return null;
        }

        if (this.nextEventDistance <= distance)
        {
            this.nextEventDistance += randint(
                this.randomEventPeriod[0],
                this.randomEventPeriod[1]
            );
            return choice(this.randomEvents);
        }
        return null;
    }
}

export class ForestLevel
{
    public stage: any;
    public scenery: any;
    private trees: any;
    private bushes: any;
    private roadPosX: number = 10;
    private roadPosY: number = 65;
    public player: any;
    private totalDistance: number = 1000;
    private distance: number = 0;

    constructor()
    {
        this.eventManager = new EventManager(this);
        //this.eventManager.addRandomEvent(Story.foundCoin);
        //this.eventManager.addRandomEvent(Story.foundFood);
        this.eventManager.addRandomEvent(Story.foundWater);
        this.eventManager.addScriptedEvent(200, Story.foundCoin);

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
        return this.distance >= this.totalDistance;
    }

    update(dt)
    {
        let speed = this.player.movementSpeed;
        this.scenery.scroll(-speed*dt);
        this.trees.scroll(-speed*dt);
        this.bushes.scroll(-speed*dt);

        let oldDistance = this.distance;
        this.distance += speed*dt;

        let eventFunc = this.eventManager.getNextEvent(this.distance);
        if (eventFunc) {
            return eventFunc(this);
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
    private totalDistance: number = 2000;
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
        return this.distance >= this.totalDistance;
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
    private totalDistance: number = 2000;
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
        return this.distance >= this.totalDistance;
    }

    update(dt)
    {
        let speed = this.player.movementSpeed;
        this.scenery.scroll(-speed*dt);
        this.distance += speed*dt;
    }
}
