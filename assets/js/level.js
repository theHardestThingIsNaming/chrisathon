BasicGame.Level = function (game) {

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.id; // level number
};

BasicGame.Level.prototype = {
    init: function (id, onMobile) {
        this.id = id;
        this.onMobile = onMobile;
    },

    preload: function () {
        this.load.image('terrain', 'assets/js/assets/levels/terrain' + this.id + '.png');
        this.load.json('positions', 'assets/js/assets/levels/positions' + this.id + '.json');
    },

    create: function () {
        this.game.debugOn = false;

        if (this.game.debugOn) {
            this.game.time.advancedTiming = true;
        }

        this.game.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.game.world.setBounds(0, 0, 3000, 1000);
        this.width = this.game.world.bounds.width;
        this.height = this.game.world.bounds.height;

        this.background = new Background(this.game, this.game.world.bounds.width, this.game.world.bounds.height);
        this.game.terrain = this.game.add.bitmapData(this.width, this.height);
        this.game.terrain.addToWorld();
        this.game.terrain.draw('terrain', 0, 0);
        this.game.terrain.update();

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 1400;

        this.game.spriteCG = this.physics.p2.createCollisionGroup();
        this.game.dummyCG = this.physics.p2.createCollisionGroup();
        this.game.wireCG = this.physics.p2.createCollisionGroup();
        this.game.gemCG = this.physics.p2.createCollisionGroup();
        this.physics.p2.updateBoundsCollisionGroup();

        this.positions = this.cache.getJSON('positions');

        this.game.player = new Player(this.game, this.positions.start[0], this.positions.start[1] - 100);
        this.game.player.body.setCollisionGroup(this.game.spriteCG);
        this.game.player.body.collides(this.game.spriteCG);

        this.startCloud = new Cloud(this.game, this.positions.start[0], this.positions.start[1]);
        this.startCloud.body.setCollisionGroup(this.game.spriteCG);
        this.startCloud.body.collides(this.game.spriteCG);

        this.finishCloud = new FinishCloud(this.game, this.positions.finish[0], this.positions.finish[1]);
        this.finishCloud.body.setCollisionGroup(this.game.spriteCG);
        this.finishCloud.body.collides(this.game.spriteCG);

        this.game.camera.follow(this.game.player);
        this.timer = 0;
        this.timer2 = 0;
        this.game.playerHasMoved = false;
        this.game.playerWins = false;

        this.game.score = 0;
    },

    update: function () {
        if (!this.game.playerHasMoved && this.timer > 1 && this.message == null) {
            this.message = new Message(this.game, 'LEVEL ' + (this.id + 1), '      TAP and hold to swing\n\nMove finger while holding to shoot', false);
        }

        if (!this.game.playerHasMoved && (this.input.pointer1.isDown || this.game.spacebar.isDown)) {
            this.game.playerHasMoved = true;
            this.message.destroy();
            this.message = null;
        }

        if (!this.game.player.playerAlive) {
            if (this.message == null) {
                this.message = new Message(this.game, 'MESSY :(', 'Scrape off the vomit and get back to it', true);
            }

            this.game.player.frame = 2;
            this.quitGame('Level', this.id);
        }

        if (this.game.playerWins) {
            if (this.id < 2) {
                if (this.message == null) {
                    this.message = new Message(this.game, 'ONE MOAR FOR LUCK', '', true);
                    localStorage.setItem('currentlevel', (this.id + 1).toString());
                }
                this.quitGame('Level', this.id + 1);
            } else {
                if (this.message == null) {
                    this.message = new Message(this.game, 'WE MADE IT', 'BOSS FIGHT!', true);
                    localStorage.setItem('currentlevel', '0');
                    window.location.href = '/bossfight.html';
                }
            }

            this.game.player.allowAction = false;
            this.game.player.body.velocity.x = 0;
            this.game.player.body.velocity.y = 0;
            this.game.player.showPointer = false;
            this.game.player.wireBitmap.clear();
            this.game.player.frame = 0;
        }
        this.timer++;
    },

    render: function () {
        if (this.game.debugOn) {
            this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, "#00ff00");
        }
    },

    quitGame: function (state, id) {
        this.timer2++;
        if (this.timer2 > 30 && (this.input.pointer1.isDown || this.game.spacebar.isDown)) {

            this.background.destroy();
            this.message.destroy();
            this.message = null;
            this.game.terrain.destroy();
            this.game.player.destroy();
            this.startCloud.destroy();
            this.finishCloud.destroy();

            this.state.start(state, true, false, id, this.onMobile);
        }
    }
};