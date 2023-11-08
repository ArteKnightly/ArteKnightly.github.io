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
let messageHeight;
let latestEvent;
function setup() {
    createCanvas(windowWidth, windowHeight);
    getLatestEvent()
    calculatePadding();
    background(255); 
    //drawGridFrame();
    displayLatestEventDetails();
    displayLatestEventDetailsFixed();
    addDonationWidget();
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
function formatDate(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${monthNames[monthIndex]}/${day}/${year}`;
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
   latestEvent = jsonData.artNite.reduce((prev, current) => (prev.UUIDEvent > current.UUIDEvent) ? prev : current);
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
    addDonationWidget();
          
}
// Function to add NOWPayments Donation Widget
function addDonationWidget() {
    // Create an iframe element
    let donationIframe = document.createElement('iframe');
    donationIframe.src = "https://nowpayments.io/embeds/donation-widget?api_key=1XYMZES-REE4C8V-Q7NN6KH-SSWDZ0D&source=lk_donation&medium=referral";
    donationIframe.frameborder = "0";
    donationIframe.scrolling = "no";
    donationIframe.style = "overflow-y: hidden;";
    donationIframe.width = "354";
    donationIframe.height = "680";

    // Append the iframe to the body or a specific element
    document.body.appendChild(donationIframe);
}

// Call the function to add the widget

