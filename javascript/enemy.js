var Enemy = function(image, x, y) {
	this.image = image;

	this.width = 40; //this.image.width;
	this.height = 20; //this.image.height;

	this.x = x;
	this.y = y;

	this.speed = game.enemySpeed;

	this.dead = false;
}

	Enemy.prototype.draw = function(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	Enemy.prototype.update = function(context) {
		if (this.dead) { return }

		if (this.x + this.speed < 25 || this.x + this.width + this.speed > game.width - 25) {
			this.moveDown(true);
		}

		this.x += this.speed;

		// Shoot missle randomly
		if (Math.random() < EnemyMissileChance) {
			this.shoot();
		}
	}

	Enemy.prototype.moveDown = function(iterate) {
		this.speed = -1 * this.speed;
		this.y += this.height;

		if (iterate === true) {
			for (var i = 0; i < game.enemies.length; i++) {
				if (game.enemies[i] === this) { continue; }
				game.enemies[i].moveDown();
			};
		}
	}

	Enemy.prototype.shoot = function() {
		if (game.missiles.length < 1 || game.missiles[game.missiles.length - 1].y > this.y + this.height + 45) {
			game.missiles[game.missiles.length] = new EnemyMissile(this);
		}
	}

	Enemy.prototype.die = function() {
		this.dead = true;
		game.score += 10;
	}
