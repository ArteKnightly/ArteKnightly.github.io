// sketch.js
let particles = [];
let angle = 0;

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

    // Draw the wireframe cube in the center
    push();
    translate(0, 0, -200); // Position the cube in front of the particles
    rotateX(angle * 0.5);
    rotateY(angle * 0.5);
    strokeWeight(1);
    box(100);
    pop();

    // Draw and update particles
    for (let p of particles) {
        p.update();
        p.display();
        p.checkBounds();
        p.checkCollision(particles); // Check for collisions with other particles
    }

    angle += 0.01; // Increment rotation angle for cube and scene
}

class Particle {
    constructor() {
        this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
        this.vel = p5.Vector.random3D().mult(random(2, 4)); // Random initial velocity
        this.size = random(5, 15); // Random size
        this.isStriking = false;
    }

    update() {
        this.pos.add(this.vel);
    }

    display() {
        if (this.isStriking) {
            fill(255, 0, 0); // Red when striking
        } else {
            noFill();
        }
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
            this pos.x < -width / 2 ||
            this.pos.y > height / 2 ||
            this.pos.y < -height / 2 ||
            this.pos.z > 200 ||
            this.pos.z < -200
        ) {
            this.vel.mult(-1); // Bounce off the walls
        }
    }

    checkCollision(otherParticles) {
        for (let other of otherParticles) {
            if (other !== this) {
                let d = dist(this.pos.x, this.pos.y, this.pos.z, other.pos.x, other.pos.y, other.pos.z);
                if (d <= (this.size / 2 + other.size / 2)) {
                    this.isStriking = true; // Change color when striking another particle
                    other.isStriking = true;
                }
            }
        }
    }
}
