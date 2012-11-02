var Player = function(image) {
	this.image = image;

	this.name = 'Speler 1';

	this.height = this.image.height;
	this.width = this.image.width;

	this.y = game.canvas.height - this.height - 10;
	this.x = game.canvas.width / 2 - this.width / 2;

	this.lives = 3;

	this.missiles = [];

	this.speed = 5;
	this.fireRate = 200;
}
	Player.prototype.update = function() {
		// Update player's missiles
		for (var i = 0; i < this.missiles.length; i++) {
			this.missiles[i].update();
			// Delete missile if missile is out of sight
			if (this.missiles[i].y + this.missiles[i].height < 0) {
				game.player.missiles.splice(i, 1);
			}
		};
	}

	Player.prototype.draw = function(context) {
		context.drawImage(this.image, this.x, this.y);
		this.drawLives(context);

		context.fillStyle = "black";
		for (missile in this.missiles) {
			this.missiles[missile].draw(context);
		}
	}

	Player.prototype.drawLives = function(context) {
		for (var i = 0; i < this.lives; i++) {
			context.drawImage(this.image, 20  + i * (this.width / 2 + 10), 620, this.width / 2, this.height / 2);
		};
	}

	Player.prototype.moveLeft = function() {
		this.x = Math.max(40, this.x - this.speed);
	}

	Player.prototype.moveRight = function() {
		this.x = Math.min(game.width - this.width - 40, this.x + this.speed);
	}

	Player.prototype.shoot = function() {
		if (this.missiles.length < 1 || this.missiles[this.missiles.length - 1].y < this.y - this.height - this.fireRate) {
			this.missiles[this.missiles.length] = new PlayerMissile(this);
		}
	}

	Player.prototype.die = function() {
		this.lives--;
		// Delete all missiles
		game.missiles = [];
		this.missiles = [];

		// Show dieing animation

		if (this.lives == 0) {
			// Gameover
			game.state = 'dead';
		} else {
			// continue playing
		}

		game.sounds['explosion'].play();
	}