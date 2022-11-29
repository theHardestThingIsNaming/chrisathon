class GameScene extends Phaser.Scene {

  constructor(config) {
    super({ key: 'GameScene' });
  }

  create() {
    this.createText();
    const background = this.add.image(0, 0, 'background').setOrigin(0);
    background.setPosition(0, 0);
    this.level = 1;
    this.sound.add('explosion');
    this.sound.add('shoot');
    this.cursors = this.input.keyboard.createCursorKeys();

    const moveButtons = this.add.image(0, 0, 'moveButtons').setOrigin(0);
    moveButtons.setInteractive();
    moveButtons.setScale(0.75);
    moveButtons.setPosition(0, this.game.canvas.height - moveButtons.displayHeight)
    moveButtons.on('pointerdown', (pointer, objectsClicked) => {
      this.handleMove(objectsClicked, moveButtons.displayWidth / 2);
    });

    const fireButton = this.add.image(0, 0, 'fireButton').setOrigin(0);
    fireButton.setInteractive();
    fireButton.setScale(0.5);
    fireButton.setPosition(this.game.canvas.width - fireButton.displayWidth, this.game.canvas.height - fireButton.displayHeight)
    fireButton.on('pointerdown', () => { this.handleKey(); });
    this.rocketMoving = MOVING.STOP;

    this.rocket = rocketFactory.create(this);
    this.bullets = this.physics.add.group({
      maxSize: 20,
      classType: Bullet,
      runChildUpdate: true
    });

    this.bombs = this.physics.add.group({
      maxSize: 20,
      classType: Bomb,
      runChildUpdate: true
    });
    this.alienManager = new AlienManager(this, this.level);

    this.physics.world.on('worldbounds', this.onWorldbounds, this);
    this.alienManager.addColider(this.bullets, this.alienHitEvent, this);
    this.alienManager.addColider(this.rocket, this.alienOnRocketEvent, this);
    this.physics.add.collider(this.rocket, this.bombs, this.bombHitEvent, null, this);
    this.state = STATE.RUN;
  }

  createText() {
    const sizeY = this.game.canvas.height;
    const sizeX = this.game.canvas.width;
    const textConfig =
      { fontSize: '88px', fontFamily: 'Pixel', fill: "#6abe30" };

    this.gameoverText = this.add.text(sizeX / 2, sizeY / 2 - 100,
      'PATHETIC', textConfig)
      .setVisible(false)
      .setDepth(1);
    this.gameoverText.setOrigin(0.5);

    this.beginText = this.add.text(sizeX / 2, (sizeY / 2) - 10,
      'PRESS FIRE TO GET BACK UP', { fontSize: '44px', fontFamily: 'Pixel', fill: "#f70a0a" })
      .setVisible(false)
      .setDepth(2);
    this.beginText.setOrigin(0.5);
  }

  onWorldbounds(body) {
    const isBullet = this.bullets.contains(body.gameObject);
    if (isBullet) {
      body.gameObject.deactivate();
    }

    const isBomb = this.bombs.contains(body.gameObject);
    if (isBomb) {
      body.gameObject.deactivate();
    }

    if (this.state == STATE.RUN) {
      if (this.alienManager.onWorldbounds(body)) {
        this.gameover();
      }
    };
  };

  update() {
    // this.handleCursor();
    this.handleMove();
  }

  handleCursor() {
    if (this.state == STATE.RUN) {
      if (this.cursors.left.isDown) {
        this.rocket.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.rocket.setVelocityX(160);
      } else {
        this.rocket.setVelocityX(0);
      }
    } else {
      this.rocket.setVelocityX(0);
    }
  }

  handleMove(point, split) {
    if (point) {
      if (point < split) {
        this.rocket.setVelocityX(-160);
        this.rocketMoving = MOVING.RIGHT;
      } else {
        this.rocket.setVelocityX(160);
        this.rocketMoving = MOVING.LEFT;
      }
    } else {
      if (this.rocketMoving == MOVING.RIGHT) {
        this.rocket.setVelocityX(-160);

      } else if (this.rocketMoving == MOVING.LEFT) {
        this.rocket.setVelocityX(160);
      } else {
        this.rocketMoving = MOVING.STOP;
        this.rocket.setVelocityX(0);
      }
    }
  }

  fireBullet() {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet.shoot(this.rocket.x - 1, this.rocket.y - 18);
    }
  }

  alienHitEvent(alien, bullet) {
    if (this.state == STATE.RUN && alien.active && bullet.active) {
      bullet.deactivate();
      alien.explode();
      if (this.alienManager.testAllAliensDead()) {
        var endTime = new Date();
        var startTime = Date.parse(localStorage.startTime); // parse to date object
        const sizeY = this.game.canvas.height;
        const sizeX = this.game.canvas.width;
        const textConfig =
          { fontSize: '88px', fontFamily: 'Pixel', fill: "#6abe30" };

        const timescore = (endTime - startTime) / 1000

        this.gameoverText = this.add.text(sizeX / 2, sizeY / 2 - 100,
          "Time: " + timescore + " seconds", textConfig)
          .setVisible(true)
          .setDepth(1);
        this.gameoverText.setOrigin(0.5);
      }
    }
  }

  alienOnRocketEvent(alien, rocket) {
    if (this.state == STATE.RUN && alien.active) {
      this.gameover();
    }
  }

  bombHitEvent(rocket, bomb) {
    if (this.state == STATE.RUN && bomb.active) {
      this.gameover();
    }
  }

  restart() {
    this.alienManager.restart(this.level);
  }

  gameover() {
    this.rocketMoving = MOVING.STOP;
    this.state = STATE.GAMEOVER;
    this.sound.play('explosion');
    this.rocket.play('explosion');
    this.time.removeAllEvents();
    this.alienManager.gameover();
    this.bullets.getChildren().forEach(
      function (bullet) { bullet.deactivate(); }
    );
    this.bombs.setVelocityX(0);
    this.bombs.setVelocityY(0);
    this.gameoverText.setVisible(true);
    this.gameoverText.setDepth(1);
    this.aliensStartVelocity = 40;

    this.time.addEvent({
      delay: 3000,
      callback: function () { this.ready(); },
      callbackScope: this
    });
  }

  ready() {
    this.state = STATE.READY;
    this.beginText.setVisible(true);
  }

  restartGame() {
    this.state = STATE.RUN;
    this.rocketMoving = MOVING.STOP;
    this.rocket.play('rocket');
    this.beginText.setVisible(false);
    this.gameoverText.setVisible(false);
    this.bombs.getChildren().forEach(
      function (bomb) { bomb.deactivate(); }
    );
    this.restart();
  }

  handleKey() {
    if (this.state == STATE.RUN) {
      this.fireBullet();
    } else if (this.state == STATE.READY) {
      this.restartGame();
    } else {
      console.log(this.state);
    }
  }
}

