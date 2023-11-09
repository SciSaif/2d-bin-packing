import React, { TouchEvent, useEffect, useState } from "react";
import { Dimension } from "../pages/imagePacker/ImagePacker";
import { positionImages } from "../pages/imagePacker/utils";

export interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    file?: File;
}

interface Props {
    containerDimensions: Dimension;
    images: ImageData[];
    setImages: (images: ImageData[]) => void;
    scaleFactor: number;
}

const ResizingWindow: React.FC<Props> = ({
    containerDimensions,
    images,
    setImages,
    scaleFactor,
}) => {
    const [selectedId, setSelectedId] = useState<null | string>(null);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [localImages, setLocalImages] = useState<ImageData[]>(images);
    const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

    const [maxY, setMaxY] = useState(0);

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
            containerDimensions,
            10,
            true
        );

        setMaxY(_maxY);
        setLocalImages(_localImages);
    }, []);

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        imgData: ImageData
    ) => {
        if (
            e.target instanceof HTMLElement &&
            e.target.classList.contains("resize-handle")
        ) {
            setIsResizing(true);
            setSelectedId(imgData.id);
            return;
        }

        if (selectedId !== imgData.id) {
            setSelectedId(imgData.id);
        }
    };
    useEffect(() => {
        const preventDefaultWhenResizing = (e: globalThis.TouchEvent) => {
            if (isResizing) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", preventDefaultWhenResizing, {
            passive: false,
        });

        return () => {
            document.removeEventListener(
                "touchmove",
                preventDefaultWhenResizing
            );
        };
    }, [isResizing]);

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing && selectedId) {
            const clientX = e.clientX;
            const clientY = e.clientY;

            const updatedImages = updateImageSize(clientX, clientY);
            if (updatedImages) {
                // Call the function to reposition images during resizing
                const repositionedImages = repositionImages(
                    updatedImages,
                    containerDimensions
                );
                // setLocalImages(repositionedImages);
                // Find the currently selected image after repositioning
                const repositionedImage = repositionedImages.find(
                    (img) => img.id === selectedId
                );

                // Check if the shelf position changed for the selected image
                const originalImage = localImages.find(
                    (img) => img.id === selectedId
                );
                if (
                    originalImage &&
                    repositionedImage &&
                    originalImage.y !== repositionedImage.y
                ) {
                    // If the shelf position changed, stop resizing
                    setIsResizing(false);
                    setSelectedId(null);
                }
                setLocalImages(repositionedImages);
            }
        }
    };

    const updateImageSize = (
        clientX: number,
        clientY: number
    ): ImageData[] | null => {
        const selectedImage = localImages.find((img) => img.id === selectedId);
        if (selectedImage && containerRef.current) {
            const aspectRatio = selectedImage.w / selectedImage.h;
            const mouseX = clientX / scaleFactor;
            const mouseY = clientY / scaleFactor; // Assuming you want to scale Y as well

            const rect = containerRef.current.getBoundingClientRect();
            let newWidth = Math.max(20, mouseX - rect.left - selectedImage.x);
            let newHeight = newWidth / aspectRatio;

            // Constrain newWidth and newHeight to not exceed the container's dimensions
            if (newWidth > containerDimensions.w) {
                newWidth = containerDimensions.w;
                newHeight = newWidth / aspectRatio;
            }
            if (newHeight > containerDimensions.h) {
                newHeight = containerDimensions.h;
                newWidth = newHeight * aspectRatio;
            }

            const updatedImages = localImages.map((img) =>
                img.id === selectedId
                    ? { ...img, w: newWidth, h: newHeight }
                    : img
            );

            // Update maxY if needed
            const newMaxY = updatedImages.reduce(
                (acc, img) => Math.max(acc, img.y + img.h),
                0
            );
            setMaxY(newMaxY);

            return updatedImages;
        }
        return null;
    };

    const repositionImages = (
        _images: ImageData[],
        containerDims: Dimension
    ): ImageData[] => {
        const { _localImages } = positionImages(_images, containerDims);

        return _localImages;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
        if (isResizing && selectedId && e.touches.length > 0) {
            // e.preventDefault();
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;

            updateImageSize(clientX, clientY);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        // Call the function to reposition images after resizing
        const repositionedImages = repositionImages(
            localImages,
            containerDimensions
        );
        setLocalImages(repositionedImages);
        setImages(repositionedImages);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove); // Add this
        window.addEventListener("touchend", handleMouseUp); // Add this

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove); // Add this
            window.removeEventListener("touchend", handleMouseUp); // Add this
        };
    }, [localImages, selectedId, isResizing]);

    return (
        <div
            ref={containerRef}
            style={{
                width: containerDimensions.w * scaleFactor,
                height: (maxY + 5) * scaleFactor,
                border: "1px solid black",
                position: "relative",
            }}
            className="overflow-hidden bg-white"
        >
            {localImages.map((imgData, index) => {
                const imageUrl = imageUrls.get(imgData.id) || "";

                return (
                    <div
                        key={imgData.id}
                        data-id={imgData.id}
                        style={{
                            position: "absolute",
                            left: imgData.x,
                            top: imgData.y * scaleFactor,
                            width: imgData.w * scaleFactor,
                            height: imgData.h * scaleFactor,
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
                                    right: -4,
                                    bottom: -4,
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
    );
};

export default ResizingWindow;
