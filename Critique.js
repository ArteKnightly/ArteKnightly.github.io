let imgManifest;
let images = [];
let currentImageIndex = 0;
let imageValues = {};
let startX, startY;  // To store the starting point for swipe

let critiqueQuestions = [
    "What do you think about the color scheme?",
    "How does this image make you feel?",
    "What stands out the most to you in this image?",
    // ... add more questions as needed
];

let responses = [];  // To store user responses

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

    // Display the currently selected image at mouseX, mouseY
    if (images.length > 0) {
        image(images[currentImageIndex].img, mouseX - images[currentImageIndex].img.width / 2, mouseY - images[currentImageIndex].img.height / 2);

        // Display the CritiqueQuestion at the top with padding
        fill(255, 0, 0);
        textSize(20);
        let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];
        text(question, 10, 3 * textSize(20));

        // Draw thumbs up/down icons
        fill(0, 255, 0);  // Green for thumbs up
        rect(10, height / 2 - 15, 30, 30);  // Simple square as thumbs up icon for now
        fill(255, 0, 0);  // Red for thumbs down
        rect(width - 40, height / 2 - 15, 30, 30);  // Simple square as thumbs down icon for now

        // Display "n/a" at the bottom center
        fill(0);
        text("n/a", width / 2 - textSize(12) / 2, height - 10);
    }
}

function touchStarted() {
    startX = mouseX;
    startY = mouseY;
    return false;
}

function touchEnded() {
    let distX = mouseX - startX;
    let distY = mouseY - startY;

    if (abs(distX) > abs(distY)) {
        if (distX > 0) storeValue(1);  // Right
        else storeValue(-1);  // Left
    } else {
        if (distY > 0) storeValue(0);  // Down
    }
    return false;
}

function storeValue(direction) {
    let imageName = images[currentImageIndex].data.UUID;
    let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];
    responses.push({ uuid: imageName, question: question, response: direction });
    console.log(responses);

    // Advance to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

function keyPressed() {
    if (key === 'S') {
        saveResponsesAsCSV();
    }
}

function saveResponsesAsCSV() {
    let csvContent = "uuid,question,response\n";
    for (let response of responses) {
        csvContent += `${response.uuid},${response.question},${response.response}\n`;
    }
    save(new Blob([csvContent], { type: "text/csv" }), 'responses.csv');
}
