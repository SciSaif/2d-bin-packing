import { ImageBox } from "@/pages/pack/Pack";
import { AlgorithmProps } from "./utils";

export const hybridFirstFit = async ({
    images,
    container,
}: AlgorithmProps): Promise<ImageBox[][]> => {
    console.log("start packing using hff");
    const imagesCopy = images.map((img) => ({ ...img }));

    // Sort the images in non-increasing height order for the first phase
    imagesCopy.sort((a, b) => b.h - a.h);

    const margin = container.margin;
    const padding = container.padding;

    // Calculate the effective width and height based on margins
    const effectiveWidth = container.w - margin.left - margin.right;
    const effectiveHeight = container.h - margin.top - margin.bottom;

    const packedBins: ImageBox[][] = [];
    let currentBin: ImageBox[] = [];
    let currentX = margin.left;
    let currentY = margin.top;
    let currentHeight = currentY;

    for (const img of imagesCopy) {
        const paddedWidth = img.w + padding; // Image width plus padding
        if (currentX + paddedWidth <= effectiveWidth + margin.left) {
            // If it fits in the current level, place it
            img.x = currentX;
            img.y = currentY;
            currentX += paddedWidth;
            currentBin.push(img);
            currentHeight = Math.max(currentHeight, currentY + img.h);
        } else {
            // Start a new level
            currentX = margin.left;
            currentY = currentHeight + padding;

            // check if the new level fits in the container
            if (currentY + img.h <= effectiveHeight + margin.top) {
                img.x = currentX;
                img.y = currentY;
                currentX += paddedWidth;
                currentBin.push(img);
                currentHeight = Math.max(currentHeight, currentY + img.h);
            } else {
                // Start a new bin
                packedBins.push(currentBin);
                currentBin = [];
                currentX = margin.left;
                currentY = margin.top;
                currentHeight = currentY;
                img.x = currentX;
                img.y = currentY;
                currentX += paddedWidth;
                currentBin.push(img);
                currentHeight = Math.max(currentHeight, currentY + img.h);
            }
        }
    }

    // Add the last level
    if (currentBin.length > 0) {
        packedBins.push(currentBin);
    }

    return packedBins;
};

