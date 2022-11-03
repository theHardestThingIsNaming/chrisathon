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
        isInitializedInPotrait = this.scale.isGamePortrait;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.forceOrientation(true, false);
        this.scale.enterIncorrectOrientation.add(handleIncorrect);
        this.scale.leaveIncorrectOrientation.add(handleCorrect);
        this.scale.setScreenSize = true;
        this.stage.scale.pageAlignHorizontally = true;
        this.stage.scale.pageAlignVeritcally = true;
        this.state.start("Preloader");
    }
};

