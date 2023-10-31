let currentShapeObj;
let shapeResolutions = {
    'box': { detailX: null, detailY: null },
    'sphere': { detailX: 3, detailY: 2 },
    'cylinder': { detailX: 4, detailY: 1 },
    'cone': { detailX: 24, detailY: 1 },
    'torus': { detailX: 3, detailY: 3 }
};

class ObjShape {
    constructor(type, size, resolutions, spin, rotate) {
        this.type = type;
        this.size = size;
        this.res = resolutions[type];
        this.posX = 0;
        this.spin = spin;
        this.rotate = rotate;
        this.noiseOffsetX = random(0, 1000);  // For Perlin noise
        this.noiseOffsetY = random(1001, 2000);  // For Perlin noise
    }

    display(yTranslate = 0) {
        let normalizedX = map(this.posX, -width / 2, width / 2, -1, 1);
        normalizedX = constrain(normalizedX, -1, 1);
        let fillCol;

        if (normalizedX < 0) {
            fillCol = lerpColor(color(0, 0, 0, 0), color(64, 224, 208, 255), abs(normalizedX)); // Turquoise
        } else {
            fillCol = lerpColor(color(0, 0, 0, 0), color(255, 48, 48, 255), normalizedX); // Cadmium Red Light
        }
        fill(fillCol);
        stroke(fillCol); // set outline to match fill color
        
        let scaleValue =  map(abs(this.posX), 0, width / 2, 0, .9); // scale from 50% to 100%
        let displaySize = (this.size *.1) + (this.size * scaleValue);

        push();
        translate(this.posX, yTranslate, 0);
        scale(scaleValue); // apply the scaling
        rotateX(frameCount * this.spin + noise(this.noiseOffsetX) * 0.1);
        rotateY(frameCount * this.rotate + noise(this.noiseOffsetY) * 0.1);

        if (this.type === 'box') {
            box(displaySize, displaySize, displaySize);
        } else if (this.type === 'sphere') {
            sphere(displaySize, this.res.detailX, this.res.detailY);
        } else if (this.type === 'cylinder') {
            cylinder(displaySize, displaySize, this.res.detailX, this.res.detailY);
        } else if (this.type === 'cone') {
            cone(displaySize, displaySize, this.res.detailX, this.res.detailY);
        } else if (this.type === 'torus') {
            torus(displaySize, displaySize / 2, this.res.detailX, this.res.detailY);
        }
        pop();

        this.noiseOffsetX += 0.001;
        this.noiseOffsetY += 0.001;
    }

    setPosition(x) {
        this.posX = x;
    }
}

function setup() {
    switchShape('box');
}

function draw() {
    currentShapeObj.display();
}

function keyPressed() {
    if (key === '1') switchShape('box');
    if (key === '2') switchShape('sphere');
    if (key === '3') switchShape('cylinder');
    if (key === '4') switchShape('cone');
    if (key === '5') switchShape('torus');
}

function switchShape(shapeType) {
    currentShapeObj = new ObjShape(shapeType, 50, shapeResolutions, 0.02, 0.01);
}

function mouseDragged() {
    currentShapeObj.setPosition(mouseX - width / 2);
}

function doubleClicked() {
    let scaledValue = map(currentShapeObj.posX, 0, width - currentShapeObj.size, -5, 5);
    scaledValue = constrain(scaledValue, -5, 5);
    if (scaledValue === 0) scaledValue = 0.01;
    console.log(`Scaled value for ${currentShapeObj.type}: ${scaledValue.toFixed(2)}`);
}
    
window.switchShape = switchShape;
