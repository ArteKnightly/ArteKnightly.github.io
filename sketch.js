// sketch.js
let particles = [];
let rotation = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create a 3D canvas
    noFill();
    stroke(255);
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0);
    rotateY(rotation); // Rotate the scene
    for (let p of particles) {
        p.jitter(); // Make particles jitter
        p.update();
        p.display();
    }
    rotation += 0.01; // Increment rotation angle for cube
}

class Particle {
    constructor() {
        this.pos = createVector(random(-width, width), random(-height, height), random(-200, 200));
        this.vel = p5.Vector.random3D();
    }

    jitter() {
        this.vel.add(p5.Vector.random3D().mult(0.1)); // Add jitter
    }

    update() {
        this.pos.add(this.vel);
        if (this.pos.x > width || this.pos.x < -width || this.pos.y > height || this.pos.y < -height || this.pos.z > 200 || this.pos.z < -200) {
            this.pos = createVector(random(-width, width), random(-height, height), random(-200, 200));
        }
    }

    display() {
        stroke(255);
        strokeWeight(2);
        point(this.pos.x, this.pos.y, this.pos.z);
    }
}

