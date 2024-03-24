const CANVAS_TOOLS = [
    {
        id: "hand-tool",
        name: "手形工具",
        isSelected: false,
        icon: "fa-hand",
        key: "h",
    },
    {
        id: "eyedropper-tool",
        name: "滴管工具",
        isSelected: false,
        icon: "fa-eye-dropper",
        key: "i",
    },
    {
        id: "brush-tool",
        name: "筆刷工具",
        isSelected: true,
        icon: "fa-paintbrush",
        key: "b",
    },
    {
        id: "eraser-tool",
        name: "橡皮擦工具",
        isSelected: false,
        icon: "fa-eraser",
        key: "e",
    },
    {
        id: "fill-tool",
        name: "填滿工具",
        isSelected: false,
        icon: "fa-fill-drip",
        key: "f",
    },
    {
        id: "shape-tool",
        name: "形狀工具",
        isSelected: false,
        icon: "fa-draw-polygon",
        key: "u",
    },
    {
        id: "text-tool",
        name: "文字工具",
        isSelected: false,
        icon: "fa-i-cursor",
        key: "t",
    },
    {
        id: "zoom-tool",
        name: "縮放顯示工具",
        isSelected: false,
        icon: "fa-magnifying-glass",
        key: "z",
    },
];

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
        lineCap: "butt",
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
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        // # Initialization
        // Canvas
        this.reset();

        // # Settings
        this.selectedTool = CANVAS_TOOLS.find(tool => tool.isSelected).id;
        this.brushShape = BRUSH_SHAPES.find(shape => shape.isSelected).value;
        this.ctx.lineWidth = 5;
        this.TOLERANCE = 5;
        this.isPainting = false;
        this.pathX = 0;
        this.pathY = 0;

        this.canvas.addEventListener("mousedown", (e) => {
            this.isPainting = true;
            this.pathX = e.offsetX;
            this.pathY = e.offsetY;
            this.ctx.beginPath();
            this.ctx.moveTo(this.pathX, this.pathY);
        });

        this.canvas.addEventListener("mousemove", (e) => this.draw(e));

        this.canvas.addEventListener("mouseup", () => {
            this.isPainting = false;
            this.ctx.beginPath();
        });

        this.initToolElements();
        this.initBrushShapeElements();
        this.initBrushSizeElement();
    }

    // # Component injection
    initToolElements() {
        const CanvasToolList = document.getElementById("canvas-tool-list");
        CANVAS_TOOLS.forEach(tool => {
            const li = document.createElement("li");

            const button = document.createElement("button");
            button.id = tool.id;
            button.type = "button";
            button.title = tool.name;
            button.className = "btn btn-tool";
            button.setAttribute("data-selected", tool.isSelected);
            button.setAttribute("aria-label", tool.name);
            button.addEventListener("click", () => this.setSelectedTool(button, CanvasToolList));

            const i = document.createElement("i");
            i.className = `fa-solid ${tool.icon}`;
            i.setAttribute("aria-hidden", "true");

            button.appendChild(i);
            li.appendChild(button);
            CanvasToolList.appendChild(li);
        });

        document.addEventListener("keydown", (e) => {
            const tool = CANVAS_TOOLS.find(tool => tool.key === e.key);
            if (tool) {
                const button = document.getElementById(tool.id);
                if (button) this.setSelectedTool(button, CanvasToolList);
            }
        });
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
    setSelectedTool(selectedButton, CanvasToolList) {
        this.selectedTool = selectedButton.id;

        const toolButtons = CanvasToolList.querySelectorAll(".btn-tool");
        toolButtons.forEach(button => {
            button.setAttribute("data-selected", "false");
        });
        selectedButton.setAttribute("data-selected", "true");
        selectedButton.focus();

        console.log(`Switch to ${selectedButton.getAttribute("aria-label")}`);
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
    draw(e) {
        if (!this.isPainting) return;

        const x = e.offsetX;
        const y = e.offsetY;
        const dx = Math.abs(x - this.pathX);
        const dy = Math.abs(y - this.pathY);

        if (dx >= this.TOLERANCE || dy >= this.TOLERANCE) {
            this.ctx.quadraticCurveTo(this.pathX, this.pathY, (x + this.pathX) / 2, (y + this.pathY) / 2);
            this.pathX = x;
            this.pathY = y;
            this.ctx.stroke();
        }
    }

    reset() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        console.log("Canvas reset");
    }

    export() {
        const a = document.createElement("a");
        a.href = this.canvas.toDataURL("image/jpeg");
        a.download = "image.jpg";
        a.click();
    }
}