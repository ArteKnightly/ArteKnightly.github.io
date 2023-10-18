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
    background(0);
    translate(width / 2, height / 2);

    let scrollX = (mouseX - width / 2) / 100;
    let scrollY = (mouseY - height / 2) / 100;

    for (let p of particles) {
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

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.pos);
        dir.setMag(0.5);
        this.applyForce(dir);

        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    display() {
        stroke(255);
        point(this.pos.x, this.pos.y);
    }
}
