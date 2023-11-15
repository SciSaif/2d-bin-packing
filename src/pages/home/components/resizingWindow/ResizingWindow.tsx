import React, { useState } from "react";
import useResizeImage from "../../../../hooks/useImageResizer";
import useMargin from "../../../../hooks/useMargin";
import { positionImages } from "./utils";
import MarginHandles from "./components/MarginHandles";
import {
    Margin,
    setContainer,
} from "../../../../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ImageBox } from "../../Home";

export interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
}

interface Props {
    startWithMaxHalfWidth?: boolean; // if true, the images will initially have at most half the width of the container
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const ResizingWindow: React.FC<Props> = ({
    startWithMaxHalfWidth = true,
    images,
    setImages,
}) => {
    const dispatch = useAppDispatch();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container } = useAppSelector((state) => state.main);
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
        startWithMaxHalfWidth,
        images,
        setImages,
    });

    console.log("localImages", localImages);

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
        <div className="flex flex-col justify-center mx-auto w-fit">
            <button
                onClick={toggleMarginControls}
                className="px-2 py-1 mx-auto mb-5 text-white bg-purple-500 rounded w-fit hover:bg-purple-600"
            >
                {showMarginControls ? "Remove Margin" : "Add Margin"}
            </button>
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
                                    className="resize-handle" // Add this class
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        bottom: 0,
                                        width: 16,
                                        height: 16,
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
