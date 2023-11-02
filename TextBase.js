// TextBase.js
let jsonData;
function preload() {
    // Load the JSON data before setup
    jsonData = loadJSON('data/artNite.json');
}
class TextDisplay {
    constructor(x, y, content, size = 16) {
        this.x = x;
        this.y = y;
        this.content = content;
        this.size = size;
    }

    display() {
        textSize(this.size);
        fill(0); // Set text color to black; adjust as needed
        text(this.content, this.x, this.y);
    }

    // If you need to update the position dynamically:
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
class LinkDisplay extends TextDisplay {
    constructor(x, y, content, href, size = 16) {
        super(x, y, content, size);
        this.href = href;
        this.link = createA(this.href, this.content, '_blank');
        this.link.position(this.x, this.y);
        this.link.style('color', '#00F'); // Style the link color; adjust as needed
    }

    // Overriding the display method to update the link position
    display() {
        this.link.position(this.x, this.y);
    }
}


class EventDetails {
    constructor(eventData, x, y, gridSpacing) {
        this.eventData = eventData;
        this.x = x;
        this.y = y;
        this.gridSpacing = gridSpacing;
        this.details = [];
        this.setupDetails();
    }

    setupDetails() {
        // You can add more details by pushing new instances of TextDisplay or its subclasses
        this.details.push(new TextDisplay(this.x, this.y, `Event: ${this.eventData.name}`));
        this.details.push(new TextDisplay(this.x, this.y + this.gridSpacing, `Date: ${this.eventData.Date}`));
        this.details.push(new TextDisplay(this.x, this.y + 2 * this.gridSpacing, `Time: ${this.eventData.Time}`));
        this.details.push(new TextDisplay(this.x, this.y + 3 * this.gridSpacing, `Location: ${this.eventData.Location}`));
        this.details.push(new LinkDisplay(this.x, this.y + 4 * this.gridSpacing, 'Contribute to playlist', this.eventData.SpotifyEdit));
        this.details.push(new LinkDisplay(this.x, this.y + 5 * this.gridSpacing, 'Listen to playlist', this.eventData.SpotifyListen));
        // For the embedded playlist, you might need a different class or a method to handle iframe
    }

    display() {
        for (let detail of this.details) {
            detail.display();
        }
    }
}

let latestEventDetails;

function setup() {
    createCanvas(800, 600); // Define a canvas size
    let xPosText = width / 2;
    let yPosText = 100;
    let gridSpacing = 75;
    latestEventDetails = new EventDetails(jsonData.latestEvent, xPosText, yPosText, gridSpacing);
    latestEventDetails.display();
}

function draw() {
       
}
