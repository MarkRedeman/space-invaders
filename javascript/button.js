var Button = function(image, x, y, action) {
	this.image = image;
	this.x = x;
	this.y = y;

	this.action = action;
}

	Button.prototype.update = function() {
		// If button is pressed, activate action
		if (buttonPressed) {
			this.action();
		}
	}

	Button.prototype.draw = function(context) {
		// If hovering
		// 		Show white background
		context.drawImage(this.image, this.x, this.y);
	}