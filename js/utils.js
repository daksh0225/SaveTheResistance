export function loadModel(loader, url, game, type)
{
    loader.load(url, function(gltf)
    {
        const root = gltf.scene;
        if(type == 'player')
        {
            root.rotation.y = Math.PI;
        }
        game.objects[type] = root;
    }, undefined, function(error)
    {
        console.log(error);
    });
}