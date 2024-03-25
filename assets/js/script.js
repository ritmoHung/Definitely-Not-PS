import AppState from "./appState.js";

const canvasState = new AppState();



/* --------------------- INITIALIZATION --------------------- */
// # Selected color property switching
document.addEventListener("DOMContentLoaded", () => {
    const mainColorButton = document.getElementById("main-color-button");
    const strokeColorButton = document.getElementById("stroke-color-button");

    function handleClick(selected, other) {
        selected.style.zIndex = 2;
        other.style.zIndex = 1;

        canvasState.setSelectedColorProperty(selected.getAttribute("data-color-property"));
    }

    mainColorButton.onclick = () => handleClick(mainColorButton, strokeColorButton);
    strokeColorButton.onclick = () => handleClick(strokeColorButton, mainColorButton);
});

document.addEventListener("DOMContentLoaded", () => {
    const selectedShape = document.getElementById("shape").value;
    updateShape(selectedShape);
});

// # Basic operations
document.addEventListener("DOMContentLoaded", () => {
    const UndoButton = document.getElementById("undo-button");
    const RedoButton = document.getElementById("redo-button");
    const DiscardButton = document.getElementById("discard-button");
    const ImportButton = document.getElementById("import-button");
    const ExportButton = document.getElementById("export-button");
    const ColorSwapButton = document.getElementById("color-swap-button");

    UndoButton.onclick = () => handleUndo();
    RedoButton.onclick = () => handleRedo();
    DiscardButton.onclick = () => handleDiscard();
    ImportButton.onclick = () => handleImport();
    ExportButton.onclick = () => handleExport();
    ColorSwapButton.onclick = () => handleColorSwap();
});

function handleUndo() {
    // TODO
    console.log("To be deved");
}

function handleRedo() {
    // TODO
    console.log("To be deved");
}

function handleDiscard() {
    canvasState.MainCanvas.reset();
}

function handleImport() {
    // TODO
    console.log("To be deved");
}

function handleExport() {
    canvasState.MainCanvas.export();
}

function handleColorSwap() {
    canvasState.swapColors();
}

// # Right sidebar toggle button
document.addEventListener("DOMContentLoaded", () => {
    const rsbToggleButton = document.getElementById("rsb-toggle-button");
    const mq = window.matchMedia("(min-width: 768px)");

    // Set state on resize
    window.addEventListener("resize", () => {
        if (!mq.matches && rsbToggleButton.getAttribute("aria-expanded") === "true") {
            setRightSidebarState(false);
        }
    });

    // Toggle state on click
    rsbToggleButton.addEventListener("click", () => {
        const state = rsbToggleButton.getAttribute("aria-expanded") === "true";
        setRightSidebarState(!state);
    });

    // Initialization
    setRightSidebarState(mq.matches);
})

function setRightSidebarState(state) {
    const rsbToggleButton = document.getElementById("rsb-toggle-button");
    const rightSidebar = document.getElementById("right-sidebar");

    rsbToggleButton.setAttribute("aria-expanded", String(state));
    if (state) rightSidebar.classList.remove("!hidden");
    else rightSidebar.classList.add("!hidden");
}



/* ------------------------- COLORS ------------------------- */
// # Color picker
document.addEventListener("DOMContentLoaded", () => {
    const colorPickerArea = document.getElementById("color-picker-area");
    const colorPickerCaret = document.getElementById("color-picker-caret");
    let isDragging = false;
    let satPercentage, valPercentage;

    function updateCaretPosition(event) {
        event.preventDefault();

        const bounds = colorPickerArea.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        x = Math.max(0, Math.min(x, bounds.width));
        y = Math.max(0, Math.min(y, bounds.height));
        satPercentage = x / bounds.width;
        valPercentage = y / bounds.height;

        applyColor();
    }

    // Apply color change to caret position and color
    function applyColor() {
        // Update caret position
        const bounds = colorPickerArea.getBoundingClientRect();
        let x = satPercentage * bounds.width;
        let y = valPercentage * bounds.height;
        colorPickerCaret.style.left = `${x}px`;
        colorPickerCaret.style.top = `${y}px`;

        // Update color
        canvasState.setColorByPercentages(canvasState.selectedColorProperty, satPercentage, 1 - valPercentage);
    }

    // # Event listeners
    // Updates on picker click / drag
    colorPickerArea.addEventListener("mousedown", (event) => {
        isDragging = true;
        updateCaretPosition(event);
    });
    document.addEventListener("mousemove", (event) => {
        if (isDragging) updateCaretPosition(event);
    });
    document.addEventListener("mouseup", () => isDragging = false);

    // Update on UI resize
    window.addEventListener("resize", () => applyColor());
});

// # Hue picker
document.addEventListener("DOMContentLoaded", () => {
    const huePicker = document.getElementById("hue-picker");
    const huePickerCaret = document.getElementById("hue-picker-caret");
    let isDragging = false;
    let huePercentage = 0;

    function updateHueCaretPosition(event) {
        event.preventDefault();

        const bounds = huePicker.getBoundingClientRect();
        let y = event.clientY - bounds.top;
        y = Math.max(0, Math.min(y, bounds.height));

        huePercentage = y / bounds.height;
        applyHue();
    }

    // Apply hue change to caret position and hue
    function applyHue() {
        // Update caret position
        const bounds = huePicker.getBoundingClientRect();
        let y = huePercentage * bounds.height;
        huePickerCaret.style.top = `${y}px`;

        // Update hue
        const h = ((1 - huePercentage) * 360) % 360;
        canvasState.setColor(canvasState.selectedColorProperty, { h });
    }

    // # Event listeners
    // Updates on picker click / drag
    huePicker.addEventListener("mousedown", (event) => {
        isDragging = true;
        updateHueCaretPosition(event);
    });
    // Updates on caret drag
    huePickerCaret.addEventListener("mousedown", () => isDragging = true);
    document.addEventListener("mousemove", (event) => {
        if (isDragging) updateHueCaretPosition(event);
    });
    document.addEventListener("mouseup", () => isDragging = false);

    // Update on UI resize
    window.addEventListener("resize", () => applyHue());
});



/* ------------------------- ERASER ------------------------- */
const eraserShapes = {
    circle: "fa-circle",
    square: "fa-square",
    triangle: "fa-play",
};

function updateEraserShape(shape) {
}
function updateEraserSize(value) {
    const eraserSizeText = document.getElementById("eraser-size-text");
    eraserSizeText.setAttribute("data-value", value);
}



/* ------------------------- SHAPES ------------------------- */
const shapes = {
    circle: "fa-circle",
    square: "fa-square-full",
    triangle: "fa-gem",
}

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