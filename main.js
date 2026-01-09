const WIDTH = 960;
const HEIGHT = 540;

class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    // 背景
    this.cameras.main.setBackgroundColor(0x060006);

    // 重力
    this.physics.world.gravity.y = 1200;

    // 地面
    this.ground = this.add.rectangle(WIDTH / 2, HEIGHT - 40, WIDTH, 80, 0x140014);
    this.physics.add.existing(this.ground, true);

    // プレイヤー（デザイラ）
    this.player = this.add.rectangle(200, HEIGHT - 140, 36, 56, 0xe0e0ff);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // 敵
    this.enemy = this.add.rectangle(720, HEIGHT - 140, 40, 60, 0xff5555);
    this.physics.add.existing(this.enemy);
    this.enemy.body.setCollideWorldBounds(true);

    // 当たり判定
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.enemy, this.ground);

    // 攻撃判定
    this.attackBox = this.add.rectangle(-9999, -9999, 60, 40, 0x9933ff, 0.15);
    this.physics.add.existing(this.attackBox);
    this.attackBox.body.setAllowGravity(false);
    this.attackActive = false;

    this.physics.add.overlap(this.attackBox, this.enemy, () => {
      if (!this.attackActive) return;
      this.enemyHP -= 10;
      this.enemy.body.setVelocityX(300);
    });

    // 入力
    this.keys = this.input.keyboard.addKeys({
      left: "A",
      right: "D",
      jump: "W",
      attack: "J"
    });

    // ステータス
    this.playerHP = 100;
    this.enemyHP = 40;

    // UI
    this.ui = this.add.text(16, 16, "", {
      fontSize: "18px",
      color: "#ffffff"
    });

    this.facing = 1;
  }

  update() {
    // 左右移動
    if (this.keys.left.isDown) {
      this.player.body.setVelocityX(-240);
      this.facing = -1;
    } else if (this.keys.right.isDown) {
      this.player.body.setVelocityX(240);
      this.facing = 1;
    } else {
      this.player.body.setVelocityX(0);
    }

    // ジャンプ
    if (this.keys.jump.isDown && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-520);
    }

    // 攻撃
    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
      this.attackActive = true;
      this.attackBox.setPosition(
        this.player.x + this.facing * 40,
        this.player.y
      );
      this.time.delayedCall(120, () => {
        this.attackActive = false;
        this.attackBox.setPosition(-9999, -9999);
      });
    }

    // UI更新
    this.ui.setText(
      `DESIRA\nHP: ${this.playerHP}   ENEMY: ${this.enemyHP}\nA/D: Move  W: Jump  J: Attack`
    );

    // 勝敗
    if (this.enemyHP <= 0) {
      this.ui.setText("CLEAR\nDesira awakens.");
      this.scene.pause();
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: { debug: false }
  }
});
