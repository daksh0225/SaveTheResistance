import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {InputManager} from './inputManager.js';

export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export class Game
{
	constructor()
	{
		this.scene = new THREE.Scene();
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
		this.planets = [
			'death_star',
			'earth',
			'venus',
			'jupiter',
			'uranus',
		];
		this.missiles = []
		this.numMissiles = 500;
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

	processInput = function()
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
			if(this.objects['player'].position.x > -15)
				this.objects['player'].position.x -= 0.1;
			if(this.objects['player'].rotation.z > -90*Math.PI/180)
			{
				this.objects['player'].rotation.z -= Math.PI/180;
			}
		}
		else
		{
			if(this.objects['player'].rotation.z < 0)
				this.objects['player'].rotation.z += Math.PI/180;
		}
		if(this.inputManager.keys.D.down)
		{
			if(this.objects['player'].position.x < 15)
				this.objects['player'].position.x += 0.1;
			if(this.objects['player'].rotation.z < 90*Math.PI/180)
			{
				this.objects['player'].rotation.z += Math.PI/180;
			}
		}
		else
		{
			if(this.objects['player'].rotation.z > 0)
				this.objects['player'].rotation.z -= Math.PI/180;
		}
		if(this.inputManager.keys.F.down)
		{
			var missile = this.objects['missile'].clone();
			missile.position.x = this.objects['player'].position.x;
			missile.position.y = this.objects['player'].position.y;
			missile.position.z = this.objects['player'].position.z;
			this.scene.add(missile);
			this.missiles.push(missile);
			this.numMissiles--;
		}
	}

	moveMissiles = function()
	{
		for(var m in this.missiles)
		{
			if(this.missiles[m].position.z-this.camera.position.z < 100)
				this.missiles[m].position.z -= 0.5;
		}
	}

	update = function()
	{
		this.camera.position.z -= 0.1;
		this.objects['player'].position.z -= 0.1;
		// this.inputManager.update();
		this.processInput();
		this.moveMissiles();
		for(var p in this.planets)
		{
			var root = this.objects[this.planets[p]];
			if(root.position.z > this.camera.position.z)
			{
				root.traverse( ( object ) => {

					if ( object.isMesh )
					{
						object.material.color.set( Math.floor(Math.random()*16777215) );
					}
				
				});
				root.position.z -= (this.planets.length)*25;
			}
		}
		console.log(this.numMissiles);
	}

	render = function()
	{
		this.renderer.render(this.scene, this.camera);
	}
}