import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { UnpackedRect } from "../binPacking/configuration";
import { pack } from "../binPacking";
import ResizingCanvas from "../components/ResizingCanvas";

// I want a feature where we can input multiple images and display those images in a canvas ,
// the canvas should have a fixed width but the height will by dynamic and will increase if the images need space to fit.
// The images will  be place one below the other.
// Now, I want the feature to click on the bottom right corner of the images and drag to resize them.
// As I am resizing, the images should move so as to not overlap.
// while resizing, the image's aspect ratio should not change.
// I need to keep track of each image's new dimensions.

interface Box {
    // img: HTMLImageElement;
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    rotated: boolean;
    color?: string;
}
const PADDING = 5; // 10 pixels padding, adjust as needed

const ImagePacker: React.FC = () => {
    const [boxes, setBoxes] = useState<Box[][]>([]);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [uploadedFiles, setUploadedFiles] = useState<
        { id: string; file: File }[]
    >([]);
    const [canvasRefs, setCanvasRefs] = useState<
        React.RefObject<HTMLCanvasElement>[]
    >([]);

    const [inResizeMode, setInResizeMode] = useState<boolean>(false);
    const [unpackedRectangles, setUnpackedRectangles] = useState<
        { id: string; w: number; h: number; x: number; y: number }[]
    >([]);
    const [maxY, setMaxY] = useState<number>(0);

    useEffect(() => {
        // Get dimensions from local storage
        const storedWidth = localStorage.getItem("containerWidth");
        const storedHeight = localStorage.getItem("containerHeight");
        console.log(storedWidth, storedHeight);

        // If dimensions exist in local storage, use them. Otherwise, use default values
        const initialWidth = storedWidth ? parseInt(storedWidth) : 800;
        const initialHeight = storedHeight ? parseInt(storedHeight) : 800;

        setContainerWidth(initialWidth);
        setContainerHeight(initialHeight);
    }, []);

    useEffect(() => {
        // Store dimensions in local storage whenever they change
        if (containerWidth === 0 || containerHeight === 0) return;
        localStorage.setItem("containerWidth", containerWidth.toString());
        localStorage.setItem("containerHeight", containerHeight.toString());
    }, [containerWidth, containerHeight]);

    useEffect(() => {
        if (!boxes || boxes.length === 0) return;
        boxes.forEach((boxSet, canvasIndex) => {
            const canvas = canvasRefs[canvasIndex].current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw the bounding box around the canvas
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            boxSet.forEach((box) => {
                const correspondingFile = uploadedFiles.find(
                    (f) => f.id === box.id
                );
                if (!correspondingFile) return;

                const img = new Image();

                img.onload = () => {
                    if (box.rotated) {
                        // Translate to the position where you want the top-left corner of the rotated image
                        ctx.translate(box.x, box.y + box.h);
                        // Rotate the context
                        ctx.rotate(-Math.PI / 2); // Rotate 90 degrees anticlockwise
                        // Draw the image with its top-left corner at the origin
                        ctx.drawImage(img, 0, 0, box.h, box.w); // Note the swapped width and height
                        // Draw a border around the image
                        ctx.strokeStyle = "red";
                        ctx.strokeRect(0, 0, box.h, box.w); // Note the swapped width and height
                        // Reset the transformation matrix to the identity matrix
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                    } else {
                        ctx.drawImage(img, box.x, box.y, box.w, box.h);
                        ctx.strokeStyle = "red";
                        ctx.strokeRect(box.x, box.y, box.w, box.h);
                    }
                };

                img.src = URL.createObjectURL(correspondingFile.file);
            });
        });
    }, [boxes, uploadedFiles, canvasRefs]);

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
            // let remainingRectangles = boxesFromImages;
            // const allPackedBoxes: Box[][] = [];

            // while (remainingRectangles.length > 0) {
            //     const { packed_rectangles, unpacked_rectangles } = pack(
            //         remainingRectangles,
            //         {
            //             w: containerWidth,
            //             h: containerHeight,
            //         },
            //         PADDING
            //     );

            //     allPackedBoxes.push(packed_rectangles);
            //     remainingRectangles = unpacked_rectangles;
            // }

            // setBoxes(allPackedBoxes);
            // setCanvasRefs(
            //     allPackedBoxes.map(() => React.createRef<HTMLCanvasElement>())
            // );
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
        setCanvasRefs(
            allPackedBoxes.map(() => React.createRef<HTMLCanvasElement>())
        );
    };

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
                {boxes.length === canvasRefs.length &&
                    boxes.map((boxSet, index) => (
                        <canvas
                            key={index}
                            ref={canvasRefs[index]}
                            width={containerWidth}
                            height={containerHeight}
                            style={{
                                width: `${containerWidth}px`,
                                height: `${containerHeight}px`,
                            }}
                            className="border border-gray-400 shadow w-fit"
                        ></canvas>
                    ))}
            </div>
            <footer className="mt-10 border-t ">
                <div className="text-sm text-center text-gray-500">
                    <p>
                        Made with{" "}
                        <span role="img" aria-label="heart">
                            ❤️
                        </span>{" "}
                        by saifullah rahman (sciSaif)
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ImagePacker;
