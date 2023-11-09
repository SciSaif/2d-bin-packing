import jsPDF from "jspdf";
// import { Box } from "./ImagePacker";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

import { ContainerType, ImageBox } from "./ImagePacker";
import { pack } from "../../binPacking";
import { ImageData } from "../../components/ResizingWindow";
export const handleSaveAsPDF = ({
    boxes,
    container,
}: {
    boxes: ImageBox[][];
    container: ContainerType;
}) => {
    const pdf = new jsPDF("p", "pt", "a4");
    pdf.setTextColor("#000000");

    const a4Width = 595; // A4 width in points
    const a4Height = 842; // A4 height in points

    const scaleX = a4Width / container.w;
    const scaleY = a4Height / container.h;

    boxes.forEach((boxSet, index) => {
        if (index > 0) {
            pdf.addPage("a4", "portrait");
        }

        const stage = new Konva.Stage({
            container: "temp-container",
            width: container.w,
            height: container.h,
        });

        const layer = new Konva.Layer();
        stage.add(layer);

        boxSet.forEach((box) => {
            if (box.imageElement) {
                const konvaImage = new Konva.Image({
                    x: box.x,
                    y: box.y,
                    width: box.rotated ? box.h : box.w,
                    height: box.rotated ? box.w : box.h,
                    image: box.imageElement,
                    rotation: box.rotated ? -90 : 0,
                    offsetX: box.rotated ? box.h : 0,
                });
                layer.add(konvaImage);
            }

            const rect = new Konva.Rect({
                x: box.x,
                y: box.y,
                width: box.w,
                height: box.h,
                stroke: "red",
            });
            layer.add(rect);
        });

        pdf.addImage(
            stage.toDataURL({ pixelRatio: 2 }),
            0,
            0,
            container.w * scaleX,
            container.h * scaleY
        );

        stage.destroy();
    });

    pdf.save("packed-images.pdf");
};

export const handlePrintMultipleStages = (stages: (Konva.Stage | null)[]) => {
    let imagesContent = "";

    stages.forEach((stage) => {
        if (!stage) {
            return;
        }
        const dataUrl = stage.toDataURL();
        // imagesContent += `<img class="print-page" src="${dataUrl}">`;
        imagesContent += `<img class="print-page" src="${dataUrl}" style="page-break-after: always; width: 100%; height: auto; display: block; margin: 0 !important; padding: 0 !important;">`;
    });

    const iframeContent = `
            <html>
                <head>
                    <title>Print canvas</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .print-page {
                            page-break-after: always;
                            width: 100%;
                            height: auto;
                            display: block;
                        }
                        @media print {
                            body {
                                margin: 0;
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body style="margin: 0 !important; padding: 0 !important;">
                    ${imagesContent}
                </body>
            </html>`;

    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.display = "none";

    iframe.onload = function () {
        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(iframeContent);
            doc.close();
            setTimeout(() => {
                iframe.contentWindow?.print();
                document.body.removeChild(iframe);
            }, 500); // Give it half a second to load the images
        }
    };
};

export const positionImages = (
    images: ImageData[],
    container: ContainerType,

    padding: number = 10,
    constrainToHalfWidth: boolean = false // New parameter to control width constraint
) => {
    let maxY = 0;
    let currentX = 0;
    let currentY = 0;
    let shelfHeight = 0;

    let localImagesTemp = images.map((img) => {
        // Determine the maximum width for the image based on the new parameter
        const maxWidth = constrainToHalfWidth ? container.w / 2 : container.w;

        // Calculate the scale factor to maintain aspect ratio while fitting within constraints
        let scaleFactor = Math.min(
            maxWidth / img.w, // Constraint for width based on the new parameter
            container.h / img.h, // Constraint for height
            1 // Ensure we don't scale up the image
        );

        // Scale the image dimensions
        const scaledWidth = img.w * scaleFactor;
        const scaledHeight = img.h * scaleFactor;

        // If the image doesn't fit in the current row, move to the next one
        if (currentX + scaledWidth + padding > container.w) {
            currentY += shelfHeight + padding; // Add margin between rows
            currentX = 0; // Reset X position for the new row
            shelfHeight = scaledHeight; // Start with the height of the first image in the new row
        } else {
            // Update the shelf height if this image is taller than the others in the row
            shelfHeight = Math.max(shelfHeight, scaledHeight);
        }

        // Position the image in the current spot
        const positionedImage = {
            ...img,
            w: scaledWidth,
            h: scaledHeight,
            x: currentX,
            y: currentY,
        };

        if (isNaN(scaledWidth)) {
            console.log("nan width ", scaleFactor);
        }

        // Update X position for the next image
        currentX += scaledWidth + padding; // Add margin between images

        // Update maxY if needed
        maxY = Math.max(maxY, currentY + scaledHeight);

        return positionedImage;
    });

    return { _maxY: maxY, _localImages: localImagesTemp };
};

// function to create the images from files
export const createImages = async (fileList: FileList) => {
    const files = Array.from(fileList);
    const newImages: ImageBox[] = await Promise.all(
        files.map((file) => {
            return new Promise<ImageBox>((resolve) => {
                const img = new Image();
                const id = uuidv4();
                img.onload = () => {
                    resolve({
                        id,
                        w: img.width,
                        h: img.height,
                        x: 0,
                        y: 0,
                        file,
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        })
    );

    return newImages;
};

// function to pack the images into the container
export const packBoxes = async ({
    images,
    container,
}: {
    images: ImageBox[];
    container: ContainerType;
}) => {
    let remainingImages = [...images]; // Copy the images array to manipulate
    const allPackedBoxes: ImageBox[][] = [];

    while (remainingImages.length > 0) {
        const { packed_rectangles, unpacked_rectangles, error } = await pack(
            remainingImages,
            {
                w: container.w,
                h: container.h,
            },
            {
                padding: container.padding,
                margin: {
                    top: 50,
                    right: 50,
                    bottom: 50,
                    left: 50,
                },
            }
        );

        if (error && error.length > 0) {
            console.error("Packing error:", error);
            break;
        }

        allPackedBoxes.push(packed_rectangles);
        remainingImages = unpacked_rectangles;
    }

    return allPackedBoxes;
};
