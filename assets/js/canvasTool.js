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
        })
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
        })
        this.appStateRef = appStateRef;
    }

    activate() {
        this.canvasRef.canvasArea.style.cursor = 'url("./assets/cursors/fa-solid-eye-dropper.svg")';
    }

    deactivate() {
        // TODO
    }
}

export class BrushTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "brush-tool",
            name: "筆刷工具",
            iconClass: "fa-solid fa-paintbrush",
            key: "b",
        })

        this.TOLERANCE = 5;
        this.isPainting = false;
        this.pathX = 0;
        this.pathY = 0;

        // ? Let functions be referenceable when removing event listeners
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    activate() {
        this.canvasRef.canvasArea.style.cursor = 'url("./assets/cursors/fa-solid-paintbrush.svg")';

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
        this.canvasRef.mainCtx.beginPath();
        this.canvasRef.mainCtx.moveTo(this.pathX, this.pathY);
    }

    handleMouseMove(e) {
        this.draw(e);
    }

    handleMouseUp(e) {
        this.isPainting = false;
        this.canvasRef.mainCtx.beginPath();
    }

    draw(e) {
        if (!this.isPainting) return;

        const x = e.offsetX;
        const y = e.offsetY;
        const dx = Math.abs(x - this.pathX);
        const dy = Math.abs(y - this.pathY);

        if (dx >= this.TOLERANCE || dy >= this.TOLERANCE) {
            this.canvasRef.mainCtx.quadraticCurveTo(this.pathX, this.pathY, (x + this.pathX) / 2, (y + this.pathY) / 2);
            this.pathX = x;
            this.pathY = y;
            this.canvasRef.mainCtx.stroke();
        }
    }
}

export class EraserTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "eraser-tool",
            name: "橡皮擦工具",
            iconClass: "fa-solid fa-eraser",
            key: "e",
        })
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

export class FillTool extends CanvasTool {
    constructor(canvasRef) {
        super(canvasRef, {
            id: "fill-tool",
            name: "填滿工具",
            iconClass: "fa-solid fa-fill-drip",
            key: "f",
        })

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
        })

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
        })
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
        })
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}