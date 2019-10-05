
import { Resource, getTexture } from './resource';

declare var PIXI: any;

function randint(a, b)
{
    return (a + (b-a+1)*Math.random())|0;
}

function choice(lst)
{
    return lst[randint(0, lst.length-1)];
}

class Scenery
{
    public container: any;
    private sprites: any;
    private textureFunc: any;

    constructor(textures, args)
    {
        this.textures = textures;
        this.gapFunc = args && args.gapFunc || null;
        this.container = new PIXI.Container();
        this.sprites = [];
        let count = args && args.count || 1;
        let anchor = args && args.anchor || [0, 0];

        for (let n = 0; n < count; n++)
        {
            let sprite = new PIXI.Sprite();
            sprite.anchor.set(anchor[0], anchor[1]);
            this.sprites.push(sprite);
            this.container.addChild(sprite);
        }
        for (let n = 0; n < count; n++) {
            this.scroll(0);
        }
    }

    scroll(amount)
    {
        for (let sprite of this.sprites) {
            sprite.x += amount;
        }
        let first = this.sprites[0];
        let last = this.sprites[this.sprites.length-1];
        if (!first.texture || first.x + first.texture.width <= 0)
        {
            // Move the first sprite off the screen, and after the last sprite
            first.texture = choice(this.textures);
            this.sprites.shift();
            //first.x = Math.max(last.x + last.width, 100);
            first.x = last.x + last.width;
            if (this.gapFunc) first.x += this.gapFunc();
            this.sprites.push(first);
        }
    }
}

/* The play screen is where most of the gameplay happens. It features a scrolling 
 * background and the player advancing to the right. */
export class PlayScreen
{
    public stage: any;
    public scenery: any;

    constructor() {
    }

    start()
    {
        this.stage = new PIXI.Container();

        this.scenery = new Scenery(
            [
                getTexture(Resource.FOREST),
            ],
            {
                count: 2,
            }
        );

        this.trees = new Scenery(
            [
                getTexture(Resource.VEGETATION, 'tree1.png'),
                getTexture(Resource.VEGETATION, 'tree2.png'),
                getTexture(Resource.VEGETATION, 'tree3.png'),
                getTexture(Resource.VEGETATION, 'tree4.png'),
            ],
            {
                count: 10,
                anchor: [0.5, 1],
                gapFunc: function() { return randint(-5, 5); },
            }
        );

        this.bushes = new Scenery(
            [
                getTexture(Resource.VEGETATION, 'bush1.png'),
                getTexture(Resource.VEGETATION, 'bush2.png'),
                getTexture(Resource.VEGETATION, 'bush3.png'),
            ],
            {
                count: 20,
                anchor: [0.5, 1],
                gapFunc: function() { return randint(0, 10); },
            }
        );

        this.stage.addChild(this.scenery.container);
        this.stage.addChild(this.trees.container);
        this.stage.addChild(this.bushes.container);

        this.trees.container.y = 47;
        this.bushes.container.y = 49;
    }

    update(dt) {
        this.scenery.scroll(-20*dt);
        this.trees.scroll(-20*dt);
        this.bushes.scroll(-20*dt);
    }
}
