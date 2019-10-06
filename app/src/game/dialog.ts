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

import { Resource, getTexture, VIEW_WIDTH, VIEW_HEIGHT } from './resource';
import { renderText, renderTextToBox } from './text';

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
    private releaseDelay: number = 0.2;
    private triggerDelay: number = 0.1;
    // The callback function triggered when the button is considered
    // to have been pressed. (short delay after it pops up)
    private callbackFunc: any;

    constructor(text)
    {
        this.state = this.STATE_IDLE;
        this.text = text;
        this.buttonUpTexture = getTexture(Resource.GUI, 'button-up');
        this.buttonDownTexture = getTexture(Resource.GUI, 'button-down');
        this.callbackFunc = null;

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

    on(event, func)
    {
        if (event === 'pressed') {
            this.callbackFunc = func;
        }
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
            this.timer = this.releaseDelay;
        }
    }

    update(dt)
    {
        if (this.state === this.STATE_RELEASE_TIMEOUT)
        {
            // Wait until releasing the button
            this.timer -= dt;
            if (this.timer <= 0) {
                this.timer = this.triggerDelay;
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
                if (this.callbackFunc) this.callbackFunc(this);
            }
        }
    }
}

/* A dialog window fills the entire screen and presents the player with a block of 
 * text and several responses to choose from. */
export class DialogWindow
{
    private STATE_RENDERING_TEXT = 0;
    private STATE_MORE_BUTTON = 1;
    private STATE_RESPONSE_BUTTONS = 2;

    public container: any;
    private textStartX: number = 12;
    private textStartY: number = 12;
    private textAreaWidth: number = 70;
    private textAreaHeight: number = 40;
    private buttons: any;
    private moreButton: any;
    // This is set to the index of the first button that is clicked on
    public response: any = -1;
    private text: string;
    private textNextChar: number;
    private callbackFunc: any;

    constructor()
    {
        this.container = new PIXI.Container();
        this.windowSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'dialog-window')
        );
        this.container.addChild(this.windowSprite);

        this.textSprite = new PIXI.Container();
        this.textSprite.x = this.textStartX;
        this.textSprite.y = this.textStartY;
        this.container.addChild(this.textSprite);

        this.buttonContainer = new PIXI.Container();
        this.buttonContainer.position.set(
            this.textStartX,
            this.textStartY + this.textAreaHeight + 5
        );
        this.container.addChild(this.buttonContainer);

        this.moreButton = new Button('CONTINUE');
        this.moreButton.on(
            'pressed',
            () => {
                this.showNextPageOfText();
            }
        );
        this.buttonContainer.addChild(this.moreButton.container);
    }

    on(event, func)
    {
        if (event === 'selected') {
            this.callbackFunc = func;
        }
    }

    close() {
        this.container.parent.removeChild(this.container);
    }

    // Display the given text and responses in the dialog window
    showContent(text, responses)
    {
        if (responses === undefined) responses = ['OK'];
        this.buttonContainer.removeChildren();
        this.buttonContainer.addChild(this.moreButton.container);
        this.textNextChar = 0;
        this.text = text;
        this.responses = responses;
        this.state = this.STATE_RENDERING_TEXT;
        this.response = -1;
        this.showNextPageOfText();
    }

    showResponseButtons()
    {
        // Position the buttons at the bottom of the window
        let x = 0;
        let y = 0;
        this.buttons = [];
        for (let response of this.responses)
        {
            let button = new Button(response);
            button.container.x = x;
            button.container.y = y;
            button.on('pressed', btn => {
                this.response = this.buttons.indexOf(btn);
                if (this.callbackFunc) this.callbackFunc(this.response);
            });
            this.buttonContainer.addChild(button.container);
            this.buttons.push(button);
            x += button.buttonSprite.width+2;
        }
    }

    hideMoreButton() {
        this.moreButton.container.visible = false;
    }

    showNextPageOfText()
    {
        if (this.state === this.STATE_RESPONSE_BUTTONS) {
            return;
        }
        let result = renderTextToBox(
            this.text.slice(this.textNextChar),
            this.textAreaWidth,
            this.textAreaHeight
        );
        this.textSprite.removeChildren();
        this.textSprite.addChild(result.container);
        this.state = this.STATE_MORE_BUTTON;

        if (result.nextChar === -1) {
            // No more text to render. Show the response buttons now.
            this.showResponseButtons();
            this.hideMoreButton();
            this.state = this.STATE_RESPONSE_BUTTONS;
        } else {
            this.textNextChar += result.nextChar;
        }
    }

    update(dt)
    {
        if (this.buttons) {
            for (let button of this.buttons) {
                button.update(dt);
            }
        }
        this.moreButton.update(dt);
    }
}

/* A message box displays a short message to the player. It displays a single "OK"
 * button at the bottom that dismisses the window. */
export class MessageBox
{
    public container: any;
    private textAreaWidth = 55;
    private textPosX = 5;
    private textPosY = 5;
    private callbackFunc: any;
    public closed: boolean = false;

    constructor(text)
    {
        this.container = new PIXI.Container();
        this.windowSprite = new PIXI.Sprite(
            getTexture(Resource.GUI, 'message-window')
        );
        this.container.addChild(this.windowSprite);

        this.textSprite = renderText(text, this.textAreaWidth);
        this.textSprite.x = this.textPosX;
        this.textSprite.y = this.textPosY;
        this.container.addChild(this.textSprite);

        this.okayButton = new Button('OK');
        this.okayButton.container.x = 21.5;
        this.okayButton.container.y = 21;
        this.okayButton.on(
            'pressed',
            () => {
                this.close();
                if (this.callbackFunc) this.callbackFunc(this);
            }
        );
        this.container.addChild(this.okayButton.container);

        // Have the window centered by default
        this.container.x = VIEW_WIDTH/2 - this.windowSprite.texture.width/2;
        this.container.y = VIEW_HEIGHT/2 - this.windowSprite.texture.height/2;
    }

    on(event, func) {
        if (event === 'closed') {
            this.callbackFunc = func;
        }
    }

    close() {
        if (!this.closed) {
            this.closed = true;
            this.container.parent.removeChild(this.container);
        }
    }

    update(dt) {
        this.okayButton.update(dt);
    }
}
