import React, { TouchEvent, useEffect, useRef, useState } from "react";
import { positionImages } from "../pages/imagePacker/utils";
import { ContainerType, Margin } from "../pages/imagePacker/ImagePacker";
import useResizeImage from "../hooks/useImageResizer";

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
}

const ResizingWindow: React.FC<Props> = ({
    images,
    setImages,
    container,
    setContainer,
}) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        // set the image urls ( this is done so that we don't have to re-render the images when resizing)
        if (!images.length) return;
        const newImageUrls = new Map<string, string>();
        images.forEach((image) => {
            if (image.file) {
                newImageUrls.set(image.id, URL.createObjectURL(image.file));
            }
        });
        setImageUrls(newImageUrls);

        // position the images in the container

        const { _maxY, _localImages } = positionImages(
            images,
            container,
            10,
            true
        );

        setMaxY(_maxY);
        setLocalImages(_localImages);
    }, []);

    const {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        selectedId,
        setMaxY,
    } = useResizeImage({
        images,
        container,
        setImages,
        containerRef,
    });

    const handleMarginChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        side: keyof Margin
    ) => {
        const newMarginValue = parseInt(e.target.value, 10);
        setContainer({
            ...container,
            margin: {
                ...container.margin,
                [side]: isNaN(newMarginValue) ? 0 : newMarginValue,
            },
        });

        positionImages(localImages, container);
    };

    const [isDraggingMargin, setIsDraggingMargin] = useState(false);

    const handleMarginDragStart = (e: any) => {
        setIsDraggingMargin(true);
    };

    const handleMarginDrag = (e: any) => {
        if (!isDraggingMargin || !containerRef.current) return;

        const clientX = e.type.includes("touch")
            ? e.touches[0].clientX
            : e.clientX;
        const rect = containerRef.current.getBoundingClientRect();
        let newMarginLeft = clientX - rect.left;

        // Constrain the margin value
        newMarginLeft = Math.max(0, newMarginLeft);
        newMarginLeft = Math.min(newMarginLeft, container.w - 20); // Assuming a minimum container width

        setContainer({
            ...container,
            margin: {
                ...container.margin,
                left: newMarginLeft / container.scaleFactor,
            },
        });
    };

    const handleMarginDragEnd = () => {
        // repositionImages(localImages);
        setIsDraggingMargin(false);
    };

    useEffect(() => {
        // console.log("margin changed", container.margin.left);
        if (!isDraggingMargin) return;
        const { _localImages } = positionImages(localImages, container);
        setLocalImages(_localImages);
    }, [container.margin, isDraggingMargin]);

    useEffect(() => {
        if (isDraggingMargin) {
            window.addEventListener("mousemove", handleMarginDrag);
            window.addEventListener("mouseup", handleMarginDragEnd);
            window.addEventListener("touchmove", handleMarginDrag);
            window.addEventListener("touchend", handleMarginDragEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleMarginDrag);
            window.removeEventListener("mouseup", handleMarginDragEnd);
            window.removeEventListener("touchmove", handleMarginDrag);
            window.removeEventListener("touchend", handleMarginDragEnd);
        };
    }, [isDraggingMargin]);

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
                    onMouseDown={handleMarginDragStart}
                    onTouchStart={handleMarginDragStart}
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
