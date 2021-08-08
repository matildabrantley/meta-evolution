// const Life = require('./life');
// const Vector = require('./vector');

class Group extends Phaser.Physics.Arcade.Group {
    constructor(world, scene, config, goal){
        super(world, scene, config);
        this.lives = [];
        this.scene = scene;
        this.world = world;

        this.timer1 = 0;
        this.genLength = 10;
        this.goal = goal;
        this.selectionCutoff = 0.15;

        //for updateFast()
        this.timer2 = 0;
        this.fastGenLength = 50;
    }

    //maintains array of easily accessible Life objects
    simplify() {
        this.lives = this.getChildren();

        for (let life of this.lives)
            life.startingDistFromGoal = Phaser.Math.Distance.BetweenPoints(life, this.goal);
    }

    //normal updating within Phaser's/Matter's loop
    updateWithEngine() {
        this.timer1++;
        for (let life of this.lives) {
            life.update(this.goal);

            //Better for fitness to be managed by group for many reasons
            life.fitness += life.startingDistFromGoal / (Phaser.Math.Distance.BetweenPoints(life, this.goal) + 1);


            //This just gives fitness based on bottom-right motion, 
            //for debugging fitness and selection in simplest case:
            // life.fitness += life.x;
            // life.fitness += life.y;
        }

        if (this.timer1 % this.genLength == 0){
           this.selection();
        }
    }

    //simplified fast updating without a framework/renderer/engine, and very limited physics
    async updateFast() {
        this.timer2++;
        for (let i=0; i < this.lives.length; i++) 
            this.lives[i].updateFast();

        if (this.timer2 % this.fastGenLength == 0){
            this.selection();
        }
    }

    //generational change in group where fitness is sorted and replacement and mutation occur
    selection() {
        if (this.genLength < 500)
            this.genLength += 10;
        this.timer1 = 0;

        //fitness sorting function in which more fit lives move to front
        this.lives.sort((b, a) => (a.fitness > b.fitness) ? 1 : -1);

        for (let i=this.lives.length-1; i > this.lives.length * this.selectionCutoff; i--) {
            let moreFit = Math.floor(Math.random() * Math.floor(this.lives.length * this.selectionCutoff));
            this.lives[i].mind.cluster.replaceAndMutate(this.lives[moreFit].mind.cluster, 0.05);
        }

        //Elite Selection: Best 5 always get spot(s) in next generation without mutation
        if (this.lives.length > 3) {
            this.lives[this.lives.length - 1].mind.cluster.replaceAndMutate(this.lives[0].mind.cluster, 0);
            this.lives[this.lives.length - 2].mind.cluster.replaceAndMutate(this.lives[0].mind.cluster, 0);
            this.lives[this.lives.length - 3].mind.cluster.replaceAndMutate(this.lives[1].mind.cluster, 0);
        } if (this.lives.length > 6) {
            this.lives[this.lives.length - 4].mind.cluster.replaceAndMutate(this.lives[0].mind.cluster, 0);
            this.lives[this.lives.length - 5].mind.cluster.replaceAndMutate(this.lives[0].mind.cluster, 0);
            this.lives[this.lives.length - 6].mind.cluster.replaceAndMutate(this.lives[1].mind.cluster, 0);
        } if (this.lives.length > 10) {         
            this.lives[this.lives.length - 7].mind.cluster.replaceAndMutate(this.lives[1].mind.cluster, 0);
            this.lives[this.lives.length - 8].mind.cluster.replaceAndMutate(this.lives[2].mind.cluster, 0);
            this.lives[this.lives.length - 9].mind.cluster.replaceAndMutate(this.lives[2].mind.cluster, 0);
            this.lives[this.lives.length - 10].mind.cluster.replaceAndMutate(this.lives[3].mind.cluster, 0);
        } if (this.lives.length > 15) {         
            this.lives[this.lives.length - 11].mind.cluster.replaceAndMutate(this.lives[3].mind.cluster, 0);
            this.lives[this.lives.length - 12].mind.cluster.replaceAndMutate(this.lives[3].mind.cluster, 0);
            this.lives[this.lives.length - 13].mind.cluster.replaceAndMutate(this.lives[4].mind.cluster, 0);
            this.lives[this.lives.length - 14].mind.cluster.replaceAndMutate(this.lives[4].mind.cluster, 0);
            this.lives[this.lives.length - 15].mind.cluster.replaceAndMutate(this.lives[5].mind.cluster, 0);
        } if (this.lives.length > 20) {         
            this.lives[this.lives.length - 16].mind.cluster.replaceAndMutate(this.lives[5].mind.cluster, 0);
            this.lives[this.lives.length - 17].mind.cluster.replaceAndMutate(this.lives[6].mind.cluster, 0);
            this.lives[this.lives.length - 18].mind.cluster.replaceAndMutate(this.lives[7].mind.cluster, 0);
            this.lives[this.lives.length - 19].mind.cluster.replaceAndMutate(this.lives[8].mind.cluster, 0);
            this.lives[this.lives.length - 20].mind.cluster.replaceAndMutate(this.lives[9].mind.cluster, 0);
        }

        //reset
        for (let life of this.lives){
            life.setPosition(Math.random() * 800, Math.random() * 600);
            this.goal.setPosition(Math.random() * 800, Math.random() * 600);
            life.startingDistFromGoal = Phaser.Math.Distance.BetweenPoints(life, this.goal);
            life.fitness = 0;
            
        }
       
    }

}