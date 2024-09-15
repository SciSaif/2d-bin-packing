import jsPDF from "jspdf";
// import { Box } from "./ImagePacker";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

import { ImageBox } from "./Home";
import { ContainerType } from "../../redux/features/slices/mainSlice";

export const saveAsPDF = async ({
    boxes,
    container,
    showBorder,
}: {
    boxes: ImageBox[][];
    container: ContainerType;
    showBorder: boolean;
}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
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
                        if (showBorder) {
                            const border = new Konva.Rect({
                                x: box.x - 1,
                                y: box.y - 1,
                                width: box.rotated ? box.h + 2 : box.w + 2,
                                height: box.rotated ? box.w + 2 : box.h + 2,
                                stroke: "#000000",
                                strokeWidth: 1,
                                rotation: box.rotated ? -90 : 0,
                                offsetX: box.rotated ? box.h : 0,
                            });
                            layer.add(border);
                        }

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
                });

                pdf.addImage(
                    stage.toDataURL({ pixelRatio: 0.9 }),
                    0,
                    0,
                    container.w * scaleX,
                    container.h * scaleY
                );

                stage.destroy();
            });
            console.log("pdf created");

            pdf.save("packed-images.pdf");
            resolve(null);
        }, 0);
    });
};

export const handlePrintMultipleStages = (stages: (Konva.Stage | null)[]) => {
    let imagesContent = "";
    console.log("stages", stages.length);

    stages.forEach((stage, index) => {
        if (!stage) {
            return;
        }
        const dataUrl = stage.toDataURL();
        imagesContent += `<img class="print-page" src="${dataUrl}">`;
    });

    const printContent = `
        <html>
            <head>
                <title>Print canvas</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .print-page {
                        width: 100%;
                        height: auto;
                        display: block;
                        page-break-before: auto;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .print-page {
                            width: 100%;
                            height: auto;
                            display: block;
                            page-break-before: auto;
                        }
                    }
                </style>
            </head>
            <body>
                ${imagesContent}
            </body>
        </html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = function () {
            printWindow.print();
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        };
    }
};

// function to create the images from files
export const createImages = async (files: File[]) => {
    // const files = Array.from(fileList);
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
                        new: true,
                    });
                };
                img.src = URL.createObjectURL(file);
            });
        })
    );

    return newImages;
};
