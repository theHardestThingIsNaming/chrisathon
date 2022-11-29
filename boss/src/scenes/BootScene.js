class BootScene extends Phaser.Scene {

  constructor(config) {
    super({ key: 'BootScene' });
  }

  preload() { }

  create() {
    let sizeY = this.game.canvas.height;
    let sizeX = this.game.canvas.width;

    this.loadingText = this.add.text(sizeX / 2, sizeY / 2, 'Loading...');
    this.loadingText.setOrigin(0.5);

    this.scene.start('LoaderScene');
  }
}
