// menu.js

Game.Menu = function (game) {
	
};

Game.Menu.prototype = {

	create: function () {

		this.cursor = game.input.keyboard.createCursorKeys();

		var logo = game.add.sprite(width / 2, 0, 'logo');
		logo.anchor.setTo(0.5, 0.5);
		game.add.tween(logo).to({ y: 72 }, 1000, Phaser.Easing.Bounce.Out).start();

		var label = game.add.bitmapText(width / 2 - (logo.x / 2), height - 48, 'bitmapFont', 'Press UP \nto start', 22);

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