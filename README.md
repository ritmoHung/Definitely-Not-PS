# Software Studio 2023 Spring - AS1 Web Canvas
This project mimics the UI and some of the tools of Photoshop.

## Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | P         |
| Text input                                       | 10%       | N         |
| Cursor icon                                      | 10%       | P         |
| Refresh button                                   | 5%        | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | P         |
| Un/Re-do button                                  | 10%       | N         |
| Image tool                                       | 5%        | N         |
| Download                                         | 5%        | Y         |

| **Other useful widgets**                         | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| HSL / HSB color picker                           | ?%        | Y         |
| Hue slider                                       | ?%        | Y         |
| Key Control (tool change)                        | ?%        | Y         |
| Key Control (operations)                         | ?%        | N         |

## Changelog
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

