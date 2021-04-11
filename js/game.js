import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {InputManager} from './inputManager.js';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export class Game
{
	constructor()
	{
		this.scene = new THREE.Scene();
		// this.scene.background = new THREE.Color(0x4a454a);
		this.renderer = new THREE.WebGLRenderer({alpha: true});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
		this.color = 0xffffff;
		this.intensity = 1;
		this.light = new THREE.AmbientLight(this.color, this.intensity);
		this.scene.add(this.light);
		this.length = getRndInteger(100, 150);
		this.numEnemies = getRndInteger(10, this.length/2);
		this.numStars = getRndInteger(5, this.length/3);
		this.objects = {};
		this.enemies = [];
		this.stars = [];
		this.inputManager = new InputManager();
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

	updatePlayerPosition = function()
	{
		if(this.inputManager.keys.W.down)
		{
			this.objects['player'].position.z -= 0.1;
		}
		if(this.inputManager.keys.S.down)
		{
			this.objects['player'].position.z += 0.1;
		}
		if(this.inputManager.keys.A.down)
		{
			this.objects['player'].position.x -= 0.1;
			// if(this.objects['player'].rotation.z > -30*Math.PI/180)
				this.objects['player'].rotation.z -= Math.PI/180;
		}
		else
		{
			if(this.objects['player'].rotation.z < 0)
				this.objects['player'].rotation.z += Math.PI/180;
		}
		if(this.inputManager.keys.D.down)
		{
			this.objects['player'].position.x += 0.1;
			// if(this.objects['player'].rotation.z < 30*Math.PI/180)
				this.objects['player'].rotation.z += Math.PI/180;
		}
		else
		{
			if(this.objects['player'].rotation.z > 0)
				this.objects['player'].rotation.z -= Math.PI/180;
		}
	}

	update = function()
	{
		this.camera.position.z -= 0.1;
		this.objects['player'].position.z -= 0.1;
		this.updatePlayerPosition();
	}

	render = function()
	{
		this.renderer.render(this.scene, this.camera);
	}
}