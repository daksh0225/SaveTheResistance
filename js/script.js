import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js'
import {Game} from './game.js';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
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

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

var player_url = 'http://localhost:8000/assets/millenium_falcon/scene.gltf';
var enemy_url = 'http://localhost:8000/assets/tie_interceptor/scene.gltf';
var boss_url = 'http://localhost:8000/assets/tie_fighter/scene.gltf';
loadModel(loader, player_url, 'player');
loadModel(loader, enemy_url, 'enemy');
loadModel(loader, boss_url, 'boss');

document.addEventListener("keypress", onDocumentKeyPress, false);

function loadEnemies()
{
    var enemies = []
    for(var i=0; i<game.numEnemies;i++)
    {
        var obj = game.objects['enemy'].clone();
        obj.scale.x = 0.1;
        obj.scale.y = 0.1;
        obj.scale.z = 0.1;
        obj.position.z = -(i+1)*5;
        obj.position.x = getRndInteger(-5, 5);
        game.scene.add(obj);
        enemies.push(obj);
    }
    return enemies;
}

function loadStars(game)
{
    var stars = []
    for(var i=0; i<game.numStars;i++)
    {
        var gmetry = new THREE.SphereGeometry(1, 5, 5);
        gmetry.scale(0.5, 0.5, 0.5);
        var mat = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});
        var star = new THREE.Mesh(gmetry, mat);
        star.position.z = -(i+1)*5;
        star.position.x = getRndInteger(-5, 5);
        game.scene.add(star);
        stars.push(star);
    }
    return stars;
}

game.camera.position.z = 1;
game.camera.position.y = 40;

//game logic
function onDocumentKeyPress(event)
{
    var key = event.code;
    if(key == "KeyW")
    {
        game.objects['player'].position.z -= 0.3;
    }
    if(key == "KeyS")
    {
        game.objects['player'].position.z += 0.4;
    }
    if(key == "KeyA")
    {
        game.objects['player'].position.x -= 0.3;
    }
    if(key == "KeyD")
    {
        game.objects['player'].position.x += 0.3;
    }
}

function update(dt)
{
    game.camera.position.z -= 0.1;
    game.objects['player'].position.z -= 0.1;
};

//draw scene
function render()
{
    game.renderer.render(game.scene, game.camera);
};

var deltaTime = 0;
var lastFrame = 0;

//run game loop (update, render, repeat)
var GameLoop = function()
{
    var currentFrame = Date.now();
    deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;
    requestAnimationFrame(GameLoop);
    update(deltaTime);
    render();
}

manager.onLoad = function()
{
    // console.log(game.objects);
    game.scene.add(game.objects['player']);
    game.objects['boss'].position.z = -100;
    game.objects['boss'].position.y = -6;
    game.scene.add(game.objects['boss']);
    game.camera.lookAt(game.objects['player'].position.x, game.objects['player'].position.y, game.objects['player'].position.z);
    // loadEnemies(game);
    game.loadEnemies();
    GameLoop();
    console.log("game started");
}