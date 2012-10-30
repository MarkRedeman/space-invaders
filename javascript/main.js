var Game = function() {
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext("2d");

	this.images = {};
	this.totalResources = 2;
	this.numResourcesLoaded = 0;
	this.fps = 30;
	this.totalFrames = 0;

	this.loadImage("player");
	this.loadImage("enemy");

	this.context.lineWidth=1;
	this.context.fillStyle="#222";
	this.context.lineStyle="#ffff00";
	this.context.font="18px sans-serif";
	this.context.fillText("Loading", 20, 20);
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

		for (var i = 0; i < 10; i++) {
			for (var y = 0; y < 5; y++) {
				this.enemies[this.enemies.length] = new Enemy(this.images['enemy'], i * 96 + 24, y * 48 + 24);
			};			
		};

		this.bindEvents();
		setInterval(this.update, 1000 / this.fps);
	}

	Game.prototype.redraw = function() {
		this.canvas.width = this.canvas.width; // clears the canvas 
		this.player.draw(this.context);

		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].draw(this.context);
		};
		// Draw score
		// this.context.lineWidth=1;
		this.context.fillStyle="#222";
		this.context.lineStyle="#ffff00";
		this.context.font="18px sans-serif";
		this.context.fillText("Score: " + this.score, 20, 620); //$('#score').html(this.score);
		
	}

	Game.prototype.update = function() {
		game.totalFrames++;
		game.player.update();

		// Update enemies
		for (var i = 0; i < game.enemies.length; i++) {
			game.enemies[i].update();
		};
		game.redraw();
	}


var Player = function(image) {
	this.image = image;

	this.name = 'Speler 1';

	this.height = this.image.height;
	this.width = this.image.width;

	this.y = game.canvas.height - this.height - 10;
	this.x = game.canvas.width / 2 - this.width / 2;


	this.missiles = [];

	this.speed = 15;
}
	Player.prototype.update = function() {
		for (var i = 0; i < this.missiles.length; i++) {
			missile = this.missiles[i];
			missile.update();
			// Delete missile if missile is out of sight
			if (missile.y + missile.height < 0) {
				this.missiles.splice(i, 1);
			}
		};
	}

	Player.prototype.draw = function(context) {
		context.drawImage(this.image, this.x, this.y);

		for (missile in this.missiles) {
			this.missiles[missile].draw(context);
		}
	}

	Player.prototype.moveLeft = function() {
		this.x -= this.speed;
	}

	Player.prototype.moveRight = function() {
		this.x += this.speed;
	}

	Player.prototype.shoot = function() {
		if (this.missiles.length < 1 || this.missiles[this.missiles.length - 1].y < this.y - this.height - 45) {
			this.missiles[this.missiles.length] = new PlayerMissile(this);
		}
	}

var PlayerMissile = function(player) {
	this.width = 5;
	this.height = 15;
	this.x = player.x + player.width / 2 - this.width / 3;
	this.y = player.y - this.height;

	this.speed = 5;
}
	PlayerMissile.prototype.update = function() {
		this.y -= this.speed;

		for (var i = 0; i < game.enemies.length; i++) {
			if (this.collide(game.enemies[i])) {
				// Remove enemy and missile
				game.score++
				game.enemies.splice(i, 1);
				this.y = -1;
			}
		};
	}

	PlayerMissile.prototype.draw = function(context) {
	 	context.beginPath();
	    context.moveTo(this.x, this.y);
	    context.lineTo(this.x, this.y - this.height);
	    context.lineTo(this.x + this.width, this.y - this.height);
	    context.lineTo(this.x + this.width, this.y);
	    context.fill();
	}

	PlayerMissile.prototype.collide = function(enemy) {
		horizontalCollision = (this.x < enemy.x && enemy.x < (this.x + this.width)) || 
								(this.x < enemy.x + enemy.width && enemy.x + enemy.width < this.x + this.width) ||
								(enemy.x < this.x && this.x + this.width < enemy.x + enemy.width)
		verticalCollision = (this.y < enemy.y && enemy.y < this.y + this.height) || 
								(this.y < enemy.y + enemy.height && enemy.y + enemy.height < this.y + this.height) ||
								(enemy.y < this.y && this.y + this.height < enemy.y + enemy.height)

		return horizontalCollision && verticalCollision;
	}

var Enemy = function(image, x, y) {
	this.image = image;

	this.width = 40; //this.image.width;
	this.height = 20; //this.image.height;

	this.x = x;
	this.y = y;

	this.missiles = [];

	this.speed = 10;
	this.direction = 'right';
}

	Enemy.prototype.draw = function(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);

		for (missile in this.missiles) {
			this.missiles[missile].draw(context);
		}
	}

	Enemy.prototype.update = function(context) {
		if (game.totalFrames % 60 == 1) {
			this.y += this.speed;
		}
		// Walk left or right
	}

	Enemy.prototype.moveLeft = function() {
		this.x -= this.speed;
	}

	Enemy.prototype.moveRight = function() {
		this.x += this.speed;
	}

	Enemy.prototype.shoot = function() {
		if (this.missiles.length < 1 || this.missiles[this.missiles.length - 1].y > this.y + this.height + 45) {
			this.missiles[this.missiles.length] = new EnemyMissile(this);
		}
	}

// Start game
game = new Game();