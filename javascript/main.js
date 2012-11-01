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
		this.context.fillText("Score: " + this.score, 20, 600); //$('#score').html(this.score);		

		this.context.fillText("Level: " + this.level, 20, 570); //$('#score').html(this.score);		
		
	}

	Game.prototype.update = function() {
		game.totalFrames++;
		game.player.update();
		if ( leftPressed) { game.player.moveLeft() }
		if ( rightPressed) { game.player.moveRight(); }
		if ( spacePressed) { game.player.shoot(); }

		// Update enemies
		for (var i = 0; i < game.enemies.length; i++) {
			game.enemies[i].update();
		};

		// Update enemy missiles
		for (var i = 0; i < game.missiles.length; i++) {
			missile = game.missiles[i];
			missile.update();
			// Delete missile if missile is out of sight
			if (missile.y > 640) {
				game.missiles.splice(i, 1);
			}

			// Player's missile collides with enemy's missile
			for (var j = 0; j < game.player.missiles.length; j++) {
				if (missile.collide(game.player.missiles[j])) {
					game.missiles.splice(i, 1);		
					game.player.missiles.splice(j, 1);		
				}
			};
		};

		// Update UFO's
		for (var i = 0; i < game.flyingSaucers.length; i++) {
			game.flyingSaucers[i].update()
		};
		// A UFO should spawn every 100 seconds
		if (game.totalFrames % game.fps	== 1) {
			if (Math.random() < 0.01) {
				game.flyingSaucers[game.flyingSaucers.length] = new FlyingSaucer(game.images['flying-saucer']);
			}
		}

		game.redraw();
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

	Game.prototype.moveDown = function(direction) {
		game.enemySpeed = Math.min(game.enemySpeed + 0.5, 5);
		game.enemyDirection = direction;
		for (var i = 0; i < game.enemies.length; i++) {
			enemy = game.enemies[i];
			enemy.y += 10;
		};
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

$('button.start').click();