//ArtNite.js
// Global Variables
let eventSlider, currentEventIndex = 0, jsonData;
let h1 = 64, h2 = 50, spaceBetween = 25;
let paddingLeft, paddingRight, paddingTop, paddingBottom, messageHeight;
let latestEvent, spotifyLink, spotifyEmbed, currentEvent
let isSetupComplete = false;
let fontEvent, fontHeader, fontBody
let lineBuffer;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    stroke(0);
    console.log("Setting text font to fontBody in Setup");
    textFont(fontBody)
    lineBuffer = createGraphics(windowWidth, windowHeight);
    lineBuffer.stroke(0); // Set the line color for the buffer
 }
function preload() {
        console.log("Preloading JSON data");
    jsonData = loadJSON('data/artNite.json', onJsonLoaded);
    console.log("Starting to preload fonts...");

    console.log("Loading font: Blox2.ttf");
    fontEvent = loadFont('fonts/Blox2.ttf', () => console.log("Loaded font: Blox2.ttf"));

    console.log("Loading font: From Cartoon Blocks.ttf");
    fontHeader = loadFont('fonts/From Cartoon Blocks.ttf', () => console.log("Loaded font: From Cartoon Blocks.ttf"));

    console.log("Loading font: Inconsolata-VariableFont_wdth,wght.ttf");
    fontBody = loadFont('fonts/Inconsolata-VariableFont_wdth,wght.ttf', () => console.log("Loaded font: Inconsolata-VariableFont_wdth,wght.ttf"));

}

function onJsonLoaded() {
    console.log('JSON successfully loaded:', jsonData);
    
    // Calculate padding first since other elements depend on it
    calculatePadding();
    console.log('Padding calculation complete');

    // Update styles based on the screen width
    updateDynamicStyles();
    console.log('Styles Update complete');

    // Find the nearest future event index and update the latest event
    currentEventIndex = findNearestFutureEventIndex();
    updateLatestEvent();
    console.log('Event update complete');
    
    // Setup the slider
    setupSlider();
    console.log('Slider setup complete');

    // Update Spotify player and links
    updateSpotifyPlayer();
    console.log('Spotify player update complete');
    updateSpotifyLinks();
    console.log('Spotify link update complete');
    createBounceText()
    console.log('Bouncing text created');
    
    isSetupComplete = true;
    console.log('Initial setup complete');
    isJsonLoaded = true;
    console.log('isJsonLoaded setup complete');
  }
function setupSlider() {
    console.log("Setting up the slider");

    if (jsonData && jsonData.artNite) {
        eventSlider = createSlider(0, jsonData.artNite.length - 1, currentEventIndex, 1);
        console.log("Slider created");

        adjustSliderForScreenSize();
        console.log("Slider adjusted for screen size");

        // Debugging logs
        console.log("paddingTop:", paddingTop);
        console.log("eventSlider height:", eventSlider.height);
        console.log("eventSlider Width:", eventSlider.width);
        console.log("windowWidth:", windowWidth);
        // Calculate a suitable top position for the slider
        let sliderY = paddingTop/2; // Adjust as needed
        console.log("sliderY:", sliderY);
        let sliderX = windowWidth * .25;
        eventSlider.position(sliderX, sliderY);
        eventSlider.changed(onSliderRelease);
    } else {
        console.log("jsonData or jsonData.artNite is not defined");
    }
}
function updateDynamicStyles() {
    console.log("updateDynamicStyles begin")
    let screenWidth = windowWidth;
    console.log("ScreenWidth: ", screenWidth )

    // Adjust font sizes based on screen width
    h1 = screenWidth * 0.025; // 4% of the screen width
    console.log("h1: ", h1)
    h2 = screenWidth * 0.015; // 3% of the screen width
    console.log("h2: ", h2)
    // Adjust spaceBetween dynamically
    spaceBetween = screenWidth * 0.025; // 2.5% of the screen width
    console.log("spaceBetween: ", spaceBetween)
    // Ensure minimum sizes
    h1 = max(h1, 24); // Minimum size for h1
    console.log("h1: ", h1)
    h2 = max(h2, 18); // Minimum size for h2
    console.log("h2: ", h2)
    spaceBetween = max(spaceBetween, 8); // Minimum space
    console.log("spaceBetween: ", spaceBetween)
}

