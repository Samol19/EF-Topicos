import Phaser from "phaser"
import EnemysPrefab from "../prefabs/Enemy";
import BulletPrefab from "../prefabs/Bullet";
class GameScene extends Phaser.Scene{
    constructor(){
        super("GameScene");
    }
    init(){

        this.life=3;
        this.timeTotal=165; //1:30 de tiempo de juego
        this.timerElapsed = 0; //contador de tiempo real
        this.PLAYER_SPEED=1000;
        this.isGameOver=false;
        this.Score=0;
        this.damageAudio = this.sound.add('damage_audio')
        this.shootAudio = this.sound.add('shoot_audio')
        this.destroyAudio = this.sound.add('destroyed_audio')
    }
    create(){
        this.physics.world.gravity.y = 0;
        //fondo
        this.background = this.add.image(0,0,'portada');
        this.background.setOrigin(0,0);
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta el tamaño de la imagen al tamaño de la pantalla
        //Jugador
        this.player = this.add.sprite(100, this.game.config.height* 8/9, 'player');
        this.physics.world.enable(this.player);  
        this.player.body.setCollideWorldBounds(true);  
        this.player.setScale(0.3)
        this.player.body.setAllowGravity(false); 


        // Teclas para mover el personaje (WASD) y cambiar su textura
        this.cursors = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();
        //Crear timer cada 4 segundos se crea enemigo
        this.time.addEvent({
            delay: 4000,
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        //crear bala
        this.input.on('pointerdown', this.shootBullet, this);

        //collider
        this.physics.add.overlap(this.player, this.enemies, this.hurt, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.detroyEnemy, null, this);

        //text score
        this.scoreText = this.add.text(50, 10, 'Score: 0', { font: '36px "Sour Gummy"', fill: '#FFFFFF' });
        this.scoreText.setOrigin(0, 0); 

        //life score
        this.lifeText = this.add.text(50, 70, 'Vidas: 3', { font: '36px "Sour Gummy"', fill: '#FFFFFF' });
        this.lifeText.setOrigin(0, 0); 

        //text time
        this.timerText = this.add.text(this.game.config.width-100, 10, '1:30', { font: '36px "Sour Gummy"', fill: '#FFFFFF' });
        this.timerText.setOrigin(0, 0); 

        
    }
    update(time,delta){

        //MOVIMIENTO JUGADOR
        if (this.cursors.A.isDown) { 
            if (this.player.x > 0) {
                this.player.x -= this.PLAYER_SPEED * (delta / 1000);
            }
        }
        if (this.cursors.D.isDown) { 
            if (this.player.x < this.game.config.width) {
                this.player.x += this.PLAYER_SPEED * (delta / 1000);
            }
        }

        //ACTUALIZAR ENTIDADES PREFABS
        this.enemies.children.iterate(enemy => {
            if (enemy) {
                enemy.update(time, delta);
            }
        });
        this.bullets.children.iterate(bullet => {
            if (bullet) {
                bullet.update(time, delta);
            }
        });


        //GAMEOVER
        if(this.isGameOver){
            return;
        }
        if(this.timeTotal<=0||this.life<=0){
            this.gameOver();
        }

        this.updateTimer();

    }
    hurt(player,enemies){
        this.damageAudio.play();
        this.damageAudio.setVolume(0.5);
        this.life-=1;
        this.updateLife();
        enemies.destroy();
    }
    detroyEnemy(bullet,enemy){
        this.destroyAudio.play();
        //AUMENTAR 10 O 5 PUNTOS DEPENDIENDO DEL ENEMIGO
        if (enemy.texture.key === 'enemy_1') {
            this.Score += 10; 
        } else if (enemy.texture.key === 'enemy_2') {
            this.Score += 5;   
        }
        bullet.destroy();
        enemy.destroy();
        this.updateScore();
    }

    createEnemy(){
        const enemy = new EnemysPrefab(this);
        this.enemies.add(enemy);
    }
    shootBullet(pointer) {
        this.shootAudio.play();
        this.shootAudio.setVolume(0.5);
        // Crear una bala en la posición del jugador y dispararla hacia arriba
        const bullet = new BulletPrefab(this, this.player.x, this.player.y);
        this.bullets.add(bullet);
    }

    updateScore() {
        this.scoreText.setText('Score: ' + this.Score); // Actualiza el texto con el puntaje actual
    }
    updateLife() {
        this.lifeText.setText('Vidas: ' + this.life); // Actualiza el texto con el puntaje actual
    }
    updateTimer() {
     this.timerElapsed += 1 / 160; //calcular tiempopor frames
    
    if (this.timerElapsed >= 1) {
        this.timerElapsed = 0;
        if (this.timeTotal > 0) {
            this.timeTotal -= 1; //restar segundos
        }
    }

    const minutes = Math.floor(this.timeTotal / 60);
    const seconds = Math.floor(this.timeTotal % 60);
    this.timerText.setText(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }


    gameOver(){
        //ELIMINAR TODO DE ESCENA
        this.player.anims.stop();
        this.player.destroy();
        this.enemies.clear(true, true);
        this.bullets.clear(true, true);
        this.showGameOver();
        if (this.isGameOver) 
        this.time.removeAllEvents(); 
 
    }
    showGameOver(){
        this.isGameOver=true;
        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x000000, 1);
        this.overlay.setAlpha(0)
        this.overlay.fillRect(
            0, 0,
            this.game.config.width, this.game.config.height);


            let maxScore = parseInt(localStorage.getItem('maxScore'), 10);

            if (isNaN(maxScore)) { 
                maxScore = 0;
            }
        
            if (this.Score > maxScore) {
                maxScore = this.Score;
                localStorage.setItem('maxScore', maxScore); 
            }
        this.tweens.add(
            {
                targets: this.overlay,
                alpha: 0.55,
                duration: 500,
                onComplete: () => {
                    //this.background.setVisible(false);
                    //this.water.setVisible(false);
                    let style = { font: '30px Arial', fill: '#fff' };
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 - 30,
                        'GAME OVER', style
                    ).setOrigin(0.5);
                    style = { font: '20px Arial', fill: '#fff' };
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 + 50,
                        'High Score: ' + localStorage.maxScore, style
                    ).setOrigin(0.5);
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 + 80,
                        'Current Score: '+ this.Score, style
                    ).setOrigin(0.5);
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 + 10,
                        'Presiona para volver a jugar', style
                    ).setOrigin(0.5);
                    this.input.once('pointerdown', this.restart, this);
                }

            }

        );
    }
    

    restart(){
        this.scene.start('StartScene')
    }

}
export default GameScene