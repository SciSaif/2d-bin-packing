import React, { useEffect, useState } from "react";

import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
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
import { ClipLoader } from "react-spinners";
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
const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    const { container, isResizingAgain, inResizeMode, imagesLoaded } =
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
        await saveAsPDF({ boxes, container });
        setLoadingPDF(false);
    };

    return (
        <div className="flex flex-col gap-2 px-2 py-2 mx-auto max-w-[1050px] items-center">
            <FileDropArea
                images={images}
                setBoxes={setBoxes}
                setImages={setImages}
            />

            <div className="flex flex-wrap gap-2 py-2 mt-5 w-fit ">
                {inResizeMode && (
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

                {images?.length > 0 && (
                    <Button
                        onClick={reset}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        Reset
                    </Button>
                )}
            </div>
            {loading && (
                <div className="py-10 text-2xl text-green-900 ">
                    Packing your images...
                </div>
            )}

            <div
                ref={containerWrapper}
                className="flex flex-wrap w-full items-center justify-center  max-w-[1050px] gap-y-10 gap-x-5 "
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
