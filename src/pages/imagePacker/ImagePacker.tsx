import React, { useEffect, useState } from "react";

import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import {
    createImages,
    handlePrintMultipleStages,
    handleSaveAsPDF,
    packBoxes,
} from "./utils";
import Konva from "konva";
import { Link } from "react-router-dom";
import ResizingWindow from "../../components/ResizingWindow";

export interface ImageBox {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
    imageElement?: HTMLImageElement;
    rotated?: boolean;
}
export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface ContainerType {
    w: number;
    h: number;
    scaleFactor: number;
    margin: Margin;
    padding: number;
}

const ImagePacker: React.FC = () => {
    const [container, setContainer] = useState<ContainerType>({
        w: 595 * 2,
        h: 842 * 2,
        scaleFactor: 0.5,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: 5,
    });

    const [scaleFactor, setScaleFactor] = useState(0.5);

    const [images, setImages] = useState<ImageBox[]>([]);
    const [boxes, setBoxes] = useState<ImageBox[][]>([]);
    const [isPacking, setIsPacking] = useState(false);

    const stageRefs = boxes.map(() => React.createRef<Konva.Stage>());

    const [inResizeMode, setInResizeMode] = useState<boolean>(false);

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
                console.log(box);

                const correspondingFile = images.find((f) => f.id === box.id);

                if (!correspondingFile) return;

                const img = new window.Image();
                img.onload = () => {
                    box.imageElement = img;
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                };

                if (!correspondingFile.file) return;
                img.src = URL.createObjectURL(correspondingFile.file);
            });
        });
    }, [boxes, images]);

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            const newImages = await createImages(event.target.files);
            setImages([...images, ...newImages]);
            setInResizeMode(true);
        }
    };

    const [loading, setLoading] = useState<boolean>(false);

    const startPacking = async () => {
        setIsPacking(true);
        setLoading(true);
        setInResizeMode(false);

        const packedBoxes = await packBoxes({
            images,
            container,
        });

        setIsPacking(false);
        setBoxes(packedBoxes);
        setLoading(false);
    };

    const reset = () => {
        setBoxes([]);
        setImages([]);
        setImagesLoaded(false);
        setInResizeMode(false);
    };

    return (
        <div className="flex flex-col gap-2 px-2 py-2">
            <Link
                to={"/"}
                className="pb-2 mb-2 text-3xl font-bold border-b text-cyan-500"
            >
                Bin Packing
            </Link>

            {images?.length === 0 ? (
                <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    accept="image/*"
                />
            ) : (
                <button
                    onClick={reset}
                    className="px-10 py-2 text-white bg-green-500 rounded w-fit hover:bg-green-600"
                >
                    Reset
                </button>
            )}
            {inResizeMode && (
                <button
                    onClick={() => startPacking()}
                    className="px-10 py-2 text-white bg-blue-500 rounded w-fit hover:bg-blue-600"
                >
                    Start packing
                </button>
            )}

            {boxes.length > 0 && container && (
                <button
                    onClick={() =>
                        handleSaveAsPDF({
                            boxes,
                            container,
                        })
                    }
                    className="px-10 py-2 mt-4 text-white bg-green-500 rounded w-fit hover:bg-green-600"
                >
                    Save as PDF
                </button>
            )}

            {boxes.length > 0 && (
                <button
                    onClick={() =>
                        handlePrintMultipleStages(
                            stageRefs.map((ref) => ref.current)
                        )
                    }
                    className="px-10 py-2 mt-4 text-white bg-purple-500 rounded w-fit hover:bg-purple-600"
                >
                    Print Canvases
                </button>
            )}
            {!inResizeMode && boxes?.length > 0 && (
                <button
                    onClick={() => {
                        setInResizeMode(true);
                        setImagesLoaded(false);
                        setBoxes([]);
                    }}
                    className="px-10 py-2 mt-4 text-white bg-yellow-500 rounded w-fit hover:bg-yellow-600"
                >
                    Resize images
                </button>
            )}

            {inResizeMode && (
                <ResizingWindow
                    container={container}
                    images={images}
                    setImages={setImages}
                    setContainer={setContainer}
                />
            )}

            {loading && (
                <div className="py-10 text-2xl text-green-900 ">
                    Packing your images...
                </div>
            )}

            <div className="flex flex-wrap w-full gap-10">
                {boxes.map((boxSet, index) => (
                    <Stage
                        key={index}
                        ref={stageRefs[index]}
                        width={container.w * scaleFactor}
                        height={container.h * scaleFactor}
                        className="border border-gray-400 shadow w-fit"
                    >
                        <Layer>
                            <Rect
                                x={0}
                                y={0}
                                width={container.w * scaleFactor}
                                height={container.h * scaleFactor}
                                stroke="black"
                                fill="white"
                            />
                            {boxSet.map((box) => (
                                <React.Fragment key={box.id}>
                                    {imagesLoaded && (
                                        <KonvaImage
                                            x={box.x * scaleFactor}
                                            y={box.y * scaleFactor}
                                            width={
                                                (box.rotated ? box.h : box.w) *
                                                scaleFactor
                                            }
                                            height={
                                                (box.rotated ? box.w : box.h) *
                                                scaleFactor
                                            }
                                            image={box.imageElement}
                                            rotation={box.rotated ? -90 : 0}
                                            offsetX={
                                                box.rotated
                                                    ? box.h * scaleFactor
                                                    : 0
                                            }
                                        />
                                    )}

                                    <Rect
                                        x={box.x * scaleFactor}
                                        y={box.y * scaleFactor}
                                        width={box.w * scaleFactor}
                                        height={box.h * scaleFactor}
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
