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
let imagePoolSize = 3; 
let displayedImages = [];
let viewedRecently = new Set();
let subsetIndices;

function preload() {
    function preload() {
        let cacheBuster = Date.now();
        console.log(`Loading manifest file at time: ${cacheBuster}`);
        imgManifest = loadJSON(`data/manifest.json?${cacheBuster}`, () => {
            console.log("Manifest loaded:", imgManifest);
        });
    }
    
    let cacheBuster = Date.now();
    console.log(`Loading manifest file at time: ${cacheBuster}`);
    imgManifest = loadJSON(`data/manifest.json?${cacheBuster}`);
    console.log("Manifest loaded:", imgManifest);
      // Randomly select a subset of images from the manifest
    subsetIndices = getRandomSubsetIndices(imgManifest.images.length, imagePoolSize);
    preloadSubsetImages(subsetIndices)
}

function preloadSubsetImages(subsetIndices) {
    for (let index of subsetIndices) {
        let imgData = imgManifest.images[index];
        console.log(`Preloading image at index ${index}:`, imgData.UUIDImage);
        loadImage('images/' + imgData.UUIDImage + '.png', (loadedImg) => {
            console.log(`Image loaded: ${imgData.UUIDImage}`);
            // This callback is executed once the image is loaded
            loadedImages.push({ data: imgData, img: loadedImg });
            viewedRecently.add(imgData.UUIDImage); // Add to viewedRecently set
        }, (event) => {
            console.error(`Error loading image at index ${index}:`, event);
        });
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);

    // Assign preloaded images to the images array
    images = loadedImages.slice(0); // Make a shallow copy of the preloaded images

    switchShape('box');

    // Set currentImageIndex to a random value within the range of preloaded images
    if (images.length > 0) {
        currentImageIndex = Math.floor(Math.random() * images.length);
    }

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
    if (images.length > currentImageIndex) {
        console.log(`Displaying image at index ${currentImageIndex}:`, images[currentImageIndex].data.UUIDImage);
        return images[currentImageIndex].img;
    } else {
        console.error("Current image index is out of bounds:", currentImageIndex);
        return null; // Return null or a placeholder image
    }
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
    console.log("Saving response:", response);
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
    console.log(`Loading more images. Current loadedImages count: ${loadedImages.length}`);

    // Use the image pool strategy to load more images
    // Remove displayed images from the loadedImages array
    loadedImages = loadedImages.filter(img => !displayedImages.includes(img));

    // Load new images until we reach the pool size
    while (loadedImages.length < imagePoolSize) {
        let index = getRandomIndexNotInDisplayedImages();
        let imgData = imgManifest.images[index];
        console.log(`Loading more images at index ${index}:`, imgData.UUIDImage);
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
    console.log("Subset indices selected:", Array.from(subsetIndices));
    return Array.from(subsetIndices);
}
function clearViewedRecently() {
       viewedRecently.clear();
}
