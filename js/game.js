import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export class Game
{
	constructor()
	{
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xffffff);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
		this.color = 0xffffff;
		this.intensity = 1;
		this.light = new THREE.DiffuseLight(this.color, this.intensity);
		this.scene.add(this.light);
		this.length = getRndInteger(100, 150);
		this.numEnemies = getRndInteger(10, this.length/2);
		this.numStars = getRndInteger(5, this.length/3);
		this.objects = {};
		this.enemies = [];
		this.stars = [];
	}
	loadEnemies = function()
	{
		for(let i=0; i<this.numEnemies;i++)
		{
			let obj = this.objects['enemy'].clone();
			obj.scale.x = 0.1;
			obj.scale.y = 0.1;
			obj.scale.z = 0.1;
			obj.position.z = -(i+1)*5;
			obj.position.x = getRndInteger(-5, 5);
			this.scene.add(obj);
			this.enemies.push(obj);
		}
		return true;
	}
}