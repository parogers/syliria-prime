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

import { MessageBox } from './dialog';

interface Event
{
    public done: boolean;
    public start();
    public update(dt);
}

export class DiscreteEvent implements Event
{
    public done: boolean = false;
    private messageBox: any;

    constructor(msg, callbackFunc)
    {
        this.callbackFunc = callbackFunc;
        this.messageBox = new MessageBox(msg);
        this.messageBox.on('closed', () => {
            this.done = true;
            this.callbackFunc();
        });
    }

    start(playScreen) {
        playScreen.stage.addChild(this.messageBox.container);
    }

    update(dt) {
        this.messageBox.update(dt);
    }
}
