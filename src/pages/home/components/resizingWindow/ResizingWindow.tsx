import React, { useState } from "react";
import useResizeImage from "../../../../hooks/useImageResizer";
import useMargin from "../../../../hooks/useMargin";
import { positionImages } from "./utils";
import MarginHandles from "./components/MarginHandles";
import {
    Margin,
    setContainer,
    setStartingMaxWidthFactor,
} from "../../../../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ImageBox } from "../../Home";
import LabelInput from "../../../../components/LabelInput";

export interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
}

interface Props {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const ResizingWindow: React.FC<Props> = ({ images, setImages }) => {
    const dispatch = useAppDispatch();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container, startingMaxWidthFactor } = useAppSelector(
        (state) => state.main
    );
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
        // resizeImagesWithMaxWidth,
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
        setMaxY(_maxY);
    };

    const { handleMarginDragStart } = useMargin({
        localImages,
        setLocalImages,
        setMaxY,
        containerRef,
    });

    return (
        <div className="flex flex-col items-center justify-center w-full pt-5 mx-auto border-t">
            <div className="mb-4">
                <p className="text-sm text-center text-gray-600">
                    Click on the image and use the resize handle to resize the
                    images. Take reference from the A4 paper width below and
                    decide what size you want each image to be.
                </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2 mb-4">
                <button
                    onClick={toggleMarginControls}
                    className="px-2 py-2   text-sm w-[150px] text-white bg-purple-500 rounded  hover:bg-purple-600"
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
            </div>
            {showMarginControls && (
                <div className="mb-10 border-t border-b">
                    {/* margin controls */}
                    <div>Margin: </div>
                    <label>
                        Top:
                        <input
                            type="number"
                            value={container.margin.top}
                            onChange={(e) => handleMarginChange(e, "top")}
                        />
                    </label>
                    <label>
                        Right:
                        <input
                            type="number"
                            value={container.margin.right}
                            onChange={(e) => handleMarginChange(e, "right")}
                        />
                    </label>
                    <label>
                        Bottom:
                        <input
                            type="number"
                            value={container.margin.bottom}
                            onChange={(e) => handleMarginChange(e, "bottom")}
                        />
                    </label>
                    <label>
                        Left:
                        <input
                            type="number"
                            value={container.margin.left}
                            min={0}
                            max={200}
                            onChange={(e) => handleMarginChange(e, "left")}
                        />
                    </label>
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
                className="bg-white "
            >
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
                                        : "none",
                                // overflow: "hidden",
                            }}
                            onMouseDown={(e) => handleMouseDown(e, imgData)}
                            onTouchStart={(e) => handleMouseDown(e, imgData)}
                        >
                            {selectedId === imgData.id && (
                                <div
                                    className="resize-handle w-[25px] h-[25px] md:w-[16px] md:h-[16px]"
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 0,

                                        backgroundColor: "white",
                                        cursor: "se-resize",
                                        border: "1px solid blue",
                                    }}
                                ></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResizingWindow;
