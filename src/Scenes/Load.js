class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        
        // Load characters spritesheet
        //this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
        this.load.spritesheet("platformer_characters", "monochrome_tilemap_transparent_packed.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        // Load tilemap information
        

        this.load.image("tilemap_tiles", "monochrome_tilemap_transparent_packed.png");   // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-one", "platformer-level-one.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        
    

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("platformer_characters", {frames: [241, 242, 243]}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("platformer_characters", {frames: [240]}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers("platformer_characters", {frames: [244]}),
        });

         // ...and pass to the next Scene
         console.log("Load scene complete, starting platformerScene");
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}