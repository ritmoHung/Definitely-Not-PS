class CanvasTool {
    constructor(canvas, ctx, { id, name, iconClass, key }) {
        this.canvas = canvas;
        this.ctx = ctx;

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
    constructor(canvas, ctx) {
        super(canvas, ctx, {
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
    constructor(canvas, ctx) {
        super(canvas, ctx, {
            id: "eyedropper-tool",
            name: "滴管工具",
            iconClass: "fa-solid fa-eye-dropper",
            key: "i",
        })
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

export class BrushTool extends CanvasTool {
    constructor(canvas, ctx) {
        super(canvas, ctx, {
            id: "brush-tool",
            name: "筆刷工具",
            iconClass: "fa-solid fa-paintbrush",
            key: "b",
        })

        this.TOLERANCE = 5;
        this.isPainting = false;
        this.pathX = 0;
        this.pathY = 0;
    }

    activate() {
        this.canvas.addEventListener("touchstart", (e) => {
            this.isPainting = true;
            this.pathX = e.offsetX;
            this.pathY = e.offsetY;
            this.ctx.beginPath();
            this.ctx.moveTo(this.pathX, this.pathY);
        });
        this.canvas.addEventListener("mousedown", (e) => {
            this.isPainting = true;
            this.pathX = e.offsetX;
            this.pathY = e.offsetY;
            this.ctx.beginPath();
            this.ctx.moveTo(this.pathX, this.pathY);
        });

        this.canvas.addEventListener("touchmove", (e) => this.draw(e));
        this.canvas.addEventListener("mousemove", (e) => this.draw(e));

        this.canvas.addEventListener("touchend", () => {
            this.isPainting = false;
            this.ctx.beginPath();
        });
        this.canvas.addEventListener("mouseup", () => {
            this.isPainting = false;
            this.ctx.beginPath();
        });
    }

    deactivate() {
        // TODO
    }

    // # Functionality
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
}

export class EraserTool extends CanvasTool {
    constructor(canvas, ctx) {
        super(canvas, ctx, {
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
    constructor(canvas, ctx) {
        super(canvas, ctx, {
            id: "fill-tool",
            name: "填滿工具",
            iconClass: "fa-solid fa-fill-drip",
            key: "f",
        })
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

export class ShapeTool extends CanvasTool {
    constructor(canvas, ctx) {
        super(canvas, ctx, {
            id: "shape-tool",
            name: "形狀工具",
            iconClass: "fa-solid fa-draw-polygon",
            key: "u",
        })
    }

    activate() {
        // TODO
    }

    deactivate() {
        // TODO
    }
}

export class TextTool extends CanvasTool {
    constructor(canvas, ctx) {
        super(canvas, ctx, {
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
    constructor(canvas, ctx) {
        super(canvas, ctx, {
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