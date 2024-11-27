import Phaser from "phaser";

class EnemysPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        const startX = Phaser.Math.Between(50, scene.game.config.width - 50); 
        const startY = -100;
        const enemyType = Phaser.Math.Between(0, 1);
        const spriteKey = enemyType === 0 ? 'enemy_1' : 'enemy_2'; 
        super(scene, startX, startY, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.24);

        this.speed = enemyType === 0 ? 390 : 520; 
        this.body.setVelocityY(this.speed);  

        this.body.setOffset((this.width - this.body.width) / 2, (this.height - this.body.height) / 2);
    
    }

    update(time, delta) {
        this.y += this.speed *(delta/1000); 
        // Destruye el enemigo si sale de la pantalla
        if (this.y > this.scene.game.config.height) {
            this.destroy();
        }
    }
}

export default EnemysPrefab;
