class CanvasTool {
    constructor(canvasRef, { id, name, iconClass, key }) {
        this.canvasRef = canvasRef;

        this.id = id;
        this.name = name;
        this.iconClass = iconClass;
        this.key = key;
    }

    activate() {
        // @Override
    }

    deactivate() {
        // @Override
    }
}

export class HandTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "hand-tool",
            name: "手形工具",
            iconClass: "fa-solid fa-hand",
            key: "h",
        });
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

export class EyeDropperTool extends CanvasTool {
    constructor(canvasRef, appStateRef) {
        super(canvasRef, {
            id: "eyedropper-tool",
            name: "滴管工具",
            iconClass: "fa-solid fa-eye-dropper",
            key: "i",
        });
        this.appStateRef = appStateRef;
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

class DrawingTool extends CanvasTool {
    constructor(canvasRef, toolConfig) {
        super(canvasRef, toolConfig);

        this.compositeOperation = toolConfig.compositeOperation ? toolConfig.compositeOperation : "";
        this.isDrawing = false;
        this.tolerance = 5;
        this.stampDensity = 2;
        this.drawShape = toolConfig.drawShape ? toolConfig.drawShape : "circle";
        this.drawSize = toolConfig.drawSize ? toolConfig.drawSize : 5;
        this.prevX = 0;
        this.prevY = 0;

        // ? Let functions be referenceable when removing event listeners
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    activate() {
        if (this.compositeOperation) {
            this.canvasRef.mainCtx.globalCompositeOperation = this.compositeOperation;
        }

        this.canvasRef.mainCanvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvasRef.mainCanvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvasRef.mainCanvas.addEventListener("mouseup", this.handleMouseUp);
    }

    deactivate() {
        if (this.compositeOperation && this.compositeOperation !== "source-over") {
            this.canvasRef.mainCtx.globalCompositeOperation = "source-over";
        }

        this.canvasRef.mainCanvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvasRef.mainCanvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvasRef.mainCanvas.removeEventListener("mouseup", this.handleMouseUp);
    }

    // # Functionality
    handleMouseDown(e) {
        this.isDrawing = true;
        this.prevX = e.offsetX;
        this.prevY = e.offsetY;
        this.canvasRef.mainCtx.beginPath();
        this.canvasRef.mainCtx.moveTo(this.prevX, this.prevY);
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;

        // ? Legacy: Draw strokes
        // const x = e.offsetX;
        // const y = e.offsetY;
        // const dx = Math.abs(x - this.prevX);
        // const dy = Math.abs(y - this.prevY);

        // if (dx >= this.tolerance || dy >= this.tolerance) {
        //     this.canvasRef.mainCtx.quadraticCurveTo(this.prevX, this.prevY, (x + this.prevX) / 2, (y + this.prevY) / 2);
        //     this.prevX = x;
        //     this.prevY = y;
        //     this.canvasRef.mainCtx.stroke();
        // }

        const x = e.offsetX;
        const y = e.offsetY;
        const dx = x - this.prevX;
        const dy = y - this.prevY;

        if (Math.abs(dx) >= this.tolerance || Math.abs(dy) >= this.tolerance) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const stamps = Math.max(1, distance * this.stampDensity);

            for (let i = 1; i <= stamps; i++) {
                const stampX = this.prevX + (dx * i) / stamps;
                const stampY = this.prevY + (dy * i) / stamps;

                this.canvasRef.mainCtx.beginPath();
                switch (this.drawShape) {
                    case "circle":
                        this.canvasRef.mainCtx.arc(stampX, stampY, this.drawSize / 2, 0, Math.PI * 2);
                        break;
                    case "square":
                        this.canvasRef.mainCtx.rect(stampX - this.drawSize / 2, stampY - this.drawSize / 2, this.drawSize, this.drawSize);
                        break;
                    case "triangle":
                        const r = this.drawSize / 2;
                        const s = Math.sqrt(3) * r;
                        const h = Math.sqrt(3) / 2 * s;

                        const A = { x: stampX - s / 2, y: stampY + h / 3 };
                        const B = { x: stampX + s / 2, y: stampY + h / 3 };
                        const C = { x: stampX, y: stampY - 2 * h / 3 };

                        this.canvasRef.mainCtx.moveTo(A.x, A.y);
                        this.canvasRef.mainCtx.lineTo(B.x, B.y);
                        this.canvasRef.mainCtx.lineTo(C.x, C.y);
                        this.canvasRef.mainCtx.closePath();
                        break;
                    case "image":
                        break;
                    default:
                        break;
                }
                this.canvasRef.mainCtx.fill();
            }

            this.prevX = x;
            this.prevY = y;
        }
    }

    handleMouseUp() {
        this.isDrawing = false;
        this.canvasRef.mainCtx.beginPath();
    }

    setDrawShape(shape) {
        this.drawShape = shape;
    }

    setDrawSize(size) {
        this.drawSize = size;
    }
}

export class BrushTool extends DrawingTool {
    constructor(canvasRef, drawSize, drawShape) {
        super(canvasRef, {
            id: "brush-tool",
            name: "筆刷工具",
            iconClass: "fa-solid fa-paintbrush",
            key: "b",
            compositeOperation: "source-over",
            drawSize,
            drawShape,
        });
    }
}

export class EraserTool extends DrawingTool {
    constructor(canvasRef, drawSize, drawShape) {
        super(canvasRef, {
            id: "eraser-tool",
            name: "橡皮擦工具",
            iconClass: "fa-solid fa-eraser",
            key: "e",
            compositeOperation: "destination-out",
            drawSize,
            drawShape,
        });
    }
}

export class FillTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "fill-tool",
            name: "填滿工具",
            iconClass: "fa-solid fa-fill-drip",
            key: "f",
        });

        // ? Let functions be referenceable when removing event listeners
        this.handleClick = this.handleClick.bind(this);
    }

    activate() {
        this.canvasRef.canvasArea.style.cursor = 'url("./assets/cursors/fa-solid-paintbrush.svg")';

        this.canvasRef.mainCanvas.addEventListener("click", this.handleClick);
    }

    deactivate() {
        this.canvasRef.mainCanvas.removeEventListener("click", this.handleClick);
    }

    // # Functionality

    handleClick() {
        this.canvasRef.mainCtx.fillRect(0, 0, this.canvasRef.mainCanvas.width, this.canvasRef.mainCanvas.height);
    }
}

