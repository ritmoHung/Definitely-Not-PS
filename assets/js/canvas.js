import * as CanvasTools from "./canvasTool.js";

const BRUSH_SHAPES = [
    {
        name: "圓形",
        value: "circle",
        icon: "fa-circle",
        isSelected: true,
        lineCap: "round",
        lineJoin: "round",
    },
    {
        name: "正方形",
        value: "square",
        icon: "fa-square",
        isSelected: false,
        lineCap: "square",
        lineJoin: "mitter",
    },
    {
        name: "三角形",
        value: "triangle",
        icon: "fa-play",
        isSelected: false,
        lineCap: "butt",
        lineJoin: "mitter",
    },
];



export default class Canvas {
    constructor(canvasId) {
        // # Elements
        // The canvas by ID
        const canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext("2d");

        // # Initialization
        // Canvas
        this.reset();

        // # Settings
        this.tools = {
            "hand-tool": new CanvasTools.HandTool(canvas, this.ctx),
            "eyedropper-tool": new CanvasTools.EyeDropperTool(canvas, this.ctx),
            "brush-tool": new CanvasTools.BrushTool(canvas, this.ctx),
            "eraser-tool": new CanvasTools.EraserTool(canvas, this.ctx),
            "fill-tool": new CanvasTools.FillTool(canvas, this.ctx),
            "shape-tool": new CanvasTools.ShapeTool(canvas, this.ctx),
            "text-tool": new CanvasTools.TextTool(canvas, this.ctx),
            "zoom-tool": new CanvasTools.ZoomTool(canvas, this.ctx),
        };
        this.currentTool = Object.keys(this.tools)[2];  // ? "brush-tool"
        this.brushShape = BRUSH_SHAPES.find(shape => shape.isSelected).value;
        this.ctx.lineWidth = 5;

        this.initToolElements();
        this.initBrushShapeElements();
        this.initBrushSizeElement();
    }

    // # Component injection
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
            const toolEntry = Object.entries(this.tools).find(([id, tool]) => tool.key === e.key);
            if (toolEntry) {
                const [toolId] = toolEntry;
                this.setCurrentTool(toolId);
            }
        });

        // Initialize
        this.setCurrentTool(this.currentTool);
    }

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
        const BrushShapeSelect = document.getElementById("brush-size-input");
        BrushShapeSelect.addEventListener("input", (e) => this.setBrushSize(e.target.value));

        this.setBrushSize(this.ctx.lineWidth);
    }

    // # SET functions
    setCurrentTool(toolId) {
        // Deactivate previous tool
        if (this.currentTool) this.tools[this.currentTool].deactivate();

        // Activate current tool
        this.currentTool = toolId;
        this.tools[toolId].activate();

        // Update UI
        this.updateCurrentToolButton(toolId)

        console.log(`Switch to ${this.tools[toolId].name}`);
    }

    setBrushShape(selectedShape) {
        const shapeObject = BRUSH_SHAPES.find(shape => shape.value === selectedShape);

        this.brushShape = selectedShape;
        this.ctx.lineCap = shapeObject.lineCap;
        this.ctx.lineJoin = shapeObject.lineJoin;
        this.updateBrushIcon(shapeObject);

        console.log(`Brush shape set to ${selectedShape}`);
    }

    setBrushSize(selectedSize) {
        this.ctx.lineWidth = selectedSize;
        this.updateBrushSizeText(selectedSize);
    }

    // # UI updates
    updateCurrentToolButton(toolId) {
        document.querySelectorAll(".btn-canvas-tool").forEach(button => {
            button.setAttribute("data-selected", "false");
        });
        const currentButton = document.getElementById(toolId);
        currentButton.setAttribute("data-selected", "true");
        currentButton.focus();
    }

    updateBrushIcon(shapeObject) {
        const BrushShapeIcon = document.getElementById("brush-shape-icon");
        BRUSH_SHAPES.forEach(shape => {
            BrushShapeIcon.classList.remove(shape.icon);
        });

        BrushShapeIcon.classList.remove("-rotate-90");
        BrushShapeIcon.classList.add(`${shapeObject.icon}`);
        if (shapeObject.value === "triangle") {
            BrushShapeIcon.classList.add("-rotate-90");
        }
    }

    updateBrushSizeText(value) {
        const BrushSizeText = document.getElementById("brush-size-text");
        BrushSizeText.setAttribute("data-value", value);
    }

    // #
    reset() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        console.log("Canvas reset");
    }

    export() {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/jpeg");
        a.download = "image.jpg";
        a.click();
    }
}