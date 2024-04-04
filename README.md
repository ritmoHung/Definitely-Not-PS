# Software Studio 2023 Spring - AS1 Web Canvas
This project mimics the UI and some of the tools of Photoshop.

## Web Page Link
[GitHub Pages](https://ritmohung.github.io/SS-AS1/)



## Scoring
| **Basic Components**                        | **Score** | **Check**          |
| :------------------------------------------ | :-------: | :---------------:  |
| Basic Control Tools                         | 30%       | :white_check_mark: |
| Text input                                  | 10%       | :white_check_mark: |
| Cursor icon                                 | 10%       | :white_check_mark: |
| Refresh button                              | 5%        | :white_check_mark: |

> [!NOTE]
> Cursor icons set through `url()` don't work on macOS devices (even if hovering on the URL shows the exact image wanted), thus fallback to `auto` written in the CSS rule. Removing the `auto` keyword gives "invalid attribute value".
> Did not find a solution.

| **Advanced Tools**                          | **Score** | **Check**          |
| :------------------------------------------ | :-------: | :---------------:  |
| Different ~~Brush~~ Shapes                  | 15%       | :white_check_mark: |
| Undo / Redo Button                          | 10%       | :white_check_mark: |
| Image Tool                                  | 5%        | :white_check_mark: |
| Download                                    | 5%        | :white_check_mark: |

| **Other Useful Widgets**                    | **Score** | **Check**          |
| :------------------------------------------ | :-------: | :----------------: |
| Right Sidebar Toggler                       | ?%        | :white_check_mark: |
| HSL / HSB Color Picker                      | ?%        | :white_check_mark: |
| Hue Slider                                  | ?%        | :white_check_mark: |
| Active Color Property Toggler               | ?%        | :white_check_mark: |
| Key Control (tool change)                   | ?%        | :white_check_mark: |
| Key Control (operations)                    | ?%        | :white_check_mark: |
| Quadratic Curve (Draw Tool)                 | ?%        | :white_check_mark: |



## How to Use
### Basic Operations
You could either press the buttons in the topbar, or use shortcut keys listed after each item. Core functions can be found in the `Canvas` class, located in `assets/js/canvas.js`.

> [!TIP]
> `Ctrl` and `Cmd` are interchangeable.

Undo `Ctrl + Z`
> Revert operations done on the canvas, such as draw, erase, shape, text, import, and reset.

Redo `Ctrl + Shift + Z` `Ctrl + Y`
> Well, it does the exact opposite of undo.

Reset `Alt + Shift + C`
> Clears the entire canvas.

Import `Ctrl + O`
> Import an image in any format that the Canvas API supports. The canvas will be automatically resized to the image's resolution.

Export `Ctrl + S`
> Export the canvas in JPEG or PNG (w/ or w/o transparency).

| **Settings**             | **Options**                                                                                       |
| :----------------------: | :-----------------------------------------------------------------------------------------------: |
| Export Format            | `JPG` or `PNG`. Defaults to `JPG`.                                                                |
| Export with Transparency | This option is only enabled when the selected format supports alpha channel. Defaults to `false`. |

---

### Canvas Tools
You could either press the buttons in the left sidebar, or use shortcut keys listed after each item. Core functions can be found in corresponding canvas tool classes, located at `assets/js/canvasTool.js`.

:warning: Hand Tool, Eyedropper Tool, and Zoom Tool currently **has no actual functionality**.

Hand Tool `H`
> Click-drag to move the canvas area if its size is larger than the container.

Eyedropper Tool `I`
> Click anywhere to pick up a color and set it to the current active color (fill or stroke).

Brush Tool `B`
> Click-drag on the canvas to draw strokes. The brush size is automatically adjusted based on pressure value for pointer devices that supports pressure.

| **Settings** | **Options**                                               |
| :----------: | :-------------------------------------------------------: |
| Stroke Color | Any valid HSL color. This property is shared globally.    |
| Brush Size   | `1` to `200`, with a step of 1. Defaults to `5`.          |
| Brush Shape  | `Circle`, `Square`, `Triangle`. **Temporarily disabled.** |

Eraser Tool `E`
> Click-drag on the canvas to erase the canvas with a selectable shape and size

| **Settings** | **Options**                                               |
| :----------: | :-------------------------------------------------------: |
| Eraser Size  | `1` to `200`, with a step of 1. Defaults to `10`.         |
| Eraser Shape | `Circle`, `Square`, `Triangle`. **Temporarily disabled.** |

Fill Tool `F`
> Click on the canvas to fill it with the fill color

| **Settings** | **Options**                                            |
| :----------- | :----------------------------------------------------: |
| Fill Color   | Any valid HSL color. This property is shared globally. |

Shape Tool `U`
> Click-drag on the canvas to pull shapes, fills with fill color and strokes with stroke color if stroke size is larger than 0.
> 
> Its sizing is from the pointer-down coordinates to the current pointer-move coordinates on default. Pressing `Shift` will force the shape to be equilateral; pressing `Alt` will force it to set the pointer-down coordinates as the shape's center. Pressing both applies both effects.

| **Settings** | **Options**                                            |
| :----------- | :----------------------------------------------------: |
| Fill Color   | Any valid HSL color. This property is shared globally. |
| Stroke Color | Any valid HSL color. This property is shared globally. |
| Shape        | `Oval`, `Rectangle`, `Triangle`                        |
| Stroke Size  | `0` to `100`, with a step of 1. Defaults to `0`.       |

Text Tool `T`
> Click on the canvas, type or paste text, then press `Esc` or click outside of the input area to draw it onto the canvas.
>
> Supports multi-line texting.

> [!WARNING]
> It exists inaccuracy between the preview input area and the actually location where the text is drawn.

| **Settings** | **Options**                                            |
| :----------- | :----------------------------------------------------: |
| Font Family  | `Inter`, `Noto Sans TC`, `Arial`, `JetBrains Mono`     |
| Font Size    | `1` to `200`, with a step of 1. Defaults to `16`.      |
| Font Weight  | `300` to `700`, with a step of 100. Defaults to `400`. |
| Line Height  | `1` to `200`, with a step of 1. Defaults to `16`.      |

Zoom Tool `Z`
> Click-drag on the canvas zoom in or out the canvas.



## Bonus Function Description
### Right Sidebar Toggler
The right sidebar can be opened or closed by clicking on the toggler, adding a tiny bit :pinching_hand::milky_way: of support for mobile devices.

The widget is placed at the most right in the topbar. Core functions can be found in the "Right sidebar toggle button" section, located in `assets/js/script.js`.

### HSL / HSB Color Picker
The color picker can switch between HSL and HSB mode. Defaults to HSB, like Photoshop does.

Core functions can be found in `assets/js/appState.js` (`setColorPickerMode()`) and `assets/css/tailwind.css` (`.color-picker` CSS class).

### Hue Slider
Drag along the hue slider to toggle the hue of the active color property. Core functions can be found in the "COLORS" section, located in `assets/js/script.js`. You can also find out how the color picker is done there.

### Active Color Property Toggler
It mimics the color selecting mechanism of Photoshop, having a fill color and a stroke color. When operating the color picker, only the active color property is being toggled. Clicking on each color grid switches the active color property to the corrseponding color (TL: fill, BR: stroke). The button with an exchange icon below the color grids allows the user to swap the two colors immediately.

The widget is placed in the left sidebar. Core functions can be found in `assets/js/appState.js` (`swapColors()` and `setSelectedColorProperty()`).

### Key Control (tool change)
Switch to a canvas tool by key down. Keydown event listeners are attached in `initToolElements()` through `attachGlobalShortcuts()`, located in `assets/js/canvas.js`.
> [!NOTE]
> Text Tool's functionality is actually corrupted by this, therefore written into functions and detaches through `detachGlobalShortcuts()` when the input area is in focus.

### Key Control (operations)
Perform a basic operation by key down. Keydown event listeners are attached in the "Basic operations" section, located in `assets/js/script.js`.

### Quadratic Curve (Draw Tool)
Using `CanvasRenderingContext2D.quadraticCurveTo()` API to draw smoother curves. You can find it in `draw()` in the `DrawTool` class, located in `assets/js/canvasTool.js`.



## Others (Optional)
TBD



## Changelog
### EOL (2024-04-05)
This repo is no longer being maintained. Any new features will be introduced, if the author has time, in a new framework based project due to the complexity of developing using Vanilla JavaScript.

### 2.2.1 (2024-04-05)
:bug: **Bugfix**
- `loadHistory()` does not work properly when Eraser Tool is active. Temporarily set globalCompositeOperation to `source-over` when drawing history images on to the canvas.

### 2.2.0 (2024-04-04)
:rocket: **New**
- Text Tool - CLick on the canvas to enter text. Once it loses focus, the content will be drawn onto the canvas.

:bug: **Bugfix**
- Some brush strokes suddenly becomes very large when drawing with pointers that supports pressure. `e.pressure === 0` is accidentally added into the `supportsPressure()` function, and since it IS possible for a pointer to report a pressure of 0, it draws by `this.drawSize` for those moves, thus the behavior observed.

### 2.1.0 (2024-04-03)
:rocket: **New**
- Undo & redo - supports Brush Tool & Eraser Tool, Shape Tool, import, and reset
- Basic operation shortcut keys - do the same operation without having to click on the button
- Pointer support - User can now operate with touch or pen (e.g., drawing tablets, Apple Pencil). Tools in the following list are supported (click events are supported on default, therefore not listed):
    - Brush Tool & Eraser Tool
    - Shape Tool
    - Color picker & hue picker
- Pointer pressure support - Pointers that supports pressure automatically draws based on it

:sparkles: **Improved**
- Basic operation buttons show shortcut key on hover and in focus
- DrawTool reverts to using quadraticCurveTo() to draw curves due to the smoothness which the "stamping" method could not achieve. Though siad, the stamping method is still reserved for future support of different brush types.

### 2.0.0 (2024-03-30)
:rocket: **New**
- Eraser Tool
- Fill Tool - Fill the entire canvas with only one click
- Shape Tool - Create basic shapes by click-dragging, controllable by some extra keydown
- Import image - Import and direct paste images to canvas
- Export canvas options - User can now choose to export as PNG (w/ or w/o transparency) or JPG

:sparkles: **Improved**
- Tools are now written as classes extended from a base class. Switching event listeners of tools becomes easier to implement!
- A white `div` is shown behind the canvas instead for the background, leaving the canvas transparent. This solution has several advantages:
    - Restting the canvas needs only one line of `clearRect()`. No need to then `fillRect()` with white and mess with `fillStyle`.
    - Brush Tool and Eraser Tool can share the same DrawTool class, made possible by passing a different `compositeOperation`. Less code, less anger!
    - Able to export image with transparency.
- Automatically swap to Bezier interpolation when drawing too fast. This reduces the n-gon like shape for the curves drawn. (Powered by [Bezier.js](https://github.com/Pomax/bezierjs))

:bug: **Bugfix**
- Shapes stil have strokes even though `lineWidth` is set to 0
    - `CanvasRenderingContext2D.lineWidth` cannot be set to 0
    - Introduce a new flag `enableStroke`, set to true if the input range slider slides to 0
- Keydowns with control keys pressed also triggers tool change
    - Check for `e.altKey`, `e.ctrlKey`, `e.metaKey`, and `e.shiftKey` before searching match key

### 1.1.0 (2024-03-24)
:rocket: **New**
- HSL / HSB color picker & selected color display
- Separate color control (**target to UI change TBD**)
- Draw Tool - optimized curve; customizable shape and size (**triangle shape TBD**)
- Rest canvas - discard all changes made on the canvas
- Export canvas - export and download the canvas as a JPG image

:sparkles: **Improved**
- CanvasState and Canvas class objects now handle state changes to acheive a more moduled and managable flow. Below are the processes that have been moved into the classes:
    - Component appending based on predefined objects
    - UI initialization (options / values / colors / etc.)
    - State changes, including the resulting UI changes

### 1.0.0 (2024-03-23)
First implementation of UI. State/icon/value changes are done by separate event listeners.

:rocket: **New**
- Basic tool parameter customization
- Canvas tools, changable by key down
