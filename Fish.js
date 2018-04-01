var mr = 0.01;
function Fish(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxSpeed = 4;
    this.maxForce = 0.4;
    this.dna=[];
    if (dna == undefined) {
        this.dna[0] = random(-5, 5);
        this.dna[1] = random(-5, 5);
        this.dna[2] = random(0, 100);
        this.dna[3] = random(0, 100);
    } else {
        this.dna[0] = dna[0];
        if(random(1) < mr){
            this.dna[0] += random(-0.1, 0.1);
        }
        this.dna[1] = dna[1];
        if(random(1) < mr){
            this.dna[1] += random(-0.1, 0.1);
        }
        this.dna[2] = dna[2];
        if(random(1) < mr){
            this.dna[2] += random(-5, 5);
        }
        this.dna[3] = dna[3];
        if(random(1) < mr){
            this.dna[3] += random(-5, 5);
        }
    }

    this.health = 1;

    this.update = function () {
        this.health -= 0.005;
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.applyForce = function (force) {
        this.acceleration.add(force);
    }

    this.reproduce = function () {
        if (random(1) < 0.001)
            return new Fish(this.position.x, this.position.y, this.dna);
        else
            return null;
    }

    this.boundaries = function () {
        var desired = null;
        var d = 25;

        if (this.position.x < d) {
            desired = createVector(this.maxSpeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxSpeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxSpeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
    }

    this.dead = function () {
        return (this.health < 0);
    }

    this.behaviours = function (good, bad) {
        var steerG = this.eat(good, 0.3, this.dna[2]);
        var steerB = this.eat(bad, -0.75, this.dna[3]);
        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    this.eat = function (list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(list[i]);

            if (d < this.maxSpeed) {
                list.splice(i, 1);
                this.health += nutrition;
            } else {

                if (d < record && d < perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }

        if (closest != null) {
            return this.seek(closest);
        }
        return createVector(0, 0);
    }

    this.seek = function (target) {
        var desired = p5.Vector.sub(target, this.position);

        desired.setMag(this.maxSpeed);

        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
        //this.applyForce(steer);
    }

    this.display = function () {
        var angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);

        noFill();
        strokeWeight(3);
        stroke(0, 255, 0);
        line(0, 0, 0, -this.dna[0] * 20);
        ellipse(0, 0, this.dna[2] * 2);
        strokeWeight(2);
        stroke(255, 0, 0);
        line(0, 0, 0, -this.dna[1] * 20);
        ellipse(0, 0, this.dna[3] * 2);

        var red = color(255, 0, 0);
        var green = color(0, 255, 0);
        var coloration = lerpColor(red, green, this.health);

        fill(coloration);
        stroke(coloration);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }
}