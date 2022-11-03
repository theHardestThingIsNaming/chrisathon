
BasicGame.Preloader = function (game) {
};

BasicGame.Preloader.prototype = {

	preload: function () {
		this.load.bitmapFont('carrier_command', 'assets/js/assets/carrier_command.png', 'assets/js/assets/carrier_command.xml');

		this.load.spritesheet('player', 'assets/js/assets/chris.png', 52, 72);
        this.load.spritesheet('kaboom', 'assets/js/assets/explode.png', 128, 128);

		this.load.image('cloud', 'assets/js/assets/cloud.png');
		this.load.image('cloud_finish', 'assets/js/assets/cloud_finish.png');
		this.load.image('gem', 'assets/js/assets/gem.png');
		this.load.image('bullet', 'assets/js/assets/bullet.png');
        this.load.image('hud_gem', 'assets/js/assets/hud_gem.png');
		this.load.image('indicator', 'assets/js/assets/indicator.png');
	},

	create: function () {
	},

	update: function () {
        this.state.start('MainMenu');
	}

};
