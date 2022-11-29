var config = {
  type: Phaser.AUTO,
  parent: 'boss-fight-game',
  width: 800,
  height: 700,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [BootScene, LoaderScene, GameScene]
};

// Bootstrap game
var game;
function startBossFight () {
  game = new Phaser.Game(config);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
}

// Cool resizing function that keeps aspect ratio
function resizeGame() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  } else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}
