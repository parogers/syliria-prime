
import { GameState } from './state';

declare var PIXI: any;

export class Game
{
    private element: any;
    private renderer: any;
    private gameState: any;
    
    constructor(element)
    {
        this.element = element;
        this.resize();
        this.gameState = new GameState();
    }

    /* Resize the rendering area to fill the available space */
    resize()
    {
        // Make the rendering area fit the parent element area
        let rect = this.element.getBoundingClientRect();
        this.setupRenderer(rect.width, rect.height);
        this.renderer.resize(rect.width, rect.height);
    }

    setupRenderer(width, height)
    {
        if (this.renderer)
        {
            return;
        }
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        // Disable the ticker sinc we don't use it (rendering happens as needed)
        //PIXI.ticker.shared.autoStart = false;
        //PIXI.ticker.shared.stop();

        this.renderer = PIXI.autoDetectRenderer({
            width: width,
            height: height,
            //antialias: true,
            // Required to prevent flickering in Chrome on Android (others too?)
            preserveDrawingBuffer: true,
            //clearBeforeRender: true
        });
        this.renderer.plugins.interaction.destroy();
        this.element.appendChild(this.renderer.view);

        // Setup the main animation/update loop
        PIXI.Ticker.shared.add(
            time => {
                let dt = time/1000.0
                if (this.gameState)
                {
                    this.gameState.update(dt);
                    this.gameState.render(this.renderer);
                }
            }
        );
    }
}
