import Canvas from "./canvas.js"


const colorPickerModes = [
    {
        name: "HSB",
        isSelected: true,
    },
    {
        name: "HSL",
        isSelected: false,
    }
];



export default class AppState {
    constructor() {
        // # Elements
        // The color picker
        this.ColorPicker = document.getElementById("color-picker");
        this.ColorPickerArea = document.getElementById("color-picker-area");
        // The <div>s that should display the main color
        this.FillColorDivs = document.getElementsByClassName("fill-color");
        // The <div>s that should display the stroke color
        this.StrokeColorDivs = document.getElementsByClassName("stroke-color");
        // The <fieldset> that should contain all picker modes
        this.PickerModeFieldset = document.getElementById("picker-mode-fieldset");
        // Main canvas
        this.MainCanvas = new Canvas("main-canvas", this);

        // # Settings
        this.colorPickerMode = "HSB";
        this.selectedColorProperty = "strokeColor";
        this.fillColor = new ColorHSL(0, 0, 100);
        this.strokeColor = new ColorHSL(0, 0, 0);
        this.setColor("fillColor", { h: 0, s: 0, l: 100 });
        this.setColor("strokeColor", { h: 0, s: 0, l: 0 });

        this.insertColorPickerModeElements();
    }

    // # Component injection
    insertColorPickerModeElements() {
        colorPickerModes.forEach(mode => {
            const div = document.createElement("div");

            const label = document.createElement("label");
            label.htmlFor = `mode-${mode.name}`;

            const input = document.createElement("input");
            input.id = `mode-${mode.name}`;
            input.type = "radio";
            input.name = "color-picker-mode";
            input.value = mode.name;
            input.checked = mode.isSelected;

            const span = document.createElement("span");
            span.textContent = mode.name;

            label.appendChild(input);
            label.appendChild(span);
            div.appendChild(label);
            this.PickerModeFieldset.appendChild(div);
        });

        this.PickerModeFieldset.addEventListener("change", (e) => this.setColorPickerMode(e.target.value));
    }

    // # UI updates
    updateColorUI(colorProperty) {
        // Update color picker area's background color
        this.ColorPickerArea.style.backgroundColor = `hsl(${this[colorProperty].h}, 100%, 50%)`;

        // Update color displays
        let divs = colorProperty === "fillColor" ? this.FillColorDivs : this.StrokeColorDivs;
        Array.from(divs).forEach(div => {
            div.style.backgroundColor = this[colorProperty].toString();
        });
    }

    // # SET functions
    setColorPickerMode(mode) {
        this.colorPickerMode = mode;
        this.ColorPicker.setAttribute("data-mode", mode);
        console.log(`Color picker mode set to ${mode}`);
    }

    setColor(colorProperty, { h, s, l }) {
        // Update color by name
        this[colorProperty].update({ h, s, l });
        switch (colorProperty) {
            case "fillColor":
                this.MainCanvas.setFillColor(this[colorProperty].toString())
                break;
            case "strokeColor":
                this.MainCanvas.setStrokeColor(this[colorProperty].toString())
                break;
        }
        
        // Update UI
        this.updateColorUI(colorProperty);
        // console.log(`${colorProperty} set to ${this[colorProperty].toString()}`); // ? Too noisy
    }

    setColorByPercentages(colorProperty, satPercent, valPercent) {
        let s, l;

        switch (this.colorPickerMode) {
            case "HSB":
                l = valPercent * (1 - satPercent / 2);
                if (l === 0 || l === 1) {
                    s = 0;
                } else {
                    s = (valPercent - l) / Math.min(l, 1 - l);
                }
                s *= 100;
                l *= 100;
                break;
            case "HSL":
                s = satPercent * 100;
                l = valPercent * 100;
                break;
            default:
        }

        this.setColor(colorProperty, { s, l });
    }

    swapColors() {
        const tempColor = new ColorHSL();
        tempColor.update(this.fillColor.get());
        this.setColor("fillColor", this.strokeColor.get());
        this.setColor("strokeColor", tempColor.get());
    }

    setSelectedColorProperty(colorProperty) {
        if (colorProperty === "fillColor" || colorProperty === "strokeColor") {
            this.selectedColorProperty = colorProperty;
            console.log(`Selected color property set to ${colorProperty}`)
        } else {
            console.error("Invalid color property");
        }
    }

    // 
}

class ColorHSL {
    constructor(h = 0, s = 0, l = 0) {
        this.h = h;
        this.s = s;
        this.l = l;
    }

    get() {
        return { h: this.h, s: this.s, l: this.l };
    }

    update({ h = this.h, s = this.s, l = this.l } = {}) {
        this.h = parseFloat(h.toFixed(3));
        this.s = parseFloat(s.toFixed(3));
        this.l = parseFloat(l.toFixed(3));
    }

    toString() {
        return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    }
}