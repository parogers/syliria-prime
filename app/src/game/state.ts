
import { LoadingScreen } from './loading';
import { TitleScreen } from './title';
import { PlayScreen } from './play';

const STATE_LOADING = 0;
const STATE_TITLE = 1;
const STATE_PLAYING = 2;
const STATE_GAME_OVER = 3;

export class GameState
{
    private screen: any = null;
    private loadingScreen: any;
    private titleScreen: any;

    constructor()
    {
        this.loadingScreen = new LoadingScreen();
        this.titleScreen = new TitleScreen();
        this.playScreen = new PlayScreen();
    }

    get stage()
    {
        if (this.screen) return this.screen.stage;
        return null;
    }

    update(dt)
    {
        if (this.screen) {
            this.screen.update(dt);
        }

        if (this.screen === null || this.screen.done)
        {
            // Start with the loading screen
            if (this.screen === null)
            {
                this.screen = this.loadingScreen;
                this.screen.start();
            }
            // Transition from loading screen to title screen
            /*else if (this.screen === this.loadingScreen)
            {
                this.screen = this.titleScreen;
                this.screen.start();
                }*/

            else if (this.screen === this.loadingScreen)
            {
                this.screen = this.playScreen;
                this.screen.start();
            }
        }
    }

    render(renderer)
    {
        if (this.screen) this.screen.render(renderer);
    }
}

