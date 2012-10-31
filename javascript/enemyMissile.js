var EnemyMissile = function(enemy) {
	this.width = 3;
	this.height = 15;
	this.x = enemy.x + enemy.width / 2 - this.width / 3;
	this.y = enemy.y + this.height;

	this.speed = 5;
}
	EnemyMissile.prototype.update = function() {
		this.y += this.speed;
		if (this.collide(game.player)) {
			game.player.die();
			this.y = 1000;
		}
	}

	EnemyMissile.prototype.draw = function(context) {
	 	context.beginPath();
	    context.moveTo(this.x, this.y);
	    context.lineTo(this.x, this.y + this.height);
	    context.lineTo(this.x + this.width, this.y + this.height);
	    context.lineTo(this.x + this.width, this.y);
	    context.fillStyle = "red";
	    context.fill();
	}

	EnemyMissile.prototype.collide = function(player) {
		horizontalCollision = (this.x < player.x && player.x < (this.x + this.width)) || 
								(this.x < player.x + player.width && player.x + player.width < this.x + this.width) ||
								(player.x < this.x && this.x + this.width < player.x + player.width)
		verticalCollision = (this.y < player.y && player.y < this.y + this.height) || 
								(this.y < player.y + player.height && player.y + player.height < this.y + this.height) ||
								(player.y < this.y && this.y + this.height < player.y + player.height)

		return horizontalCollision && verticalCollision;
	}