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
        p.update();
        p.display();
        p.checkCollision(); // Check for collision with the cube
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
        this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
        this.vel = p5.Vector.random3D().mult(random(2, 4)); // Random initial velocity
        this.size = random(5, 15); // Random size
    }

    update() {
        this.pos.add(this.vel);
        this.checkBounds(); // Check if the particle is outside the box
    }

    display() {
        stroke(255);
        strokeWeight(2);
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(this.size); // You can use different shapes like box, sphere, etc.
        pop();
    }

    checkBounds() {
        if (this.pos.x > width / 2 || this.pos.x < -width / 2) {
            this.vel.x *= -1; // Bounce off the walls
        }
        if (this.pos.y > height / 2 || this.pos.y < -height / 2) {
            this.vel.y *= -1; // Bounce off the ceiling and floor
        }
        if (this.pos.z > 200 || this.pos.z < -200) {
            this.vel.z *= -1; // Bounce off the front and back of the box
        }
    }

    checkCollision() {
        // Check for collision with the cube
        let d = dist(0, 0, 0, this.pos.x, this.pos.y, this.pos.z);
        if (d <= 50) {
            let normal = createVector(0, 0, 1); // Normal vector of the cube's front face
            this.vel.reflect(normal); // Reflect velocity off the cube
        }
    }
}
