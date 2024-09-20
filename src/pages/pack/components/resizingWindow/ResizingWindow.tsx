import React, { useState } from "react";
import useResizeImage from "../../../../hooks/useImageResizer";
import useMargin from "../../../../hooks/useMargin";
import { positionImages } from "./utils";
import MarginHandles from "./components/MarginHandles";
import {
    Margin,
    setContainer,
    setShowBorder,
} from "../../../../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import LabelInput from "../../../../components/LabelInput";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import ResizeAnchor from "./components/ResizeAnchor";
import { ImageBox } from "../../Pack";

export interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
    new?: boolean;
}

interface Props {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const ResizingWindow: React.FC<Props> = ({ images, setImages }) => {
    const dispatch = useAppDispatch();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container, showBorder } = useAppSelector((state) => state.main);
    // Function to toggle the margin controls
    const toggleMarginControls = () => {
        setShowMarginControls(!showMarginControls);
    };

    const {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        imageUrls,
        selectedId,
        setMaxY,
    } = useResizeImage({
        containerRef,
        images,
        setImages,
    });

    const handleMarginChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        side: keyof Margin
    ) => {
        const newMarginValue = parseInt(e.target.value, 10);
        const newContainer = {
            ...container,
            margin: {
                ...container.margin,
                [side]: isNaN(newMarginValue) ? 0 : newMarginValue,
            },
        };

        dispatch(setContainer(newContainer));

        const { _localImages, _maxY } = positionImages(
            localImages,
            newContainer
        );
        setLocalImages(_localImages);
        setMaxY(Math.max(container.h, _maxY));
    };

    const { handleMarginDragStart } = useMargin({
        localImages,
        setLocalImages,
        setMaxY,

        containerRef,
    });

    return (
        <div className="flex flex-col items-center justify-center w-full pt-5 border-t">
            <div className="mb-4">
                <p className="text-sm text-center text-gray-600">
                    Click on the image and use the resize handle to resize the
                    images. Take reference from the A4 paper width below and
                    decide what size you want each image to be.
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4 wrap ">
                <button
                    onClick={toggleMarginControls}
                    className="px-2 py-2   text-sm w-[150px] text-black bg-slate-100 rounded  hover:bg-slate-200 shadow"
                >
                    {showMarginControls ? "Hide Margins" : "Show Margins"}
                </button>
                <LabelInput
                    type="number"
                    label="Padding"
                    min={0}
                    max={30}
                    value={container.padding}
                    onChange={(e) => {
                        let padding = parseInt(e.target.value, 10);
                        if (isNaN(padding)) padding = 0;
                        dispatch(
                            setContainer({
                                ...container,
                                padding,
                            })
                        );
                    }}
                />

                {/* show border button*/}
                <button
                    onClick={() => {
                        dispatch(setShowBorder(!showBorder));
                    }}
                    className="px-2 py-2   text-sm w-[150px] text-black bg-slate-100 rounded  hover:bg-slate-200 shadow"
                >
                    {showBorder ? "Hide Border" : "Show Border"}
                </button>
            </div>
            {showMarginControls && (
                <div className="flex flex-col items-center justify-center w-full mb-10 border-t  border-b gap-y-2 max-w-[450px]">
                    {/* margin controls */}
                    <div className="flex flex-row text-sm text-center text-gray-500 gap-x-2">
                        <InformationCircleIcon className="w-10 h-10 mr-1" />
                        <p>
                            Most browser's print feature also allows you to set
                            custom margins. You can leave the margins at 0 if
                            you want.
                        </p>
                    </div>

                    <div className="mr-1">Margin: </div>
                    <div className="grid w-full grid-cols-2 gap-1 md:grid-cols-4">
                        <LabelInput
                            type="number"
                            label="top"
                            value={container.margin.top}
                            onChange={(e) => handleMarginChange(e, "top")}
                        />
                        <LabelInput
                            type="number"
                            label="left"
                            value={container.margin.left}
                            onChange={(e) => handleMarginChange(e, "left")}
                        />
                        <LabelInput
                            type="number"
                            label="right"
                            value={container.margin.right}
                            onChange={(e) => handleMarginChange(e, "right")}
                        />

                        <LabelInput
                            type="number"
                            label="bottom"
                            value={container.margin.bottom}
                            onChange={(e) => handleMarginChange(e, "bottom")}
                        />
                    </div>
                </div>
            )}
            <div
                ref={containerRef}
                style={{
                    width: container.w * container.scaleFactor,
                    height: (maxY + 5) * container.scaleFactor,
                    border: "1px solid black",
                    position: "relative",
                }}
                className="mt-10 bg-white shadow-xl"
            >
                <div className="absolute flex flex-row items-center w-full h-10 -top-12 ">
                    <div className="w-full h-[1px] bg-gray-500 relative ">
                        <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -left-[6px]"></div>
                    </div>
                    <div className="px-2 text-sm text-center whitespace-nowrap ">
                        {container.paperSize.name} Paper Width
                    </div>
                    <div className="w-full h-[1px] bg-gray-500 relative">
                        <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -right-[6px]"></div>
                    </div>
                </div>

                {showMarginControls && (
                    <MarginHandles
                        handleMarginDragStart={handleMarginDragStart}
                    />
                )}

                {maxY > container.h * container.scaleFactor && (
                    <div
                        className="absolute w-full bg-gray-300 "
                        style={{
                            top: container.h * container.scaleFactor,
                            height: 1,
                        }}
                    >
                        <p className="absolute text-[8px] opacity-50 -top-3 right-1">
                            Page End
                        </p>
                    </div>
                )}

                {localImages.map((imgData, index) => {
                    const imageUrl = imageUrls.get(imgData.id) || "";

                    return (
                        <div
                            key={imgData.id}
                            data-id={imgData.id}
                            style={{
                                position: "absolute",
                                left: imgData.x * container.scaleFactor,
                                top: imgData.y * container.scaleFactor,
                                width: imgData.w * container.scaleFactor,
                                height: imgData.h * container.scaleFactor,
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: "cover",
                                border:
                                    selectedId === imgData.id
                                        ? "2px solid blue"
                                        : showBorder
                                        ? "1px solid black"
                                        : "none",
                                // overflow: "hidden",
                            }}
                            onMouseDown={(e) => handleMouseDown(e, imgData)}
                            onTouchStart={(e) => handleMouseDown(e, imgData)}
                        >
                            {selectedId === imgData.id && <ResizeAnchor />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResizingWindow;
