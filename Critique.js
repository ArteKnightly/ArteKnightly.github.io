let imgManifest;
let images = [];
let currentImageIndex = 0;
let acceptBtn, naBtn;
let critiqueQuestions;
let responses = [];
let leftPad;
let rightPad;
let bottomPad;
let topPad;

function preload() {
    imgManifest = loadJSON('data/manifest.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);

    for (let imgData of imgManifest.images) {
        let img = loadImage('images/' + imgData.UUID + '.jpg');
        images.push({ data: imgData, img: img });

         // Initialize sliders
    leftPadSlider = createSlider(0, 200, 2); // Range: 0-200, Initial Value: 2
    leftPadSlider.position(10, height - 90);

    topPadSlider = createSlider(0, 200, currentShapeObj.size * 2); // Initial value set based on object size
    topPadSlider.position(10, height - 60);

    bottomPadSlider = createSlider(0, 200, 5); // Range: 0-200, Initial Value: 5
    bottomPadSlider.position(10, height - 30);

    }

    switchShape('box');
    currentImageIndex = 0;

    definePads();
}

function draw() {
    background(0);
    
    leftPad = leftPadSlider.value();
    topPad = topPadSlider.value();
    bottomPad = bottomPadSlider.value();

    currentShapeObj.display(getSpinningObjectYPos());
   image(getImg(), -imageXPos() - displayImageWidth(getImg()) / 2, - displayImageHeight(getImg()) / 2, displayImageWidth(getImg()), displayImageHeight(getImg()));
   
    // Display the slider values
    fill(255);  // White text
    text('Left Padding: ' + leftPad, 220, height - 75);
    text('Top Padding: ' + topPad, 220, height - 45);
    text('Bottom Padding: ' + bottomPad, 220, height - 15);
}

function definePads() {
    leftPad = 5;
    rightPad = 2;
    bottomPad = 1;
    topPad = currentShapeObj.size * 3;
}

function getImg() {
    return images[currentImageIndex].img;
}

function getSpinningObjectYPos() {
    return (topPad / 2) - (height / 2);
}

function maxImageWidth() {
    return width - leftPad - rightPad;
}

function maxImageHeight() {
    return height - topPad - bottomPad;
}

function displayImageWidth(img) {
    let aspectRatio = calculateImageAspectRatio(img);
    if (maxImageWidth() / aspectRatio < maxImageHeight()) {
        return maxImageWidth();
    } else {
        return displayImageHeight(img) * aspectRatio;
    }
}

function displayImageHeight(img) {
    let aspectRatio = calculateImageAspectRatio(img);
    if (maxImageWidth() / aspectRatio < maxImageHeight()) {
        return maxImageWidth() / aspectRatio;
    } else {
        return maxImageHeight();
    }
}

function calculateImageAspectRatio(img) {
    return img.width / img.height;
}

function imageXPos() {
    return leftPad;
}

function imageYPos() {
    return bottomPad;
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
