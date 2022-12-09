class LoaderScene extends Phaser.Scene {

  constructor(config) {
    super({ key: 'LoaderScene' });
  }

  preload() {
    this.load.spritesheet('graphic', 'boss/assets/spaceinvaders.png', {
      frameWidth: 13 * 4,
      frameHeight: 9 * 4
    });
    this.load.spritesheet('bomb', 'boss/assets/bomb.png', {
      frameWidth: 12,
      frameHeight: 56
    });

    this.load.image('background', 'boss/assets/background.png');
    this.load.image('chris', 'boss/assets/chris.png');
    this.load.image('moveButtons', 'boss/assets/moveButtons.png');
    this.load.image('fireButton', 'boss/assets/fireButton.png');
    this.load.image('bullet', 'boss/assets/bullet.png');
    this.load.audio('explosion', 'boss/assets/audio/explosion.wav');
    this.load.audio('DemonicLaugh', 'assets/audio/DemonicLaugh.mp3');
    this.load.audio('PATHETIC', 'assets/audio/PATHETIC.mp3');
    this.load.audio('shoot', 'boss/assets/audio/shoot.wav');
  }

  create() {
    this.animFactory();
    this.scene.start('GameScene');
  }

  animFactory() {
    this.alienAnimFactory(GC.ALIEN_1);
    this.alienAnimFactory(GC.ALIEN_2);
    this.alienAnimFactory(GC.ALIEN_3);

    this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 1 }),
      frameRate: 2.5,
      repeat: -1
    });
  }

  alienAnimFactory(alienType) {
    this.anims.create({
      key: 'alien' + alienType,
      frames: this.anims.generateFrameNumbers('graphic',
        { start: alienType, end: alienType + 1 }),
      frameRate: 2.5,
      repeat: -1
    });
  }
}
