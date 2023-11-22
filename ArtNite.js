// Global Variables
let eventSlider, currentEventIndex = 0, jsonData;
let h1 = 32, h2 = 24, spaceBetween = 25;
let paddingLeft, paddingRight, paddingTop, paddingBottom, messageHeight;
let latestEvent, spotifyLink, spotifyEmbed;

function setup() {
    createCanvas(windowWidth, windowHeight);
    preload();
    calculatePadding();
    background(255);
    setupSlider();
    redrawEventDetails();
}

function preload() {
    jsonData = loadJSON('data/artNite.json', onJsonLoaded);
}

function onJsonLoaded() {
    console.log('JSON successfully loaded:', jsonData);
    currentEventIndex = findNearestFutureEventIndex();
    updateLatestEvent();
}


function setupSlider() {
    if (jsonData && jsonData.artNite) {
        eventSlider = createSlider(0, jsonData.artNite.length - 1, currentEventIndex, 1);
        adjustSliderForScreenSize();
        let sliderX = (windowWidth - eventSlider.width) / 2;
        eventSlider.position(sliderX, paddingTop / 2);
        eventSlider.changed(onSliderRelease);
    }
}

function adjustSliderForScreenSize() {
    if (eventSlider) { // Check if eventSlider is defined
        eventSlider.style('width', windowWidth < 600 ? '100%' : '50%');
    }
}

function onSliderRelease() {
    currentEventIndex = eventSlider.value();
    updateLatestEvent();
    background(0);
    redrawEventDetails();
    updateSpotifyLinks();
}

function redrawEventDetails() {
    background(255);
    displayLatestEventDetails();
    displayLatestEventDetailsFixed();
}

function displayLatestEventDetails() {
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(h1);
    text(`Art Nite?`, width / 2, paddingTop + h1 + spaceBetween);
    displayDateAndLocation();
}

function displayDateAndLocation() {
    let formattedDate = formatDate(latestEvent.Date);
    textSize(h2);
    text(formattedDate, width / 2, paddingTop + h1 + spaceBetween * 2 + h2);
    text('Location: the Compound', width / 2, paddingTop + h1 + spaceBetween * 3 + h2 * 2);
}

function displayLatestEventDetailsFixed() {
    // Additional logic for fixed event details (if any)
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
    messageHeight = h1 + spaceBetween * 5 + h2 * 4 + 400;
    paddingLeft = (windowWidth - 350) / 2;
    paddingRight = (windowWidth - 250) / 2;
    paddingTop = (windowHeight - messageHeight) / 2;
    paddingBottom = (windowHeight - messageHeight + 100) / 2;
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
    if (mouseIsPressed) {
        stroke(0);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    adjustSliderForScreenSize();
    calculatePadding();
    redrawEventDetails();
}

function createSpotifyEmbed(playlistId) {
    let embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    let iframe = document.createElement('iframe');

    // Simplified styling
    iframe.style.borderRadius = '0'; // No rounded corners for a more minimalistic look
    iframe.style.border = 'none'; // No border for seamless integration
    iframe.style.boxShadow = 'none'; // No shadow for a flat design

    // Size adjustments (if needed)
    iframe.width = '100%';
    iframe.height = '300'; // Adjust height as per your design

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
    spotifyEmbed = createSpotifyEmbed(playlistId);
    document.body.appendChild(spotifyEmbed);
}

function updateSpotifyLinks() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let eventDate = new Date(latestEvent.Date);
    let playlistId = latestEvent.SpotifyPlaylistId;
    let listeningLink = `https://open.spotify.com/playlist/${playlistId}`;
    let collaborateLink = latestEvent.SpotifyCollaborateLink;
    if (spotifyLink) {
        spotifyLink.remove();
    }
    if (eventDate > today || isSameDay(eventDate, today)) {
        spotifyLink = createA(collaborateLink, 'Contribute to playlist', '_blank');
    } else {
        spotifyLink = createA(listeningLink, 'Listen on Spotify', '_blank');
    }
    spotifyLink.position(width / 2 - spotifyLink.width / 2, height - (paddingBottom - spaceBetween));
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

function onSliderChange() {
    currentEventIndex = eventSlider.value();
    getLatestEvent();
    background(0);
    redrawEventDetails();
}

function doubleClicked() {
    background(255);
    drawGridFrame();
    displayLatestEventDetails();
}
