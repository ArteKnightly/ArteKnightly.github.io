// sketch.js
let particles = [];
let angle = 0;
let cubeSize = 100;
let trappedParticles = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create a 3D canvas
    noFill();
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
        if (p instanceof StarParticle) {
            if (p.checkCollision(cubeSize)) {
                trappedParticles.push(p);
                particles.splice(i, 1);
            }
        } else if (p instanceof CubeParticle) {
            if (p.checkCollision(cubeSize)) {
                trappedParticles.push(p);
                particles.splice(i, 1);
            }
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
        noFill();
        stroke(255);
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
    }
}

class StarParticle extends Particle {
    constructor() {
        super();
        this.isStar = true;
        this.isStriking = false;
    }

    display() {
        if (this.isStriking) {
            fill(255, 0, 0); // Red when striking
        }
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        star(0, 0, this.size, this.size / 2, 5);
        pop();
    }

    checkCollision(cubeSize) {
        // Specific collision checking for stars goes here
        return false;
    }
}

class CubeParticle extends Particle {
    constructor() {
        super();
        this.isStar = false;
        this.isStriking = false;
    }

    display() {
        if (this.isStriking) {
            fill(255, 0, 0); // Red when striking
        }
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        box(this.size);
        pop();
    }

    checkCollision(cubeSize) {
        // Specific collision checking for cubes goes here
        return false;
    }
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = -PI; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
