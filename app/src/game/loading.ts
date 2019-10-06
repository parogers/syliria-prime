
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
            .add(Resource.VEGETATION)
            .add(Resource.LETTERS);

        PIXI.loader.load(() => {
            console.log('done loading assets', PIXI.loader.resources);

            // Clean up texture names by removing the trailing '.png' extensions
            // (included automatically by TexturePacker)
            for (let resName in PIXI.loader.resources)
            {
                let res = PIXI.loader.resources[resName];
                if (res.textures === undefined) continue

                for (let name in res.textures)
                {
                    if (name.endsWith('.png')) {
                        let newName = name.slice(0, -4);
                        res.textures[newName] = res.textures[name];
                    }
                }
            }
            
            this.done = true;
        });
    }

    update(dt) {
    }
}

