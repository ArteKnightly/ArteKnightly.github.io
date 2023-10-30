let imgManifest;
let images = [];
let currentImageIndex = 0;
let slider;
let acceptBtn, naBtn;
let critiqueQuestions;
let responses = [];

function preload() {
    // Load the manifest.json file
    imgManifest = loadJSON('data/manifest.json');

    // Load the inquisidor.json file
    //critiqueQuestions = loadJSON('data/inquisidor.json');
    critiqueQuestions = loadJSON('data/inquisidor.json');
}
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);  // Set background to black

    // Load all the images from the manifest
    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUID + '.jpg');
        images.push({ data: imgData, img: img });
    }

    // Initialize spinning object
    switchShape('box');

    // Default selected image
    currentImageIndex = 0;
}

function mouseClicked() {
    acceptResponse();
}
function draw() {
    background(0);  // Black background

    // Calculate the y position for the spinning object based on its size and the top padding
    let topPad = currentShapeObj.size * 1.5;
    let yPos = topPad - height/2;

    // Display the spinning object at the calculated position
    currentShapeObj.display(yPos);

    if (images.length > 0) {
        let img = images[currentImageIndex].img;

        // Define padding values
        let leftPad = 20;
        let rightPad = 20;
        let bottomPad = 50;

        // Calculate maximum display dimensions
        let maxDisplayWidth = width - leftPad - rightPad;
        let maxDisplayHeight = height - (2 * topPad) - bottomPad;  // 2 times topPad to account for the space taken by the spinning object

        // Calculate the aspect ratio of the image
        let imgAspectRatio = img.width / img.height;

        // Calculate display width and height based on aspect ratio
        let displayWidth = maxDisplayWidth;
        let displayHeight = displayWidth / imgAspectRatio;

        if (displayHeight > maxDisplayHeight) {
            displayHeight = maxDisplayHeight;
            displayWidth = displayHeight * imgAspectRatio;
        }

        // Calculate image position
        let imageXPosition = width / 2; // Centered in x-axis
        let imageYPosition = yPos + currentShapeObj.size + displayHeight/2;  // The image's center is below the spinning object

        // Display the image
        image(img, imageXPosition - displayWidth / 2, imageYPosition - displayHeight / 2, displayWidth, displayHeight);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);  // Re-set background to black

    // Adjust positions based on new window size
    naBtn.position(windowWidth / 2 + 50, windowHeight - 40);
}

function acceptResponse() {
    let scaledValue = map(currentShapeObj.posX, 0, width - currentShapeObj.size, -5, 5);
    scaledValue = constrain(scaledValue, -5, 5);
    if (scaledValue === 0) scaledValue = 0.01;  // Reserve 0 for N/A

    let response = {
        uuid: images[currentImageIndex].data.UUID,
        question: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: scaledValue
    };

    responses.push(response);
    console.log(responses);

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
function naResponse() {
    let response = {
        uuid: images[currentImageIndex].data.UUID,
        question: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: 0
    };

    responses.push(response);
    console.log(responses);

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
