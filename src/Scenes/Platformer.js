class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1000;
        this.JUMP_VELOCITY = -350;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.spawnPointCheck = false;
        this.keyCheck = false;
    }
    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        this.load.audio('terraria', './assets/05_Underground.mp3');
        this.load.audio('jumpaudio', './assets/impactPlank_medium_001.ogg');
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-one", 16, 16, 120, 30);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.detailLayer = this.map.createLayer("Back-n-Ground", this.tileset, 0, 0);
        this.backgroundLayer = this.map.createLayer("Background-n-Objects", this.tileset, 0, 0);


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        //find coins in the "Objects" layer in Phaser
        //Look for them by finding objects with the name "coin"
        //assign the coin texture from the tilemap_sheet sprite sheet
        

        //Audio courtesy of Terraria, "Underground" theme downloaded from https://archive.org/details/05-underground/05+Underground.mp3
        this.myAudio = this.sound.add('terraria');
        this.myAudio.loop = true;
        this.myAudio.play();
        this.myAudio.setVolume(0.1);
        this.jumpAudio = this.sound.add('jumpaudio');
        

        let propertyCollider = (obj1, obj2) => {
            if (obj2.properties.hurts){
                console.log("Player has hit a hazard!");
                if (this.spawnPointCheck == true){
                    my.sprite.player.x = this.spawnPoint.x;
                    my.sprite.player.y = this.spawnPoint.y;
                } else {
                    my.sprite.player.x = 60;
                    my.sprite.player.y = 40;
                }
            }
        }

        this.coins = this.map.createFromObjects("Objects", {
            name: "coins",
            key: "tilemap_sheet",
            frame: 102
        });
        //createFromObjects 
        this.spring = this.map.createFromObjects("Objects", {
            name: "spring",
            key: "tilemap_sheet",
            frame: 163
        });

        //this.spring = this.physics.add.sprite(this.springObj.x, this.springObj.y, "tilemap_sheet",  163);
        ///this.spring.body.setAllowGravity(false);
        ///this.spring.body.setImmovable(true);
        

        this.spawnObj = this.map.findObject("Objects", (obj) => obj.name === "spawnPoint");
        this.spawnPoint = this.physics.add.sprite(this.spawnObj.x, this.spawnObj.y, "tilemap_sheet",  185);
        this.spawnPoint.body.setAllowGravity(false);
        this.spawnPoint.body.setImmovable(true);
        
        this.keyObj = this.map.findObject("Objects", (obj) => obj.name === "key");
        this.key = this.physics.add.sprite(this.keyObj.x, this.keyObj.y, "tilemap_sheet", 96);
        this.key.body.setAllowGravity(false);
        this.key.body.setImmovable(true);

        this.chestObj = this.map.findObject("Objects", (obj) => obj.name === "chest");
        this.chest = this.physics.add.sprite(this.chestObj.x, this.chestObj.y, "tilemap_sheet", 389);
        this.chest.body.setAllowGravity(false);
        this.chest.body.setImmovable(true);

        //this.anims.create({
        //    key: 'spawnAnim',
        //    frames: this.anims.generateFrameNumbers('tilemap_sheet',
        //        {start: 111, end: 112}
        //    ),
        //    frameRate: 3,
        //    repeat: -1
        //});
        this.anims.create({
            key: 'springAnim',
            frames: this.anims.generateFrameNumbers('tilemap_sheet',
                {start: 163, end: 165}
            ),
            frameRate: 15
        });
        this.anims.create({
            key: 'chestAnim',
            frames: this.anims.generateFrameNumbers('tilemap_sheet',
                {start: 389, end: 390}
            ),
            frameRate: 3,
        });
        //this.anims.play('coinAnim', this.coins);
        //this.anims.play('spawnAnim', this.spawnPoint);

        
        // TODO: Add turn into Arcade Physics here
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        this.physics.world.enable(this.spring, Phaser.Physics.Arcade.STATIC_BODY);
        this.springGroup = this.add.group(this.spring);

        

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(60, 40, "platformer_characters", 240);
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer, propertyCollider);

        // TODO: Add coin collision handler
        this.coinVFX = this.add.particles(0,0, "tilemap_sheet", {
            frame: 102,
            emitting: false,
            scale: {start: 1.0, end: 0.1},
            lifespan: 500,
            alpha: {start: 1, end: 0.1},
            speed: {min: 50, max: 100},
            gravityY: 1000,
            quantity: 3
        });
        this.keyVFX = this.add.particles(0,0, "kenny-particles", {
            frame: ['star_08.png'],
            emitting: false,
            scale: {start: 0.1, end: 0.05},
            lifespan: 500,
            alpha: {start: 1, end: 0.1},
            speed: {min: 50, max: 100},
            gravityY: 1000,
            quantity: 3
        });
        
        
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.coinVFX.explode(3, obj2.x, obj2.y);
            obj2.destroy();
        });
        this.physics.add.collider(my.sprite.player, this.springGroup, (player, spring) => {
            player.body.setVelocityY(-500);
            this.anims.play('springAnim', spring);
        });

        this.physics.add.overlap(my.sprite.player, this.spawnPoint, (obj1, obj2) => {
            console.log("Player has reached the spawn point!");
            if (!this.spawnPointCheck){
                this.spawnPointCheck = true;
                console.log(this.spawnPointCheck);
            }
        });
        this.physics.add.overlap(my.sprite.player, this.key, (obj1, obj2) => {
            this.keyVFX.explode(3, obj2.x, obj2.y);
            this.keyCheck = true;
            console.log(this.keyCheck);
            this.key.destroy();
            
        });

        this.winTextShown = false;
            this.physics.add.overlap(my.sprite.player, this.chest, (obj1, obj2) => {
                if (this.keyCheck == true && !this.winTextShown){
                    this.anims.play('chestAnim', this.chest);
                    this.add.text(my.sprite.player.x, my.sprite.player.y -50, "Congrats! Press R to restart", {
                        fontFamily: 'Arial',
                        fontSize: 24,
                        color: '#ffffff',
                        align: 'center'
                    }).setOrigin(0.5, 0.5);
                    this.winTextShown = true;
                    my.sprite.player.setVelocityX(0);
                }
            });
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.groundLayer.renderDebug(this.add.graphics(), {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
        my.vfx = {};
        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0,0, "kenny-particles", {
            frame: ['scorch_03.png', 'smoke_02.png'],
            scale: {start: 0.03, end: 0.01},
            lifespan: 150,
            alpha: {start:1, end: 0.1},

        });
        my.vfx.walking.stop();

        my.vfx.jump = this.add.particles(0,0, "kenny-particles", {
            frame: ['muzzle_01.png'],
            scale: {start: 0.05, end: 0.01},
            lifespan: 250,
            alpha: {start:1, end: 0.1}
        });
        my.vfx.jump.stop();

        // TODO: add camera code here
        console.log(this.map.widthInPixels/2, this.map.heightInPixels/2);
        this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, false, 0.5, 0.5);
        this.cameras.main.setDeadzone(50,50);
        this.cameras.main.setZoom(this.SCALE);

        this.animatedTiles.init(this.map);

    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down){
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(false, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down){
                my.vfx.walking.start();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            this.jumpAudio.play({volume: 1.0});
            //my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayHeight/2-5, false);
            //my.vfx.jump.start();
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpAudio.play();
            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jump.start();

        } else {
            this.jumpAudio.stop();
            my.vfx.jump.stop();
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.myAudio.stop();
            this.scene.restart();
        }
        //console.log(my.sprite.player.y);
        //console.log(this.spawnPoint.x);
        if ((my.sprite.player.y > this.map.heightInPixels) || (my.sprite.player.x > this.map.widthInPixels)){
            if (this.spawnPointCheck == true){
                my.sprite.player.x = this.spawnPoint.x;
                my.sprite.player.y = this.spawnPoint.y;
            } else {
                my.sprite.player.x = 60;
                my.sprite.player.y = 40;
            }
        }
        
    }
}
