let imgManifest;
let images = [];
let currentImageIndex = 0;
let imageValues = {};
let startX, startY;  // To store the starting point for swipe
let critiqueQuestions = [
    "Is color scheme sucessful?",
    "Do you hate this image?",
    "Does this image make an impression?",
    "Would you own this?",
    "Is composition sucessful?"
    // ... add more questions as needed
];
function preload() {
    // Load the manifest.json file
    imgManifest = loadJSON('images/manifest.json');
}

function setup() {
    createCanvas(800, 600);

    // Load all the images from the manifest
    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUID + '.jpg');  // Use the UUID as filename
        images.push({ data: imgData, img: img });  // Store both image and its metadata
    }

    // Example: Pick the first image as the default selected image
    currentImageIndex = 0;
}

function draw() {
    background(220);

    // Display the currently selected image
    if (images.length > 0) {
        image(images[currentImageIndex].img, 0, 0);

        // Display the CritiqueQuestion as a caption at the top
        fill(255, 0, 0);  // Red color for the text, adjust as needed
        textSize(20);
        let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];
        text(question, 10, 30);
    }
}

function touchStarted() {
    // Store the starting x and y positions when touch starts
    startX = mouseX;
    startY = mouseY;
    return false;  // To prevent any default action
}

function touchEnded() {
    // Calculate the swipe direction
    let distX = mouseX - startX;
    let distY = mouseY - startY;

    if (abs(distX) > abs(distY)) {  // Horizontal swipe
        if (distX > 0) {
            storeValue('right');
        } else {
            storeValue('left');
        }
    } else if (distY < 0) {  // Swipe up is ignored, only swipe down is considered
        storeValue('down');
    }
    return false;  // To prevent any default action
}

function storeValue(direction) {
    // Associate the swipe direction with the currently displayed image
    let imageName = images[currentImageIndex].data.UUID;  // Use UUID as the identifier
    imageValues[imageName] = direction;
    console.log(`Stored value '${direction}' for image '${imageName}'`);

    // Advance to the next image after a swipe
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// To recall the value for a specific image
function recallValueForImage(imageName) {
    return imageValues[imageName];
}
