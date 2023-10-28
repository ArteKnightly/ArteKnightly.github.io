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
    createCanvas(windowWidth, windowHeight);
    background(0);  // Set background to black

    // Load all the images from the manifest
    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUID + '.jpg');
        images.push({ data: imgData, img: img });
    }

    // Slider setup
    slider = createSlider(-5, 5, 2.5, 0.1);
    slider.position(windowWidth / 2 - 100, windowHeight - 70);
    

    // Accept button
    acceptBtn = createButton('Accept');
    acceptBtn.position(windowWidth / 2 - 50, windowHeight - 40);
    
    acceptBtn.mousePressed(acceptResponse);

    // N/A button
    naBtn = createButton('N/A');
    naBtn.position(windowWidth / 2 + 50, windowHeight - 40);
    naBtn.mousePressed(naResponse);

    // Default selected image
    currentImageIndex = 0;
}

function draw() {
    background(0);

    // Display the currently selected image centered with a border
    if (images.length > 0) {
        stroke(0);  // Black border
        strokeWeight(4);
        noFill();
        rect(0, 0, width, height);

        // Calculate the scaling factor while maintaining aspect ratio
        let scale_factor = min(width / images[currentImageIndex].img.width, height / images[currentImageIndex].img.height);

        // Display the image centered
        imageMode(CENTER);
        image(images[currentImageIndex].img, width / 2, height / 2, images[currentImageIndex].img.width * scale_factor, images[currentImageIndex].img.height * scale_factor);

        // Display the CritiqueQuestion at the top
        fill(255);  // White text color
        textSize(20);
        let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];
        text(question, width / 2 - textWidth(question) / 2, 2 * textSize(20));
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);  // Re-set background to black

    // Adjust positions based on new window size
    slider.position(windowWidth / 2 - 100, windowHeight - 70);
    acceptBtn.position(windowWidth / 2 - 50, windowHeight - 40);
    naBtn.position(windowWidth / 2 + 50, windowHeight - 40);
}

function acceptResponse() {
    let value = slider.value();
    // Adjust for the value of 0
    if (value === 0) value = 0.01;

    let response = {
        uuid: images[currentImageIndex].data.UUID,
        question: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: value
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
