import { ImageBox } from "@/pages/pack/Pack";
import { ContainerType } from "@/redux/features/slices/mainSlice";

export const positionImages = (
    images: ImageBox[],
    container: ContainerType,
    constrainWidthFactor?: number
) => {
    let maxY = 0;
    let currentX = container.margin.left;
    let currentY = container.margin.top; // Start from the top margin
    let shelfHeight = 0;

    let localImagesTemp = images.map((img) => {
        let availableContainerWidth =
            container.w - container.margin.left - container.margin.right;

        // Determine the maximum width for the image based on the constrainWidthFactor parameter
        const maxWidth =
            constrainWidthFactor && img.new
                ? availableContainerWidth * constrainWidthFactor
                : availableContainerWidth;

        // Calculate the scale factor to maintain aspect ratio while fitting within constraints
        let aspectRatio = Math.min(
            maxWidth / img.w, // Constraint for width
            container.h / img.h, // Constraint for height
            1 // Ensure we don't scale up the image
        );

        const scaledWidth = img.w * aspectRatio;
        const scaledHeight = img.h * aspectRatio;

        // Move to the next row if the image doesn't fit in the current row
        if (currentX + scaledWidth > container.w - container.margin.right) {
            currentY += shelfHeight + container.padding; // Add padding for the new row
            currentX = container.margin.left; // Reset X to left margin for the new row
            shelfHeight = scaledHeight;
        } else {
            shelfHeight = Math.max(shelfHeight, scaledHeight);
        }

        const positionedImage = {
            ...img,
            w: scaledWidth,
            h: scaledHeight,
            x: currentX,
            y: currentY,
            new: false,
        };

        currentX += scaledWidth + container.padding; // Add padding between images
        maxY = Math.max(maxY, currentY + scaledHeight);

        return positionedImage;
    });

    return { _maxY: maxY, _localImages: localImagesTemp };
};
