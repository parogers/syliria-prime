export var Resource = {
    CHARS: 'assets/characters.json',
    VEGETATION: 'assets/vegetation.json',
    FOREST: 'assets/forest.png',
};

export function getTexture(res, name?)
{
    if (name !== undefined) {
        return PIXI.loader.resources[res].textures[name];
    }
    return PIXI.loader.resources[res].texture;
}

