import PreloadScene from "./states/Preload";
import GameScene from "./states/Game";
import StartScene from "./states/Start";
let config = {
    width: 840, //100% del escenario
    height: 1080,
    scene: [PreloadScene,GameScene,StartScene],
    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics:{
        default : 'arcade',
        arcade:{
            debug:false,
            gravity:{
                y:1000
            }
        }

    }
};
new Phaser.Game(config);