function adjustSliderForScreenSize() {
    if (eventSlider) {
        let newWidth = windowWidth < 600 ? '100%' : '50%';
        eventSlider.style('width', newWidth);
        console.log("Adjusted slider width to:", newWidth);

        // Log the actual HTML element of the slider
        console.log("Slider element:", eventSlider.elt);
        console.log("Slider width after adjustment:", eventSlider.width);
    }
}
function onSliderRelease() {
    console.log("Slider released at value:", eventSlider.value());
    currentEventIndex = eventSlider.value();
    updateLatestEvent();
    console.log("event updated to:", latestEvent.Date);
    //background(255);
    redrawEventDetails();
    updateSpotifyLinks();
    updateSpotifyPlayer(); // Update the Spotify player based on the current event
}
function redrawEventDetails() {
    if (!isSetupComplete) {
        return; // Exit the function if setup isn't complete
    }
    //background(255);
    displayLatestEventDetails();
    //displayLatestEventDetailsFixed();
   }

function displayLatestEventDetails() {
    textAlign(CENTER, CENTER);
    noStroke();
    console.log("Setting text font to fontBody in displayLatestEventDetails");
    textFont(fontHeader);
    fill(0);
    textSize(h1);
    let textX = 0
    let textY = -windowHeight/2 + (paddingTop + h1 + spaceBetween);
    console.log("text: x_", textX, "Y_", textY);
    text(`Art Nite?`, textX, textY);
    console.log("Setting text font to fontBody in displayLatestEventDetails");
    textFont(fontBody);
    displayDateAndLocation(textX, textY);
}

function displayDateAndLocation(textX, textY) {
    let formattedDate = formatDate(latestEvent.Date);
    textSize(h2);
    textX = textX;
    textY = textY + spaceBetween + h2;
    console.log("text: x_", textX, "Y_", textY);
    text(formattedDate, textX, textY);
    textX = textX;
    textY = textY + spaceBetween + h2
    console.log("text: x_", textX, "Y_", textY);
    text('Location: the Compound', textX, textY);
}

function displayLatestEventDetailsFixed() {
    // Additional logic for fixed event details (if any)
}
function createBounceText() {
    // Log the current event number
    console.log("Current event number:", latestEvent.EventNumber);

    // Create a BouncingText for the current event
    currentBouncingText = new BouncingText(
        latestEvent.EventNumber,
        random(windowWidth),
        random(windowHeight),
        1,
        1
    );
    bouncingText.push(currentBouncingText);
}


function formatDate(isoDateString) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let date = new Date(isoDateString);
    date.setUTCHours(12);
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();
    return `${monthNames[monthIndex]}/${day}/${year}`;
}

function calculatePadding() {
    // Define a uniform padding percentage for all sides
    let sidePaddingPercent = 0.04;
    let topPaddingPercent = .06;
    // Apply this percentage to calculate padding for all sides
    paddingLeft = windowWidth * sidePaddingPercent;
    console.log("paddingLeft calculated:", paddingLeft);
    paddingRight = paddingLeft; // Same as paddingLeft
    console.log("paddingRight calculated:", paddingRight);
    paddingTop = windowHeight * topPaddingPercent;
    console.log("paddingTop calculated:", paddingTop);
    paddingBottom = windowHeight * topPaddingPercent*1.5; // Same as paddingTop
    console.log("paddingBottom calculated:", paddingBottom);
    // Recalculate messageHeight if needed
    messageHeight = windowHeight - (paddingTop + paddingBottom);
}

function findNearestFutureEventIndex() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < jsonData.artNite.length; i++) {
        let eventDate = new Date(jsonData.artNite[i].Date);
        if (eventDate >= today) {
            return i;
        }
    }
    return jsonData.artNite.length - 1;
}

function updateLatestEvent() {
    if (jsonData && jsonData.artNite && jsonData.artNite.length > 0) {
        latestEvent = jsonData.artNite[currentEventIndex];
    }
}

