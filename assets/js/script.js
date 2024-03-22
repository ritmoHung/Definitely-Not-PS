const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const keyToToolMap = {
    "h": "手形工具",
    "i": "滴管工具",
    "b": "筆刷工具",
    "e": "橡皮擦工具",
    "f": "填滿工具",
    "u": "形狀工具",
    "t": "文字工具",
    "z": "縮放顯示工具",
};

document.addEventListener("DOMContentLoaded", () => {
    const selectedBrushShape = document.getElementById("brush-shape").value;
    updateBrushShape(selectedBrushShape);

    const selectedShape = document.getElementById("shape").value;
    updateShape(selectedShape);
});

document.addEventListener("DOMContentLoaded", () => {
    const toolButtons = document.querySelectorAll(".btn-tool");

    function updateSelectedTool(selectedButton) {
        toolButtons.forEach(button => {
            button.setAttribute("data-selected", "false");
        });
        selectedButton.setAttribute("data-selected", "true");
        selectedButton.focus();
    }

    toolButtons.forEach(button => {
        button.addEventListener("click", () => updateSelectedTool(button));
    });

    document.addEventListener("keydown", (e) => {
        const toolName = keyToToolMap[e.key];
        if (toolName) {
            const button = Array.from(toolButtons).find(button => button.getAttribute("aria-label") === toolName);
            if (button) {
                updateSelectedTool(button);
                console.log(`${e.key.toUpperCase()}: ${toolName}`);
            }
        }
    })
});



const brushShapes = {
    circle: "fa-circle",
    square: "fa-square",
    triangle: "fa-play",
};
const eraserShapes = {
    circle: "fa-circle",
    square: "fa-square",
    triangle: "fa-play",
};
const shapes = {
    circle: "fa-circle",
    square: "fa-square-full",
    triangle: "fa-gem",
}

/* ------------------------- _BRUSH ------------------------- */
function updateBrushShape(shape) {
    const brushShapeIcon = document.getElementById("brush-shape-icon");
    Object.values(brushShapes).forEach(className => {
        brushShapeIcon.classList.remove(className);
    });

    brushShapeIcon.classList.remove("-rotate-90");
    brushShapeIcon.classList.add(`${brushShapes[shape]}`);
    if (shape === "triangle") {
        brushShapeIcon.classList.add("-rotate-90");
    }
}
function updateBrushSize(value) {
    const brushSizeText = document.getElementById("brush-size-text");
    brushSizeText.setAttribute("data-value", value);
}

/* ------------------------- ERASER ------------------------- */
function updateEraserShape(shape) {
}
function updateEraserSize(value) {
    const eraserSizeText = document.getElementById("eraser-size-text");
    eraserSizeText.setAttribute("data-value", value);
}

/* ------------------------- SHAPES ------------------------- */
function updateShape(shape) {
    const shapeIcon = document.getElementById("shape-icon");
    Object.values(shapes).forEach(className => {
        shapeIcon.classList.remove(className);
    });
    shapeIcon.classList.add(`${shapes[shape]}`);
}
function updateShapeStrokeSize(value) {
    const shapeStrokeText = document.getElementById("shape-stroke-text");
    shapeStrokeText.setAttribute("data-value", value);
}

/* ------------------------- SHAPES ------------------------- */
function updateFontSize(value) {
    const fontSizeText = document.getElementById("font-size-text");
    fontSizeText.setAttribute("data-value", value);
}
function updateFontWeight(value) {
    const fontWeightText = document.getElementById("font-weight-text");
    fontWeightText.setAttribute("data-value", value);
}