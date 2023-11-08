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
function setup() {
    createCanvas(windowWidth, windowHeight);
    calculatePadding();
    initializeHues();
    background(0); 
    drawGridFrame();
    displayLatestEventDetails("setup");
    
  
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
function displayLatestEventDetails(_mode) {
    textAlign(CENTER, CENTER); // Center the text both horizontally and vertically

    // Find the event with the largest UUIDEvent
    let latestEvent = jsonData.artNite.reduce((prev, current) => (prev.UUIDEvent > current.UUIDEvent) ? prev : current);

    // Display the details
    textSize(h1);
    text(`Art Nite?`, width / 2, paddingTop + h1 + spaceBetween);
    text(`${latestEvent.Date}`, width / 2, paddingTop + h1 + spaceBetween * 2 + h2);
    textSize(h2);
    text('Location: the Compound', width / 2, paddingTop + h1 + spaceBetween * 3 + h2 * 2);

    if (_mode === 'setup') { // Correct the conditional check
        //TODO if `${latestEvent.Date}` < today show Listen Link
        //Else contribute to list
        //Create hyperlink to SpotifyEdit
        let contributeLink = createA(latestEvent.SpotifyEdit, 'Contribute to playlist', '_blank');
        contributeLink.position(width / 2 - contributeLink.width / 2, paddingTop + h1 + spaceBetween * 4 + h2 * 3);
        // Embed Spotify player
        let spotifyEmbed = createElement('div', latestEvent.SpotifyembedIframe);
        spotifyEmbed.position(width / 2 - 150, height-(paddingBottom + spotifyEmbed.height));
    }
}


function drawGridFrame() {
    let gridWidth = spaceBetween;
    let gridHeight = spaceBetween; 
    let xOffset = 0;
    let time = millis() / 1000; // Time in seconds

    // Calculate grid counts
    let xCount = Math.ceil(width / gridWidth);
    let yCount = Math.ceil(height / gridHeight);

    // Loop to create the diamond grid pattern
    for (let x = 0; x < xCount; x++) {
        let yOffset = 0;  // Initial y offset for Perlin noise
        for (let y = 0; y < yCount; y++) {
            drawCell(x , y , xOffset, yOffset, gridWidth, gridHeight);
            yOffset += 0.1;  // Increment y offset
        }
        xOffset += 0.1;  // Increment x offset
    }
}
function drawCell(x, y, xOffset, yOffset, gridWidth, gridHeight) {
    
    
}

function draw() {
    drawGridFrame();
    
    displayLatestEventDetails("draw");
    if (mouseIsPressed) {
        stroke(255);
        line(mouseX, mouseY, pmouseX, pmouseY);
       console.log(noiseValue);
      
    }
}
function doubleClicked(){
  background(0); 
    drawGridFrame();
    displayLatestEventDetails();
          
}
