import React, { TouchEvent, useEffect, useRef, useState } from "react";
import { positionImages } from "../pages/imagePacker/utils";
import { ContainerType, Margin } from "../pages/imagePacker/ImagePacker";
import useResizeImage from "../hooks/useImageResizer";
import useMargin from "../hooks/useMargin";

export interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
}

interface Props {
    images: ImageData[];
    setImages: (images: ImageData[]) => void;
    container: ContainerType;
    setContainer: (container: ContainerType) => void;
    startWithMaxHalfWidth?: boolean; // if true, the images will initially have at most half the width of the container
}

const ResizingWindow: React.FC<Props> = ({
    images,
    setImages,
    container,
    setContainer,
    startWithMaxHalfWidth = true,
}) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        imageUrls,
        selectedId,
        setMaxY,
    } = useResizeImage({
        images,
        container,
        setImages,
        containerRef,
        startWithMaxHalfWidth,
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

        setContainer(newContainer);

        const { _localImages, _maxY } = positionImages(
            localImages,
            newContainer
        );
        setLocalImages(_localImages);
        setMaxY(_maxY);
    };

    const { handleMarginDragStart } = useMargin({
        container,
        setContainer,
        localImages,
        setLocalImages,
        setMaxY,
        containerRef,
    });

    return (
        <div>
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
            <div
                ref={containerRef}
                style={{
                    width: container.w * container.scaleFactor,
                    height: (maxY + 5) * container.scaleFactor,
                    border: "1px solid black",
                    position: "relative",
                }}
                className="ml-5 bg-white "
            >
                {/* left margin handle  */}
                <div
                    className="absolute w-5 h-5 -translate-x-1/2 bg-blue-500 cursor-pointer -top-5"
                    style={{
                        left: container.margin.left * container.scaleFactor,
                    }}
                    onMouseDown={(e) => handleMarginDragStart(e, "left")}
                    onTouchStart={(e) => handleMarginDragStart(e, "left")}
                ></div>
                {/* right margin handle  */}
                <div
                    className="absolute w-5 h-5 translate-x-1/2 bg-blue-500 cursor-pointer -top-5 "
                    style={{
                        right: container.margin.right * container.scaleFactor,
                    }}
                    onMouseDown={(e) => handleMarginDragStart(e, "right")}
                    onTouchStart={(e) => handleMarginDragStart(e, "right")}
                ></div>
                {/* top margin handle  */}
                <div
                    className="absolute w-5 h-5 -translate-y-1/2 bg-blue-500 cursor-pointer -right-5 "
                    style={{
                        top: container.margin.top * container.scaleFactor,
                    }}
                    onMouseDown={(e) => handleMarginDragStart(e, "top")}
                    onTouchStart={(e) => handleMarginDragStart(e, "top")}
                ></div>

                {/* margin lines */}
                <div
                    className="absolute w-full  top-0 bg-gray-200"
                    style={{
                        height: container.margin.top * container.scaleFactor,
                    }}
                ></div>
                <div
                    className="absolute h-full left-0   bg-gray-200"
                    style={{
                        width: container.margin.left * container.scaleFactor,
                    }}
                ></div>

                <div
                    className="absolute h-full right-0 bg-gray-200"
                    style={{
                        width: container.margin.right * container.scaleFactor,
                    }}
                ></div>

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
