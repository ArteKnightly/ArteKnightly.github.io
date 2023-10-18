// sketch.js
function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function draw() {
    setGradient(0, 0, width, height, color(random(255), random(255), random(255)), color(random(255), random(255), random(255)));
}

function setGradient(x, y, w, h, c1, c2) {
    noFill();
    for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
    }
}
