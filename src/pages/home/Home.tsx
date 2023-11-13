import React, { useEffect, useMemo, useState } from "react";

import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import {
    createImages,
    handlePrintMultipleStages,
    handleSaveAsPDF,
    packBoxes,
} from "./utils";
import Konva from "konva";
import { Link } from "react-router-dom";
import ResizingWindow from "./components/resizingWindow/ResizingWindow";
import useDragAndDrop from "../../hooks/useDragDrop";
import { twMerge } from "tailwind-merge";

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

const defaultContainer: ContainerType = {
    w: 595 * 2,
    h: 842 * 2,
    scaleFactor: 0.3,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: 5,
};

const Home: React.FC = () => {
    const [container, setContainer] = useState<ContainerType>(defaultContainer);

    const [images, setImages] = useState<ImageBox[]>([]);
    const [boxes, setBoxes] = useState<ImageBox[][]>([]);
    const [isPacking, setIsPacking] = useState(false);

    const stageRefs = boxes.map(() => React.createRef<Konva.Stage>());

    const [inResizeMode, setInResizeMode] = useState<boolean>(false);
    const [resizingAgain, setResizingAgain] = useState<boolean>(false);

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

    const containerWrapper = React.useRef<HTMLDivElement>(null);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures this effect runs only once at mount

    const updateScaleFactor = () => {
        if (!containerWrapper.current) return;

        const containerWrapperWidth = containerWrapper.current.clientWidth;
        const columns = windowWidth >= 768 ? 2 : 1;
        let gridCellWidth = containerWrapperWidth / columns;

        // Subtract any grid gap if applicable
        const gap = 10;
        gridCellWidth -= gap;

        const scaleFactor = gridCellWidth / container.w;

        setContainer((prev) => ({
            ...prev,
            scaleFactor,
        }));
    };

    useEffect(() => {
        updateScaleFactor();
    }, [containerWrapper, windowWidth]); // Depend on windowWidth

    const {
        dragging,
        files,
        handleDragOver,
        handleDrop,
        mainRef,
        setFiles,
        handlePaste,
        fileInputRef,
        triggerFileInput,
        handleFileInputChange,
    } = useDragAndDrop();

    const [filesUpdated, setFilesUpdated] = useState<boolean>(false);

    // Modify handleImageUpload to handle files from both drag-and-drop and file input
    const handleImageUpload = async (uploadedFiles: File[]) => {
        const newImages = await createImages(uploadedFiles);
        setImages([...images, ...newImages]);
        setInResizeMode(true);
        setFilesUpdated((prev) => !prev);
    };

    // Call handleImageUpload when files state changes
    useEffect(() => {
        if (files && files.length > 0) {
            handleImageUpload(files);
        }
    }, [files]);

    const reset = () => {
        setBoxes([]);
        setImages([]);
        setImagesLoaded(false);
        setInResizeMode(false);
        setContainer(defaultContainer);
        setFiles([]);
        setResizingAgain(false);
        updateScaleFactor();
    };
    const removeImage = (id: any) => {
        setImages(images.filter((image) => image.id !== id));
        setFilesUpdated((prev) => !prev);
    };

    const imagePreviews = useMemo(() => {
        return images.map((image) => (
            <div
                key={image.id}
                className="inline-flex flex-col items-center p-2"
            >
                {image.file && (
                    <img
                        src={URL.createObjectURL(image.file)}
                        alt="Preview"
                        className="object-cover w-14 h-14"
                    />
                )}
                <button
                    onClick={() => removeImage(image.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    &#10005; {/* Cross Icon */}
                </button>
            </div>
        ));
    }, [images, filesUpdated]); // Dependency on images and filesUpdated

    return (
        <div className="flex flex-col gap-2 px-2 py-2 mx-auto max-w-[1000px] items-center">
            {images?.length > 0 && (
                <button
                    onClick={reset}
                    className="px-10 py-1 text-white bg-green-500 rounded w-fit hover:bg-green-600"
                >
                    Reset
                </button>
            )}

            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
                ref={mainRef}
                className={twMerge(
                    "w-full border-2 flex flex-col border-tertiary/50 cursor-pointer border-dashed  rounded-xl  bg-gray-100 shadow mt-10   ",
                    dragging && "border-blue-500 bg-sky-100"
                )}
            >
                <div
                    onClick={triggerFileInput}
                    className="flex items-center justify-center flex-grow min-h-[200px] w-full text-xl font-bold text-tertiary/50"
                >
                    Drop your images here{" "}
                </div>
                {images.length > 0 && (
                    <div className="mx-2 border-t ">
                        {/* show preview of images here with option to remove them */}
                        {images.length > 0 && (
                            <div className="mx-2 border-t">{imagePreviews}</div>
                        )}
                        {/* {images.length > 0 && (
                            <div className="mx-2 border-t">
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="inline-flex flex-col items-center p-2"
                                    >
                                        {image.file && (
                                            <img
                                                src={URL.createObjectURL(
                                                    image.file
                                                )}
                                                alt="Preview"
                                                className="object-cover w-14 h-14"
                                            />
                                        )}
                                        <button
                                            onClick={() =>
                                                removeImage(image.id)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            &#10005;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </div>
                )}
            </div>
            {/* Hidden file input */}
            <input
                type="file"
                multiple
                onChange={handleFileInputChange}
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
            />

            {inResizeMode && (
                <button
                    onClick={() => startPacking()}
                    className="px-10 py-1 text-white bg-blue-500 rounded w-fit hover:bg-blue-600"
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
                        setResizingAgain(true);
                        setInResizeMode(true);
                        setImagesLoaded(false);
                        setBoxes([]);
                    }}
                    className="px-10 py-2 mt-4 text-white bg-yellow-500 rounded w-fit hover:bg-yellow-600"
                >
                    Resize images
                </button>
            )}

            {loading && (
                <div className="py-10 text-2xl text-green-900 ">
                    Packing your images...
                </div>
            )}

            <div
                ref={containerWrapper}
                className="grid w-full grid-cols-1  md:grid-cols-1 items-center justify-center  max-w-[1000px] gap-y-10 gap-x-5 "
            >
                {inResizeMode && (
                    <ResizingWindow
                        container={container}
                        images={images}
                        setImages={setImages}
                        setContainer={setContainer}
                        startWithMaxHalfWidth={!resizingAgain}
                        filesUpdated={filesUpdated}
                    />
                )}

                {boxes.map((boxSet, index) => (
                    <Stage
                        key={index}
                        ref={stageRefs[index]}
                        width={container.w * container.scaleFactor}
                        height={container.h * container.scaleFactor}
                        className="border border-gray-400 shadow w-fit"
                    >
                        <Layer>
                            <Rect
                                x={0}
                                y={0}
                                width={container.w * container.scaleFactor}
                                height={container.h * container.scaleFactor}
                                stroke="black"
                                fill="white"
                            />
                            {boxSet.map((box) => (
                                <React.Fragment key={box.id}>
                                    {imagesLoaded && (
                                        <KonvaImage
                                            x={box.x * container.scaleFactor}
                                            y={box.y * container.scaleFactor}
                                            width={
                                                (box.rotated ? box.h : box.w) *
                                                container.scaleFactor
                                            }
                                            height={
                                                (box.rotated ? box.w : box.h) *
                                                container.scaleFactor
                                            }
                                            image={box.imageElement}
                                            rotation={box.rotated ? -90 : 0}
                                            offsetX={
                                                box.rotated
                                                    ? box.h *
                                                      container.scaleFactor
                                                    : 0
                                            }
                                        />
                                    )}

                                    {/* <Rect
                                        x={box.x * container.scaleFactor}
                                        y={box.y * container.scaleFactor}
                                        width={box.w * container.scaleFactor}
                                        height={box.h * container.scaleFactor}
                                        stroke="red"
                                    /> */}
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

export default Home;
