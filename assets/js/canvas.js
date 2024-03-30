import * as CanvasTools from "./canvasTool.js";

const BRUSH_SHAPES = [
    {
        name: "圓形",
        value: "circle",
        iconClass: "fa-circle",
        isSelected: true,
    },
    {
        name: "正方形",
        value: "square",
        iconClass: "fa-square",
        isSelected: false,
    },
    {
        name: "三角形",
        value: "triangle",
        iconClass: "fa-play",
        isSelected: false,
    },
];

const ERASER_SHAPES = [
    {
        name: "圓形",
        value: "circle",
        isSelected: true,
    },
    {
        name: "正方形",
        value: "square",
        isSelected: false,
    },
    {
        name: "三角形",
        value: "triangle",
        isSelected: false,
    },
];

const SHAPES = [
    {
        name: "圓形",
        value: "circle",
        iconClass: "fa-circle",
        isSelected: false,
    },
    {
        name: "四邊形",
        value: "rectangle",
        iconClass: "fa-square-full",
        isSelected: true,
    },
    {
        name: "三角形",
        value: "triangle",
        iconClass: "fa-gem",
        isSelected: false,
    },
];



export default class Canvas {
    constructor(canvasId, appStateRef) {
        // # Elements
        // The canvas by ID
        this.mainCanvas = document.getElementById(canvasId);
        this.mainCtx = this.mainCanvas.getContext("2d");
        this.previewCanvas = document.getElementById("prev-canvas");
        this.previewCtx = this.previewCanvas.getContext("2d");
        this.canvasArea = document.getElementById("canvas-area");
        this.appStateRef = appStateRef;

        // # Settings
        // Brush Tool
        this.brushShape = BRUSH_SHAPES.find(shape => shape.isSelected).value;
        this.brushSize = 5;
        // Eraser Tool
        this.eraserShape = ERASER_SHAPES.find(shape => shape.isSelected).value;
        this.eraserSize = 10;
        // Shape Tool
        this.shape = SHAPES.find(shape => shape.isSelected).value;
        this.enableStroke = false;
        this.strokeSize = 0;
        // Tools
        this.tools = {  
            "hand-tool": new CanvasTools.HandTool(this),
            "eyedropper-tool": new CanvasTools.EyeDropperTool(this, this.appStateRef),
            "brush-tool": new CanvasTools.BrushTool(this, this.brushSize, this.brushShape),
            "eraser-tool": new CanvasTools.EraserTool(this, this.eraserSize, this.eraserShape),
            "fill-tool": new CanvasTools.FillTool(this),
            "shape-tool": new CanvasTools.ShapeTool(this),
            "text-tool": new CanvasTools.TextTool(this),
            "zoom-tool": new CanvasTools.ZoomTool(this),
        };
        this.currentTool = Object.keys(this.tools)[2];  // ? "brush-tool"

        // # Initialization
        this.initToolElements();
        this.initBrushShapeElements();
        this.initBrushSizeElement();
        this.initEraserShapeElements();
        this.initEraserSizeElement();
        this.initShapeElements();
        this.initStrokeSizeElement();
    }

    // # Tools
    initToolElements() {
        const CanvasToolList = document.getElementById("canvas-tool-list");
        Object.values(this.tools).forEach(tool => {
            const li = document.createElement("li");

            const button = document.createElement("button");
            button.id = tool.id;
            button.type = "button";
            button.title = tool.name;
            button.className = "btn btn-canvas-tool";
            button.setAttribute("data-selected", false);
            button.setAttribute("aria-label", tool.name);
            button.addEventListener("click", () => this.setCurrentTool(tool.id));

            const i = document.createElement("i");
            i.className = tool.iconClass;
            i.setAttribute("aria-hidden", "true");

            button.appendChild(i);
            li.appendChild(button);
            CanvasToolList.appendChild(li);
        });

        // Handle keydown for tool switch
        document.addEventListener("keydown", (e) => {
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const toolEntry = Object.entries(this.tools).find(([id, tool]) => tool.key === e.key);
            if (toolEntry) {
                const [toolId] = toolEntry;
                this.setCurrentTool(toolId);
            }
        });

        // Initialize
        this.setCurrentTool(this.currentTool);
    }

    setCurrentTool(toolId) {
        // Deactivate previous tool
        if (this.currentTool) this.tools[this.currentTool].deactivate();

        // Activate current tool
        this.currentTool = toolId;
        this.tools[toolId].activate();
        this.mainCanvas.setAttribute("data-tool-id", toolId);  // ? Cursor image change purpose

        // Update UI
        this.updateCurrentToolButton(toolId)

        console.log(`Switch to ${this.tools[toolId].name}`);
    }
    updateCurrentToolButton(toolId) {
        document.querySelectorAll(".btn-canvas-tool").forEach(button => {
            button.setAttribute("data-selected", "false");
        });
        const currentButton = document.getElementById(toolId);
        currentButton.setAttribute("data-selected", "true");
        currentButton.focus();
    }

    // # Brush Tool
    initBrushShapeElements() {
        const BrushShapeSelect = document.getElementById("brush-shape-select");
        BRUSH_SHAPES.forEach(shape => {
            const option = document.createElement("option");
            option.value = shape.value;
            option.selected = shape.isSelected;
            option.textContent = shape.name;

            BrushShapeSelect.appendChild(option);
        });
        BrushShapeSelect.addEventListener("change", (e) => this.setBrushShape(e.target.value));
        
        this.setBrushShape(this.brushShape);
    }
    initBrushSizeElement() {
        const BrushShapeInput = document.getElementById("brush-size-input");
        BrushShapeInput.addEventListener("input", (e) => this.setBrushSize(e.target.value));

        this.setBrushSize(this.brushSize);
    }

