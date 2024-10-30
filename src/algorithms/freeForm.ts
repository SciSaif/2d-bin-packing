import { ImageBox } from "@/pages/pack/Pack";
import { ContainerType } from "@/redux/features/slices/mainSlice";
import { pack, UnpackedRect, Rectangle } from "efficient-rect-packer";
import { AlgorithmProps } from "./utils";
// export interface ImageBox {
//     id: string;
//     w: number;
//     h: number;
//     x: number;
//     y: number;
//     file?: File;
//     imageElement?: HTMLImageElement;
//     rotated?: boolean;
//     new?: boolean;
//     url?: any
// }

export type efficientPackingProps = AlgorithmProps;

export const freeFormPacking = ({
    images: originalImages,
    container,
}: efficientPackingProps): ImageBox[][] => {
    const images = [...originalImages];
    const totalImages = images.length;
    // images have the x, y coordinates already set, I just need to create distribute the images
    // on different pages or boxes
    // we will look at the container height and for each container only put the images
    // that fit in the container
    // images' y coordinates keeps increasing and can exceed the container height
    // if the image's y coordinate is greater than the container height, we will move the image to the next container
    // we need to modify the y coordinate of the image by subtracting the container height * page number
    // we will create a new container for each page
    const maxHeight = images.reduce((acc, image) => {
        return Math.max(acc, image.y + image.h);
    }, 0);
    const totalPages = Math.ceil(maxHeight / container.h);
    // array with totalPages number of containers
    const allPackedBoxes: ImageBox[][] = [];

    for (let i = 0; i < totalImages; i++) {
        const image = images[i];
        // find the page image belongs to
        const pageNumber = Math.floor(image.y / container.h);

        // place the image in the correct container
        if (!allPackedBoxes[pageNumber]) {
            allPackedBoxes[pageNumber] = [];
        }
        allPackedBoxes[pageNumber].push({
            ...image,
            y: image.y % container.h,
        });
    }

    return allPackedBoxes;
};
