// load.js

Game = {};

var tileSize = 16;
var width = 160;
var height = 144;
var deaths = 0;


Game.Boot = function (game) { 

};

Game.Boot.prototype = {

	preload: function () {

		this.game.stage.backgroundColor = '#4f5d3e';

		game.load.image('loading_frame', '../../../jumpBoy/assets/loading_frame.png');
		game.load.image('loading_bar', '../../../jumpBoy/assets/loading_bar.png');
	},

	create: function () {
		var pixelCanvas = document.getElementById("pixel");
		pixelcontext = pixelCanvas.getContext("2d");
		pixelWidth = pixelCanvas.width;
		pixelHeight = pixelCanvas.height;
		Phaser.Canvas.setSmoothingEnabled(pixelcontext, false);
		
		this.game.state.start('Load');
	}
	
};

Game.Load = function (game) {

};

Game.Load.prototype = {

	preload: function () {

		label2 = game.add.text(Math.floor(width / 2) + 0.5, Math.floor(height / 2) - 15 + 0.5, 'loading...', { font: '32px Arial', fill: '#fff' });
		label2.anchor.setTo(0.5, 0.5);

		loadingFrame = game.add.sprite(width / 2, height / 2 + 15, 'loading_frame');
		loadingFrame.x -= loadingFrame.width / 2;
		loadingBar = game.add.sprite(width / 2, height / 2 + 22, 'loading_bar');
		loadingBar.x -= loadingBar.width/2;
		game.load.setPreloadSprite(loadingBar);

		this.game.load.tilemap('map1', '../../../jumpBoy/levels/Level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('map2', '../../../jumpBoy/levels/Level2.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.tilemap('map3', '../../../jumpBoy/levels/Level3.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', '../../../jumpBoy/assets/jumpTileSet.png');

		this.game.load.spritesheet('player', '../../../jumpBoy/assets/jumpMan.png', 10, 16, 2);
		this.game.load.image('coin', '../../../jumpBoy/assets/coin.png');
		this.game.load.image('blade', '../../../jumpBoy/assets/sawBlade.png');
		this.game.load.image('door', '../../../jumpBoy/assets/door.png');

		this.game.load.audio('jump', '../../../jumpBoy/assets/sounds/jump.wav');
		this.game.load.audio('coin', '../../../jumpBoy/assets/sounds/coin.wav');
		this.game.load.audio('music', '../../../jumpBoy/assets/sounds/music.mp3');
		this.game.load.audio('death', '../../../jumpBoy/assets/sounds/death.wav');

		this.game.load.bitmapFont('bitmapFont', '../../../jumpBoy/assets/nokia.png', '../../../jumpBoy/assets/nokia.xml');
		this.game.load.image('logo', '../../../jumpBoy/assets/logo_jump.png');
	},
	
	loadRender: function () {
		pixelcontext.drawImage(game.canvas, 0, 0, 160, 144, 0, 0, pixelWidth, pixelHeight);

	},
	
/*
	render: function () {
		pixelcontext.drawImage(game.canvas, 0, 0, 160, 144, 0, 0, pixelWidth, pixelHeight);
	},
*/
	
	create: function () {
		this.game.state.start('Menu');
	}

};