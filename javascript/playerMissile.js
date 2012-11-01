var PlayerMissile = function(player) {
	this.width = 5;
	this.height = 15;
	this.x = player.x + player.width / 2 - this.width / 3;
	this.y = player.y - this.height;

	this.speed = 5;

	game.sounds['shoot'].play()
}
	PlayerMissile.prototype.update = function() {
		this.y -= this.speed;
		// Check if missile colides with enemy
		for (var i = 0; i < game.enemies.length; i++) {
			if (this.collide(game.enemies[i]) && !game.enemies[i].dead) {
				// Remove enemy and missile
				game.enemies[i].die();
				this.y = -1;
			}
		};

		for (var i = 0; i < game.flyingSaucers.length; i++) {
			if (this.collide(game.flyingSaucers[i]) && !game.flyingSaucers[i].dead) {
				// Remove enemy and missile
				game.flyingSaucers[i].die();
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
	    context.fillStyle = "white";
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