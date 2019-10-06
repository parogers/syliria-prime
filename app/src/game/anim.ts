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

export class Animation
{
    private frames: any;
    private fps: number;
    private frame: number;

    constructor(frames, fps)
    {
        this.frames = frames;
        this.fps = fps
        this.frame = 0;
    }

    get frameNum()
    {
        return (this.frame|0) % this.frames.length;
    }

    update(dt) {
        this.frame += dt*this.fps;
        return this.frames[this.frameNum];
    }
}
