
import { Resource, getTexture } from './resource';

declare var PIXI: any;

export class TitleScreen
{
    private stage: any;

    constructor()
    {
    }

    start()
    {
        this.stage = new PIXI.Container();
        let sprite = new PIXI.Sprite(
            getTexture(Resource.CHARS, 'player1.png')
        );
        sprite.x = 10;
        sprite.y = 50;
        this.stage.addChild(sprite);
    }

    update(dt)
    {
    }
}
