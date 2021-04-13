export const drawOutline = (detectedObjects, canvasContext, color) => {
  detectedObjects.forEach((obj) => {
    // deconstruct x,y, width, and height from the detectedObj's array
    let [x, y, width, height] = obj.bbox;
    let item = obj.class;

    canvasContext.strokeStyle = color;
    canvasContext.fillStyle = color;
    canvasContext.lineWidth = '5';
    canvasContext.font = '24px Arial';

    canvasContext.beginPath();
    canvasContext.fillText(item, x + width / 2, y + height / 2);
    canvasContext.rect(
      x + width * 0.25,
      y + height * 0.25,
      width / 2,
      height / 2
    );
    canvasContext.stroke();
  });
};
