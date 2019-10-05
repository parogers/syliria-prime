
import { Resource } from './resource';

declare var PIXI: any;

export class LoadingScreen
{
    public done: boolean = false;
    public stage: any = null;

    constructor()
    {
    }

    start()
    {
        PIXI.loader.defaultQueryString = 'nocache=' + (new Date()).getTime();
        PIXI.loader
            .add(Resource.CHARS)
            .add(Resource.FOREST)
            .add(Resource.VEGETATION);

        PIXI.loader.load(() => {
            console.log('done loading assets', PIXI.loader.resources);
            this.done = true;
        });
    }

    update(dt) {
    }
}

