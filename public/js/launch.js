// const Matter = require('matter-js');
let width = 800;
let height = 600;
let groupPop = 100;
let maxStars = 10;
const species = [];

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    backgroundColor: '#000F00',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create, 
        update: update,
        //render: render
    }
};

var game = new Phaser.Game(config);
let starGroup;
let globalTimer = 0;
let timerText;
let loneStar, blueStar, greenStar, brightStar;
// let chosenPoint;
let tiles, tileset, tileLayer;
let g1, g2, g3, g4;
let distances = [];

function preload () {
    this.load.image('star', 'sprites/star.png');
    this.load.image('bluestar', 'sprites/bluestar.png');
    this.load.image('blackstar', 'sprites/blackstar.png');
    this.load.image('greenstar', 'sprites/greenstar.png');
    this.load.image('circle', 'sprites/circle.png');
    this.load.atlas('redLife', 'sprites/pulsing-red-dot.png', 'sprites/pulsing-red-dot.json');
    this.load.atlas('blueLife', 'sprites/pulsing-blue-dot.png', 'sprites/pulsing-blue-dot.json');
    this.load.atlas('greenLife', 'sprites/pulsing-green-dot.png', 'sprites/pulsing-green-dot.json');
    this.load.atlas('brightLife', 'sprites/pulsing-white-star.png', 'sprites/pulsing-white-star.json');
    
    this.load.atlas('fireSpiral', 'sprites/fire-spiral.png', 'sprites/fire-spiral.json');
    this.load.atlas('waterSpiral', 'sprites/water-spiral.png', 'sprites/water-spiral.json');
    this.load.atlas('natureSpiral', 'sprites/nature-spiral.png', 'sprites/nature-spiral.json');
    this.load.atlas('windSpiral', 'sprites/wind-spiral.png', 'sprites/wind-spiral.json');
    this.load.atlas('sparkSpiral', 'sprites/spark-spiral.png', 'sprites/spark-spiral.json');
    this.load.atlas('groundSpiral', 'sprites/ground-spiral.png', 'sprites/ground-spiral.json');
    this.load.atlas('lightSpiral', 'sprites/light-spiral.png', 'sprites/light-spiral.json');
    this.load.atlas('voidSpiral', 'sprites/void-spiral.png', 'sprites/void-spiral.json');

    this.load.image('tiles', 'sprites/all-tiles.png');
    this.load.tilemapTiledJSON('tilemap', 'sprites/tilemap-data.json');
}

function create () {
    this.physics.world.setBounds( 0, 0, width, height );

    

    tiles = this.make.tilemap({ key: 'tilemap', tileWidth: 32, tileHeight: 32 });
    tileset = tiles.addTilesetImage('tiles');
    tileLayer = tiles.createLayer('training-grounds', tileset);

    tiles.setCollision([ 29, 48, 70 ]);

    let goalDivergence = 0.2;

    let goalGroup = this.add.group();
    loneStar = this.physics.add.image(width * (0.5 - goalDivergence), height * (0.5 - goalDivergence), 'star');
    loneStar.setCircle(30);
    loneStar.setScale(4);
    loneStar.setBounce(5);
    loneStar.collideWorldBounds = true;
    goalGroup.add(loneStar);
    
    // blueStar = this.physics.add.image(width * (0.5 + goalDivergence), height * (0.5 - goalDivergence), 'bluestar');
    // blueStar.setCircle(30);
    // blueStar.setScale(4);
    // blueStar.setBounce(5);
    // blueStar.collideWorldBounds = true;
    // goalGroup.add(blueStar);
    
    // blackStar = this.physics.add.image(width * (0.5 + goalDivergence), height * (0.5 + goalDivergence), 'blackstar');
    // blackStar.setCircle(30);
    // blackStar.setScale(5);
    // blackStar.setBounce(5);
    // blackStar.collideWorldBounds = true;
    // goalGroup.add(blackStar);
    
    // greenStar = this.physics.add.image(width * (0.5 - goalDivergence), height * (0.5 + goalDivergence), 'greenstar');
    // greenStar.setCircle(30);
    // greenStar.setScale(5);
    // greenStar.setBounce(5);
    // greenStar.collideWorldBounds = true;
    // goalGroup.add(greenStar);

    let fps = 30;
    const redGroupAnim = createAnimConfig (this, 'redKey', 'redLife', fps, 'pulsing-red-dot0.png') 
    const blueGroupAnim = createAnimConfig (this, 'blueKey', 'blueLife', fps, 'pulsing-blue-dot0.png') 
    const greenGroupAnim = createAnimConfig (this, 'greenKey', 'greenLife', fps, 'pulsing-green-dot0.png') 
    const brightGroupAnim = createAnimConfig (this, 'brightKey', 'brightLife', fps, 'pulsing-white-star0.png') 
    
    const fireSpiralAnim = createAnimConfig (this, 'fireSpiralKey', 'fireSpiral', fps, 'fire-spiral0.png', 0.5); 


    const groupConfig = {world: this.physics.world, scene: this, config: config, tiles: tileLayer, goals: goalGroup};

    //Create empty species with only goals defined
    species.push(new Species({goals: goalGroup, goalsAreMoving: true})); 
    //Create groups
    g1 = species[0].createGroup(groupConfig, redGroupAnim, {pop: groupPop});
    g2 = species[0].createGroup(groupConfig, blueGroupAnim, {pop: groupPop});
    g3 = species[0].createGroup(groupConfig, greenGroupAnim, {pop: groupPop});
    g4 = species[0].createGroup(groupConfig, brightGroupAnim, {pop: groupPop});
    g5 = species[0].createGroup(groupConfig, fireSpiralAnim, {pop: groupPop});
    // species[0].createGroup(groupConfig, redGroupAnim, {pop: 100});
    // species[0].createGroup(groupConfig, blueGroupAnim, {pop: 100});
    // species[0].createGroup(groupConfig, greenGroupAnim, {pop: 100});
    // species[0].createGroup(groupConfig, brightGroupAnim, {pop: 100});
    
    this.physics.add.collider(g1, tileLayer);
    this.physics.add.collider(g2, tileLayer);
    this.physics.add.collider(g3, tileLayer);
    this.physics.add.collider(g4, tileLayer);
    this.physics.add.collider(g5, tileLayer);
    // this.physics.add.collider(loneStar, tileLayer);


    timerText = this.add.text(10, 10, globalTimer);
}

function update () {
    timerText.setText("Update " + globalTimer);
    
    //Let's pretend "specie" is the correct singular of "species" =)
    for (let specie of species)
        specie.update();

    //example of collision handling
    //this.physics.collide(groups[0], loneStar, eat);
    globalTimer++;
}

function eat (creature, food) {
    food.destroy();
    // creature.fitness++;
}

const createAnimConfig = (scene, keyName, spritesheet, fps, firstFrame, animScale = 1) => {
    let animConfig = {
        key: keyName,
        frames: spritesheet,
        frameRate: fps,
        repeat: -1
    };
    scene.anims.create(animConfig);
    return {spritesheet: animConfig.frames, key: animConfig.key, firstFrame: firstFrame, scale: animScale};
}