function drawGridFrame() {
    let gridWidth = spaceBetween;
    let gridHeight = spaceBetween;
    let xOffset = 0;
    // Calculate grid counts
    let xCount = Math.ceil(width / gridWidth);
    let yCount = Math.ceil(height / gridHeight);

    // Loop to create the diamond grid pattern
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
    //todo
}
function draw() {
    if (isJsonLoaded) {
        console.log("Setting text font to fontBody in draw");
        textFont(fontBody);
        redrawEventDetails();
        console.log("redrawEventDetails initial call");
        isJsonLoaded = false; // Prevent continuous redrawing, remove if continuous drawing is needed
    }


    // Draw lines to the buffer
    if (mouseIsPressed) {
        lineBuffer.line(mouseX, mouseY, pmouseX, pmouseY);
    }
    // Display the buffer
    image(lineBuffer, -windowWidth / 2, -windowHeight / 2);

    fill(255, 255, 255, 1); // White with some opacity for transparency
    noStroke();
    rectMode(CORNER); // Draw the rectangle from the top-left corner
    rect(-windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
    redrawEventDetails()
    console.log("Setting text font to fontBody in draw-outside isJsonloaded checkpoint");
    textFont(fontEvent);
    // Update and display each bouncing text
    for (let i = 0; i < bouncingText.length; i++) {
        bouncingText[i].move();
        bouncingText[i].display();
    }
}

function windowResized() {
    console.log("Window resized");
    resizeCanvas(windowWidth, windowHeight);
    updateDynamicStyles();
    adjustSliderForScreenSize();
    calculatePadding();
    redrawEventDetails();

}

function createSpotifyEmbed(playlistId, playerWidth, playerHeight) {
    let embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    let iframe = document.createElement('iframe');

    // Simplified styling
    iframe.style.borderRadius = '0'; // No rounded corners for a more minimalistic look
    iframe.style.border = 'none'; // No border for seamless integration
    iframe.style.boxShadow = 'none'; // No shadow for a flat design

    // Size adjustments (if needed)
    iframe.width = playerWidth;
    iframe.height = playerHeight; // Adjust height as per your design

    // Other necessary attributes
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.loading = 'lazy';
    iframe.src = embedUrl;

    return iframe;
}

function updateSpotifyPlayer() {
    let playlistId = latestEvent.SpotifyPlaylistId;
    if (spotifyEmbed) {
        spotifyEmbed.remove();
    }
    //console.log("Setting text font to fontBody in updateSpotifyPlayer");
    //textFont(fontBody);
    // Calculate the width and position
    let playerWidth = windowWidth * .5;
    console.log("Player Width:", playerWidth)
    let playerHeight = windowHeight * .25; // Or make this dynamic as per your design
    console.log("Player Height:", playerHeight)
    let playerX = windowWidth / 2 - playerWidth / 2;
    console.log("Player X:", playerX) 
    let playerY = windowHeight-paddingBottom-playerHeight*.75;// You can adjust this based on where you want it vertically
    console.log("Player Y:", playerY)
    spotifyEmbed = createSpotifyEmbed(playlistId, playerWidth, playerHeight);
    spotifyEmbed.style.position = 'absolute';
    spotifyEmbed.style.left = `${playerX}px`;
    spotifyEmbed.style.top = `${playerY}px`;

    document.body.appendChild(spotifyEmbed);
}
function updateSpotifyLinks() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let eventDate = new Date(latestEvent.Date);
    let playlistId = latestEvent.SpotifyPlaylistId;
    let listeningLink = `https://open.spotify.com/playlist/${playlistId}`;
    let collaborateLink = latestEvent.SpotifyCollaborateLink;
    //console.log("Setting text font to fontBody in updateSpotifyLinks");
    //textFont(fontBody);
    if (spotifyLink) {
        spotifyLink.remove();
    }
    if (eventDate > today || isSameDay(eventDate, today)) {
        spotifyLink = createA(collaborateLink, 'Contribute to playlist', '_blank');
    } else {
        spotifyLink = createA(listeningLink, 'Listen on Spotify', '_blank');
    }
    spotifyLink.position(windowWidth / 2 - spotifyLink.width / 2, windowHeight - (paddingBottom / 2));
    console.log("Spotify link drawn: X", windowWidth / 2 - spotifyLink.width / 2, "Y", windowHeight - (paddingBottom / 2) )
}

function isSameDay(d1, d2) {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
}

function getLatestEvent() {
    if (jsonData && jsonData.artNite && jsonData.artNite.length > 0) {
        // Use the current event index as set by the slider
        latestEvent = jsonData.artNite[currentEventIndex];
    }
}
function findNearestFutureEventIndex() {
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds

    for (let i = 0; i < jsonData.artNite.length; i++) {
        let eventDate = new Date(jsonData.artNite[i].Date);
        if (eventDate >= today) {
            return i; // Return the index of the nearest future event
        }
    }
    return jsonData.artNite.length - 1; // If no future events, return the last event
}

function doubleClicked() {
    background(255);
    //drawGridFrame();
    displayLatestEventDetails();
}
