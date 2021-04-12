import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import {InputManager} from './inputManager.js';

export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

export class Game
{
	constructor()
	{
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({alpha: true});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 500);
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
		this.numMissiles = 100;
		this.missileTime = 0;
		this.inputManager = new InputManager();
		this.listener = new THREE.AudioListener();
		this.camera.add(this.listener);
		this.sound = new THREE.Audio(this.listener);
		this.backgroundSound = new THREE.Audio(this.listener);
		this.audioLoader = new THREE.AudioLoader();
		this.score = 0;
		this.health = 100;
	}

	playLaserSound = function()
	{
		var sound = this.sound
		if(sound.isPlaying)
			sound.isPlaying = false;
		this.audioLoader.load('http://localhost:8000/assets/sounds/lasers.ogg', function(buffer)
		{
			sound.setBuffer(buffer);
			sound.setLoop(false);
			sound.setVolume(0.5);
			sound.play();
		});
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
			obj.position.x = getRndInteger(-12, 12);
			obj.lookAt(this.objects['player'].position.x, this.objects['player'].position.y, this.objects['player'].position.z);
			this.scene.add(obj);
			this.enemies.push(obj);
		}
	}
	
	loadStars = function()
	{
		for(let i=0; i<this.numStars;i++)
		{
			let obj = this.objects['star'].clone();
			obj.scale.x = 0.5;
			obj.scale.y = 0.5;
			obj.scale.z = 0.5;
			obj.position.z = -(i+1)*5;
			obj.position.x = getRndInteger(-12, 12);
			this.scene.add(obj);
			this.stars.push(obj);
		}
	}

	processInput = function()
	{
		if(this.inputManager.keys.W.down)
		{
			this.objects['player'].position.z -= 0.2;
		}
		if(this.inputManager.keys.S.down)
		{
			if(this.objects['player'].position.z+20 < this.camera.position.z)
				this.objects['player'].position.z += 0.3;
		}
		if(this.inputManager.keys.A.down)
		{
			if(this.objects['player'].position.x > -12)
				this.objects['player'].position.x -= 0.2;
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
			if(this.objects['player'].position.x < 12)
				this.objects['player'].position.x += 0.2;
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
		if(this.inputManager.keys.F.down && Date.now()-this.missileTime > 150 && this.numMissiles > 0)
		{
			var missile = this.objects['missile'].clone();
			missile.position.x = this.objects['player'].position.x;
			missile.position.y = this.objects['player'].position.y;
			missile.position.z = this.objects['player'].position.z;
			missile.rotation.x = Math.PI/2;
			missile.traverse( ( object ) =>
			{
				if( object.isMesh )
				{
					object.material.color.set(0x4db1eb);
				}
			});
			this.scene.add(missile);
			this.missiles.push(missile);
			this.numMissiles--;
			this.missileTime = Date.now();
			this.playLaserSound();
		}
	}

	moveMissiles = function()
	{
		for(var m in this.missiles)
		{
			if(-this.missiles[m].position.z+this.camera.position.z < 100)
				this.missiles[m].position.z -= 0.5;
			else
			{
				this.scene.remove(this.missiles[m]);
				delete this.missiles[m];
			}
		}
	}

	checkCollision = function(a, b)
	{
		const boxa = new THREE.Box3().setFromObject(a);
		const boxb = new THREE.Box3().setFromObject(b);
		if(boxa.intersectsBox(boxb))
		{
			return true;
		}
		return false;
	}

	collisions = function()
	{
		var enemy;
		for(var e in this.enemies)
		{
			enemy = this.enemies[e];
			if(this.checkCollision(this.objects['player'], enemy))
			{
				this.health -= 2.5;
				this.scene.remove(enemy);
				delete this.enemies[e];
			}
			else
			{
				var missile;
				for(var m in this.missiles)
				{
					missile = this.missiles[m];
					if(this.checkCollision(enemy, missile))
					{
						this.score += 25;
						this.scene.remove(enemy);
						this.scene.remove(missile);
						delete this.missiles[m];
						delete this.enemies[e];
					}
				}
			}
		}
		var star;
		for(var s in this.stars)
		{
			star = this.stars[s];
			if(this.checkCollision(this.objects['player'], star))
			{
				this.score += 10;
				this.scene.remove(star);
				delete this.stars[s];
			}
		}
	}

	update = function()
	{
		this.camera.position.z -= 0.1;
		this.objects['player'].position.z -= 0.1;
		// this.inputManager.update();
		this.processInput();
		this.moveMissiles();
		this.collisions();
		for(var e in this.enemies)
		{
			var enemy = this.enemies[e];
			if(enemy.position.z > this.camera.position.z)
			{
				this.scene.remove(enemy);
				delete this.enemies[e];
			}
		}
		for(var e in this.enemies)
		{
			var enemy = this.enemies[e];
			enemy.lookAt(this.objects['player'].position.x, this.objects['player'].position.y, this.objects['player'].position.z);
		}
		for(var s in this.stars)
		{
			var star = this.stars[s];
			star.rotation.y += Math.PI/180;
		}
		for(var p in this.planets)
		{
			var root = this.objects[this.planets[p]];
			if(root.position.z > this.camera.position.z)
			{
				root.traverse( ( object ) =>
				{
					if( object.isMesh )
					{
						object.material.color.set( Math.floor(Math.random()*16777215) );
					}
				});
				root.position.z -= (this.planets.length)*25;
			}
			root.rotation.y += 0.25*Math.PI/180;
		}
		document.getElementById("healthbar").style.width = this.health+'%';
		document.getElementById("scoreboard").innerHTML = zeroPad(this.score, 10);
		document.getElementById("missilesleft").innerHTML = zeroPad(this.numMissiles, 2);
	}

	render = function()
	{
		this.renderer.render(this.scene, this.camera);
	}
}