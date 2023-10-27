import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { UnpackedRect } from "../binPacking/configuration";
import { pack } from "../binPacking";

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
const PADDING = 10; // 10 pixels padding, adjust as needed

const ImagePacker: React.FC = () => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(1000);
    const [containerHeight, setContainerHeight] = useState<number>(1500);
    const [uploadedFiles, setUploadedFiles] = useState<
        { id: string; file: File }[]
    >([]);

    useEffect(() => {
        if (boxes) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw the bounding box around the canvas
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            boxes.forEach((box, index) => {
                const correspondingFile = uploadedFiles.find(
                    (f) => f.id === box.id
                );
                if (!correspondingFile) return;

                const img = new Image();

                // reduce the opacity to 50%
                img.onload = () => {
                    console.log(box);

                    if (box.rotated) {
                        console.log("rotated");

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
                        console.log("not rotated");
                    }
                };

                img.src = URL.createObjectURL(correspondingFile.file);
            });
        }
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
                        boxesFromImages.push({
                            w: img.width,
                            h: img.height,
                            id,
                        });
                        uploadedFiles.push({ id, file });
                        resolve();
                    };
                    img.src = URL.createObjectURL(file);
                })
            );
        });

        Promise.all(promises).then(() => {
            const packedBoxes = pack(boxesFromImages, {
                w: containerWidth,
                h: containerHeight,
            });
            setBoxes(packedBoxes);
        });
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

            <input type="file" multiple onChange={handleImageUpload} />

            {/* <button
                onClick={goo}
                className="px-10 py-2 text-white rounded shadow w-fit bg-cyan-500 hover:bg-cyan-600"
            >
                Gooo
            </button> */}
            <canvas
                ref={canvasRef}
                width={containerWidth}
                height={containerHeight}
                style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                }}
                className="w-fit"
            ></canvas>

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
