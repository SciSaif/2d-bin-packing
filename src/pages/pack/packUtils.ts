import { pack, UnpackedRect, Rectangle } from "efficient-rect-packer";
import { ContainerType } from "../../redux/features/slices/mainSlice";
import { ImageBox } from "./Pack";

function toUnpackedRect(image: ImageBox): UnpackedRect {
    return {
        id: image.id,
        w: image.w,
        h: image.h,
    };
}

function mapPackedRectToImageBox(
    rect: Rectangle,
    originalImage: ImageBox
): ImageBox {
    return {
        ...originalImage,
        w: rect.w,
        h: rect.h,
        x: rect.x,
        y: rect.y,
        rotated: rect.rotated,
    };
}

async function callPackFunction({
    rectangles,
    container,
    useApi,
}: {
    rectangles: UnpackedRect[];
    container: ContainerType;
    useApi?: boolean;
}): Promise<{
    packed_rectangles: Rectangle[];
    unpacked_rectangles: UnpackedRect[];
}> {
    const options = {
        padding: Math.ceil(container.padding / 2),
        margin: container.margin,
        noRotation: false,
    };

    if (useApi) {
        // API-based packing
        console.log("packing images using API");
        const response = await fetch("http://localhost:3000/pack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rectangles,
                container_size: {
                    w: container.w,
                    h: container.h,
                },
                options,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Packing error:", errorText);
            throw new Error(`API packing failed: ${errorText}`);
        }

        return await response.json();
    } else {
        // Local packing
        console.log("packing images locally");
        return await pack(
            rectangles,
            {
                w: container.w,
                h: container.h,
            },
            options
        );
    }
}

export type PackBoxesProps = {
    images: ImageBox[];
    container: ContainerType;
    options?: {
        packingFactor?: number;
        useApi?: boolean;
    };
};

export const packBoxes = async ({
    images,
    container,
    options = {},
}: PackBoxesProps): Promise<ImageBox[][]> => {
    let remainingImages = [...images];
    const allPackedBoxes: ImageBox[][] = [];
    const imageMap = new Map(images.map((img) => [img.id, img]));

    const { packingFactor = 1, useApi = false } = options;
    const containerArea = container.w * container.h;
    const targetArea = containerArea * packingFactor;

    while (remainingImages.length > 0) {
        let currentBatchArea = 0;
        const currentBatch: UnpackedRect[] = [];

        // Select images for the current batch
        for (const image of remainingImages) {
            const imageArea = image.w * image.h;
            if (currentBatchArea + imageArea <= targetArea) {
                currentBatch.push(toUnpackedRect(image));
                currentBatchArea += imageArea;
            } else {
                break;
            }
        }

        // Pack the current batch
        const { packed_rectangles } = await callPackFunction({
            rectangles: currentBatch,
            container,
            useApi,
        });

        // Process packed rectangles
        const packedImageBoxes = packed_rectangles.map((rect) => {
            const originalImage = imageMap.get(rect.id);
            if (!originalImage) {
                throw new Error(
                    `No matching original image found for id: ${rect.id}`
                );
            }
            return mapPackedRectToImageBox(rect, originalImage);
        });

        allPackedBoxes.push(packedImageBoxes);

        // Update remaining images
        const packedIds = new Set(packed_rectangles.map((rect) => rect.id));
        remainingImages = remainingImages.filter(
            (img) => !packedIds.has(img.id)
        );

        // Log efficiency for this batch
        const packedArea = packed_rectangles.reduce(
            (acc, rect) => acc + rect.w * rect.h,
            0
        );
        console.log("Batch efficiency:", (packedArea / containerArea) * 100);
    }

    // Log overall efficiency
    const totalAvailableArea = allPackedBoxes.length * containerArea;
    const totalPackedArea = allPackedBoxes.reduce(
        (acc, boxes) =>
            acc + boxes.reduce((boxAcc, box) => boxAcc + box.w * box.h, 0),
        0
    );
    console.log("_________________________________________");
    console.log("Total packed area:", totalPackedArea);
    console.log("Total available area:", totalAvailableArea);
    console.log(
        "Overall efficiency:",
        (totalPackedArea / totalAvailableArea) * 100
    );

    return allPackedBoxes;
};

// export const packBoxes = async ({
//     images,
//     container,
//     useApi,
// }: {
//     images: ImageBox[];
//     container: ContainerType;
//     useApi?: boolean;
// }): Promise<ImageBox[][]> => {
//     let remainingImages = [...images]; // Copy the images array to manipulate
//     const allPackedBoxes: ImageBox[][] = [];
//     const imageMap = new Map(images.map((img) => [img.id, img]));

//     while (remainingImages.length > 0) {
//         const { packed_rectangles, unpacked_rectangles } =
//             await callPackFunction({
//                 rectangles: remainingImages.map(toUnpackedRect),
//                 container,
//                 useApi,
//             });

//         // Calculate total packed area for efficiency logging
//         const totalArea = packed_rectangles.reduce((acc, rect) => {
//             return acc + rect.w * rect.h;
//         }, 0);
//         console.log("Total available area", container.w * container.h);
//         console.log("Total packed area", totalArea);
//         console.log(
//             "Efficiency",
//             (totalArea / (container.w * container.h)) * 100
//         );

//         // Map packed rectangles back to ImageBox objects
//         const packedImageBoxes = packed_rectangles.map((rect) => {
//             const originalImage = imageMap.get(rect.id);
//             if (!originalImage) {
//                 throw new Error(
//                     `No matching original image found for id: ${rect.id}`
//                 );
//             }
//             return mapPackedRectToImageBox(rect, originalImage);
//         });

//         allPackedBoxes.push(packedImageBoxes);

//         // Update remaining images
//         remainingImages = unpacked_rectangles.map((rect) => {
//             const originalImage = imageMap.get(rect.id);
//             if (!originalImage) {
//                 throw new Error(
//                     `No matching original image found for id: ${rect.id}`
//                 );
//             }
//             return originalImage;
//         });
//     }

//     // Log overall efficiency
//     const totalAvailableArea =
//         allPackedBoxes.length * container.w * container.h;
//     const totalPackedArea = allPackedBoxes.reduce((acc, boxes) => {
//         return acc + boxes.reduce((boxAcc, box) => boxAcc + box.w * box.h, 0);
//     }, 0);
//     console.log("_________________________________________");
//     console.log("Total packed area", totalPackedArea);
//     console.log("Total available area", totalAvailableArea);
//     console.log("Efficiency", (totalPackedArea / totalAvailableArea) * 100);

//     return allPackedBoxes;
// };
