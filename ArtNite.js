let eventSlider;
let currentEventIndex = 0;
let jsonData;
let h1 = 32;
let h2 = 24;
let spaceBetween = 25;
let paddingLeft, paddingRight, paddingTop, paddingBottom;
let messageHeight;
let latestEvent;


function setup() {
    createCanvas(windowWidth, windowHeight);
    getLatestEvent(); // This function now uses jsonData, which is loaded
    calculatePadding();
    background(255);

    // Ensure jsonData is available before creating the slider
    if (jsonData && jsonData.artNite) {
        eventSlider = createSlider(0, jsonData.artNite.length - 1, findNextEventIndex(), 1);
        eventSlider.position(width / 2, paddingTop / 2);
        eventSlider.input(onSliderChange);
    }

    redrawEventDetails();
}


// Function to find the index of the next event
function findNextEventIndex() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < jsonData.artNite.length; i++) {
        let eventDate = new Date(jsonData.artNite[i].Date);
        if (eventDate >= today) {
            return i;
        }
    }
    return jsonData.artNite.length - 1; // If no future events, return the last event
}



function preload() {
    jsonData = loadJSON('data/artNite.json', jsonLoaded);
}

function jsonLoaded() {
    console.log('JSON successfully loaded:', jsonData);
}

function calculatePadding() {
    messageHeight = h1 + spaceBetween * 5 + h2 * 4 + 400;
    paddingLeft = (windowWidth - 350) / 2;
    paddingRight = (windowWidth - 250) / 2;
    paddingTop = (windowHeight - messageHeight) / 2;
    paddingBottom = (windowHeight - messageHeight+100) / 2;
}

function displayLatestEventDetails() {
    textAlign(CENTER, CENTER); // Center the text both horizontally and vertically
    fill(0); // Set the text color to black
    textSize(h1);
    text(`Art Nite?`, width / 2, paddingTop + h1 + spaceBetween);

    // Parse the ISO 8601 date and format it
    let eventDate = new Date(latestEvent.Date);
    let formattedDate = formatDate(eventDate);

    textSize(h2);
    text(formattedDate, width / 2, paddingTop + h1 + spaceBetween * 2 + h2);
    text('Location: the Compound', width / 2, paddingTop + h1 + spaceBetween * 3 + h2 * 2);
}
function formatDate(isoDateString) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Parse the ISO date string and adjust the time
    let date = new Date(isoDateString);
    date.setUTCHours(12); // Set the time to noon UTC

    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();

    return `${monthNames[monthIndex]}/${day}/${year}`;
}
function redrawEventDetails() {
    background(255);
    // Optionally call drawGridFrame() if needed
    displayLatestEventDetails();
    displayLatestEventDetailsFixed();
}
function displayLatestEventDetailsFixed() {
    textAlign(CENTER, CENTER);
    textSize(h2);
    fill(0); // Set the text color to black

    // Get today's date with time set to 00:00:00 for accurate comparison
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse event date directly from the ISO 8601 formatted string
    let eventDate = new Date(latestEvent.Date);

    // Decide whether to show 'Contribute' or 'Listen' based on the date
    let linkText, linkHref;
    if (eventDate > today || isSameDay(eventDate, today)) {
        // Event is today or in the future, show contribute link
        linkText = 'Contribute to playlist';
        linkHref = latestEvent.SpotifyEdit;
    } else {
        // Event is in the past, show listen link
        linkText = 'Listen on Spotify';
        linkHref = latestEvent.SpotifyListen;
    }

    // Create hyperlink to Spotify
    let spotifyLink = createA(linkHref, linkText, '_blank');
    spotifyLink.position(width / 2 - spotifyLink.width / 2, height - (paddingBottom - spaceBetween));
    // Embed Spotify player
    let spotifyEmbed = createElement('div', latestEvent.SpotifyembedIframe);
    spotifyEmbed.position(width / 2 - 150, height - (paddingBottom + spotifyEmbed.height));
}

function isSameDay(d1, d2) {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
}

function getLatestEvent() {
    if (jsonData && jsonData.artNite && jsonData.artNite.length > 0) {
        // Ensure the index is within the bounds of the array
        currentEventIndex = Math.min(currentEventIndex, jsonData.artNite.length - 1);
        latestEvent = jsonData.artNite[currentEventIndex];
    }
}
function onSliderChange() {
    currentEventIndex = eventSlider.value();
    getLatestEvent();
    background(0);
    redrawEventDetails();
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
            drawCell(x , y , xOffset, yOffset, gridWidth, gridHeight);
            yOffset += 0.1;  // Increment y offset
        }
        xOffset += 0.1;  // Increment x offset
    }
}
function drawCell(x, y, xOffset, yOffset, gridWidth, gridHeight) {
    //todo
}

function draw() {
    //drawGridFrame();
    
    //displayLatestEventDetails("draw");
    if (mouseIsPressed) {
        stroke(0);
        line(mouseX, mouseY, pmouseX, pmouseY);
            }
}
function doubleClicked(){
    background(255); 
    drawGridFrame();
    displayLatestEventDetails();
             
}

