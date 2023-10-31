import { BinPacker } from "./binPacker";
import Configuration, { Dimension, UnpackedRect } from "./configuration";
import {
    Rectangle,
    Result,
    getResult,
    increaseDimensionsForPadding,
} from "./util";

// export const pack = (
//     rects: UnpackedRect[],
//     container_size: Dimension,
//     padding: number = 0
// ) => {
//     if (padding > 0) {
//         rects = increaseDimensionsForPadding(rects, padding);
//         container_size.w += padding + padding;
//         container_size.h += padding + padding;
//     }

//     const C = new Configuration(
//         container_size,
//         [...rects], // Using spread operator to create a shallow copy
//         [],
//         padding
//     );

//     const packer = new BinPacker(C);

//     const packedConfig = packer.PackConfiguration(C);

//     return getResult(packedConfig, padding);
// };

export const pack = async (
    rects: UnpackedRect[],
    container_size: Dimension,
    padding: number = 0
): Promise<Result> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (padding > 0) {
                rects = increaseDimensionsForPadding(rects, padding);
                container_size.w += padding + padding;
                container_size.h += padding + padding;
            }

            const C = new Configuration(
                container_size,
                [...rects], // Using spread operator to create a shallow copy
                [],
                padding
            );

            const packer = new BinPacker(C);

            const packedConfig = packer.PackConfiguration(C);

            resolve(getResult(packedConfig, padding));
        }, 0); // setTimeout with 0ms delay to make it asynchronous
    });
};
