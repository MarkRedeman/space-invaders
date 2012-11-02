var EnemyMissileChance = 0.0005;
var leftPressed = false;
var rightPressed = false;
var spacePressed = false;

var Game = function() {
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext("2d");

	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.images = {};
	this.sounds = {};
	this.totalResources = 12;
	this.numResourcesLoaded = 0;
	this.fps = 60;
	this.totalFrames = 0;

	this.state = 'loading';

	this.loadImage("player");
	this.loadImage("invader");
	this.loadImage("flying-saucer");

	this.loadSound("shoot");
	this.loadSound("ufo_lowpitch");
	this.loadSound("ufo_highpitch");
	this.loadSound("invaderkilled");
	this.loadSound("fastinvader4");
	this.loadSound("fastinvader3");
	this.loadSound("fastinvader2");
	this.loadSound("fastinvader1");
	this.loadSound("explosion");

	this.context.lineWidth=1;
	this.context.fillStyle="#222";
	this.context.lineStyle="#ffff00";
	this.context.font="18px sans-serif";
	this.context.fillText("Loading", 20, 20);

	this.interval = null;
};
	Game.prototype.initialize = function() {
		this.player = new Player(this.images['player']);
		this.score = 0;
		this.level = 0;
		this.levelReset();

		this.enemySpeed = 0.5;

		this.state = 'playing';
		this.bindEvents();
		this.interval = setInterval(this.update, 1000 / this.fps);
	}

	Game.prototype.bindEvents = function() {
		$(document).keydown(function(e) {
		  	var keyCode = e.keyCode || e.which;
		  	switch (keyCode) {
			    case 37: // left
			    	leftPressed = true;
			    	rightPressed = false;
			    break;
			    case 39: // right
			    	rightPressed = true;
			    	leftPressed = false;
			    break;
			    case 32: // Space
			    	spacePressed = true;
			    break;
		  	}
		});

		$(document).keyup(function(e) {
		  var keyCode = e.keyCode || e.which;
		  switch (keyCode) {
			    case 37: // left
			    	leftPressed = false;
			    break;
			    case 39: // right
			    	rightPressed = false;
			    break;
			    case 32: // Space
			    	spacePressed = false;
			    break;
		  	}
		});
	};

	Game.prototype.loadImage = function(name) {
		  this.images[name] = new Image();
		  this.images[name].onload = function() { 
		      game.resourceLoaded();
		  }
		  this.images[name].src = "images/" + name + ".png";
	}

	Game.prototype.loadSound = function(name) {
		this.sounds[name] = new Audio();
		this.sounds[name].addEventListener('canplaythrough', this.resourceLoaded(), false);
		this.sounds[name].src = "sounds/" + name + ".wav";
		console.log(this.sounds[name]);
	}

	Game.prototype.resourceLoaded = function() {
		this.numResourcesLoaded += 1;
		if(this.numResourcesLoaded === this.totalResources) {
			this.initialize();
		}
	}

	Game.prototype.redraw = function() {
		this.canvas.width = this.canvas.width; // clears the canvas 
		this.player.draw(this.context);
		// Draw enemies
		for (var i = 0; i < this.enemies.length; i++) {
			// Skip dead enemies	
			if (game.enemies[i].dead) {
				continue;				
			}
			this.enemies[i].draw(this.context);
		};
		// Draw enemy missiles
		for (missile in this.missiles) {
			this.missiles[missile].draw(this.context);
		}
		// Update UFO's
		for (var i = 0; i < this.flyingSaucers.length; i++) {
			this.flyingSaucers[i].draw(this.context)
		};
		// Draw score
		this.context.fillStyle="#fff";
		this.context.lineStyle="#222";
		this.context.font="18px sans-serif";
		this.context.fillText("Score: " + this.score, 20, 600);

		this.context.fillText("Level: " + this.level, 20, 570);
		
	}

	Game.prototype.update = function() {
		if (game.state === 'pause') { return; }
		if (game.state === 'dead') { game.updateDead() }
		if (game.state === 'playing') { game.play() }
	}

	Game.prototype.updateDead = function() {
		this.missiles = [];
		this.enemies = [];
		this.flyingSaucers = [];

		this.canvas.width = this.canvas.width; // clears the canvas 

		this.player.x = 320 - this.player.width;
		this.player.draw(this.context);

		this.context.fillStyle="#fff";
		this.context.lineStyle="#222";
		this.context.font="80px sans-serif";
		this.context.fillText("Gameover", 100, 150);

		this.context.font="20px sans-serif";
		this.context.fillText("Score: " + this.score, 120, 180);
		this.context.fillText("Level: " + this.level, 120, 210);

		this.context.font="30px sans-serif";
		this.context.fillText("Restart", 120, 260);

		this.stop();
	}

	Game.prototype.play = function() {
		this.totalFrames++;
		this.player.update();
		if ( leftPressed) { this.player.moveLeft() }
		if ( rightPressed) { this.player.moveRight(); }
		if ( spacePressed) { this.player.shoot(); }

		// Update enemies
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update();
		};

		// Update enemy missiles
		for (var i = 0; i < this.missiles.length; i++) {
			missile = this.missiles[i];
			missile.update();
			// Delete missile if missile is out of sight
			if (missile.y > 640) {
				this.missiles.splice(i, 1);
			}

			// Player's missile collides with enemy's missile
			for (var j = 0; j < this.player.missiles.length; j++) {
				if (missile.collide(this.player.missiles[j])) {
					this.missiles.splice(i, 1);		
					this.player.missiles.splice(j, 1);		
				}
			};
		};

		// Update UFO's
		for (var i = 0; i < this.flyingSaucers.length; i++) {
			this.flyingSaucers[i].update()
		};
		// A UFO should spawn every 100 seconds
		if (this.totalFrames % this.fps	== 1) {
			if (Math.random() < 0.01) {
				this.flyingSaucers[this.flyingSaucers.length] = new FlyingSaucer(this.images['flying-saucer']);
			}
		}

		this.redraw();
	}

	Game.prototype.aliveEnemies = function() {
		var enemies = [];
		for (var i = 0; i < this.enemies.length; i++) {
			if (!this.enemies[i].dead) {
				enemies.push(this.enemies[i]);
			}
		};
		return enemies;
	}

	Game.prototype.reset = function() {
		clearInterval(this.interval);
		game = new Game();
	}

	Game.prototype.stop = function() {
		clearInterval(this.interval);
		game = null;
	}

	Game.prototype.nextLevel = function() {
		this.levelReset();
		this.level++;
		// Make the next level harder
		this.enemySpeed = 0.5 + 0.1 * this.level;
		EnemyMissileChance += 0.0001;
	}

	Game.prototype.levelReset = function() {
		this.enemies = [];

		this.enemySpeed = 0.5;
		this.enemyDirection = 'right';
		this.missiles = [];
		this.flyingSaucers = [];		

		for (var i = 0; i < 10; i++) {
			for (var y = 0; y < 5; y++) {
				this.enemies[this.enemies.length] = new Enemy(this.images['invader'], 40 + i * 80 + 24, y * 40 + 40);
			};			
		};
	}

$('button.start').click(function() {
	// Start game
	game = new Game();
});
$('button.reset').click(function() {
	// Start game
	game.reset();
});

$('button.stop').click(function() {
	// Start game
	game.stop();
});

$('button.pause').click(function() {
	console.log(this);
	if (game.state === 'pause') {
		game.state = 'playing';
		$(this).html('Pause');
	} else {
		game.state = 'pause';
		$(this).html('Resume');
	}

});

$('button.start').click();