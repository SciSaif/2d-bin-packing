import { BinPacker } from "./binPacker";
import Configuration, {
    Dimension,
    Margin,
    UnpackedRect,
} from "./configuration";
import {
    Rectangle,
    Result,
    checkIfRectanglesExceedContainer,
    getResult,
    increaseDimensionsForPadding,
} from "./util";

export interface Options {
    padding: number;
    margin: Margin;
}

export const pack = async (
    rects: UnpackedRect[],
    container_size: Dimension,
    { padding, margin }: Options = {
        padding: 0,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
    }
): Promise<Result> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (
                checkIfRectanglesExceedContainer(rects, container_size, margin)
            ) {
                console.log(rects, container_size, margin);

                resolve({
                    packed_rectangles: [],
                    unpacked_rectangles: rects.map((rect) => {
                        return {
                            id: rect.id,
                            w: rect.w,
                            h: rect.h,
                            x: 0,
                            y: 0,
                            rotated: false,
                        };
                    }),
                    isRemaining: true,
                    error: "Some rectangles exceed container dimensions",
                });
            }

            if (padding > 0) {
                rects = increaseDimensionsForPadding(rects, padding);
                container_size.w += padding + padding;
                container_size.h += padding + padding;
            }

            const C = new Configuration(
                container_size,
                [...rects], // Using spread operator to create a shallow copy
                [],
                margin
            );

            const packer = new BinPacker(C);

            const packedConfig = packer.PackConfiguration(C);

            resolve(getResult(packedConfig, padding));
        }, 0); // setTimeout with 0ms delay to make it asynchronous
    });
};
