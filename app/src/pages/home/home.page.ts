import { Component, ViewChild } from '@angular/core';
import { Game } from '../../game/main';

declare var PIXI: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage
{
    @ViewChild('playarea', { static: false }) playArea;
    private game: Game;

    constructor()
    {
        window.addEventListener(
            'resize',
            () => this.handleResize()
        );
    }

    ionViewWillEnter()
    {
        this.game = new Game(this.playArea.nativeElement);
        this.handleResize();
    }

    handleResize()
    {
        if (this.game)
        {
            // Resize the playing area to fill the window
            let width = window.innerWidth-5;
            let height = window.innerHeight-5;

            this.playArea.nativeElement.style.width = width + 'px';
            this.playArea.nativeElement.style.height = height + 'px';

            // Let the game know it needs to resize
            this.game.resize();
        }
    }
}
