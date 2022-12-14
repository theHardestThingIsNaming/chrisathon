Message = function (game, msg, subMsg, blink) {
    // dummy sprite to have update function
    Phaser.Sprite.call(this, game, 0, 0);
    game.add.existing(this);

    this.game = game;
    this.timer = 0;
    this.blink = blink;

    this.textHeight = this.game.camera.height * 0.15
    this.msg = this.game.add.bitmapText(this.game.camera.width / 2, this.textHeight, 'carrier_command', msg, 48);
    this.msg.x -= this.msg.textWidth * 0.5;
    this.msg.y -= this.msg.textHeight * 0.5;
    this.msg.tint = 0x00F1FF;
    this.msg.fixedToCamera = true;


    this.subtextHeight = this.textHeight + 100
    this.subMsg = this.game.add.bitmapText(this.game.camera.width / 2, this.subtextHeight, 'carrier_command', subMsg, 22);
    this.subMsg.x -= this.subMsg.textWidth * 0.5;
    this.subMsg.y -= this.subMsg.textHeight * 0.5;
    this.subMsg.tint = 0x00e2fb;
    this.subMsg.fixedToCamera = true;
};

Message.prototype = Object.create(Phaser.Sprite.prototype);
Message.prototype.constructor = Message;

Message.prototype.update = function () {
    if (this.blink) {
        this.subMsg.alpha = 0.5 * (Math.sin((3 * this.timer / 360) * 2 * Math.PI) + 1);
        this.timer++;
        if (this.timer == 360) { this.timer = 0; }
    }
};

Message.prototype.destroy = function () {
    this.msg.destroy();
    this.subMsg.destroy();
    this.pendingDestroy = true;
};



Background = function (game, width, height) {
    this.bg = game.add.bitmapData(width, height);
    this.bg.addToWorld();

    var n = height / 5 + 1;
    var y = 0;

    for (var i = 0; i < n; i++) {
        var c = Phaser.Color.interpolateColor(0x290297, 0xfc1afc, n, i);
        this.bg.rect(0, y, width, y + 5, Phaser.Color.getWebRGB(c));
        y += 5;
    }
};

Background.prototype.constructor = Background;

Background.prototype.destroy = function () {
    this.bg.destroy();
};
