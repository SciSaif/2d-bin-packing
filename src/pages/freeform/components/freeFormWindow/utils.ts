import { ImageBox } from "@/pages/pack/Pack";
import { ContainerType } from "../../../../redux/features/slices/mainSlice";

export const resizeImages = (
    images: ImageBox[],
    container: ContainerType,
    constrainWidthFactor?: number
) => {
    let maxY = 0;

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

        const positionedImage = {
            ...img,
            w: scaledWidth,
            h: scaledHeight,
            x: img.x,
            y: img.y,
            new: false,
        };

        maxY = Math.max(maxY, img.y + scaledHeight);

        return positionedImage;
    });

    return { _maxY: maxY, _localImages: localImagesTemp };
};

// for function positionNewImages, image can have a new property that is a boolean , we will use this
// we won't change the position of the old images, and we will place all the new images after the last old image.
// for this we first find the x, y coordinates of the old image that is at the lowest y coordinate, then we
// find the starting coordinate where we will place the new images. the starting coordinate will be the top right corner of the
// last old image + some padding of 5 px, after that we just place the images one after the other
// in the x direction until we reach the end of the container, then we move to the next row.
export const positionNewImages = (
    images: ImageBox[],
    container: ContainerType,
    constrainWidthFactor?: number
) => {
    let maxY = 0;
    let currentX = container.margin.left;
    let currentY = container.margin.top; // Start from the top margin

    // Find the x, y coordinates of the old image that is at the lowest y coordinate
    let oldImages = images.filter((img) => !img.new);

    let lastOldImage =
        oldImages.length > 0
            ? oldImages.reduce((prev, current) =>
                  prev.y > current.y ? prev : current
              )
            : { x: 0, y: 0, w: 0, h: 0 };
    let lastOldImageX = lastOldImage.x;
    let lastOldImageY = lastOldImage.y;
    let lastOldImageW = lastOldImage.w;
    let lastOldImageH = lastOldImage.h;

    // Find the starting coordinate where we will place the new images
    let startingX =
        lastOldImageX +
        lastOldImageW +
        (lastOldImageX + lastOldImageW > 0 ? container.padding : 0);
    let startingY = lastOldImageY + (lastOldImageY > 0 ? container.padding : 0);
    currentX = startingX;
    currentY = startingY;

    let localImagesTemp = images.map((img) => {
        // if its an old image, we don't change its position
        if (!img.new) {
            maxY = Math.max(maxY, img.y + img.h);
            return img;
        }

        let availableContainerWidth =
            container.w - container.margin.left - container.margin.right;

        // Determine the maximum width for the image based on the constrainWidthFactor parameter
        const maxWidth = constrainWidthFactor
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
            currentY = maxY + container.padding; // Add padding for the new row
            currentX = container.margin.left; // Reset X to left margin for the new row
        } else {
            maxY = Math.max(maxY, currentY + scaledHeight);
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