    setBrushShape(selectedShape) {
        this.tools["brush-tool"].setDrawShape(selectedShape);
        this.updateBrushIcon(selectedShape);

        console.log(`Brush shape set to ${selectedShape}`);
    }
    updateBrushIcon(selectedShape) {
        const shapeObject = BRUSH_SHAPES.find(shape => shape.value === selectedShape);
        const BrushShapeIcon = document.getElementById("brush-shape-icon");

        BRUSH_SHAPES.forEach(shape => {
            BrushShapeIcon.classList.remove(shape.iconClass);
        });
        BrushShapeIcon.classList.remove("-rotate-90");
        BrushShapeIcon.classList.add(`${shapeObject.iconClass}`);
        if (shapeObject.value === "triangle") {
            BrushShapeIcon.classList.add("-rotate-90");
        }
    }

    setBrushSize(selectedSize) {
        this.tools["brush-tool"].setDrawSize(selectedSize);
        this.updateBrushSizeText(selectedSize);
    }
    updateBrushSizeText(value) {
        const BrushSizeText = document.getElementById("brush-size-text");
        BrushSizeText.setAttribute("data-value", value);
    }

    // # Eraser Tool
    initEraserShapeElements() {
        const EraserShapeSelect = document.getElementById("eraser-shape-select");
        ERASER_SHAPES.forEach(shape => {
            const option = document.createElement("option");
            option.value = shape.value;
            option.selected = shape.isSelected;
            option.textContent = shape.name;

            EraserShapeSelect.appendChild(option);
        });
        EraserShapeSelect.addEventListener("change", (e) => this.setEraserShape(e.target.value));
        
        this.setEraserShape(this.eraserShape);
    }
    initEraserSizeElement() {
        const EraserShapeInput = document.getElementById("eraser-size-input");
        EraserShapeInput.addEventListener("input", (e) => this.setEraserSize(e.target.value));

        this.setEraserSize(this.eraserSize);
    }

    setEraserShape(selectedShape) {
        this.tools["eraser-tool"].setDrawShape(selectedShape);

        console.log(`Eraser shape set to ${selectedShape}`);
    }

    setEraserSize(selectedSize) {
        this.tools["eraser-tool"].setDrawSize(selectedSize);
        this.updateEraserSizeText(selectedSize);
    }
    updateEraserSizeText(value) {
        const EraserSizeText = document.getElementById("eraser-size-text");
        EraserSizeText.setAttribute("data-value", value);
    }

    // # Shape Tool
    initShapeElements() {
        const ShapeSelect = document.getElementById("shape-select");
        SHAPES.forEach(shape => {
            const option = document.createElement("option");
            option.value = shape.value;
            option.selected = shape.isSelected;
            option.textContent = shape.name;

            ShapeSelect.appendChild(option);
        });
        ShapeSelect.addEventListener("change", (e) => this.setShape(e.target.value));
        
        this.setShape(this.shape);
    }
    initStrokeSizeElement() {
        const ShapeInput = document.getElementById("stroke-size-input");
        ShapeInput.addEventListener("input", (e) => this.setStrokeSize(e.target.value));

        this.setStrokeSize(this.strokeSize);
    }

    setShape(selectedShape) {
        this.tools["shape-tool"].setShape(selectedShape);
        this.updateShapeIcon(selectedShape);

        console.log(`Shape set to ${selectedShape}`);
    }
    updateShapeIcon(selectedShape) {
        const shapeObject = SHAPES.find(shape => shape.value === selectedShape);
        const ShapeIcon = document.getElementById("shape-icon");

        SHAPES.forEach(shape => {
            ShapeIcon.classList.remove(shape.iconClass);
        });
        ShapeIcon.classList.add(`${shapeObject.iconClass}`);
    }

    setStrokeSize(selectedSize) {
        this.mainCtx.lineWidth = selectedSize;
        this.previewCtx.lineWidth = selectedSize;
        if (selectedSize === 0) {
            this.tools["shape-tool"].setEnableStroke(false);
        } else {
            this.tools["shape-tool"].setEnableStroke(true);
        }
        this.updateStrokeSizeText(selectedSize);
    }
    updateStrokeSizeText(value) {
        const StrokeSizeText = document.getElementById("stroke-size-text");
        StrokeSizeText.setAttribute("data-value", value);
    }

    // # Utilities
    // Colors
    setFillColor(color) {
        this.mainCtx.fillStyle = color;
        this.previewCtx.fillStyle = color;
    }
    setStrokeColor(color) {
        this.mainCtx.strokeStyle = color;
        this.previewCtx.strokeStyle = color;
    }

    reset(ctx = this.mainCtx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // console.log("Canvas reset");
    }

    export(format, withTransBg) {
        // Create a temporary canvas
        let exportCanvas = document.createElement("canvas");
        let exportCtx = exportCanvas.getContext("2d");
        exportCanvas.width = this.mainCanvas.width;
        exportCanvas.height = this.mainCanvas.height;

        function fillBgWhite() {
            exportCtx.fillStyle = "white";
            exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        }

        // If target format does not support alpha channel,
        // or the user wish to export with background
        let fne = format;
        switch (format) {
            case "jpeg":
                fillBgWhite();
                fne = "jpg";
                break;
            case "png":
                if (!withTransBg) fillBgWhite();
                break;
            default:
                console.error("Unsupported export format");
                return;
        }
        exportCtx.drawImage(this.mainCanvas, 0, 0);

        // Create a download
        const filename = `image.${fne}`;
        const a = document.createElement("a");
        a.href = exportCanvas.toDataURL(`image/${format}`, 1.0);
        a.download = filename;
        a.click();

        // Cleanup
        exportCanvas = null;
        console.log(`Export as ${filename}`);
    }
}