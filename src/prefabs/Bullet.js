import Phaser from "phaser";

class BulletPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet'); 
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.4); 
        this.body.setAllowGravity(false);
        this.body.setSize(this.width, this.height);

    }

    update(time, delta) {
        //movimiento de bala
        this.y -= 1200*(delta/1000); 
        if (this.y < 0) {
            this.destroy();
        }
    }
}

export default BulletPrefab;
