// sketch.js
let particles = [];
let angle = 0;
let cubeSize = 100;
let trappedParticles = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create a 3D canvas
    stroke(255);
    for (let i = 0; i < 50; i++) {
        particles.push(new StarParticle());
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
    noFill();
    box(cubeSize);
    pop();

    // Draw and update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.display();
        p.checkBounds();

        // Check for collision with the cube
        if (p instanceof StarParticle && p.checkCollision(cubeSize)) {
            trappedParticles.push(p);
            particles.splice(i, 1);
        }
    }

    // Draw trapped particles
    for (let p of trappedParticles) {
        p.display();
    }

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
    }

    display() {
        stroke(255, 0, 0); // Red outline
        strokeWeight(2);
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        // Specific particle rendering goes here
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
            this.vel.mult(-1); // Bounce off the walls
        }
    }

    checkCollision(cubeSize) {
        // Specific collision checking goes here
        return false;
    }
}

class StarParticle extends Particle {
    constructor() {
        super();
        this.isStar = true;
        this.isStriking = false;
        this.tracer = [];
    }

    update() {
        super.update();
        this.tracer.push(createVector(this.pos.x, this.pos.y, this.pos.z));
        if (this.tracer.length > 20) {
            this.tracer.shift();
        }
    }

    display() {
        super.display();
        noFill();
        for (let i = 0; i < this.tracer.length - 1; i++) {
            let alpha = map(i, 0, this.tracer.length - 1, 100, 0);
            stroke(255, 0, 0, alpha);
            line(this.tracer[i].x, this.tracer[i].y, this.tracer[i].z, this.tracer[i + 1].x, this.tracer[i + 1].y, this.tracer[i + 1].z);
        }
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        // Render the star
        pop();
    }

    checkCollision(cubeSize) {
        // Check if the star is inside the cube
        if (
            this.pos.x + this.size / 2 < cubeSize / 2 &&
            this.pos.x - this.size / 2 > -cubeSize / 2 &&
            this.pos.y + this.size / 2 < cubeSize / 2 &&
            this.pos.y - this.size / 2 > -cubeSize / 2 &&
            this.pos.z + this.size / 2 < cubeSize / 2 &&
            this.pos.z - this.size / 2 > -cubeSize / 2
        ) {
            return true;
        }
        return false;
    }
}
