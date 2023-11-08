import jsPDF from "jspdf";
// import { Box } from "./ImagePacker";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

import { ImageBox } from "./ImagePacker";
import { pack } from "../../binPacking";
export const handleSaveAsPDF = ({
    boxes,
    containerDimensions,
}: {
    boxes: ImageBox[][];
    containerDimensions: { w: number; h: number };
}) => {
    const pdf = new jsPDF("p", "pt", "a4");
    pdf.setTextColor("#000000");

    const a4Width = 595; // A4 width in points
    const a4Height = 842; // A4 height in points

    const scaleX = a4Width / containerDimensions.w;
    const scaleY = a4Height / containerDimensions.h;

    boxes.forEach((boxSet, index) => {
        if (index > 0) {
            pdf.addPage("a4", "portrait");
        }

        const stage = new Konva.Stage({
            container: "temp-container",
            width: containerDimensions.w,
            height: containerDimensions.h,
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
            containerDimensions.w * scaleX,
            containerDimensions.h * scaleY
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

// function to position the images in the resizing window
export const positionImages = (
    images: ImageBox[],
    containerDimensions: { w: number; h: number }
) => {
    let maxY = 0;

    let localImagesTemp = images.map((img) => {
        let tempMaxY = maxY;
        if (
            img.w > containerDimensions.w / 2 ||
            img.h > containerDimensions.h
        ) {
            const scaleFactor = Math.min(
                containerDimensions.w / 2 / img.w,
                containerDimensions.h / img.h
            );
            img.w = img.w * scaleFactor;
            img.h = img.h * scaleFactor;
        }

        maxY += img.h + 10;

        return {
            id: img.id,
            w: img.w,
            h: img.h,
            x: img.x,
            y: tempMaxY,
            file: img.file,
            imageElement: img.imageElement,
        };
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
    containerDimensions,
    padding,
}: {
    images: ImageBox[];
    containerDimensions: { w: number; h: number };
    padding: number;
}) => {
    let remainingImages = [...images]; // Copy the images array to manipulate
    const allPackedBoxes: ImageBox[][] = [];

    while (remainingImages.length > 0) {
        const { packed_rectangles, unpacked_rectangles, error } = await pack(
            remainingImages,
            {
                w: containerDimensions.w,
                h: containerDimensions.h,
            },
            padding
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
