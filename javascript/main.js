var EnemyMissileChance = 0.0005;

var Game = function() {
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext("2d");

	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.images = {};
	this.sounds = {};
	this.totalResources = 2;
	this.numResourcesLoaded = 0;
	this.fps = 60;
	this.totalFrames = 0;

	this.loadImage("player");
	this.loadImage("enemy");

	this.context.lineWidth=1;
	this.context.fillStyle="#222";
	this.context.lineStyle="#ffff00";
	this.context.font="18px sans-serif";
	this.context.fillText("Loading", 20, 20);

	this.interval = null;
};

	Game.prototype.bindEvents = function() {
		$(document).keydown(function(e) {
		  var keyCode = e.keyCode || e.which;

		  switch (keyCode) {
		    case 37: // left
		      	game.player.moveLeft();
		    break;
		    case 39: // right
		      	game.player.moveRight();
		    break;
		    case 32: // Space
		    	game.player.shoot();
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

	Game.prototype.resourceLoaded = function() {
		this.numResourcesLoaded += 1;
		if(this.numResourcesLoaded === this.totalResources) {
			this.initialize();
		}
	}

	Game.prototype.initialize = function() {
		this.player = new Player(this.images['player']);
		this.enemies = [];
		this.score = 0;

		this.enemySpeed = 2;
		this.enemyDirection = 'right';
		this.missiles = [];

		for (var i = 0; i < 10; i++) {
			for (var y = 0; y < 5; y++) {
				this.enemies[this.enemies.length] = new Enemy(this.images['enemy'], i * 64 + 24, y * 48 + 24);
			};			
		};

		this.bindEvents();
		this.interval = setInterval(this.update, 1000 / this.fps);
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
		// Draw score
		this.context.fillStyle="#222";
		this.context.lineStyle="#ffff00";
		this.context.font="18px sans-serif";
		this.context.fillText("Score: " + this.score, 20, 600); //$('#score').html(this.score);		
		
	}

	Game.prototype.update = function() {
		game.totalFrames++;
		game.player.update();

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

//$('button.start').click();