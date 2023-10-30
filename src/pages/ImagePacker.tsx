import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { UnpackedRect } from "../binPacking/configuration";
import { pack } from "../binPacking";
import ResizingCanvas from "../components/ResizingCanvas";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import jsPDF from "jspdf";
import Konva from "konva";

interface Box {
    // img: HTMLImageElement;
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    rotated: boolean;
    color?: string;
    image?: HTMLImageElement;
}

const PADDING = 3; // 10 pixels padding, adjust as needed

const ImagePacker: React.FC = () => {
    const [boxes, setBoxes] = useState<Box[][]>([]);
    const [containerWidth, setContainerWidth] = useState<number>(595 * 2);
    const [containerHeight, setContainerHeight] = useState<number>(842 * 2);
    const [uploadedFiles, setUploadedFiles] = useState<
        { id: string; file: File }[]
    >([]);

    const [inResizeMode, setInResizeMode] = useState<boolean>(false);
    const [unpackedRectangles, setUnpackedRectangles] = useState<
        { id: string; w: number; h: number; x: number; y: number }[]
    >([]);
    const [maxY, setMaxY] = useState<number>(0);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (!boxes || boxes.length === 0) return;

        let loadedCount = 0;
        const totalImages = boxes.reduce(
            (acc, boxSet) => acc + boxSet.length,
            0
        );

        boxes.forEach((boxSet) => {
            boxSet.forEach((box) => {
                const correspondingFile = uploadedFiles.find(
                    (f) => f.id === box.id
                );
                if (!correspondingFile) return;

                const img = new window.Image();
                img.onload = () => {
                    box.image = img;
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                };
                img.src = URL.createObjectURL(correspondingFile.file);
            });
        });
    }, [boxes, uploadedFiles]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        const boxesFromImages: UnpackedRect[] = [];
        const promises: Promise<void>[] = [];

        files.forEach((file) => {
            promises.push(
                new Promise((resolve) => {
                    const img = new Image();
                    const id = uuidv4();
                    img.onload = () => {
                        // boxesFromImages.push({
                        //     w: img.width,
                        //     h: img.height,
                        //     id,
                        // });
                        let imgWidth = img.width;
                        let imgHeight = img.height;

                        // Check if the image's width or height exceeds the container's dimensions
                        if (
                            imgWidth > containerWidth ||
                            imgHeight > containerHeight
                        ) {
                            const scaleFactor = Math.min(
                                containerWidth / imgWidth,
                                containerHeight / imgHeight
                            );
                            imgWidth = imgWidth * scaleFactor;
                            imgHeight = imgHeight * scaleFactor;
                        }

                        boxesFromImages.push({
                            w: imgWidth,
                            h: imgHeight,
                            id,
                        });
                        setUploadedFiles((prev) => [...prev, { id, file }]);
                        resolve();
                    };
                    img.src = URL.createObjectURL(file);
                })
            );
        });

        Promise.all(promises).then(() => {
            let maxYc = 0;
            setUnpackedRectangles(
                boxesFromImages.map((box) => {
                    const res = {
                        id: box.id,
                        w: box.w,
                        h: box.h,
                        x: 0,
                        y: maxYc + 5,
                    };
                    maxYc += box.h + 5;
                    return res;
                })
            );
            setInResizeMode(true);
            setMaxY(maxYc);
        });
    };

    const startPacking = () => {
        setInResizeMode(false);

        let remainingRectangles = unpackedRectangles;
        const allPackedBoxes: Box[][] = [];

        while (remainingRectangles.length > 0) {
            const { packed_rectangles, unpacked_rectangles } = pack(
                remainingRectangles,
                {
                    w: containerWidth,
                    h: containerHeight,
                },
                PADDING
            );

            allPackedBoxes.push(packed_rectangles);
            remainingRectangles = unpacked_rectangles;
        }

        setBoxes(allPackedBoxes);
    };
    const handleSaveAsPDF = () => {
        const pdf = new jsPDF("p", "pt", "a4");
        pdf.setTextColor("#000000");

        const a4Width = 595; // A4 width in points
        const a4Height = 842; // A4 height in points

        const scaleX = a4Width / containerWidth;
        const scaleY = a4Height / containerHeight;

        boxes.forEach((boxSet, index) => {
            if (index > 0) {
                pdf.addPage("a4", "portrait");
            }

            const stage = new Konva.Stage({
                container: "temp-container",
                width: containerWidth,
                height: containerHeight,
            });

            const layer = new Konva.Layer();
            stage.add(layer);

            boxSet.forEach((box) => {
                if (box.image) {
                    const konvaImage = new Konva.Image({
                        x: box.x,
                        y: box.y,
                        width: box.rotated ? box.h : box.w,
                        height: box.rotated ? box.w : box.h,
                        image: box.image,
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
                containerWidth * scaleX,
                containerHeight * scaleY
            );

            stage.destroy();
        });

        pdf.save("packed-images.pdf");
    };

    // const handleSaveAsPDF = () => {
    //     const pdf = new jsPDF("p", "pt", "a4");
    //     pdf.setTextColor("#000000");

    //     boxes.forEach((boxSet, index) => {
    //         if (index > 0) {
    //             pdf.addPage("a4", "portrait");
    //         }

    //         const stage = new Konva.Stage({
    //             container: "temp-container",
    //             width: containerWidth,
    //             height: containerHeight,
    //         });

    //         const layer = new Konva.Layer();
    //         stage.add(layer);

    //         boxSet.forEach((box) => {
    //             if (box.image) {
    //                 const konvaImage = new Konva.Image({
    //                     x: box.x,
    //                     y: box.y,
    //                     width: box.rotated ? box.h : box.w,
    //                     height: box.rotated ? box.w : box.h,
    //                     image: box.image,
    //                     rotation: box.rotated ? -90 : 0,
    //                     offsetX: box.rotated ? box.h : 0,
    //                 });
    //                 layer.add(konvaImage);
    //             }

    //             const rect = new Konva.Rect({
    //                 x: box.x,
    //                 y: box.y,
    //                 width: box.w,
    //                 height: box.h,
    //                 stroke: "red",
    //             });
    //             layer.add(rect);
    //         });

    //         pdf.addImage(
    //             stage.toDataURL({ pixelRatio: 2 }),
    //             0,
    //             0,
    //             containerWidth,
    //             containerHeight
    //         );

    //         stage.destroy();
    //     });

    //     pdf.save("packed-images.pdf");
    // };

    return (
        <div className="flex flex-col gap-2 px-2 py-2">
            <h1 className="pb-2 mb-2 text-3xl font-bold border-b text-cyan-500">
                Bin Packing
            </h1>

            <div className="flex flex-row items-center gap-2">
                <label>Container dimensions:</label>
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={containerWidth}
                    onChange={(e) => setContainerWidth(+e.target.value)}
                />
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={containerHeight}
                    onChange={(e) => setContainerHeight(+e.target.value)}
                />
            </div>

            <input
                type="file"
                multiple
                onChange={handleImageUpload}
                accept="image/*"
            />

            {inResizeMode && (
                <button
                    onClick={() => startPacking()}
                    className="px-10 py-2 text-white bg-blue-500 rounded w-fit hover:bg-blue-600"
                >
                    Start packing
                </button>
            )}

            {boxes.length > 0 && (
                <button
                    onClick={handleSaveAsPDF}
                    className="px-10 py-2 mt-4 text-white bg-green-500 rounded w-fit hover:bg-green-600"
                >
                    Save as PDF
                </button>
            )}

            {inResizeMode && (
                <ResizingCanvas
                    containerWidth={containerWidth}
                    images={unpackedRectangles}
                    uploadedFiles={uploadedFiles}
                    maxY={maxY}
                    setImages={setUnpackedRectangles}
                />
            )}

            <div className="flex flex-wrap w-full gap-5">
                {boxes.map((boxSet, index) => (
                    <Stage
                        key={index}
                        width={containerWidth}
                        height={containerHeight}
                        className="border border-gray-400 shadow w-fit"
                    >
                        <Layer>
                            {boxSet.map((box) => (
                                <React.Fragment key={box.id}>
                                    {imagesLoaded && (
                                        <KonvaImage
                                            x={box.x}
                                            y={box.y}
                                            width={box.rotated ? box.h : box.w}
                                            height={box.rotated ? box.w : box.h}
                                            image={box.image}
                                            rotation={box.rotated ? -90 : 0}
                                            offsetX={box.rotated ? box.h : 0}
                                        />
                                    )}
                                    <Rect
                                        x={box.x}
                                        y={box.y}
                                        width={box.w}
                                        height={box.h}
                                        stroke="red"
                                    />
                                </React.Fragment>
                            ))}
                        </Layer>
                    </Stage>
                ))}
            </div>
            <div id="temp-container" style={{ display: "none" }}></div>
        </div>
    );
};

export default ImagePacker;
