import React, { useEffect, useState } from "react";

import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import { handlePrintMultipleStages, packBoxes, saveAsPDF } from "./utils";
import Konva from "konva";
import ResizingWindow from "./components/resizingWindow/ResizingWindow";
import { useWindowResize } from "../../hooks/useWindowResize";
import Button from "../../components/Button";
import FileDropArea from "./components/FileDropArea";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    resetState,
    setContainer,
    setImagesLoaded,
    setInResizeMode,
    setIsPacking,
    setIsResizingAgain,
} from "../../redux/features/slices/mainSlice";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
export interface ImageBox {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
    imageElement?: HTMLImageElement;
    rotated?: boolean;
    new?: boolean;
}
const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    const { container, inResizeMode, imagesLoaded, showBorder } =
        useAppSelector((state) => state.main);

    const [boxes, setBoxes] = useState<ImageBox[][]>([]);
    const [images, setImages] = useState<ImageBox[]>([]);

    const stageRefs = boxes.map(() => React.createRef<Konva.Stage>());

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
                        console.log("all images loaded");

                        dispatch(setImagesLoaded(true));
                    }
                };

                if (!correspondingFile.file) return;
                img.src = URL.createObjectURL(correspondingFile.file);
            });
        });
    }, [boxes, images]);

    const [loading, setLoading] = useState<boolean>(false);

    const startPacking = async () => {
        dispatch(setIsPacking(true));
        setLoading(true);
        dispatch(setInResizeMode(false));

        const packedBoxes = await packBoxes({
            images,
            container,
        });

        setIsPacking(false);
        setBoxes(packedBoxes);
        setLoading(false);
    };

    const containerWrapper = React.useRef<HTMLDivElement>(null);

    const windowWidth = useWindowResize();

    const updateScaleFactor = () => {
        if (!containerWrapper.current) return;

        const containerWrapperWidth = containerWrapper.current.clientWidth;
        const columns = windowWidth >= 768 ? 2 : 1;
        // const columns = 2;
        let gridCellWidth = containerWrapperWidth / columns;

        // Subtract any grid gap if applicable
        const gap = 20;
        gridCellWidth -= gap;

        const scaleFactor = gridCellWidth / container.w;

        dispatch(setContainer({ ...container, scaleFactor }));
    };

    useEffect(() => {
        updateScaleFactor();
    }, [containerWrapper, windowWidth]); // Depend on windowWidth

    const reset = () => {
        setImages([]);
        setBoxes([]);
        dispatch(resetState());
        updateScaleFactor();
    };

    const [loadingPDF, setLoadingPDF] = useState<boolean>(false);

    const handlePdfSave = async () => {
        setLoadingPDF(true);
        console.log("saving pdf");

        await saveAsPDF({ boxes, container, showBorder });
        console.log("pdf saved3");

        setLoadingPDF(false);
    };

    return (
        <main className="flex flex-col pb-10 gap-2 px-2 py-2 mx-auto max-w-[1050px] items-center">
            <div className="flex flex-col justify-center mt-10 text-center">
                <h1 className="mb-2 text-xl font-semibold">
                    Smart Image Printing Simplified: Introducing pack4print!
                </h1>
                <p>
                    Effortlessly optimize your image printing with pack4print!
                    Upload, customize, and let our powerful algorithm
                    intelligently pack your images onto paper, minimizing waste
                    and maximizing efficiency. Create, download, and print with
                    ease. Try it now for a seamless printing experience!
                </p>
                <div>
                    <Link
                        to={"/about"}
                        className="font-semibold text-secondary-800 hover:text-secondary-700 hover:underline"
                    >
                        Click here
                    </Link>{" "}
                    for Instructions
                </div>
            </div>
            <FileDropArea
                images={images}
                setBoxes={setBoxes}
                setImages={setImages}
            />

            <div className="flex flex-wrap gap-2 py-2 mt-5 w-fit ">
                {inResizeMode && images.length > 0 && (
                    <Button onClick={() => startPacking()} className="">
                        Start packing
                    </Button>
                )}

                {boxes.length > 0 &&
                    container &&
                    (loadingPDF ? (
                        <div className="flex flex-row items-center justify-center gap-2 px-2 py-2 text-white bg-green-500 hover:bg-green-600">
                            creating PDF
                            <ClipLoader color="white" size={16} />
                        </div>
                    ) : (
                        <Button
                            onClick={handlePdfSave}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Save as PDF
                        </Button>
                    ))}

                {boxes.length > 0 && (
                    <Button
                        onClick={() =>
                            handlePrintMultipleStages(
                                stageRefs.map((ref) => ref.current)
                            )
                        }
                        className="bg-purple-500 hover:bg-purple-600"
                    >
                        Print
                    </Button>
                )}
                {!inResizeMode && boxes?.length > 0 && (
                    <Button
                        onClick={() => {
                            dispatch(setIsResizingAgain(true));
                            dispatch(setInResizeMode(true));
                            dispatch(setImagesLoaded(false));
                            setBoxes([]);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600"
                    >
                        Resize images
                    </Button>
                )}

                {images?.length > 0 && !loading && (
                    <Button
                        onClick={reset}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Reset
                    </Button>
                )}
            </div>
            {loading && (
                <div className="flex flex-col items-center justify-center py-10 text-green-900 gap-y-2">
                    {/* Packing your images... */}
                    <ClipLoader color="#134e4a" size={50} />
                    <p className="text-2xl font-semibold">
                        Packing your images
                    </p>
                </div>
            )}

            <div
                ref={containerWrapper}
                className="flex flex-wrap w-full items-center justify-center   max-w-[1050px] gap-y-10 gap-x-5 "
                style={{ overscrollBehavior: "auto" }}
            >
                {inResizeMode && (
                    <ResizingWindow setImages={setImages} images={images} />
                )}

                {boxes.map((boxSet, index) => (
                    <Stage
                        key={index}
                        ref={stageRefs[index]}
                        width={container.w * container.scaleFactor}
                        height={container.h * container.scaleFactor}
                        className="bg-white border border-gray-400 shadow w-fit"
                        style={{ touchAction: "auto" }}
                        preventDefault={false}
                    >
                        <Layer preventDefault={false}>
                            {boxSet.map((box) => (
                                <React.Fragment key={box.id}>
                                    {imagesLoaded && (
                                        <>
                                            <KonvaImage
                                                preventDefault={false}
                                                x={
                                                    box.x *
                                                    container.scaleFactor
                                                }
                                                y={
                                                    box.y *
                                                    container.scaleFactor
                                                }
                                                width={
                                                    (box.rotated
                                                        ? box.h
                                                        : box.w) *
                                                    container.scaleFactor
                                                }
                                                height={
                                                    (box.rotated
                                                        ? box.w
                                                        : box.h) *
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
                                            {/* show border if showBorder is true */}
                                            {showBorder && (
                                                <Rect
                                                    preventDefault={false}
                                                    x={
                                                        box.x *
                                                        container.scaleFactor
                                                    }
                                                    y={
                                                        box.y *
                                                        container.scaleFactor
                                                    }
                                                    width={
                                                        (box.rotated
                                                            ? box.h
                                                            : box.w) *
                                                        container.scaleFactor
                                                    }
                                                    height={
                                                        (box.rotated
                                                            ? box.w
                                                            : box.h) *
                                                        container.scaleFactor
                                                    }
                                                    stroke="black"
                                                    strokeWidth={1}
                                                    rotation={
                                                        box.rotated ? -90 : 0
                                                    }
                                                    offsetX={
                                                        box.rotated
                                                            ? box.h *
                                                              container.scaleFactor
                                                            : 0
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </Layer>
                    </Stage>
                ))}
            </div>
            <div id="temp-container" style={{ display: "none" }}></div>
        </main>
    );
};

export default Home;
