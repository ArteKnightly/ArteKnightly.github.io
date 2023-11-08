let spaceBetween = 25;
let paddingLeft, paddingRight, paddingTop, paddingBottom;
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    calculatePadding();
    addDonationWidget();
}
function calculatePadding() {
    messageHeight = h1 + spaceBetween * 5 + h2 * 4 + 400;
    paddingLeft = (windowWidth - 350) / 2;
    paddingRight = (windowWidth - 250) / 2;
    paddingTop = (windowHeight - messageHeight) / 2;
    paddingBottom = (windowHeight - messageHeight + 100) / 2;
}

// Function to add NOWPayments Donation Widget
function addDonationWidget() {
    // Create an iframe element
    let donationIframe = document.createElement('iframe');
    donationIframe.src = "https://nowpayments.io/embeds/donation-widget?api_key=1XYMZES-REE4C8V-Q7NN6KH-SSWDZ0D&source=lk_donation&medium=referral";
    donationIframe.frameborder = "0";
    donationIframe.scrolling = "no";
    donationIframe.style.overflowY = "hidden";
    donationIframe.style.width = "354px";
    donationIframe.style.height = "680px";
    donationIframe.style.position = "absolute"; // Absolute positioning
    // Positioning the iframe on the page
    donationIframe.style.top = paddingTop + 'px'; // Adjust this value as needed
    donationIframe.style.left = paddingLeft + 'px'; // Adjust this value as needed

    // Append the iframe to the body or a specific element
    document.body.appendChild(donationIframe);
}
