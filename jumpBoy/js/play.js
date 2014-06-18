/** 
	play.js
*/

Game.Play = function (game) {

};

Game.Play.prototype = {

	create: function () {

		// Define movement constants
		this.MAX_SPEED = 200;
		this.ACCELERATION = 1500;
		this.GRAVITY = 980;
		this.JUMP_SPEED = -700;

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = this.GRAVITY;

		this.cursor = this.game.input.keyboard.createCursorKeys();

		this.coins = game.add.group();
		this.enemies = game.add.group();
		this.door = game.add.group();
		this.level = 1;
		this.coinsPickedUp = 0;

		this.player = this.game.add.sprite(tileSize, height - tileSize * 4, 'player');
		this.player.animations.add('walk', [0, 1], 60, true);
		this.player.smoothed = false;
		game.physics.enable(this.player);
		this.player.body.setSize(8, 16, 1, 0);
		this.player.body.bounce.y = 0.2;
		this.player.body.linearDamping = 1;
		this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);
		this.canDoubleJump = true;

		this.coinSound = game.add.sound('coin');
		this.jumpSound = game.add.sound('jump');
		this.deathSound = game.add.sound('death');
		music = this.game.add.sound('music');
		music.play('', 0, 0.5, true);

		this.loadMap();

		// this.scoreText = game.add.text(2, 2, '', { font: '16px Arial', fill: '#fffffff' });
		// this.scoreText.fixedToCamera = true;
		// this.scoreText.z = 100;

		game.camera.follow(this.player);
	},

	update: function () {

		// this.scoreText.setText(this.coinsPickedUp + ' Coins');

		game.physics.arcade.collide(this.player, this.layer);
		game.physics.arcade.overlap(this.player, this.coins, this.coinPickUp, null, this);
		game.physics.arcade.collide(this.enemies, this.layer, this.enemyHitWall, null, this);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDied, null, this);

		if (this.player.y > this.game.world.height) {
			this.player.alive = false;
			this.playerDied();
		}

		this.playerMovement();

		if (this.totalCoins === this.coinsPickedUp) {
			this.door.forEach(function (door) {
				door.alpha = 1;
				game.physics.arcade.overlap(this.player, this.door, this.loadMap, null, this);
			}, this);
		}
	},
	
	loadRender: function () {
		pixelcontext.drawImage(game.canvas, 0, 0, 160, 144, 0, 0, pixelWidth, pixelHeight);

	},

	// render: function () {

	// 	this.enemies.forEach(function(coin) {
	// 		game.debug.body(coin);
	// 	}, this);
	// 	game.debug.body(this.player);
	// },

	loadMap: function () {

		if (this.level === 4) {
			game.state.start('End');
			return;
		}
		this.clearMap();

		console.log(this.level);
		this.map = this.game.add.tilemap('map' + this.level);
		if (this.level == 2) {
			this.map.y = 800;
		}
		this.map.addTilesetImage('jumpTileSet', 'tiles');

		this.layer = this.map.createLayer('ground');
		this.map.createFromObjects('objects', 12, 'coin', 0, true, false, this.coins);
		this.map.createFromObjects('objects', 13, 'blade', 0, true, false, this.enemies);
		this.map.createFromObjects('objects', 14, 'door', 0, true, false, this.door);
		this.layer.resizeWorld();

		this.map.setCollisionBetween(1, 10);
		this.player.reset(tileSize, height - tileSize * 4);
		this.level++;
		this.totalCoins = 0;
		this.coinsPickedUp = 0;
		this.addObjects();

		console.log(this.level);
	},

	addObjects: function () {
        
        this.door.forEach(function(door) {
			door.alpha = 0.4;

			game.physics.arcade.enable(door);
			door.body.allowGravity = false;
			door.body.setSize(2, 2, 8, 8);
		}, this);

		this.coins.forEach(function(coin) {
			coin.alive = true;
            coin.anchor.setTo(0.5, 0.5);
            coin.x += coin.width;
            coin.y += coin.width / 2;
			game.physics.arcade.enable(coin);
			coin.body.allowGravity = false;
			var animation = game.add.tween(coin).to({ y:"-5"}, 400).to({ y:"+5"}, 400);
			animation.loop(true).start();
			this.totalCoins++;
			
		}, this);
		console.log('Total Coins: ' + this.totalCoins);

		this.enemies.forEach(function(enemy) {
			game.physics.arcade.enable(enemy);
			enemy.body.allowGravity = false;
			enemy.body.setSize(12, 12, 2, 2);

			if (enemy.move == 0) {
				enemy.body.velocity.x = 100;
				enemy.direction = 1;
			} else if (enemy.move == 1) {
				enemy.body.velocity.y = 100;
				enemy.direction = 1;
			}

		}, this);
		
	},

	coinPickUp: function (player, coin) {

		if (!coin.alive) {
			return;
		}
		this.coinSound.play();
		coin.alive = false;
		var animation = game.add.tween(coin.scale).to({ x: 0, y: 0}, 300).start();
		animation.onComplete.add(function() { this.destroy(); }, coin);
		this.coinsPickedUp += 1;
		console.log('Coins ' + this.coinsPickedUp + ' / ' + this.coins.countDead());
	},

	enemyHitWall: function (enemy, tile) {

		if (enemy.move == 0) {
			if (enemy.direction < 0) {
				enemy.body.velocity.x = 100;
			} else {
				enemy.body.velocity.x = -100;
			} 
		} else if ( enemy.move == 1) {
			if (enemy.direction < 0) {
				enemy.body.velocity.y = 100;
			} else {
				enemy.body.velocity.y = -100;
			}
		}
		enemy.direction *= -1;
	},

	playerMovement: function () {

		var onTheGround = this.player.body.onFloor();
		if (onTheGround) this.canDoubleJump = true;

		if (this.upInputIsActive(5)) {
			
			if (this.canDoubleJump) {
				this.jumpSound.play('', 0, 0.3);
				this.player.body.velocity.y = this.JUMP_SPEED;
				if (!onTheGround) {
					this.canDoubleJump = false;
				}
			}		
		}

		if (this.cursor.left.isDown) {
			this.player.body.velocity.x = -this.ACCELERATION;
			this.player.animations.play('walk');
			this.player.scale.setTo(1, 1);
		}
		else if (this.cursor.right.isDown) {
			this.player.body.velocity.x = this.ACCELERATION;
			this.player.animations.play('walk');
			this.player.scale.setTo(1, 1);
		} 
		else {
			this.player.body.velocity.x = 0;
			this.player.animations.stop();
		}
	},

	upInputIsActive: function (duration) {

		var isActive = false;

		isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);
		return isActive;
	},

	playerDied: function (sprite, tile) {
		this.deathSound.play();
		this.player.reset(tileSize, height - tileSize * 4);
		deaths++;
	},

	clearMap: function () {

		if (this.layer) {
			this.layer.destroy();
		}

		this.coins.callAll('kill');
		this.enemies.callAll('kill');
		this.door.callAll('kill');
	}
};