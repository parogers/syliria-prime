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

import { DialogWindow, MessageBox } from './dialog';

/* Displays a message to the player, and once dismissed triggers a
 * callback function that implements the consequences. */
export class DiscreteEvent
{
    public done: boolean = false;
    private messageBox: any;
    private callbackFunc: any;

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

export class StoryNode
{
    private text: any;
    // List of possible responses
    private responseData: any;

    constructor(text, responseData)
    {
        // Fill in a default response
        if (!responseData)
        {
            responseData = [
                ['OK', null]
            ];
        }
        this.text = text;
        this.responseData = responseData;
    }

    get responses() {
        return this.responseData.map(r => r[0]);
    }

    // Returns the next node (name)
    getNextNode(index) {
        return this.responseData[index][1];
    }
}

export class StoryEvent
{
    private storyNodes: any;
    private currentNode: StoryNode;
    public done: boolean = false;

    constructor(storyNodes)
    {
        this.storyNodes = storyNodes;
        this.dialogWindow = new DialogWindow();
        this.dialogWindow.on(
            'selected', index => {
                this.makeChoice(index);
            }
        );
    }

    get startNode() {
        return this.storyNodes['start'];
    }

    start(playScreen)
    {
        playScreen.stage.addChild(
            this.dialogWindow.container
        );
        this.showNode(this.startNode);
    }

    showNode(node)
    {
        this.currentNode = node;
        this.dialogWindow.showContent(
            node.text,
            node.responses
        );
    }

    // Choose a response (given the choice index) on the given story
    // node, causing the dialog window to advance to the next node.
    makeChoice(index)
    {
        // Advance to the next node
        let next = this.currentNode.getNextNode(index);

        while (typeof next === 'function') {
            next = next();
        }
        
        if (!next) {
            // End of the story
            this.dialogWindow.close();
            this.done = true;
        }
        else
        {
            // Advance to the next node of the story
            this.showNode(this.storyNodes[next]);
        }
    }

    update(dt) {
        this.dialogWindow.update(dt);
    }
}

