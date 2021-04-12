import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js'
import {Game, getRndInteger} from './game.js';

export function loadModel(loader, url, type)
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

var game = new Game();
document.body.appendChild(game.renderer.domElement);

var width = window.innerWidth;
var height = window.innerHeight;
game.renderer.setSize(width, height);
game.camera.aspect = width/height;
game.camera.updateProjectionMatrix();

const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.scale(0.25, 0.25, 0.25);
const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
const cylinder = new THREE.Mesh( geometry, material );
game.objects['missile'] = cylinder;

window.addEventListener('resize', function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    game.renderer.setSize(width, height);
    game.camera.aspect = width/height;
    game.camera.updateProjectionMatrix();
});


const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

var player_url = 'http://localhost:8000/assets/millenium_falcon/scene.gltf';
var enemy_url = 'http://localhost:8000/assets/tie_interceptor/scene.gltf';
var boss_url = 'http://localhost:8000/assets/space_fighter/scene.gltf';
// var boss_url = 'http://localhost:8000/assets/tie_fighter/scene.gltf';
loadModel(loader, player_url, 'player');
loadModel(loader, enemy_url, 'enemy');
loadModel(loader, boss_url, 'boss');
var planets = [
    'death_star',
    'earth',
    'venus',
    'jupiter',
    'uranus',
];
var p;
for (p in planets)
{
    var url = 'http://localhost:8000/assets/'+planets[p]+'/scene.gltf';
    console.log(url);
    loadModel(loader, url, planets[p]);
}


game.camera.position.z = 25;
game.camera.position.y = 25;


//run game loop (update, render, repeat)
var GameLoop = function()
{
    requestAnimationFrame(GameLoop);
    game.update();
    game.render();
}

manager.onLoad = function()
{
    game.objects['player'].scale.x = 0.75;
    game.objects['player'].scale.y = 0.75;
    game.objects['player'].scale.z = 0.75;
    game.scene.add(game.objects['player']);
    game.objects['boss'].scale.x = 1.25;
    game.objects['boss'].scale.y = 1.25;
    game.objects['boss'].scale.z = 1.25;
    game.objects['boss'].position.z = -100;
    // game.objects['boss'].position.y = -6;
    game.scene.add(game.objects['boss']);
    for (p in planets)
    {
        var planet = planets[p];
        // console.log(planet)
        var scale = 0.05;
        if(planet == 'death_star')
            scale = 0.02;
        game.objects[planet].scale.x = scale;
        game.objects[planet].scale.y = scale;
        game.objects[planet].scale.z = scale;
        var zpos = -getRndInteger(15, 30) - p*20;
        game.objects[planet].position.z = zpos;
        var xpos = Math.pow(-1, p)*getRndInteger(20, 30);
        game.objects[planet].position.x = xpos;
        game.scene.add(game.objects[planet]);
    }
    game.objects['death_star'].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].material.metalness = 0;
    game.objects['death_star'].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].material.metalness = 0;
    game.camera.lookAt(game.objects['player'].position.x, game.objects['player'].position.y, game.objects['player'].position.z);
    game.loadEnemies();
    GameLoop();
    console.log("game started");
}