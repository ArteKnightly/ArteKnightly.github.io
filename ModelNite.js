// ArtNite.js
let jsonData;

function preload() {
    // Load the JSON data before setup
    jsonData = loadJSON('data/artNite.json');
}

let padding;
let startHue = 360, endHue = 0;
let messageHeight;
let noiseOffsets = { x: 0, y: 1000, z: 1000000 };
const noiseIncrements = { x: 0.005, y: 0.009, z: 0.01 };
const gridSpacing = 25;
let primitive;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    padding = calculatePadding();
    background(0);
    drawGridFrame();
    displayLatestEventDetails();
    primitive = {
        position: createVector(200, 200),
        velocity: createVector(2, 2.5),
        acceleration: createVector(0, 0),
        radius: 20
    };
}

function calculatePadding() {
    messageHeight = 32 + 4 * 24 + 5 * gridSpacing + 400;
    let horizontalPadding = (windowWidth - 300) / 2; // Simplified to use a single value for left and right
    let verticalPadding = (windowHeight - messageHeight) / 2;
    return { left: horizontalPadding, right: horizontalPadding, top: verticalPadding, bottom: verticalPadding + 100 };
}

function displayLatestEventDetails() {
    textAlign(CENTER, CENTER);
    let latestEvent = jsonData.figureNite.reduce((prev, current) => (prev.UUIDFigureNite > current.UUIDFigureNite) ? prev : current);

    fill(255); // Ensure text is visible
    textSize(32);
    text(`Figure Nite?`, width / 2 + 25, padding.top + 32 + gridSpacing);
    textSize(24);
    text(`${latestEvent.Date}`, width / 2 + 25, padding.top + 32 + 2 * gridSpacing);
    text('6-9p est', width / 2 + 25, padding.top + 32 + 3 * gridSpacing);
    text('Location: the Compound', width / 2 + 25, padding.top + 32 + 4 * gridSpacing);

    let contributeLink = createA(latestEvent.SpotifyEdit, 'Contribute to playlist', '_blank');
    contributeLink.position(width / 2 - contributeLink.width / 2 + 25, padding.top + 32 + 5 * gridSpacing);

    let spotifyEmbed = createElement('iframe', latestEvent.SpotifyEmbedIframe);
    spotifyEmbed.position(width / 2 - 70, padding.top + 32 + 15 * gridSpacing);
}

function drawGridFrame() {
    let gridWidth = gridSpacing;
    let gridHeight = gridSpacing;

    let xCount = Math.ceil(width / gridWidth);
    let yCount = Math.ceil(height / gridHeight);

    for (let x = 0; x < xCount; x++) {
        for (let y = 0; y < yCount; y++) {
            drawCell(x, y, gridWidth, gridHeight);
        }
    }
}

function drawCell(x, y, gridWidth, gridHeight) {
    let xPos = x * gridWidth;
    let yPos = y * gridHeight;

    if (xPos >= padding.left && xPos <= width - padding.right && yPos >= padding.top && yPos <= height - padding.bottom) {
        // Skip drawing cells within the text area (padding area)
        return;
    }

    let zOffset = noise(noiseOffsets.z) / 10;
    let sineShift = sin(zOffset * TWO_PI);
    let xyOffset = noise(x * noiseIncrements.x + noiseOffsets.x + zOffset, y * noiseIncrements.y + noiseOffsets.y - zOffset);
    let noiseValue = noise(x * noiseIncrements.x, y * noiseIncrements.y);
    let hueValue = map(noiseValue, 0, 1, startHue, endHue);
    let saturation = map(zOffset, 0, 1, 50, 80);
    let brightness = map(xyOffset, 0, 1, 20, 90);

    noStroke();
    fill(hueValue, saturation, brightness);

    push();
    translate(xPos + gridWidth / 2, yPos + gridHeight / 2);
    rotate(TWO_PI * noiseValue);
    ellipse(0, 0, gridWidth * sineShift, gridHeight * xyOffset);
    pop();
}

function calculateAttraction() {
    let mousePos = createVector(mouseX, mouseY);
    let direction = p5.Vector.sub(mousePos, primitive.position); // Get the direction towards the mouse
    direction.normalize(); // Normalize to a unit vector
    direction.mult(0.5); // Scale the force to a small value
    return direction;
}

function draw() {
    if (frameCount % 60 === 0) {
        drawGridFrame();
    }

    updateNoiseOffsets();
    handleMousePressed();

    let attraction = calculateAttraction();
    primitive.acceleration.add(attraction); // Apply the attraction force to the acceleration

    drawBouncingPrimitive();
    updateBouncingPrimitive();
}

function updateNoiseOffsets() {
    noiseOffsets.x += noiseIncrements.x;
    noiseOffsets.y += noiseIncrements.y;
    noiseOffsets.z += noiseIncrements.z;
}

function handleMousePressed() {
    if (mouseIsPressed) {
        let force = calculateAttraction();
        primitive.acceleration.add(force);
    }
}

function drawBouncingPrimitive() {
    noFill(); // Primitive color
    stroke(269, 70, 70)
    ellipse(primitive.position.x, primitive.position.y, primitive.radius * 2, primitive.radius * 2);
}
function updateBouncingPrimitive() {
    // Apply acceleration to velocity
    primitive.velocity.add(primitive.acceleration);
    // Reset acceleration to 0 each frame
    primitive.acceleration.mult(0);

    // Apply velocity to position
    primitive.position.add(primitive.velocity);

    // Check for canvas boundaries and reverse velocity if necessary
    if (primitive.position.x > width - padding.right - primitive.radius || primitive.position.x < padding.left + primitive.radius) {
        primitive.velocity.x *= -1;
    }
    if (primitive.position.y > height - padding.bottom - primitive.radius || primitive.position.y < padding.top + primitive.radius) {
        primitive.velocity.y *= -1;
    }

    // Damping the velocity to simulate friction
    primitive.velocity.mult(0.74);
}


// Call setup to initialize the sketch
setup();
