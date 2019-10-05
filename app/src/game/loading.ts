
declare var PIXI: any;

export class LoadingScreen
{
    public done: boolean = false;

    constructor()
    {
    }

    start()
    {
        PIXI.loader.defaultQueryString = 'nocache=' + (new Date()).getTime();
        PIXI.loader.add(
            'assets/out.png'
        );

        PIXI.loader.load(() => {
            console.log('done loading');
            this.done = true;
        });
    }

    update(dt) {
    }

    render(renderer) {
    }
}

