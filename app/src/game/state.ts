
import { LoadingScreen } from './loading';
import { TitleScreen } from './title';

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
            else if (this.screen === this.loadingScreen)
            {
                this.screen = this.titleScreen;
                this.screen.start();
            }
        }
    }

    render(renderer)
    {
        if (this.screen) this.screen.render(renderer);
    }
}

