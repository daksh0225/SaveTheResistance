function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
});

document.addEventListener("keypress", onDocumentKeyPress, false);


//create the shapes
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: false});
var cube = new THREE.Mesh(geometry, material);
cube.position.x = 0;
cube.position.y = 0;
scene.add(cube);

var levelLength = getRndInteger(60, 100);
var numEnemies = getRndInteger(10, levelLength/2);
var numStars = getRndInteger(5, levelLength/3);
console.log(levelLength, numEnemies);
var enemies = []

for(var i=0; i<numEnemies;i++)
{
    var gmetry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    gmetry.scale(0.5, 0.5, 0.5);
    var mat = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
    var box = new THREE.Mesh(gmetry, mat);
    box.position.z = -(i+1)*5;
    box.position.x = getRndInteger(-5, 5);
    scene.add(box);
    enemies.push(box);
}

var stars = []

for(var i=0; i<numStars;i++)
{
    var gmetry = new THREE.SphereGeometry(1, 5, 5);
    gmetry.scale(0.5, 0.5, 0.5);
    var mat = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});
    var star = new THREE.Mesh(gmetry, mat);
    star.position.z = -(i+1)*5;
    star.position.x = getRndInteger(-5, 5);
    scene.add(star);
    stars.push(star);
}

var bossGeometry = new THREE.BoxGeometry(10, 8, 3);
var bossMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
var bossCube = new THREE.Mesh(bossGeometry, bossMaterial);
bossCube.position.z = -(numEnemies+5)*5;
scene.add(bossCube);

camera.position.z = 6;
camera.position.y = 2;
// camera.lookAt(cube.position.x, cube.position.y, cube.position.z);

//game logic
function onDocumentKeyPress(event)
{
    var key = event.code;
    if(key == "KeyW")
    {
        cube.position.z -= 0.3;
    }
    if(key == "KeyS")
    {
        cube.position.z += 0.3;
    }
    if(key == "KeyA")
    {
        cube.position.x -= 0.3;
    }
    if(key == "KeyD")
    {
        cube.position.x += 0.3;
    }
}

var update = function(dt)
{
    // camera.position.z -= 0.1;
    // cube.position.z -= 0.1;
    for(box in enemies)
    {
        enemies[box].position.z += 0.3;
    }
    for(box in stars)
    {
        stars[box].position.z += 0.05;
    }
    bossCube.position.z += 0.3;
};

//draw scene
var render = function()
{
    renderer.render(scene, camera);
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

GameLoop();