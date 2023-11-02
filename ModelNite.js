let modelNiteDetails;

async function setup() {
    createCanvas(800, 600);
    let xPosText = width / 2;
    let yPosText = 100;
    let gridSpacing = 75; // Adjust as needed for your layout

    // Assuming ModelNiteTextDisplay class returns a Promise that resolves when data is ready
    modelNiteDetails = await new ModelNiteTextDisplay(xPosText, yPosText, gridSpacing);

    // Now that we've awaited the promise, we can safely display the content
    modelNiteDetails.display();
}

function draw() {
    // Your draw loop here
}