let imgManifest;
let images = [];
let currentImageIndex = 0;
let slider;
let acceptBtn, naBtn;

let critiqueQuestions = [
    "What do you think about the color scheme?",
    // ... add more questions as needed
];

let responses = [];

function preload() {
    // Load the manifest.json file
    imgManifest = loadJSON('images/manifest.json');
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);  // Set background to black

    // Load all the images from the manifest
    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUID + '.jpg');
        images.push({ data: imgData, img: img });
    }

    // Initialize spinning object
    switchShape('box');

    // N/A button
    naBtn = createButton('N/A');
    naBtn.position(windowWidth / 2 + 50, windowHeight - 40);
    naBtn.mousePressed(naResponse);

    // Attach acceptResponse to canvas click event
    canvas.mouseClicked(acceptResponse);

    // Default selected image
    currentImageIndex = 0;
}

function draw() {
    background(0);  // Black background

    if (images.length > 0) {
        let img = images[currentImageIndex].img;

        // Calculate maximum display dimensions with 100-pixel padding
        let maxDisplayWidth = width - 200;  // 100 pixels padding on each side
        let maxDisplayHeight = height - 200;

        // Calculate the aspect ratio of the image
        let imgAspectRatio = img.width / img.height;

        // Calculate display width and height based on aspect ratio
        let displayWidth = maxDisplayWidth;
        let displayHeight = displayWidth / imgAspectRatio;

        if (displayHeight > maxDisplayHeight) {
            displayHeight = maxDisplayHeight;
            displayWidth = displayHeight * imgAspectRatio;
        }

        // Display the image centered on the canvas
        image(img, (width - displayWidth) / 2, (height - displayHeight) / 2, displayWidth, displayHeight);

        /* Display the CritiqueQuestion at the top*/
        fill(255);  // White text color
        textSize(20);
        let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];
        text(question, width / 2 - textWidth(question) / 2, 2 * textSize(20));
        currentShapeObj.display();
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
