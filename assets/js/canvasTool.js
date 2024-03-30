import { Bezier } from "https://cdn.jsdelivr.net/npm/bezier-js@6.1.4/+esm";



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
        this.stampDensity = 10;
        this.bezierThreshold = 20;
        this.drawShape = toolConfig.drawShape ? toolConfig.drawShape : "circle";
        this.drawSize = toolConfig.drawSize ? toolConfig.drawSize : 5;
        this.points = [];
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

    // # Event Listener
    handleMouseDown(e) {
        this.isDrawing = true;
        this.prevX = e.offsetX;
        this.prevY = e.offsetY;
        this.points = [{ x: e.offsetX, y: e.offsetY }];
        this.canvasRef.mainCtx.beginPath();
        this.canvasRef.mainCtx.moveTo(this.prevX, this.prevY);
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;
        this.draw(e);
    }

    handleMouseUp() {
        this.isDrawing = false;
        this.canvasRef.mainCtx.beginPath();
    }

    // # Functionality
    setDrawShape(shape) {
        this.drawShape = shape;
    }

    setDrawSize(size) {
        this.drawSize = size;
    }

    draw(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        const dx = x - this.prevX;
        const dy = y - this.prevY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const point = { x, y };
        this.points.push(point);
        if (this.points.length > 3) this.points.shift();

        // Choose the drawing method based on the linear distance of the 2 latest moves
        // Use bezier curves if the distance is too far away to avoid n-gon like shapes
        if (this.shouldDraw(dx, dy)) {
            if (distance >= this.bezierThreshold) {
                this.drawBezier();
            } else {
                this.drawLinear(dx, dy);
            }

            // Push current point to previous point
            this.prevX = x;
            this.prevY = y;
        }
    }
    
    // Method 1: "Stamp" shapes along the path instead of drawing quadraticCurveTo() curves
    drawLinear(dx, dy) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const stamps = Math.max(1, distance * this.stampDensity);

        for (let i = 1; i <= stamps; i++) {
            let pt = { x: this.prevX + (dx * i) / stamps, y: this.prevY + (dy * i) / stamps };

            this.canvasRef.mainCtx.beginPath();
            switch (this.drawShape) {
                case "circle":
                    this.stampCircle(pt);
                    break;
                case "square":
                    this.stampSquare(pt);
                    break;
                case "triangle":
                    this.stampTriangle(pt);
                    break;
                case "image":
                    break;
                default:
                    break;
            }
            this.canvasRef.mainCtx.fill();
        }
    }

    // Method 2: Stamp shapes along a bezier curve calculated by the latest 3 moves
    drawBezier() {
        if (this.points.length < 3) return;

        const curve = Bezier.quadraticFromPoints(this.points[0], this.points[1], this.points[2], 0.5);
        const stamps = Math.max(1, curve.length() * this.stampDensity);
        
        for (let i = 1; i <= stamps; i++) {
            const t = i / stamps;
            if (t < 0.495) continue;
            const pt = curve.get(t);
            
            this.canvasRef.mainCtx.beginPath();
            switch (this.drawShape) {
                case "circle":
                    this.stampCircle(pt);
                    break;
                case "square":
                    this.stampSquare(pt);
                    break;
                case "triangle":
                    this.stampTriangle(pt);
                    break;
                case "image":
                    break;
                default:
                    break;
            }
            this.canvasRef.mainCtx.fill();
        }
    }

    shouldDraw(dx, dy) {
        return Math.abs(dx) >= this.tolerance || Math.abs(dy) >= this.tolerance;
    }

    stampCircle(pt) {
        this.canvasRef.mainCtx.arc(pt.x, pt.y, this.drawSize / 2, 0, Math.PI * 2);
        
    }

    stampSquare(pt) {
        this.canvasRef.mainCtx.rect(pt.x - this.drawSize / 2, pt.y - this.drawSize / 2, this.drawSize, this.drawSize);
    }

    stampTriangle(pt) {
        const r = this.drawSize / 2;
        const s = Math.sqrt(3) * r;
        const h = Math.sqrt(3) / 2 * s;

        const A = { x: pt.x - s / 2, y: pt.y + h / 3 };
        const B = { x: pt.x + s / 2, y: pt.y + h / 3 };
        const C = { x: pt.x, y: pt.y - 2 * h / 3 };

        this.canvasRef.mainCtx.moveTo(A.x, A.y);
        this.canvasRef.mainCtx.lineTo(B.x, B.y);
        this.canvasRef.mainCtx.lineTo(C.x, C.y);
        this.canvasRef.mainCtx.closePath();
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
        this.canvasRef.mainCanvas.addEventListener("click", this.handleClick);
    }

    deactivate() {
        this.canvasRef.mainCanvas.removeEventListener("click", this.handleClick);
    }

    // # Event Listener
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

        this.drawShape = "rectangle";
        this.enableStroke = false;
        this.isDrawing = false;
        this.prevX = 0;
        this.prevY = 0;
        this.x = 0;
        this.y = 0;

        // ? Let functions be referenceable when removing event listeners
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    activate() {
        this.canvasRef.mainCanvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvasRef.mainCanvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvasRef.mainCanvas.addEventListener("mouseup", this.handleMouseUp);
    }

    deactivate() {
        this.canvasRef.reset(this.canvasRef.previewCtx);

        this.canvasRef.mainCanvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvasRef.mainCanvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvasRef.mainCanvas.removeEventListener("mouseup", this.handleMouseUp);
    }

    // # Event Listener
    handleMouseDown(e) {
        e.preventDefault();
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        this.isDrawing = true;
        this.prevX = this.x = e.offsetX;
        this.prevY = this.y = e.offsetY;
        this.canvasRef.previewCtx.beginPath();
    }

    handleMouseMove(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        this.draw(e);
    }

    handleMouseUp() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);

        this.isDrawing = false;
        this.canvasRef.mainCtx.drawImage(this.canvasRef.previewCanvas, 0, 0);
        this.canvasRef.reset(this.canvasRef.previewCtx);
        this.canvasRef.previewCtx.beginPath();
    }

    handleKeyDown(e) {
        e.preventDefault();
        if (!this.isDrawing || !(this.isAltPressed(e, true) || this.isShiftPressed(e, true))) return;
        this.draw(e);
    }

    handleKeyUp(e) {
        e.preventDefault();
        if (!this.isDrawing || !(this.isAltReleased(e) || this.isShiftReleased(e))) return;
        this.draw(e);
    }

    // # Functionality
    setShape(shape) {
        this.drawShape = shape;
    }

    setEnableStroke(enableStroke) {
        this.enableStroke = enableStroke;
    }

    draw(e) {
        this.x = e.offsetX ? e.offsetX : this.x;
        this.y = e.offsetY ? e.offsetY : this.y;
        
        let ctx = this.canvasRef.previewCtx;
        this.canvasRef.reset(ctx);

        switch (this.drawShape) {
            case "circle":
                this.drawCircle(
                    ctx, this.prevX, this.prevY, this.x, this.y,
                    this.isShiftPressed(e), this.isAltPressed(e), this.enableStroke
                );
                break;
            case "rectangle":
                this.drawRect(
                    ctx, this.prevX, this.prevY, this.x, this.y,
                    this.isShiftPressed(e), this.isAltPressed(e), this.enableStroke
                );
                break;
            case "triangle":
                this.drawTriangle(
                    ctx, this.prevX, this.prevY, this.x, this.y,
                    this.isShiftPressed(e), this.isAltPressed(e), this.enableStroke
                );
                break;
            default:
                break;
        }
    }

    drawCircle(ctx, x1, y1, x2, y2, equilateral = false, centered = false, enableStroke = false) {
        ctx.beginPath();
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lx = Math.abs(dx);
        const ly = Math.abs(dy);
        const size = Math.min(lx, ly);
        let centerX, centerY, radius, scaleX;

        // Center
        if (centered) {
            centerX = x1;
            centerY = y1;
        } else if (equilateral) {
            centerX = dx < 0 ? x1 - size / 2 : x1 + size / 2;
            centerY = dy < 0 ? y1 - size / 2 : y1 + size / 2;
        } else {
            centerX = x1 + dx / 2;
            centerY = y1 + dy / 2;
        }

        // Radius & scale
        if (equilateral && centered) {
            radius = size;
            scaleX = 1;
        } else if (equilateral) {
            radius = size / 2;
            scaleX = 1;
        } else if (centered) {
            radius = ly;
            scaleX = lx / ly;
        } else {
            radius = ly / 2;
            scaleX = lx / ly;
        }

        ctx.save();                             // 1. Save canvas state
        ctx.translate(centerX, centerY);        // 2. Translate origin to center of circle
        ctx.scale(scaleX, 1);                   // 3. Scale the canvas to form a fake oval
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);  // 4. Draw the circle
        ctx.restore();                          // 5. Rest canvas state (translate & scale)

        ctx.closePath();
        ctx.fill();
        if (enableStroke) ctx.stroke();
    }
    
    drawRect(ctx, x1, y1, x2, y2, equilateral = false, centered = false, enableStroke = false) {
        ctx.beginPath();
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lx = Math.abs(dx);
        const ly = Math.abs(dy);
        let startX, startY, width, height;
        if (equilateral) {
            // Equilateral: The rectangle becomes a square. Use the larger of dx or dy for size
            let size = Math.min(lx, ly);
            if (centered) {
                // Centered: Adjust start positions to keep the square centered at the initial click
                size *= 2;
                startX = x1 - size / 2;
                startY = y1 - size / 2;
                width = height = size;
            } else {
                // Not centered: The square starts at (x1, y1)
                // Adjust startX/Y to draw upwards/leftwards if dx/dy is negative
                startX = dx < 0 ? x1 - size : x1;
                startY = dy < 0 ? y1 - size : y1;
                width = height = size;
            }
        } else {
            // Non-equilateral
            if (centered) {
                // Centered but not equilateral: Adjust start positions to keep the rect centered
                startX = x1 - lx;
                startY = y1 - ly;
                width = 2 * lx;
                height = 2 * ly;
            } else {
                // Standard rectangle drawing from (x1, y1) to (x2, y2)
                // Adjust startX/Y to draw upwards/leftwards if dx/dy is negative
                startX = dx < 0 ? x2 : x1;
                startY = dy < 0 ? y2 : y1;
                width = lx;
                height = ly;
            }
        }
    
        ctx.rect(startX, startY, width, height);
        ctx.closePath();
        ctx.fill();
        if (enableStroke) ctx.stroke();
    }

    drawTriangle(ctx, x1, y1, x2, y2, equilateral = false, centered = false, enableStroke = false) {
        ctx.beginPath();
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lx = Math.abs(dx);
        const ly = Math.abs(dy);
        
        const size = equilateral ? Math.max(lx, ly) : Math.sqrt(dx * dx + dy * dy);

        let A, B, C;
        if (equilateral && centered) {
            // Draw an equilateral triangle with centroid at (x1, y1)
            const height = size * Math.sqrt(3) / 2;
            A = { x: x1 - size / 2, y: y1 + height / 3 };
            B = { x: x1 + size / 2, y: y1 + height / 3 };
            C = { x: x1, y: y1 - 2 * height / 3 };
        } else if (equilateral) {
            // Draw an equilateral triangle but not centered
            const height = size * Math.sqrt(3) / 2;
            A = { x: x1, y: y2 };
            B = { x: x2, y: y2 };
            C = { x: (x1 + x2) / 2, y: y2 - height };
        } else if (centered) {
            // Draw a triangle centered at (x1, y1)
            A = { x: x1 - lx / 2, y: y1 + ly / 2 };
            B = { x: x1 + lx / 2, y: y1 + ly / 2 };
            C = { x: x1, y: y1 - ly / 2 };
        } else {
            // Default case: not equilateral or centered
            A = { x: x1, y: y2 };
            B = { x: x2, y: y2 };
            C = { x: (x1 + x2) / 2, y: y1 };
        }
    
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.closePath();

        ctx.fill();
        if (enableStroke) ctx.stroke();
    }
    
    isAltPressed(e, checkKey = false) {
        if (checkKey) {
            return e.altKey && (e.key ? e.key === "Alt" : true); 
        } else {
            return e.altKey;
        }
    }

    isShiftPressed(e, checkKey = false) {
        if (checkKey) {
            return e.shiftKey && (e.key ? e.key === "Shift" : true); 
        } else {
            return e.shiftKey;
        }
    }

    isAltReleased(e) {
        return !e.altKey && (e.key ? e.key === "Alt" : true);
    }

    isShiftReleased(e) {
        return !e.shiftKey && (e.key ? e.key === "Shift" : true);
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