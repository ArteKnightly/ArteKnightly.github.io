// ModelNite.js

var modelNite; // Declare a variable to hold the instance of ModelNite

function setup() {
    createCanvas(windowWidth, windowHeight); // Use windowWidth and windowHeight to cover the full browser window
    background(150);
    modelNite = new ModelNite(); // Initialize the instance of ModelNite
}

function ModelNite() {
    this.modelNiteTextBase = new ModelNiteTextBase(); // Assuming ModelNiteTextBase is defined correctly in another file
    this.xSpeed = 2;
    this.ySpeed = 3;
}

// The update method to move the text
ModelNite.prototype.update = function () {
    // Move the text
    var newTextX = this.modelNiteTextBase.textObject.x + this.xSpeed;
    var newTextY = this.modelNiteTextBase.textObject.y + this.ySpeed;

    // Check for canvas boundaries
    if (newTextX > width || newTextX < 0) {
        this.xSpeed *= -1;
    }
    if (newTextY > height || newTextY < 0) {
        this.ySpeed *= -1;
    }

    // Update text position
    this.modelNiteTextBase.textObject.setPosition(newTextX, newTextY);
};

// The display method to draw the text on screen
ModelNite.prototype.display = function () {
    this.modelNiteTextBase.display();
};

function draw() {
    background(150); // Clear the canvas on each frame or you'll see a trail of text
    modelNite.update(); // Call the update method to move the text
    modelNite.display(); // Call the display method to draw the text
}