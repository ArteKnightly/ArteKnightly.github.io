// sketch.js
let particles = [];
let angle = 0;
let trappedParticles = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create a 3D canvas
    noFill();
    stroke(255);
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0);
    rotateY(angle); // Rotate the scene

    // Draw and update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.display();
        p.checkBounds();

        // Check for collision with the cube
        if (p.checkCollision()) {
            particles.splice(i, 1);
            trappedParticles.push(p);
        }
    }

    // Draw a rotating cube in the center
    push();
    translate(0, 0, -200); // Position the cube in front of the particles
    rotateX(angle * 0.5);
    rotateY(angle * 0.5);
    box(100);
    pop();

    angle += 0.01; // Increment rotation angle for cube and scene

    // Restart if all particles are trapped
    if (particles.length === 0 && trappedParticles.length > 0) {
        particles = trappedParticles;
        trappedParticles = [];
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
        this.vel = p5.Vector.random3D().mult(random(2, 4)); // Random initial velocity
        this.size = random(5, 15); // Random size
    }

    update() {
        this.pos.add(this.vel);
    }

    display() {
        stroke(255);
        strokeWeight(2);
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(this.size);
        pop();
    }

    checkBounds() {
        if (
            this.pos.x > width / 2 ||
            this.pos.x < -width / 2 ||
            this.pos.y > height / 2 ||
            this.pos.y < -height / 2 ||
            this.pos.z > 200 ||
            this.pos.z < -200
        ) {
            this.vel.mult(-1); // Bounce off the walls and cube faces
        }
    }

    checkCollision() {
        // Check for collision with the cube
        let d = dist(0, 0, 0, this.pos.x, this.pos.y, this.pos.z);
        return d <= 50; // Return true if particle is inside the cube
    }
}
