# Software Studio 2023 Spring - AS1 Web Canvas
This project mimics the UI and some of the tools of Photoshop.

## Scoring

| **Basic components**                             | **Score** | **Check**         |
| :----------------------------------------------- | :-------: | :---------------: |
| Basic control tools                              | 30%       | :white_check_mark:|
| Text input                                       | 10%       | :x:               |
| Cursor icon                                      | 10%       | :white_check_mark:|
| Refresh button                                   | 5%        | :white_check_mark:|

| **Advanced tools**                               | **Score** | **Check**         |
| :----------------------------------------------- | :-------: | :---------------: |
| Different brush shapes                           | 15%       | :white_check_mark:|
| Un/Re-do button                                  | 10%       | :x:               |
| Image tool                                       | 5%        | :white_check_mark:|
| Download                                         | 5%        | :white_check_mark:|

| **Other useful widgets**                         | **Score** | **Check**         |
| :----------------------------------------------- | :-------: | :----------------:|
| HSL / HSB color picker                           | ?%        | :white_check_mark:|
| Hue slider                                       | ?%        | :white_check_mark:|
| Key Control (tool change)                        | ?%        | :white_check_mark:|
| Key Control (operations)                         | ?%        | :x:               |
| Bezier Interpolation (Draw Tool)                 | ?%        | :white_check_mark:|

## Changelog
### 1.2.0 (2024-03-30)
:rocket: **New**
- Eraser Tool
- Fill Tool - Fill the entire canvas with only one click
- Shape Tool - Create basic shapes by click-dragging, controllable by some extra keydown
- Import image - import and direct paste images to canvas
- Export canvas options - user can now choose to export as PNG (w/ or w/o transparency) or JPG

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

---

## How to Use

    [H] Hand Tool - Click-drag to move the canvas area if its size is larger than the container.
    [I] Eyedropper Tool - Click anywhere to pick up a color
    [B] Brush Tool - Draw on the canvas with a selectable shape and size
    [E] Eraser Tool - Erase the canvas with a selectable shape and size
    [F] Fill Tool - Fill the canvas with a color with one click
    [U] Shape Tool - Draw selectable, click-drag-sizable shapes
    [T] Text Tool - Click, then type and paste texts onto the canvas
    ~~[Z] Zoom Tool - Zoom in or out the canvas~~

## Bonus Function Description

    TBD

## Web Page Link
[GitHub Pages](https://ritmohung.github.io/SS-AS1/)

## Others (Optional)

    TBD

