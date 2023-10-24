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
    w: number;
    h: number;
    x: number;
    y: number;
}

export function plotConfiguration(C: any): Rectangle[] {
    let rectangles_data: Rectangle[] = [];
    for (let rect of C.packed_rects) {
        let rectangle_info: Rectangle = {
            w: rect.width,
            h: rect.height,
            x: rect.origin[0],
            y: rect.origin[1],
        };
        rectangles_data.push(rectangle_info);
    }
    console.log(rectangles_data);
    return rectangles_data;
}