export class ShapeTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "shape-tool",
            name: "形狀工具",
            iconClass: "fa-solid fa-draw-polygon",
            key: "u",
        });

        this.isPainting = false;
        this.pathX = 0;
        this.pathY = 0;

        // ? Let functions be referenceable when removing event listeners
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    activate() {
        this.canvasRef.mainCanvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvasRef.mainCanvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvasRef.mainCanvas.addEventListener("mouseup", this.handleMouseUp);
    }

    deactivate() {
        this.canvasRef.mainCanvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvasRef.mainCanvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvasRef.mainCanvas.removeEventListener("mouseup", this.handleMouseUp);
    }

    // # Functionality
    handleMouseDown(e) {
        this.isPainting = true;

        this.pathX = e.offsetX;
        this.pathY = e.offsetY;
        this.canvasRef.previewCtx.beginPath();
        this.canvasRef.previewCtx.moveTo(this.pathX, this.pathY);
    }

    handleMouseMove(e) {
        if (!this.isPainting) return;
        this.canvasRef.previewCtx.clearRect(0, 0, this.canvasRef.previewCanvas.width, this.canvasRef.previewCanvas.height);

        this.draw(e);
    }

    handleMouseUp(e) {
        this.isPainting = false;
        this.canvasRef.mainCtx.drawImage(this.canvasRef.previewCanvas, 0, 0);
        this.canvasRef.previewCtx.clearRect(0, 0, this.canvasRef.previewCanvas.width, this.canvasRef.previewCanvas.height);
    }

    draw(e) {
        const x = e.offsetX;
        const y = e.offsetY;

        this.canvasRef.previewCtx.beginPath();
        this.canvasRef.previewCtx.rect(this.pathX, this.pathY, x - this.pathX, y - this.pathY);
        this.canvasRef.previewCtx.fill();
        this.canvasRef.previewCtx.stroke();
    }
}

export class TextTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "text-tool",
            name: "文字工具",
            iconClass: "fa-solid fa-i-cursor",
            key: "t",
        });
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

export class ZoomTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "zoom-tool",
            name: "縮放顯示工具",
            iconClass: "fa-solid fa-magnifying-glass",
            key: "z",
        });
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}