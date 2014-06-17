// game.js

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game');
var pixelcontent = null;
var pixelWidth = 0;
var pixelHeight = 0;

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);
game.state.add('End', Game.End);

game.state.start('Boot');