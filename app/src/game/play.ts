
import { Resource, getTexture } from './resource';
import { renderText } from './text';

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
    private textures: any;
    private offsetFunc: any;
    private tightFit: any;

    constructor(textures, args)
    {
        this.textures = textures;
        this.offsetFunc = args && args.offsetFunc || null;
        this.container = new PIXI.Container();
        this.sprites = [];
        this.tightFit = args && args.tightFit || false;
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

            first.x = last.x + last.width;
            if (!this.tightFit) {
                first.x = Math.max(first.x, 100);
            }
            
            if (this.offsetFunc)
            {
                let offset = this.offsetFunc();
                first.x += offset.x;
                first.y = offset.y;
            }
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
    private trees: any;
    private bushes: any;

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
                tightFit: true,
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
                offsetFunc: function() {
                    return {
                        x: randint(-5, 5),
                        y: randint(0, -1),
                    }
                },
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
                offsetFunc: function() {
                    return {
                        x: randint(-5, 5),
                        y: randint(-2, 2),
                    }
                },
            }
        );

        this.stage.addChild(this.scenery.container);
        this.stage.addChild(this.trees.container);
        this.stage.addChild(this.bushes.container);

        this.trees.container.y = 46;
        this.bushes.container.y = 48;

        // Example text
        let textScale = 0.5;
        let sprite = renderText('HELLO WORLD THIS IS A LARGER AMOUNT OF TEXT THAT SHOULD SPLIT MULTIPLE LINES. ANOTHER LINE HERE.', Resource.LETTERS, 200);
        sprite.scale.set(textScale);
        sprite.x = 5;
        sprite.y = 5;
        this.stage.addChild(sprite);
    }

    update(dt) {
        this.scenery.scroll(-20*dt);
        this.trees.scroll(-20*dt);
        this.bushes.scroll(-20*dt);
    }
}
