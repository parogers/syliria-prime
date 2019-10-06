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
import { renderText } from './text';

declare const PIXI: any;

class Button
{
    private STATE_IDLE = 0;
    private STATE_PRESSED = 1;
    private STATE_RELEASE_TIMEOUT = 2;
    private STATE_TRIGGER_TIMEOUT = 3;

    public container: any;
    private textPosY: number = 2.75;
    private state: number;
    private timer: number;

    constructor(text, index)
    {
        this.state = this.STATE_IDLE;
        this.text = text;
        this.index = index;
        this.buttonUpTexture = getTexture(Resource.GUI, 'button-up');
        this.buttonDownTexture = getTexture(Resource.GUI, 'button-down');

        this.buttonSprite = new PIXI.Sprite(this.buttonUpTexture);

        this.container = new PIXI.Container();
        this.textSprite = renderText(text);

        this.container.addChild(this.buttonSprite);
        this.container.addChild(this.textSprite);

        // Make the button interactable via PIXI
        this.buttonSprite.buttonMode = true;
        this.buttonSprite.interactive = true;
        this.buttonSprite.on('pointerdown', () => this.handlePressed());
        this.buttonSprite.on('pointerup', () => this.handleReleased());

        this.showButtonUp();
    }

    showButtonUp() {
        this.textSprite.x = 4;
        this.textSprite.y = this.textPosY;
        this.buttonSprite.texture = this.buttonUpTexture;
    }

    showButtonDown() {
        this.textSprite.x = 4;
        this.textSprite.y = this.textPosY + 1;
        this.buttonSprite.texture = this.buttonDownTexture;
    }

    handlePressed()
    {
        if (this.state === this.STATE_IDLE)
        {
            this.state = this.STATE_PRESSED;
            this.showButtonDown();
        }
    }

    handleReleased()
    {
        if (this.state === this.STATE_PRESSED) {
            // Have the button release after a short interval
            this.state = this.STATE_RELEASE_TIMEOUT;
            this.timer = 0.2;
        }
    }

    update(dt)
    {
        if (this.state === this.STATE_RELEASE_TIMEOUT)
        {
            // Wait until releasing the button
            this.timer -= dt;
            if (this.timer <= 0) {
                this.state = this.STATE_TRIGGER_TIMEOUT;
                this.showButtonUp();
            }
        }
        else if (this.state === this.STATE_TRIGGER_TIMEOUT)
        {
            // Wait until triggering the button callback
            this.timer -= dt;
            if (this.timer <= 0) {
                this.state = this.STATE_IDLE;
                console.log('trigger');
            }
        }
    }
}

export class DialogWindow
{
    public container: any;
    private textStartX: number = 12;
    private textStartY: number = 12;
    private textAreaWidth: number = 70;
    private textAreaHeight: number = 40;
    private buttons: any;

    constructor(text, responses)
    {
        this.container = new PIXI.Container();
        this.windowSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'dialog-window')
        );
        this.container.addChild(this.windowSprite);

        this.textSprite = renderText(text, this.textAreaWidth);
        this.textSprite.x = this.textStartX;
        this.textSprite.y = this.textStartY;
        this.container.addChild(this.textSprite);

        // Position the buttons at the bottom of the window
        let count = 0;
        let x = this.textStartX;
        let y = this.textStartY + this.textAreaHeight + 5;
        this.buttons = [];
        for (let response of responses)
        {
            let button = new Button(response, count);
            button.container.x = x;
            button.container.y = y;
            this.container.addChild(button.container);
            this.buttons.push(button);
            x += button.buttonSprite.width+2;
            count++;
        }
    }

    update(dt)
    {
        for (let button of this.buttons) {
            button.update(dt);
        }
    }
}
