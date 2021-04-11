import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js'
import {Game} from './game.js';

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
var boss_url = 'http://localhost:8000/assets/tie_fighter/scene.gltf';
var death_star_url = 'http://localhost:8000/assets/death_star/scene.gltf';
var coruscant_url = 'http://localhost:8000/assets/coruscant/scene.gltf';
var earth_url = 'http://localhost:8000/assets/earth/scene.gltf';
loadModel(loader, player_url, 'player');
loadModel(loader, enemy_url, 'enemy');
loadModel(loader, boss_url, 'boss');
loadModel(loader, death_star_url, 'death_star');
loadModel(loader, coruscant_url, 'coruscant');
loadModel(loader, earth_url, 'earth');


game.camera.position.z = 10;
game.camera.position.y = 5;


//run game loop (update, render, repeat)
var GameLoop = function()
{
    requestAnimationFrame(GameLoop);
    game.update();
    game.render();
}

manager.onLoad = function()
{
    // console.log(game.objects);
    game.objects['player'].scale.x = 0.75;
    game.objects['player'].scale.y = 0.75;
    game.objects['player'].scale.z = 0.75;
    game.scene.add(game.objects['player']);
    game.objects['boss'].position.z = -100;
    game.objects['boss'].position.y = -6;
    game.scene.add(game.objects['boss']);
    game.objects['death_star'].position.x = -50;
    game.objects['death_star'].position.z = -100;
    game.objects['death_star'].scale.x = 0.05;
    game.objects['death_star'].scale.y = 0.05;
    game.objects['death_star'].scale.z = 0.05;
    game.objects['death_star'].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].material.metalness = 0;
    game.objects['death_star'].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].material.metalness = 0;
    game.scene.add(game.objects['death_star']);
    console.log(game.objects['death_star'])
    game.objects['coruscant'].position.x = 20;
    game.objects['coruscant'].position.z = -50;
    game.objects['coruscant'].scale.x = 0.05;
    game.objects['coruscant'].scale.y = 0.05;
    game.objects['coruscant'].scale.z = 0.05;
    game.objects['coruscant'].children[0].children[0].children[0].children[0].children[0].children[0].material.metalness = 0;
    game.objects['coruscant'].children[0].children[0].children[0].children[0].children[0].children[0].color = new THREE.Color(0xffffff);
    game.scene.add(game.objects['coruscant']);
    console.log(game.objects['coruscant'])
    game.objects['earth'].position.x = 20;
    game.objects['earth'].position.z = -100;
    game.objects['earth'].scale.x = 0.05;
    game.objects['earth'].scale.y = 0.05;
    game.objects['earth'].scale.z = 0.05;
    game.scene.add(game.objects['earth']);
    // game.camera.lookAt(game.objects['player'].position.x, game.objects['player'].position.y, game.objects['player'].position.z);
    game.loadEnemies();
    GameLoop();
    console.log("game started");
}