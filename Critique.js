let imgManifest;
let images = [];
let currentImageIndex = 0;
let startX, startY;  // For swipe detection
let isDragging = false;  // To check if the mouse is pressed or touch is active

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
    createCanvas(800, 600);

    // Load all the images from the manifest
    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUID + '.jpg');
        images.push({ data: imgData, img: img });
    }

    // Add a button to export responses to CSV
    let saveBtn = createButton('Export CSV');
    saveBtn.position(width - 150, height - 40);
    saveBtn.mousePressed(function () {
        console.log('Save button pressed');  // Debugging log
        saveResponsesAsCSV();
    });

    // Example: Default selected image
    currentImageIndex = 0;
}

function draw() {
    background(220);

    // Display the currently selected image centered
    if (images.length > 0) {
        image(images[currentImageIndex].img, width / 2 - images[currentImageIndex].img.width / 2, height / 2 - images[currentImageIndex].img.height / 2);

        // Display the CritiqueQuestion at the top with padding
        fill(0);
        textSize(20);
        let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];

        // Drawing a background for the text to ensure visibility
        fill(255, 255, 0);  // Yellow background
        rect(0, 0, width, 3 * textSize(20));

        fill(0);  // Black text color
        text(question, width / 2 - textWidth(question) / 2, 2 * textSize(20));
    }
}
function mousePressed() {
    startX = mouseX;
    startY = mouseY;
    isDragging = true;
    return false;
}

function mouseReleased() {
    let distX = mouseX - startX;
    let distY = mouseY - startY;

    if (abs(distX) > abs(distY)) {
        if (distX > 0) storeValue(1);  // Right
        else storeValue(-1);  // Left
    } else {
        if (distY > 0) storeValue(0);  // Down
    }

    isDragging = false;
    return false;
}

function storeValue(direction) {
    let imageName = images[currentImageIndex].data.UUID;
    let question = critiqueQuestions[currentImageIndex % critiqueQuestions.length];
    responses.push({ uuid: imageName, question: question, response: direction });
    console.log(responses);

    currentImageIndex = (currentImageIndex + 1) % images.length;
}

function saveResponsesAsCSV() {
    let csvContent = "uuid,question,response\n";
    for (let response of responses) {
        csvContent += `${response.uuid},${response.question},${response.response}\n`;
    }
    save(new Blob([csvContent], { type: "text/csv" }), 'responses.csv');
}
