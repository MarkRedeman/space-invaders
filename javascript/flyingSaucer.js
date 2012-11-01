var FlyingSaucer = function(image) {
	this.image = image;

	this.width = 26; //this.image.width;
	this.height = 24; //this.image.height;

	this.x = 0;
	this.y = this.height / 2;

	this.speed = 1;

	this.dead = false;

	game.sounds['ufo_lowpitch'].play();
}

	FlyingSaucer.prototype.draw = function(context) {
		if (this.dead) { return }
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	FlyingSaucer.prototype.update = function(context) {
		if (this.dead) { return }

		if (this.x > game.width) {
			this.dead = true;
		}
		this.x += this.speed;
	}

	FlyingSaucer.prototype.moveDown = function(iterate) {
		this.speed = -1 * this.speed;
		this.y += this.height / 2;

		if (iterate === true) {
			for (var i = 0; i < game.enemies.length; i++) {
				if (game.enemies[i] === this) { continue; }
				game.enemies[i].moveDown();
			};
		}
	}

	FlyingSaucer.prototype.die = function() {
		this.dead = true;
		var score = Math.floor(Math.random() * 10) * 50;
		console.log(score);
		game.score += score;
		game.sounds['invaderkilled'].play()
	}
