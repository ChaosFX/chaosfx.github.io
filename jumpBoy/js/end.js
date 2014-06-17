// end.js

Game.End = function (game) {

};

Game.End.prototype = {

	create: function () {
		this.cursor = this.game.input.keyboard.createCursorKeys();

		var label = game.add.bitmapText(2, height / 2, 'bitmapFont', 'You died ' + deaths + ' times! \nPress UP to \nrestart', 20);
		label.align = 'center';
	},

	update: function () {
		if (this.cursor.up.isDown) {
			this.game.state.start('Play');
		}
	},
	
	loadRender: function () {
		pixelcontext.drawImage(game.canvas, 0, 0, 160, 144, 0, 0, pixelWidth, pixelHeight);

	}
	
};