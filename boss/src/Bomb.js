class Bomb extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, 0, 0, 'bomb');
    this.play('bomb', { volume: 0.3 });
  }

  throw(x, y) {
    this.enableBody(true, x, y, true, true);
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.setVelocityY(300);
  }

  deactivate() {
    this.disableBody (true, true);
  }
}
