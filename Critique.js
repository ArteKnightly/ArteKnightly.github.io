let imgManifest;
let images = [];
let currentImageIndex = 0;
let slider;
let acceptBtn, naBtn;
let critiqueQuestions;
let responses = [];
let leftPad;
let rightPad;
let bottomPad;
let topPad;
function preload() {
    // Load the manifest.json file
    imgManifest = loadJSON('data/manifest.json');

    // Load the inquisidor.json file
    //critiqueQuestions = loadJSON('data/inquisidor.json');
    //critiqueQuestions = loadJSON('data/inquisidor.json');
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
    background(0);

    // Define padding values
    leftPad = 2;
    rightPad = 2;
    bottomPad = 5;
    topPad = currentShapeObj.size * 2;

    // Draw Spinning object
    let yPos = -height / 2 + (topPad / 2);
    currentShapeObj.display(yPos);

    if (images.length > 0) {
        let img = images[currentImageIndex].img;
        // Calculate image position
        let imageXPosition = 0;// leftPad; // Start from left padding
        let imageYPosition = 0;// topPad;  // Start from top padding

        // Display the image
        image(img, imageXPosition, imageYPosition, DisplayImageWidth(), DisplayImageHeight());
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);  // Re-set background to black

    // Adjust positions based on new window size
    naBtn.position(windowWidth / 2 + 50, windowHeight - 40);
}

function MaxImageWidth(img) {
    return  width - leftPad - rightPad;
}
function MaxImageHeight(img) {
    return  height - topPad - bottomPad;
}
function DisplayImageWidth(img) {
    if (MaxImageWidth(img) / CalculateImageAspectRatio(img) < MaxImageWidth(img)) {
        return MaxImageWidth(img);
    }
    else {
        return DisplayImageHeight(img) * CalculateImageAspectRatio(img)
    }
}

function DisplayImageHeight(img) {
    if (MaxImageWidth(img) / CalculateImageAspectRatio(img) < MaxImageWidth(img)) {
        return DisplayImageWidth(img) / CalculateImageAspectRatio(img);
    }
    else {
        return MaxImageHeight(img)
    } 
}

function CalculateImageAspectRatio(img) {
    return imgAspectRatio = img.width / img.height;
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
