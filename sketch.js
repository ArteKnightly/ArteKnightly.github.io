let particles = [];
let cubeSize = 100;
let cubeRotationX = 0;
let cubeRotationY = 0;
let burstParticles = [];
let burstTime = 5000; // 5 seconds
let startTime;
let cubeColor = 200; // Fixed cube color

// Bounce direction variables
let xDirection = 1;
let yDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // Use the WEBGL renderer
  noStroke();
  startTime = millis();

  // Initialize particles in random positions
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(random(-width / 2, width / 2), random(-height / 2, height / 2), 5));
  }
}

function draw() {
  background(0);
  let dampingFactor = 0.8; // Adjust this value as needed
  // Inside the draw function
  for (let p of particles) {
  p.update(mouseX - width / 2, mouseY - height / 2, dampingFactor);
  p.display();
  }
  // Rotate the cube
  cubeRotationX += 0.01 * xDirection;
  cubeRotationY += 0.01 * yDirection;

  // Bounce when the cube reaches a certain angle
  if (cubeRotationX > PI / 4 || cubeRotationX < -PI / 4) {
    xDirection *= -1;
  }
  if (cubeRotationY > PI / 4 || cubeRotationY < -PI / 4) {
    yDirection *= -1;
  }

  push();
  translate(0, 0, 0);
  rotateX(cubeRotationX);
  rotateY(cubeRotationY);
  noFill(); // Wireframe cube
  stroke(cubeColor);
  box(cubeSize);
  pop();

  // Remove particles that hit the cube
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update(mouseX - width / 2, mouseY - height / 2);
    p.display();

    // Check for collision with the cube
    if (p.checkCollision(cubeSize)) {
      burstParticles.push(...p.burst());
      particles.splice(i, 2);
    }
  }

  // Display the burst particles
  for (let p of burstParticles) {
    p.update();
    p.display();
  }

  // End animation when all particles are gone
  if (particles.length === 0) {
    if (millis() - startTime < burstTime) {
      textSize(64);
      fill(255);
      text("ENTER", -50, 0);
    } else {
      // Burst into tiny particles
      if (burstParticles.length === 0) {
        for (let i = 0; i < 500; i++) {
          burstParticles.push(new Particle(0, 0, random(2, 5)));
        }
      }
    }
  }
}

class Particle {
  constructor(x, y, speed) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = 10;
  }
  repel(other, minDistance, maxForce) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d > 0 && d < minDistance) {
      let force = p5.Vector.sub(this.pos, other.pos);
      force.normalize();
      force.mult(map(d, 0, minDistance, maxForce, 0));
      this.acc.add(force);
    }
  }

  update(targetX, targetY, damping) {
    let target = createVector(targetX, targetY);
    let dir = p5.Vector.sub(target, this.pos);
    dir.setMag(.5); // Set the speed to a constant value (e.g., 5)

    // Apply damping
    this.vel.mult(damping);

    this.acc = dir;

    // Calculate repulsion force between particles
    for (let other of particles) {
      if (other !== this) {
        this.repel(other, Math.floor(Math.random() * (50 - 15 + 1)) + 15, 6); // Adjust minDistance and maxForce as needed
      }
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // Check boundaries
    if (this.pos.x < -width / 2 || this.pos.x > width / 2) {
      this.vel.x *= -1; // Reverse the x-velocity to bounce off horizontally
    }
    if (this.pos.y < -height / 2 || this.pos.y > height / 2) {
      this.vel.y *= -1; // Reverse the y-velocity to bounce off vertically
    }
  }

  display() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  checkCollision(cubeSize) {
    return (
      this.pos.x > -cubeSize / 2 &&
      this.pos.x < cubeSize / 2 &&
      this.pos.y > -cubeSize / 2 &&
      this.pos.y < cubeSize / 2
    );
  }

  burst() {
    const newParticles = [];
    for (let i = 0; i < 10; i++) {
      newParticles.push(new Particle(this.pos.x, this.pos.y, random(1, 3)));
    }
    return newParticles;
  }
}
