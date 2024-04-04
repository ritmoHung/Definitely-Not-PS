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

        // Settings
        this.compositeOperation = toolConfig.compositeOperation ? toolConfig.compositeOperation : "";
        this.tolerance = 5;
        this.stampDensity = 20;
        this.bezierThreshold = 20;
        this.drawShape = toolConfig.drawShape ? toolConfig.drawShape : "circle";
        this.drawSize = toolConfig.drawSize ? toolConfig.drawSize : 5;

        // Utilities
        this.activePointerId = null;
        this.isDrawing = false;
        this.didDraw = false;
        this.points = [];

        // ? Let functions be referenceable when removing event listeners
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
    }

    activate() {
        if (this.compositeOperation) {
            this.canvasRef.mainCtx.globalCompositeOperation = this.compositeOperation;
        }
        this.canvasRef.mainCtx.lineCap = "round";
        this.canvasRef.mainCtx.lineJoin = "round";

        this.canvasRef.mainCanvas.addEventListener("pointerdown", this.handlePointerDown);
        this.canvasRef.mainCanvas.addEventListener("pointermove", this.handlePointerMove);
        this.canvasRef.mainCanvas.addEventListener("pointerup", this.handlePointerUp);
    }

    deactivate() {
        if (this.compositeOperation && this.compositeOperation !== "source-over") {
            this.canvasRef.mainCtx.globalCompositeOperation = "source-over";
        }

        this.canvasRef.mainCanvas.removeEventListener("pointerdown", this.handlePointerDown);
        this.canvasRef.mainCanvas.removeEventListener("pointermove", this.handlePointerMove);
        this.canvasRef.mainCanvas.removeEventListener("pointerup", this.handlePointerUp);
    }

    // # Event Listener
    handlePointerDown(e) {
        // Only continue if (1) Is left-click, and (2) No target (active) pointer
        e.preventDefault();
        if (e.button !== 0) return;
        if (e.button !== 0 && (this.isDrawing === true && this.activePointerId !== null)) return;

        this.activePointerId = e.pointerId;
        this.isDrawing = true;

        const pt = { x: e.offsetX, y: e.offsetY, pressure: e.pressure };
        this.points = [pt];
        this.canvasRef.mainCtx.lineWidth = this.supportsPressure(e) ? Math.log(e.pressure + 1) * this.drawSize / Math.log(2) : this.drawSize;
        this.canvasRef.mainCtx.beginPath();
        this.canvasRef.mainCtx.moveTo(pt.x, pt.y);
    }

    handlePointerMove(e) {
        // Only continue if (1) Is drawing, and (2) It's the target (active) pointer
        e.preventDefault();
        if (!this.isDrawing || e.pointerId !== this.activePointerId) return;

        this.didDraw = true;
        this.draw(e);
    }

    handlePointerUp(e) {
        // Only continue if it's the target (active) pointer
        if (e.pointerId !== this.activePointerId) return;

        this.canvasRef.mainCtx.lineWidth = 0;
        if (this.didDraw) {
            this.didDraw = false;
            this.canvasRef.pushHistory();  // Only push to history if did draw
        }
        this.isDrawing = false;
    }

    // # Functionality
    setDrawShape(shape) {
        this.drawShape = shape;
    }

    setDrawSize(size) {
        this.drawSize = size;
    }

    // draw(e) {
    //     const pt = { x: e.offsetX * 2, y: e.offsetY * 2, pressure: e.pressure };
    //     const prevPt = this.points[this.points.length - 1];
    //     const dx = pt.x - prevPt.x;
    //     const dy = pt.y - prevPt.y;
    //     const distance = Math.sqrt(dx * dx + dy * dy);

    //     // Choose the drawing method based on the linear distance of the 2 latest moves
    //     // Use bezier curves if the distance is too far away to avoid n-gon like shapes
    //     if (this.shouldDraw(dx, dy)) {
    //         this.points.push(pt);
    //         if (this.points.length > 3) this.points.shift();
            
    //         if (distance >= this.bezierThreshold) {
    //             this.drawBezier(e);
    //         } else {
    //             this.drawLinear(e, distance);
    //         }
    //     }
    // }

    draw(e) {
        const pt = { x: e.offsetX, y: e.offsetY, pressure: e.pressure };
        this.points.push(pt);

        this.canvasRef.mainCtx.lineWidth = this.supportsPressure(e)
            ? (0.2 * Math.log(e.pressure + 1) * this.drawSize / Math.log(2)) + (0.8 * this.canvasRef.mainCtx.lineWidth)
            : this.drawSize; 
        const l = this.points.length - 1;
        if (this.points.length >= 3) {
            const xc = (this.points[l - 1].x + this.points[l].x) / 2;
            const yc = (this.points[l - 1].y + this.points[l].y) / 2;
            this.canvasRef.mainCtx.quadraticCurveTo(this.points[l - 1].x, this.points[l - 1].y, xc, yc);
            this.canvasRef.mainCtx.stroke();
            this.canvasRef.mainCtx.beginPath();
            this.canvasRef.mainCtx.moveTo(xc, yc);
        } else {
            const pt = this.points[l];
            this.canvasRef.mainCtx.beginPath();
            this.canvasRef.mainCtx.moveTo(pt.x, pt.y);
            this.canvasRef.mainCtx.stroke();
        }
    }
    
    // Method 1: "Stamp" shapes along the path instead of drawing quadraticCurveTo() curves
    drawLinear(e, distance) {
        const stamps = Math.max(1, distance * this.stampDensity);

        const a = this.points[this.points.length - 2];
        const b = this.points[this.points.length - 1];
        for (let i = 1; i <= stamps; i++) {
            const ratio = i / stamps;
            const pt = {
                x: a.x * (1 - ratio) + b.x * ratio,
                y: a.y * (1 - ratio) + b.y * ratio,
                pressure: this.supportsPressure(e)
                    ? a.pressure * (1 - ratio) + b.pressure * ratio
                    : 1,
            };

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
    drawBezier(e) {
        if (this.points.length < 3) return;

        const curve = Bezier.quadraticFromPoints(this.points[0], this.points[1], this.points[2], 0.5);
        const stamps = Math.max(1, curve.length() * this.stampDensity);
        
        const a = this.points[this.points.length - 2];
        const b = this.points[this.points.length - 1];
        for (let i = 1; i <= stamps; i++) {
            const ratio = i / stamps;
            if (ratio < 0.495) continue;
            let pt = curve.get(ratio);
            pt.pressure = this.supportsPressure(e)
                    ? a.pressure * (1 - ratio) + b.pressure * ratio
                    : 1,
            
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
        this.canvasRef.mainCtx.arc(pt.x, pt.y, pt.pressure * this.drawSize / 2, 0, Math.PI * 2);
    }

    stampSquare(pt) {
        const adjustedSize = pt.pressure * this.drawSize;
        this.canvasRef.mainCtx.rect(pt.x - adjustedSize / 2, pt.y - adjustedSize / 2, adjustedSize, adjustedSize);
    }

    stampTriangle(pt) {
        const r = pt.pressure * this.drawSize / 2;
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

    // An extremely simplfied solution to detect if a device supports pointer pressure
    supportsPressure(e) {
        // ! Do not detect `e.pressure !== 0` because devices are able to report a 0 pressure
        const supports = e.pointerType === "pen";
        return supports;
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
        this.canvasRef.pushHistory();
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

        // Settings
        this.drawShape = "rectangle";
        this.enableStroke = false;

        // Utilities
        this.activePointerId = null;
        this.isDrawing = false;
        this.didDraw = false;
        this.prevX = 0;
        this.prevY = 0;
        this.x = 0;
        this.y = 0;

        // ? Let functions be referenceable when removing event listeners
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    activate() {
        this.canvasRef.mainCanvas.addEventListener("pointerdown", this.handlePointerDown);
        this.canvasRef.mainCanvas.addEventListener("pointermove", this.handlePointerMove);
        this.canvasRef.mainCanvas.addEventListener("pointerup", this.handlePointerUp);
    }

    deactivate() {
        this.canvasRef.reset(this.canvasRef.previewCtx);

        this.canvasRef.mainCanvas.removeEventListener("pointerdown", this.handlePointerDown);
        this.canvasRef.mainCanvas.removeEventListener("pointermove", this.handlePointerMove);
        this.canvasRef.mainCanvas.removeEventListener("pointerup", this.handlePointerUp);
    }

    // # Event Listener
    handlePointerDown(e) {
        // Only continue if (1) Is left-click, and (2) No target (active) pointer
        e.preventDefault();
        if (e.button !== 0) return;
        if (this.isDrawing === true && this.activePointerId !== null) return;
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);

        this.activePointerId = e.pointerId;
        this.isDrawing = true;

        this.prevX = this.x = e.offsetX;
        this.prevY = this.y = e.offsetY;
        this.canvasRef.previewCtx.beginPath();
    }

    handlePointerMove(e) {
        // Only continue if (1) Is drawing, or (2) It's the target (active) pointer
        e.preventDefault();
        if (!this.isDrawing || e.pointerId !== this.activePointerId) return;

        this.didDraw = true;
        this.draw(e);
    }

    handlePointerUp(e) {
        // Only continue if it's the target (active) pointer 
        if (e.pointerId !== this.activePointerId) return;
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);

        this.isDrawing = false;
        if (this.didDraw) {
            this.didDraw = false;
            this.canvasRef.mainCtx.drawImage(this.canvasRef.previewCanvas, 0, 0);
            this.canvasRef.pushHistory();  // Only push to history if did draw
        }
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

        // Settings
        this.fontWeight = 400;
        this.fontSize = 16;
        this.fontFamily = "Arial";
        this.lineHeight = 16;

        // Utilities
        this.isTexting = false;

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
    handleClick(e) {
        if (this.isTexting) return;
        this.isTexting = true;

        this.canvasRef.detachGlobalShortcuts();
        this.createContentEditable(e.offsetX, e.offsetY);
    }

    // # Functionality
    setFont({ fontWeight = this.fontWeight, fontSize = this.fontSize, fontFamily = this.fontFamily }) {
        this.fontWeight = fontWeight;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.canvasRef.mainCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    }

    setLineHeight(lineHeight) {
        this.lineHeight = lineHeight;
    }

    createContentEditable(x, y) {
        // Remove existing input if any
        const existingInput = document.getElementById("text-input");
        if (existingInput) existingInput.remove();

        const div = document.createElement("div");
        div.id = "text-input";
        div.contentEditable = "plaintext-only";
        div.style.position = "absolute";
        div.style.left = `${this.canvasRef.mainCanvas.offsetLeft + x}px`;
        div.style.top = `${this.canvasRef.mainCanvas.offsetTop + y - (0.3 * this.fontSize + 10) - 0.5 * (this.lineHeight)}px`;
        div.style.color = this.canvasRef.mainCtx.fillStyle;
        div.style.font = this.canvasRef.mainCtx.font;
        div.style.lineHeight = `${this.lineHeight}px`;
        document.body.appendChild(div);

        div.focus();
        
        div.oninput = (e) => {
            let text = "";
            e.target.childNodes.forEach((node, i) => {
                text += (node.innerText || node.nodeValue || "").replace(/\n/g, "");
                if (i !== e.target.childNodes.length - 1) text += "\n";
            });

            if (text === "") div.innerHTML = "";
        }

        div.onkeydown = (e) => {
            if (e.key === "Escape" && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                div.blur();
            }
        }

        div.onblur = () => {
            let htmlContent = div.innerHTML;
            let textContent = htmlContent
                .replace(/<div>|<p>/gi, '\n')
                .replace(/<\/div>|<\/p>|<br>/gi, '')
                .replace(/&nbsp;/gi, ' ')
                .trim();

            if (textContent) {
                this.drawText(textContent, x, y, this.lineHeight);
                this.canvasRef.pushHistory();
            }
            div.remove();
            this.isTexting = false;
            this.canvasRef.attachGlobalShortcuts();
        };
    }

    drawText(text, x, y, lineHeight) {
        const lines = text.split('\n');
    
        for (let i = 0; i < lines.length; i++) {
            this.canvasRef.mainCtx.fillText(lines[i], x, y + (i * lineHeight));
        }
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