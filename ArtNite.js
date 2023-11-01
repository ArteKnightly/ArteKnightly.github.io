// ArtNite.js
let jsonData;

function preload() {
    // Load the JSON data before setup
    jsonData = loadJSON('data/artNite.json');
}
let h1 = 32;
let h2 = 24;
let spaceBetween = 25;
let paddingLeft, paddingRight, paddingTop, paddingBottom;
let startHue, endHue;
let messageHeight;
let xStart = 0;
let yStart = 1000;
let zStart = 1000000;
const incrementX = 0.005;
const incrementY = 0.009;
const incrementZ = 0.01;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100);
    calculatePadding();
    initializeHues();
    drawGridFrame();
    displayLatestEventDetails();
}

function calculatePadding() {
    messageHeight = h1 + spaceBetween * 5 + h2 * 4 + 400;
    paddingLeft = (windowWidth - 420) / 2;
    paddingRight = (windowWidth - 420) / 2;
    paddingTop = (windowHeight - messageHeight) / 2;
    paddingBottom = (windowHeight - messageHeight) / 2;
}

function initializeHues() {
    startHue = 360;
    endHue = 0;
}
function displayLatestEventDetails() {
    textAlign(CENTER, CENTER); // Center the text both horizontally and vertically

    // Find the event with the largest UUIDEvent
    let latestEvent = jsonData.artNite.reduce((prev, current) => (prev.UUIDEvent > current.UUIDEvent) ? prev : current);

    // Display the details
    textSize(h1);
    text(`Art Nite?`, width / 2, paddingTop + h1 + spaceBetween);
    text(`${latestEvent.Date}`, width / 2, paddingTop + h1 + spaceBetween * 2 + h2);
    textSize(h2);
    text('Location: the Compound', width / 2, paddingTop + h1 + spaceBetween * 3 + h2 * 2);

    // Create hyperlink to SpotifyEdit
    let contributeLink = createA(latestEvent.SpotifyEdit, 'Contribute to playlist', '_blank');
    contributeLink.position(width / 2 - contributeLink.width / 2, paddingTop + h1 + spaceBetween * 4 + h2 * 3);

    // Embed Spotify player
    let spotifyEmbed = createElement('div', latestEvent.SpotifyembedIframe);
    spotifyEmbed.position(width / 2 - 150, paddingTop + h1 + spaceBetween * 5 + h2 * 4);
}

function drawGridFrame() {
    let gridWidth = spaceBetween;
    let gridHeight = spaceBetween;
    let xOffset = 0;  // Initial x offset for Perlin noise

    // Calculate grid counts
    let xCount = Math.ceil(width / gridWidth);
    let yCount = Math.ceil(height / gridHeight);

    for (let x = 0; x < xCount; x++) {
        let yOffset = 0;  // Initial y offset for Perlin noise
        for (let y = 0; y < yCount; y++) {
            drawCell(x, y, xOffset, yOffset, gridWidth, gridHeight);
            yOffset += 0.1;  // Increment y offset
        }
        xOffset += 0.1;  // Increment x offset
    }
}
function drawCell(x, y, xOffset, yOffset, gridWidth, gridHeight) {
    let xPos = x * gridWidth;
    let yPos = y * gridHeight;

    if (xPos < paddingLeft || xPos > width - paddingRight || yPos < paddingTop || yPos > height - paddingBottom) {
        let zNoiseValue = noise(zStart) / 10;
        let sineShift = sin(zNoiseValue * TWO_PI);
        let xyNoiseValue = noise(xOffset + xStart + zNoiseValue, yOffset + yStart - zNoiseValue);
        let noiseValue = noise((10 * xOffset / TWO_PI + xStart), (yOffset + yStart));
        let hueValue = map(noiseValue, 0, 5 * sineShift, startHue, endHue);
        let hueSaturation = map(zNoiseValue * TWO_PI, 0, 1, 50, 80);
        let hueBrightness = map(xyNoiseValue / zNoiseValue, 0, 1, 20, 90)
        noStroke()
        fill(hueValue, hueSaturation, hueBrightness);

        push();
        translate(xPos + gridWidth / 2, yPos + gridHeight / 2);
        rotate(TWO_PI * (100 * zNoiseValue) * (xyNoiseValue));
        ellipse(0, 0, gridWidth - (6000 * zNoiseValue / TWO_PI), gridHeight - (20 * xyNoiseValue));
        pop();
    }
}

function draw() {
    drawGridFrame();
    xStart += incrementX;
    yStart += incrementY;
    zStart += incrementZ;

    if (mouseIsPressed) {
        stroke(0);
        strokeWeight(4);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}
