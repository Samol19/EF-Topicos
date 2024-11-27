import Phaser from "phaser"

class PreloadScene extends Phaser.Scene{
    constructor(){
        super("PreloadScene");
    }
    preload(){  
        //examen
        this.load.image('portada', 'assets/images/back.jpg'); 
        this.load.image('player', 'assets/images/player.png'); 
        this.load.image('enemy_1', 'assets/images/enemy_1.png'); 
        this.load.image('enemy_2', 'assets/images/enemy_2.png'); 
        this.load.image('bullet', 'assets/images/bullet.png'); 



        this.load.audio('shoot_audio',['assets/audio/shoot.ogg']); 
        this.load.audio('damage_audio',['assets/audio/damage.ogg']) ;
        this.load.audio('destroyed_audio',['assets/audio/destroyed.mp3']); 
        this.load.audio('background_music',['assets/audio/theme.ogg']);
    }               
    create(){
        this.scene.start('StartScene');
    }
}
export default PreloadScene