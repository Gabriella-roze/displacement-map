"use strict";

const canvas = document.getElementById("canvas");
const mapCanvas = document.getElementById("canvasMap");
const resultCanvas = document.getElementById("canvasResult");

const ctx = canvas.getContext("2d");
const mapCtx = mapCanvas.getContext("2d");
const resultCtx = resultCanvas.getContext("2d");

const MAX_MOVEMENT = 7;

let imgOriginal, imgMap;

let imgOriginalData, imgMapData;
let resultData = resultCtx.createImageData(canvas.width, canvas.height);

let x, y;

console.clear();

document.addEventListener("DOMContentLoaded", init);

function init() {
    imgOriginal = new Image();
    imgMap = new Image();
    imgOriginal.onload = () => {
        // draw image
        ctx.drawImage(imgOriginal, 0, 0);
        resultCtx.drawImage(imgOriginal, 0, 0);
        // get the data for original image
        imgOriginalData = ctx.getImageData(0, 0, canvas.width, canvas.height); // getImgData(ctx);
        console.log('---> ', imgOriginalData)
    };
    imgMap.onload = () => {
        mapCtx.drawImage(imgMap, 0, 0)
        // get the data of map image
        imgMapData = getImgData(mapCtx);
    };

    resultCanvas.addEventListener("mousemove", mouseMoved);

    imgOriginal.src = "puppy.jpg";
    imgMap.src = "map.jpg";
}

function getImgData(elem) {
    return elem.getImageData(0, 0, canvas.width, canvas.height);
}

function drawCopiedData() {
    console.log(resultData)
    resultCtx.putImageData(resultData, 0, 0);
}


function mouseMoved(event) {
    // get cursor coordinations
    x = event.offsetX;
    y = event.offsetY;
    render();
}

function render() {
    copyPixels(x, y);
    drawCopiedData();
}

function calcXYRatio(x, y) {
    //  calculate and return x and y ratios (0 to 1)
    let mouseXratio = ( x / canvas.width * 2 ) - 1;
    let mouseYratio = ( y / canvas.height * 2 ) - 1;
    return [mouseXratio, mouseYratio];
}

function copyPixels(mouseX, mouseY) {
    let [mouseXratio, mouseYratio]  = calcXYRatio(x, y);
    let displacementX = mouseXratio * MAX_MOVEMENT;
	let displacementY = mouseYratio * MAX_MOVEMENT;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const pixelIndex = 4 * (x + y * canvas.width);

            const greyvalue = imgMapData.data[pixelIndex] / 255;

            const offsetX = Math.round( x + (displacementX * greyvalue));
            const offsetY = Math.round( y + (displacementY * greyvalue));
            
            let originalPixelIndex = (offsetY * canvas.width + offsetX) * 4;

            resultData.data[pixelIndex] = imgOriginalData.data[originalPixelIndex];
            resultData.data[pixelIndex + 1] = imgOriginalData.data[originalPixelIndex + 1];
            resultData.data[pixelIndex + 2] = imgOriginalData.data[originalPixelIndex + 2];
            resultData.data[pixelIndex + 3] = imgOriginalData.data[originalPixelIndex + 3];
        }
    }
}