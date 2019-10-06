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

import { Resource } from './resource';

declare var PIXI: any;

export class LoadingScreen
{
    public done: boolean = false;
    public stage: any = null;

    constructor()
    {
    }

    start()
    {
        // Add a cache buster to the URL to avoid browser caching woes
        // when resources are updated.
        // TODO - disable in production, and gear to app version instead
        PIXI.loader.defaultQueryString = 'nocache=' + (new Date()).getTime();
        for (let resName in Resource) {
            PIXI.loader.add(Resource[resName]);
        }

        PIXI.loader.load(() => {
            console.log('done loading assets', PIXI.loader.resources);

            // Clean up texture names by removing the trailing '.png' extensions
            // (included automatically by TexturePacker)
            for (let resName in PIXI.loader.resources)
            {
                let res = PIXI.loader.resources[resName];
                if (res.textures === undefined) continue

                for (let name in res.textures)
                {
                    if (name.endsWith('.png')) {
                        let newName = name.slice(0, -4);
                        res.textures[newName] = res.textures[name];
                    }
                }
            }
            
            this.done = true;
        });
    }

    update(dt) {
    }
}

