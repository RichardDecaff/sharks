var fishes = [];
var food = [];
var poison = [];

function setup() {
    createCanvas(800, 600);
    for (var i = 0; i < 10; i++) {
        var x = random(width);
        var y = random(height);
        fishes.push(new Fish(x, y));
    }
    for (var i = 0; i < 100; i++) {
        var x = random(width);
        var y = random(height);
        food.push(createVector(x, y));
    }
    for (var i = 0; i < 50; i++) {
        var x = random(width);
        var y = random(height);
        poison.push(createVector(x, y));
    }
}

function draw() {

    background(51);

    if(random(1)< 0.1){
        var x = random(width);
        var y = random(height);
        food.push(createVector(x, y));
    }
    if(random(1)< 0.01){
        var x = random(width);
        var y = random(height);
        poison.push(createVector(x, y));
    }
    for (var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 8, 8);
    }
    for (var i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 8, 8);
    }
    for (var i = fishes.length-1; i >=0; i--) {
        fishes[i].boundaries();
        fishes[i].behaviours(food, poison);
        fishes[i].update();
        fishes[i].display();
        var newFish = fishes[i].reproduce();
        if(newFish != null){
            fishes.push(newFish);
        }
        if(fishes[i].dead()){
            food.push(createVector(fishes[i].position.x, fishes[i].position.y));
            fishes.splice(i,1);
        }
    }
}