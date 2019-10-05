
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
            PIXI.loader.resources['assets/out.png'].texture
        );
        sprite.x = 10;
        sprite.y = 50;
        this.stage.addChild(sprite);
    }

    update(dt)
    {
    }

    render(renderer)
    {
        renderer.render(this.stage);
    }
}
