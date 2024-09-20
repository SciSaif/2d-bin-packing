import React, { useEffect, useState } from "react";
import Konva from "konva";
import FileDropArea from "./components/FileDropArea";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    setImagesLoaded,
    setInResizeMode,
    setIsPacking,
} from "../../redux/features/slices/mainSlice";
import { ClipLoader } from "react-spinners";
import ResizingWindow from "./components/resizingWindow/ResizingWindow";
import Content from "./components/Content";

import ActionButtons from "./components/ActionButtons";
import { useScaleFactor } from "../../hooks/useScaleFactor";
import PageStage from "./components/PageStage";
import SettingsPanel from "./components/SettingsPanel";
import { terminateWorkerInstance } from "../../workerUtils";
import Button from "../../components/Button";

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

const Pack = () => {
    const dispatch = useAppDispatch();

    const { inResizeMode, isPacking } = useAppSelector((state) => state.main);

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

    const containerWrapper = React.useRef<HTMLDivElement>(null);

    const updateScaleFactor = useScaleFactor(containerWrapper);

    return (
        <div className="flex flex-col px-2 py-10 sm:px-10">
            <Content noImagesUploaded={images.length === 0} />
            {!isPacking && boxes.length === 0 && (
                <FileDropArea
                    images={images}
                    setBoxes={setBoxes}
                    setImages={setImages}
                />
            )}

            <SettingsPanel />

            <ActionButtons
                boxes={boxes}
                setBoxes={setBoxes}
                images={images}
                setImages={setImages}
                stageRefs={stageRefs}
                updateScaleFactor={updateScaleFactor}
            />

            {isPacking && (
                <div className="flex flex-col items-center justify-center py-10 text-green-900 gap-y-2">
                    <ClipLoader color="#134e4a" size={50} />
                    <p className="text-2xl font-semibold">
                        Packing your images
                    </p>
                </div>
            )}
            {isPacking && (
                // stop button
                <Button
                    onClick={() => {
                        console.log("terminating worker");
                        terminateWorkerInstance();
                        dispatch(setIsPacking(false));
                        dispatch(setInResizeMode(true));
                    }}
                    className="px-2 py-0 underline mx-auto   text-sm  text-black bg-transparent hover:bg-transparent hover:text-red-500 "
                >
                    Stop packing
                </Button>
            )}

            <div
                ref={containerWrapper}
                className="flex flex-wrap w-full items-center justify-center mx-auto   max-w-[1050px] gap-y-10 gap-x-5 "
                style={{ overscrollBehavior: "auto" }}
            >
                {inResizeMode && images?.length > 0 && (
                    <ResizingWindow setImages={setImages} images={images} />
                )}

                {boxes &&
                    boxes.map((boxSet, index) => (
                        <PageStage
                            key={index}
                            boxSet={boxSet}
                            stageRef={stageRefs}
                            index={index}
                        />
                    ))}
            </div>
            <div id="temp-container" style={{ display: "none" }}></div>
        </div>
    );
};

export default Pack;
