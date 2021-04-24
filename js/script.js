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

var progress = document.createElement('div');
var progressBar = document.createElement('div');
progressBar.id = "progressbar";
progress.appendChild(progressBar);
document.body.appendChild(progress);

var game = new Game();
document.body.appendChild(game.renderer.domElement);

var width = window.innerWidth;
var height = window.innerHeight;
game.renderer.setSize(width, height);
game.camera.aspect = width/height;
game.camera.updateProjectionMatrix();

const geometry = new THREE.CylinderGeometry(1, 1, 10, 1000);
geometry.scale(0.1, 0.1, 0.1);
const material = new THREE.MeshBasicMaterial( {color: 0x4db1eb} );
const cylinder = new THREE.Mesh( geometry, material );
game.objects['missile'] = cylinder;

const new_material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
const new_cylinder = new THREE.Mesh( geometry, new_material );
game.objects['enemy_missile'] = new_cylinder;

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

var player_url = '../assets/millenium_falcon/scene.gltf';
var enemy_url = '../assets/tie_interceptor/scene.gltf';
var star_url = '../assets/star/scene.gltf';
var boss_url = '../assets/space_fighter/scene.gltf';
loadModel(loader, player_url, 'player');
loadModel(loader, boss_url, 'enemy');
loadModel(loader, star_url, 'star');
loadModel(loader, boss_url, 'boss');
// loadModel(loader, red_saber_url, 'missile');
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
    var url = '../assets/'+planets[p]+'/scene.gltf';
    loadModel(loader, url, planets[p]);
}


game.camera.position.z = 20;
game.camera.position.y = 5;


//run game loop (update, render, repeat)
var GameLoop = function()
{
    if(game.health > 0)
    {
        requestAnimationFrame(GameLoop);
        game.update();
        game.render();
    }
    else
    {
        console.log('game fininshed');
        game.backgroundSound.stop();
        while(game.scene.children.length > 0) {
            game.scene.remove(game.scene.children[0]);
        }
        game.renderer.clear();
        var body = document.getElementById('body');
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.style.alignItems = 'center';
        body.style.justifyContent = 'center';
        document.getElementById("hud").style.height = "150px"
        document.getElementById("hud").innerHTML += "<p>Game Over!!!</p>";
    }
}


manager.onProgress = function ( item, loaded, total )
{
    progressBar.style.width = (loaded / total * 100) + '%';
};

manager.onLoad = function()
{
    progressBar.style.display = "none";
    progress.style.height = 0;
    game.objects['player'].scale.x = 0.75;
    game.objects['player'].scale.y = 0.75;
    game.objects['player'].scale.z = 0.75;
    game.scene.add(game.objects['player']);
    game.objects['boss'].scale.x = 1.25;
    game.objects['boss'].scale.y = 1.25;
    game.objects['boss'].scale.z = 1.25;
    game.objects['boss'].position.z = -100;
    // game.scene.add(game.objects['boss']);
    console.log(game.objects['missile'])
    for (p in planets)
    {
        var planet = planets[p];
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
    // game.camera.lookAt(game.objects['player'].position.x, game.objects['player'].position.y, game.objects['player'].position.z);
    game.loadEnemies();
    game.loadStars();
    GameLoop();
    game.audioLoader.load('../assets/sounds/backgroundSound.ogg', function(buffer)
    {
        game.backgroundSound.setBuffer(buffer);
        game.backgroundSound.setLoop(true);
        game.backgroundSound.setVolume(0.5);
        game.backgroundSound.play();
    });
    console.log("game started");
}