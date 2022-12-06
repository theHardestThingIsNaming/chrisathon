var isInitializedInPotrait;
var BasicGame = {};

BasicGame.Boot = function (game) { };

BasicGame.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;  // only single-finger touch
    },

    preload: function () {
    },

    create: function () {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.scale.startFullScreen();
        this.state.start("Preloader");
    }
};

