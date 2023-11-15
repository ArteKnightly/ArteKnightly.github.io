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
let viewedRecently = new Set();
let subsetIndices;
function preload() {
    let cacheBuster = Date.now();
    imgManifest = loadJSON(`data/manifest.json?${cacheBuster}`, jsonLoaded, loadError);
}
function jsonLoaded() {
    console.log('JSON successfully loaded:', imgManifest);
    loadMoreImages(); // Start loading images now that JSON is available
}
async function loadMoreImages() {
    console.log(`Loading more images. Current loadedImages count: ${loadedImages.length}`);

    let imageLoadPromises = [];
    while (loadedImages.length < imagePoolSize) {
        let index = getRandomIndexNotInDisplayedImages();
        let imgData = imgManifest.images[index];
        console.log(`Loading more image at index ${index}:`, imgData.UUIDImage);

        let imgLoadPromise = new Promise((resolve, reject) => {
            loadImage('images/' + imgData.UUIDImage + '.png', (loadedImg) => {
                loadedImages.push({ data: imgData, img: loadedImg });
                console.log("Image loaded:", imgData.UUIDImage);
                resolve();
            }, (error) => {
                console.error("Failed to load image:", imgData.UUIDImage, error);
                reject(error);
            });
        });

        imageLoadPromises.push(imgLoadPromise);
    }

    await Promise.all(imageLoadPromises);
}
function shouldLoadMoreImages() {
    // Check if we're running low on preloaded images in the loadedImages array
    return loadedImages.length < imagePoolSize;
}
function getRandomIndexNotInDisplayedImages() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * imgManifest.images.length);
    } while (viewedRecently.has(imgManifest.images[randomIndex].UUIDImage));
    return randomIndex;
}
function clearViewedRecently() {
    viewedRecently.clear();
}
function loadError(error) {
    console.error('Error loading JSON:', error);
}
function getImg() {
    if (images.length > 0 && currentImageIndex >= 0 && currentImageIndex < images.length && images[currentImageIndex].img) {
        console.log(`Displaying image at index ${currentImageIndex}:`, images[currentImageIndex].data.UUIDImage);
        return images[currentImageIndex].img;
    } else {
        console.error('Image at index', currentImageIndex, 'is not loaded or does not exist');
        return null; // You can return a default image or handle this scenario appropriately
    }
}
function switchImage() {
    // Record UUID to viewedRecently
    let currentUUID = images[currentImageIndex].data.UUIDImage;
    viewedRecently.add(currentUUID);

    // Remove the recently viewed image from loadedImages
    let removeIndex = loadedImages.findIndex(img => img.data.UUIDImage === currentUUID);
    if (removeIndex !== -1) {
        loadedImages.splice(removeIndex, 1);
    }

    // Load more images if necessary
    if (shouldLoadMoreImages()) {
        loadMoreImages();
    }

    // Select next image, ensuring it's not recently viewed
    do {
        currentImageIndex = Math.floor(Math.random() * images.length);
    } while (viewedRecently.has(images[currentImageIndex].data.UUIDImage));
}
//Display
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

    // Call loadMoreImages only if necessary
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
}

 //response
 function naResponse() {
    let response = {
        UUIDImage: images[currentImageIndex].data.UUIDImage,
        UUIDQuestion: critiqueQuestions[currentImageIndex % critiqueQuestions.length],
        responseValue: 0
    };

    responses.push(response);
    console.log(responses);
    // Move to the next image
    switchImage();
}
function doubleClicked() {
    //saveResponse();
    switchImage();
    // Reset the x position of the spinning object
    currentShapeObj.posX = width / 2;
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

//async function preloadSubsetImages(indices) {
//    let imageLoadPromises = [];
//    for (let index of indices) {
//        let imgData = imgManifest.images[index];
//        console.log(`Preloading image at index ${index}:`, imgData.UUIDImage);
//        let imgLoadPromise = new Promise((resolve, reject) => {
//            loadImage('images/' + imgData.UUIDImage + '.png', (loadedImg) => {
//                loadedImages.push({ data: imgData, img: loadedImg });
//                console.log("Image loaded:", imgData.UUIDImage);
//                resolve();
//            }, (error) => {
//                console.error("Failed to load image:", imgData.UUIDImage, error);
//                reject(error);
//            });
//        });
//        imageLoadPromises.push(imgLoadPromise);
//    }
//    await Promise.all(imageLoadPromises);
//}