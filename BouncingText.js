let bouncingTexts = [];
let smallestSize = 4;
let largestSize = 200;
let medianSize = (largestSize + smallestSize) / 2;
let low = smallestSize - medianSize;
let high = largestSize - medianSize;
let weight;

class BouncingText {
    constructor(text, x, y, xSpeed, ySpeed) {
        this.text = text;
        this.x = x - windowWidth / 2; // Adjust for WebGL coordinate system
        this.y = y - windowHeight / 2; // Adjust for WebGL coordinate system
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.size = medianSize; // Initial size
        this.color = color(random(255), random(255), random(255)); // Initial random color
        this.outlineThickness = 1;
        this.outlineColor = color(random(255), random(255), random(255));

        // Rotation attributes
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;

        // Perlin noise offsets for color
        this.noiseOffsetR = random(1000);
        this.noiseOffsetG = random(2000, 3000);
        this.noiseOffsetB = random(4000, 5000);
    }

    move() {
        weight = map(this.size - medianSize, low, high, -1, 1);
        this.ySpeed += weight * 0.1;

        // Move the Text
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Adjusted boundary checks for WebGL
        if (this.x > windowWidth / 2 || this.x < -windowWidth / 2) {
            this.xSpeed *= -1;
        }
        if (this.y > windowHeight / 2) {
            this.y = windowHeight / 2;
            this.ySpeed *= -0.8;
        }
        if (this.y < -windowHeight / 2) {
            this.y = -windowHeight / 2;
            this.ySpeed *= -1;
        }

        // Update size and color using Perlin noise
        this.size = map(noise(this.x * 0.01, this.y * 0.01), 0, 1, smallestSize, largestSize);
        this.color = color(
            noise(this.noiseOffsetR) * 40,
            noise(this.noiseOffsetG) * 70,
            noise(this.noiseOffsetB) * 120
        );

        // Increment noise offsets for color
        this.noiseOffsetR += 0.005;
        this.noiseOffsetG += 0.005;
        this.noiseOffsetB += 0.005;
        this.rotX += 0.01;
        this.rotY += 0.01;
        this.rotZ += 0.01;
    }

    display() {
        push();
        translate(this.x, this.y, 50);
        rotateX(this.rotX);
        rotateY(this.rotY);
        rotateZ(this.rotZ);
        textSize(this.size);
        fill(this.color);
        stroke(0,0,0);
        strokeWeight(this.outlineThickness);
        text(this.text, 0, 0);
        pop();
    }
}
// Declare an array to store instances of BouncingText
let bouncingText= [];

