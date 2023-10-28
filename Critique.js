let imgManifest;
let images = [];
let currentImageIndex = 0;
let imageValues = {};

function preload() {
    // Load the manifest.json file
    imgManifest = loadJSON('images/manifest.json');
}

function setup() {
    createCanvas(800, 600);

    // Load all the images from the manifest
    for (let imgFile of imgManifest.images) {
        let img = loadImage('images/' + imgFile);
        images.push(img);
    }

    // Create buttons and set up their actions
    createButton('Top').position(390, 10).mousePressed(() => storeValue('top'));
    createButton('Bottom').position(380, 570).mousePressed(() => storeValue('bottom'));
    createButton('Left').position(10, 290).mousePressed(() => storeValue('left'));
    createButton('Right').position(760, 290).mousePressed(() => storeValue('right'));

    // Example: Pick the first image as the default selected image
    currentImageIndex = 0;
}

function draw() {
    background(220);

    // Display the currently selected image
    if (images.length > 0) {
        image(images[currentImageIndex], 0, 0);
    }
}

function storeValue(direction) {
    // Associate the button value with the currently displayed image
    let imageName = imgManifest.images[currentImageIndex];
    imageValues[imageName] = direction;
    console.log(`Stored value '${direction}' for image '${imageName}'`);

    // For demonstration purposes: advance to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// To recall the value for a specific image
function recallValueForImage(imageName) {
    return imageValues[imageName];
}