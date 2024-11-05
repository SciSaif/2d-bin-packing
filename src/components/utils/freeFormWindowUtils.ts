import { ImageBox } from "@/pages/pack/Pack";
import { ContainerType } from "@/redux/features/slices/mainSlice";

export const resizeImages = (
    images: ImageBox[],
    container: ContainerType,
    constrainWidthFactor?: number
) => {
    let maxY = 0;

    let localImagesTemp = images.map((img) => {
        // Determine the maximum width for the image based on the constrainWidthFactor parameter
        const maxWidth =
            constrainWidthFactor && img.new
                ? container.w * constrainWidthFactor
                : container.w;

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
// Also, If the new image won't fit in the container height wise, we will move it to the next container by changing the y coordinate
export const positionNewImages = (
    images: ImageBox[],
    container: ContainerType,
    constrainWidthFactor?: number
) => {
    let maxY = 0;
    let currentX = 0,
        currentY = 0;

    // Find the x, y coordinates of the old image that is at the lowest y coordinate
    let oldImages = images.filter((img) => !img.new);

    let lastOldImage =
        oldImages.length > 0
            ? oldImages.reduce((prev, current) =>
                  prev.y > current.y ? prev : current
              )
            : { x: 0, y: 0, w: 0, h: 0 };

    // Find the starting coordinate where we will place the new images
    let startingX =
        lastOldImage.x +
        lastOldImage.w +
        (lastOldImage.x + lastOldImage.w > 0 ? container.padding : 0);
    let startingY =
        lastOldImage.y + (lastOldImage.y > 0 ? container.padding : 0);

    currentX = startingX;
    currentY = startingY;

    // Determine the maximum width for the image based on the constrainWidthFactor parameter
    const maxWidth = constrainWidthFactor
        ? container.w * constrainWidthFactor
        : container.w;

    let localImagesTemp = images.map((img) => {
        // if its an old image, we don't change its position
        if (!img.new) {
            maxY = Math.max(maxY, img.y + img.h);
            return img;
        }

        // Calculate the scale factor to maintain aspect ratio while fitting within constraints
        let aspectRatio = Math.min(
            maxWidth / img.w, // Constraint for width
            container.h / img.h, // Constraint for height
            1 // Ensure we don't scale up the image
        );

        const scaledWidth = img.w * aspectRatio;
        const scaledHeight = img.h * aspectRatio;

        // Move to the next row if the image doesn't fit in the current row
        if (currentX + scaledWidth > container.w) {
            currentY = maxY + container.padding; // Add vertical padding for the new row
            currentX = 0; // Reset X to 0 for the new row
        } else {
            maxY = Math.max(maxY, currentY + scaledHeight);
        }

        // if image overlaps with the line between the two containers, move it to the next container
        const currentContainerNumber = Math.floor(currentY / container.h) + 1;
        const currentContainerEndingY = currentContainerNumber * container.h;


        if (currentY + scaledHeight > currentContainerEndingY) {
            currentY = currentContainerEndingY;
            currentX = 0;
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
