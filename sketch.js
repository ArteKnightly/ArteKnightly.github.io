// sketch.js
let particles = [];
let angle = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create a 3D canvas
    noFill();
    stroke(255);
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0);
    rotateY(angle); // Rotate the scene

    // Draw and update particles
    for (let p of particles) {
        p.followMouse(); // Make particles follow the mouse closely
        p.update();
        p.display();
    }

    // Draw a rotating cube in the center
    push();
    translate(0, 0, -200); // Position the cube in front of the particles
    rotateX(angle * 0.5);
    rotateY(angle * 0.5);
    box(100);
    pop();

    angle += 0.01; // Increment rotation angle for cube and scene
}

class Particle {
    constructor() {
        this.pos = createVector(random(-width, width), random(-height, height), random(-200, 200));
        this.vel = p5.Vector.random3D();
    }

    followMouse() {
        let target = createVector(mouseX - width / 2, mouseY - height / 2);
        let dir = p5.Vector.sub(target, this.pos);
        dir.normalize();
        this.vel.add(dir.mult(0.5)); // Make particles follow the mouse closely
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
