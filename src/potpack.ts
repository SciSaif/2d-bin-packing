export function potpack2(
    boxes: { w: number; h: number; x: number; y: number; isRotated: boolean }[],
    containerWidth: number,
    containerHeight: number,
    padding: number = 0
) {
    // sort the boxes for insertion by height, descending
    boxes.sort((a, b) => b.h - a.h);

    // start with a single empty space that matches the container size
    const spaces = [{ x: 0, y: 0, w: containerWidth, h: containerHeight }];

    for (const box of boxes) {
        let min = containerHeight + 1;
        let bestSpaceIndex = 0;

        // Find best space for the box
        for (let i = 0; i < spaces.length; i++) {
            if (
                spaces[i].w >= box.w &&
                spaces[i].h >= box.h &&
                spaces[i].h - box.h < min
            ) {
                bestSpaceIndex = i;
                min = spaces[i].h - box.h;
            }
        }

        // If no space could accommodate box, box can't be placed
        if (min == containerHeight + 1) {
            box.x = 1000;
            box.y = 1000;
        } else {
            // place the box in the space and update the space accordingly
            const space = spaces[bestSpaceIndex];
            box.x = space.x;
            box.y = space.y;

            if (box.w === space.w && box.h === space.h) {
                // space matches the box exactly; remove it
                spaces.splice(bestSpaceIndex, 1);
            } else if (box.h === space.h) {
                // space matches the box height; update it accordingly
                space.x += box.w + padding;
                space.w -= box.w + padding;
            } else if (box.w === space.w) {
                // space matches the box width; update it accordingly
                space.y += box.h + padding;
                space.h -= box.h + padding;
            } else {
                // otherwise the box splits the space into two spaces
                spaces.push({
                    x: space.x + box.w + padding,
                    y: space.y,
                    w: space.w - box.w - padding,
                    h: box.h,
                });
                space.y += box.h + padding;
                space.h -= box.h + padding;
            }
        }
    }

    return boxes;
}

export function pack(
    boxes: { w: number; h: number; x: number; y: number }[],
    containerWidth: number,
    containerHeight: number
): boolean {
    // Sort boxes by area for a better starting point (this is an optimization, but not necessary)
    boxes.sort((a, b) => b.w * b.h - a.w * a.h);

    // Recursively try to pack the boxes
    return tryPacking(boxes, 0, containerWidth, containerHeight);
}

function tryPacking(
    boxes: { w: number; h: number; x: number; y: number }[],
    index: number,
    containerWidth: number,
    containerHeight: number
): boolean {
    console.log("called", index);
    if (index >= boxes.length) {
        return true; // All boxes are successfully packed
    }

    const box = boxes[index];
    for (let y = 0; y <= containerHeight - box.h; y++) {
        for (let x = 0; x <= containerWidth - box.w; x++) {
            box.x = x;
            box.y = y;
            console.log("try", index, box.x, box.y);

            if (isValidPlacement(boxes, box, index)) {
                if (
                    tryPacking(
                        boxes,
                        index + 1,
                        containerWidth,
                        containerHeight
                    )
                ) {
                    return true; // Found a valid configuration
                }
            }

            // Reset x and y before next iteration
            box.x = 0;
            box.y = 0;
        }
    }
    box.x = 1000;
    box.y = 1000;
    return false; // Couldn't pack the current box
}

function isValidPlacement(
    boxes: { w: number; h: number; x: number; y: number }[],
    box: { w: number; h: number; x: number; y: number },
    index: number
): boolean {
    for (let i = 0; i < index; i++) {
        const other = boxes[i];
        if (
            box.x < other.x + other.w &&
            box.x + box.w > other.x &&
            box.y < other.y + other.h &&
            box.y + box.h > other.y
        ) {
            console.log("invalid", index);

            return false; // There's an overlap
        }
    }
    console.log("valid", index);

    return true;
}
