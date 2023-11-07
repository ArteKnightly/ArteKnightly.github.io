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
    
    background(0); 
    drawGridFrame();
    displayLatestEventDetails();
    
  
}

function calculatePadding() {
    messageHeight = h1 + spaceBetween * 5 + h2 * 4 + 400;
    paddingLeft = (windowWidth - 350) / 2;
    paddingRight = (windowWidth - 250) / 2;
    paddingTop = (windowHeight - messageHeight) / 2;
    paddingBottom = (windowHeight - messageHeight+100) / 2;
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
    let gridHeight = spaceBetween * sin(QUARTER_PI); // Adjust gridHeight for diamond pattern
    let xOffset = 0;  // Initial x offset for Perlin noise
    let time = millis() / 1000; // Time in seconds

    // Calculate grid counts
    let xCount = Math.ceil(width / gridWidth);
    let yCount = Math.ceil(height / gridHeight);

    // Loop to create the diamond grid pattern
    for (let x = 0; x < xCount; x++) {
        let yOffset = 0;  // Initial y offset for Perlin noise
        for (let y = 0; y < yCount; y++) {
            // Calculate position with staggered offset for diamond pattern
            let staggerOffset = (x % 2 === 0) ? 0 : gridHeight / 2;
            let yPos = y * gridHeight + staggerOffset;

            // Apply a slow shift over time
            let shiftX = noise(time * 0.1 + x * 0.5) * 5; // The shift in x
            let shiftY = noise(time * 0.1 + y * 0.5) * 5; // The shift in y

            drawCell(x + shiftX, y + shiftY, xOffset, yOffset, gridWidth, gridHeight);
            yOffset += 0.1;  // Increment y offset
        }
        xOffset += 0.1;  // Increment x offset
    }
}
function drawCell(x, y, xOffset, yOffset, gridWidth, gridHeight) {
    let xPos = x * gridWidth;
    let yPos = y * gridHeight;

    // Only affect the border cells using diamond pattern logic
    if (xPos < paddingLeft || xPos > width - paddingRight || yPos < paddingTop || yPos > height - paddingBottom) {
        let zNoiseValue = noise(zStart) / 10;
        let sineShift = sin(zNoiseValue * TWO_PI);
        let xyNoiseValue = noise(xOffset + xStart + zNoiseValue, yOffset + yStart - zNoiseValue);
        let noiseValue = noise((10 * xOffset / TWO_PI + xStart), (yOffset + yStart));

        // Use a time-based hue rotation
        let time = millis() / 1000;
        let hueValue = (startHue + time * 100) % 360;

        let hueSaturation = map(zNoiseValue * TWO_PI, 0, 1, 50, 100);
        let hueBrightness = map(xyNoiseValue / zNoiseValue, 0, 1, 40, 100);
        noStroke();
        fill(hueValue, hueSaturation, hueBrightness);

        push();
        translate(xPos + gridWidth / 2, yPos + gridHeight / 2);
        rotate(TWO_PI * (100 * zNoiseValue) * (xyNoiseValue));
        // Use a mix of rectangles and ellipses
        if (int(noiseValue * 10) % 2 == 0) {
            rectMode(CENTER);
            rect(0, 0, gridWidth * zNoiseValue, gridHeight * xyNoiseValue);
        } else {
            ellipse(0, 0, gridWidth * zNoiseValue, gridHeight * xyNoiseValue);
        }
        pop();
    }
}

function draw() {
    let transparency = 50; // Set transparency from 0 (fully transparent) to 255 (fully opaque)
    background(0, 0, 0, transparency);
    drawGridFrame();
    xStart += incrementX;
    yStart += incrementY;
    zStart += incrementZ;
    let noiseValue = noise((xStart)*100);
    if (mouseIsPressed) {
        stroke(255);
        strokeWeight(map(noiseValue, 0, 1,5, 20));
        line(mouseX, mouseY, pmouseX, pmouseY);
       console.log(noiseValue);
      
    }
}
function doubleClicked(){
  background(0); 
    drawGridFrame();
    displayLatestEventDetails();
          
}
