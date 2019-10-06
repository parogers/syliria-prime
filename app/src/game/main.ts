
import { GameState } from './state';
import { VIEW_WIDTH, VIEW_HEIGHT } from './resource';

declare var PIXI: any;

export class Game
{
    private element: any;
    private renderer: any;
    private gameState: any;
    private scale: number;
    
    constructor(element)
    {
        this.element = element;
        this.resize();
        this.gameState = new GameState();
    }

    /* Resize the rendering area to fill the available space */
    resize()
    {
        // Make the rendering area fit the parent element area, but maintain
        // the aspect ratio.
        let rect = this.element.getBoundingClientRect();
        this.scale = Math.min(
            rect.width/VIEW_WIDTH,
            rect.height/VIEW_HEIGHT
        );

        let width = (VIEW_WIDTH*this.scale)|0;
        let height = (VIEW_HEIGHT*this.scale)|0;

        this.setupRenderer(width, height);
        this.renderer.resize(width, height);
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
        //this.renderer.plugins.interaction.destroy();
        this.element.appendChild(this.renderer.view);

        // Setup the main animation/update loop
        PIXI.Ticker.shared.add(
            time => {
                //let dt = time/100.0;
                let dt = PIXI.Ticker.shared.deltaMS/1000.0;
                if (this.gameState)
                {
                    this.gameState.update(dt);
                    let stage = this.gameState.stage;
                    if (stage) {
                        stage.scale.set(this.scale);
                        this.renderer.render(stage);
                    }
                }
            }
        );
    }
}
