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

import { randint } from './random';
import { StoryEvent, StoryNode } from './events';

function treasureCave(level)
{
    return new StoryEvent({
        start: new StoryNode(
            'YOU SPOT A CAVE OFF THE ROAD. THE ENTRANCE IS OVERGROWN WITH VINES AND YOU ALMOST MISSED IT. YOU\'RE TEMPTED TO DO SOME EXPLORING.',
            [
                ['EXPLORE', 'cave'],
                ['LEAVE', null],
            ]
        ),
        cave: new StoryNode(
            'YOU VENTURE A LITTLE FURTHER INTO THE CAVE. THE PASSAGE IS BECOMMING CRAMPED AND NARROW. FEELING ANXIOUS, YOU HESITATE A MOMENT.',
            [
                [
                    'GO ON',
                    () => {
                        if (randint(1, 3) == 1) return 'lost';
                        return 'treasure';
                    }
                ],
                ['LEAVE', null],
            ]
        ),
        lost: new StoryNode(
            'YOU STUMBLE AROUND IN THE DARKNESS FOR ALMOST AN HOUR BEFORE FINDING YOUR WAY BACK OUT AGAIN. IN THE PROCESS SOME ITEMS SLIP FROM YOUR PACK.',
            [
                [
                    'OK',
                    () => {
                        if (level.player.money > 5) level.player.money -= 2;
                        if (level.player.food > 5) level.player.food -= 5;
                        return null;
                    }
                ],
            ]
        ),
        treasure: new StoryNode(
            'THE TUNNEL OPENS TO A LARGE CAVERNOUS ROOM. IN THE MIDDLE OF THE ROOM YOU SPOT A SMALL TREASURE CHEST FULL OF COINS! HOW FORTUNATE!',
            [
                [
                    'OK',
                    () => {
                        level.player.money += 10;
                    }
                ],
            ]
        ),
    });
}


export const Story = {
    treasureCave: treasureCave,
};

