import Configuration from "./configuration";

export enum PointType {
    BOTTOM_LEFT = 0,
    BOTTOM_RIGHT = 1,
    TOP_LEFT = 2,
    TOP_RIGHT = 3,
}

export function argmax(lst: number[]): number {
    return lst.indexOf(Math.max(...lst));
}

export interface Rectangle {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    rotated: boolean;
}

interface Result {
    packed_rectangles: Rectangle[];
    unpacked_rectangles: Rectangle[];
    isRemaining: boolean;
}

export function getResult(C: Configuration): Result {
    let rectangles_data: Rectangle[] = [];
    for (let rect of C.packed_rects) {
        let rectangle_info: Rectangle = {
            id: rect.id,
            w: rect.width,
            h: rect.height,
            x: rect.origin.x,
            y: rect.origin.y,
            rotated: rect.rotated,
        };
        rectangles_data.push(rectangle_info);
    }
    console.log(rectangles_data);

    let remaining_rectangles_data: Rectangle[] = [];
    for (let rect of C.unpacked_rects) {
        let rectangle_info: Rectangle = {
            id: rect.id,
            w: rect.w,
            h: rect.h,
            x: 0,
            y: 0,
            rotated: false,
        };
        remaining_rectangles_data.push(rectangle_info);
    }
    console.log(remaining_rectangles_data);

    return {
        packed_rectangles: rectangles_data,
        unpacked_rectangles: remaining_rectangles_data,
        isRemaining: C.unpacked_rects.length > 0,
    };
}
