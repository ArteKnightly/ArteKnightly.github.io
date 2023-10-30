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

    display() {
        // Determine fill color based on posX
        let normalizedX = map(this.posX, -width / 2, width / 2, -1, 1);
        
        normalizedX = constrain(normalizedX, -1, 1);

        if (normalizedX < 0) {
            // Transition to turquoise
            let col = lerpColor(color(0, 0, 0, 0), color(64, 224, 208, 255), abs(normalizedX)); // Turquoise
            fill(col);
        } else {
            // Transition to cadmium red light
            let col = lerpColor(color(0, 0, 0, 0), color(255, 48, 48, 255), normalizedX); // Cadmium Red Light
            fill(col);
        }

        // Interpolate outline from white to black
        let outlineCol = lerpColor(color(255), color(0), abs(normalizedX));
        stroke(outlineCol);
        display(yTranslate = 0) {
        push();
        translate(this.posX, yTranslate, 0);
        rotateX(frameCount * this.spin + noise(this.noiseOffsetX) * 0.1);  // Incorporate noise into spin
        rotateY(frameCount * this.rotate + noise(this.noiseOffsetY) * 0.1);  // Incorporate noise into rotate

        if (this.type === 'box') {
            box(this.size, this.size, this.size);
        } else if (this.type === 'sphere') {
            sphere(this.size, this.res.detailX, this.res.detailY);
        } else if (this.type === 'cylinder') {
            cylinder(this.size, this.size, this.res.detailX, this.res.detailY);
        } else if (this.type === 'cone') {
            cone(this.size, this.size, this.res.detailX, this.res.detailY);
        } else if (this.type === 'torus') {
            torus(this.size, this.size / 2, this.res.detailX, this.res.detailY);  // Size divided by 2 for inner radius
        }
        pop();
        }

        this.noiseOffsetX += 0.001;  // Adjust as needed
        this.noiseOffsetY += 0.001;  // Adjust as needed
    }

    setPosition(x) {
        this.posX = x;
    }
}

function setup() {
    switchShape('box');  // Start with the box shape by default
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
