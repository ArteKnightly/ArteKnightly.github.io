//import { sheetRead, sheetWrite } from './GSheetFunc.js';

let imgManifest;
let images = [];
let currentImageIndex = 0;
let acceptBtn, naBtn;
//let critiqueQuestions;
let responses = [];
let leftPad;
let rightPad;
let bottomPad;
let topPad;
// Variables to keep track of loaded and displayed images
let loadedImages = [];
let imagePoolSize = 10; 
let displayedImages = [];
let viewedRecently = new Set();
let subsetIndices;

function preload() {
    let cacheBuster = Date.now();
    imgManifest = loadJSON(`data/manifest.json?${cacheBuster}`);
      // Randomly select a subset of images from the manifest
    subsetIndices = getRandomSubsetIndices(imgManifest.images.length, imagePoolSize);
    preloadSubsetImages(subsetIndices)
}

function preloadSubsetImages(subsetIndices) {
    for (let index of subsetIndices) {
        let imgData = imgManifest.images[index];
        loadImage('images/' + imgData.UUIDImage + '.png', (loadedImg) => {
            // This callback is executed once the image is loaded
            loadedImages.push({ data: imgData, img: loadedImg });
            viewedRecently.add(imgData.UUIDImage); // Add to viewedRecently set
        });
    }
}
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);

    // Instead of loading all images at once, we use a subset loaded in preload()
    displayedImages = loadedImages.slice(0); // Make a shallow copy of the preloaded images to start with
    switchShape('box');
    currentImageIndex = 0;
    definePads();
}
function draw() {
    background(0);
    currentShapeObj.display(getSpinningObjectYPos());
    image(getImg(), imageXPos(), imageYPos(), displayImageWidth(getImg()), displayImageHeight(getImg()));
    if (shouldLoadMoreImages()) {
        loadMoreImages();
    }
}

function definePads() {
    leftPad = currentShapeObj.size/2;
    rightPad = currentShapeObj.size/2;
    bottomPad = 20;
    topPad = currentShapeObj.size * 2.125;
}

function getImg() {
    return images[currentImageIndex].img;
}

function getSpinningObjectYPos() {
    return (topPad / 1.9) - (height / 2);
}

function maxImageWidth() {
    return windowWidth - leftPad - rightPad;
}

function maxImageHeight() {
    return windowHeight - topPad - bottomPad;
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
    return -displayImageWidth(getImg()) / 2;
}

function imageYPos() {
   return topPad - (height / 2);
    // return -topPad - displayImageHeight(getImg()) / 2;
}

function naResponse() {
    let response = {
        UUIDImage: images[currentImageIndex].data.UUIDImage,
        UUIDQuestion: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: 0
    };

    responses.push(response);
    console.log(responses);

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
}
function doubleClicked() {
    saveResponse();

    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;

    // Reset the x position of the spinning object
    currentShapeObj.posX = width / 2;  // Assuming the middle of the canvas is the default position
}
function saveResponse() {
    let scaledValue = map(currentShapeObj.posX, 0, width - currentShapeObj.size, -5, 5);
    scaledValue = constrain(scaledValue, -5, 5);
    if (scaledValue === 0) scaledValue = 0.01;  // Reserve 0 for N/A
    scaledValue = parseFloat(scaledValue.toFixed(2));

    let response = {
        UUIDImage: images[currentImageIndex].data.UUIDImage,
        UUIDQuestion: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: scaledValue
    };

    responses.push(response);
    console.log(responses);
    // Create an instance of the ImageRatingsTable class
    const imageRatings = new ImageRatingsTable();

    // Assuming the response object has the structure { UUIDImage, UUIDQuestion, Score }
    // Write to the ImageRatings sheet using the write method
    imageRatings.write(response.UUIDImage, response.UUIDQuestion, response.Score);
}
function shouldLoadMoreImages() {
    // Define logic to determine if we're running low on preloaded images
    return displayedImages.length < 10; // for example, load more if we have less than 10 images left
}

function loadMoreImages() {
    // Use the image pool strategy to load more images
    // Remove displayed images from the loadedImages array
    loadedImages = loadedImages.filter(img => !displayedImages.includes(img));

    // Load new images until we reach the pool size
    while (loadedImages.length < imagePoolSize) {
        let index = getRandomIndexNotInDisplayedImages();
        let imgData = imgManifest.images[index];
        let img = loadImage('images/' + imgData.UUIDImage + '.png', (loadedImg) => {
            loadedImages.push({ data: imgData, img: loadedImg });
        });
    }
}
function getRandomSubsetIndices(totalLength, subsetSize) {
    let subsetIndices = new Set();

    // Continue to attempt to add random indices until we have a full subset
    while (subsetIndices.size < subsetSize) {
        let randomIndex = Math.floor(Math.random() * totalLength);
        subsetIndices.add(randomIndex);
    }

    return Array.from(subsetIndices);
}
//function getRandomSubsetIndices(totalLength, subsetSize) {
//    let subsetIndices = new Set(); // Use a Set to ensure unique indices

//    while (subsetIndices.size < subsetSize) {
//        let randomIndex = Math.floor(Math.random() * totalLength);
//        if (!viewedRecently.has(imgManifest.images[randomIndex].UUIDImage)) {
//            subsetIndices.add(randomIndex);
//        }
//    }

//    return Array.from(subsetIndices); // Convert the Set to an Array
//}

function clearViewedRecently() {
       viewedRecently.clear();
}