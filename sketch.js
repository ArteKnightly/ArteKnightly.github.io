// cool-background.js
let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    stroke(255);
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0, 25); // Add alpha to create a fading trail effect
    translate(width / 2, height / 2);

    let target = createVector(mouseX - width / 2, mouseY - height / 2); // Attraction target

    for (let p of particles) {
        p.attract(target); // Attract to the mouse position
        p.update();
        p.display();
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(-width, width), random(-height, height));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = random(2, 6);
    }

    attract(target) {
        let force = p5.Vector.sub(target, this.pos);
        let distance = force.mag();
        distance = constrain(distance, 5, 25); // Limit the distance
        force.normalize();
        let strength = 10 / (distance * distance); // Adjust the strength as needed
        force.mult(strength);
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    display() {
        stroke(255, 150); // Reduce particle opacity for the trail effect
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
    }
}
