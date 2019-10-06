
declare var PIXI: any;

// Size of the virtual display (this gets scaled up to
// fit the available/actual space on screen)
export const VIEW_WIDTH = 100;
export const VIEW_HEIGHT = 75;

export var Resource = {
    CHARS: 'assets/characters.json',
    VEGETATION: 'assets/vegetation.json',
    FOREST: 'assets/forest.png',
    LETTERS: 'assets/media/letters.json',
};

export function getTexture(resName, spriteName?)
{
    let res = PIXI.loader.resources[resName];
    if (!res) {
        console.log('ERROR: cannot find resource', resName);
        return null;
    }

    if (spriteName !== undefined)
    {
        let texture = res.textures[spriteName];
        if (!texture) {
            console.log('ERROR: cannot find texture', resName, spriteName);
        }
        return texture;
    }
    return res.texture;
}

