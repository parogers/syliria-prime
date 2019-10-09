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

import { randint, choice } from './random';
import { DiscreteEvent, StoryEvent, StoryNode } from './events';

export var Story: any = {};

Story.abandonedGrave = function(level)
{
    // Player finds an abandoned grave. Has the option to visit and pay respects.
    // Either they are chased away by an old dog (half the time wounding the player),
    // or the leave feeling renewed hope.
}

Story.troubledWanderer = function(level)
{
    // Player encounters an NPC down on their luck, who asks for some coins.
    // The player can choose how many to give (0, 5, 10)
    // 0 => Either NPC wishes player well, or curses them
    // 5 => NPC thanks player
    // 10 => NPC thanks player, half the time gives them food
}

Story.lostBackpack = function(level)
{
    // Player spots an abandoned backpack at the side of the path.
    // The backpack is either empty, has items in it, or a snake.
    // (which half the time poisons the player)
}

Story.hiddenStash = function(level)
{
    // Player spots a suspicious hollow in a tree, and are prompted to stick
    // their hand in to find out what's inside. Either it's empty, has bees,
    // has a snake, or has coins in it.
}

Story.argument = function(level)
{
    // The player comes upon a customer arguing with a merchant. Both claim
    // the other cheated them out of a deal and want you to decide who's
    // correct. Whatever the choice they both walk away unhappy. If player
    // chooses merchant they get money, if they choose the customer they get
    // an item.
}

Story.treasureCave = function(level)
{
    return new StoryEvent({
        start: new StoryNode(
            'YOU SPOT A CAVE OFF THE ROAD. THE ENTRANCE IS OVERGROWN WITH VINES AND YOU ALMOST MISSED IT. YOU\'RE TEMPTED TO DO SOME EXPLORING.',
            [
                ['EXPLORE', 'cave'],
                ['LEAVE', 'leave'],
            ]
        ),
        leave: new StoryNode(
            'YOU DECIDE NO GOOD CAN COME OF EXPLORING THIS CAVE. YOU HEAD BACK TO THE PATH.',
        ),
        cave: new StoryNode(
            'YOU VENTURE A LITTLE FURTHER INTO THE CAVE. THE PASSAGE IS BECOMMING CRAMPED AND NARROW. FEELING ANXIOUS, YOU HESITATE A MOMENT.',
            [
                [
                    'GO ON',
                    () => choice(['lost', 'treasure', 'nothing'])
                ],
                ['LEAVE', 'leave'],
            ]
        ),
        nothing: new StoryNode(
            'YOU CONTINUE SEARCHING THE CAVE BUT FIND NOTHING. DISAPPOINTED, YOU RETURN TO THE PATH.'
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


Story.foundCoin = function(level)
{
    return new DiscreteEvent(
        'LUCKY DAY! YOU FOUND A FEW COINS ON THE ROADSIDE',
        () => {
            level.player.money += randint(1, 5);
        }
    );
}

Story.foundFood = function(level)
{
    let msg = choice([
        'YOU COLLECT SOME TASTY BERRIES FROM A BUSH NEARBY',
        'YOU COLLECT SOME APPLES FROM A NEARBY APPLE TREE',
        'YOU DIG UP SOME TASTY ROOT VEGETABLES',
    ]);
    return new DiscreteEvent(
        msg,
        () => {
            level.player.food += randint(1, 3);
        }
    );
}

Story.foundWater = function(level)
{
    return new DiscreteEvent(
        'YOU COLLECT SOME WATER FROM A NEARBY STREAM',
        () => {
            level.player.water += randint(1, 3);
        }
    );
}

