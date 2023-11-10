import React, { useState, useEffect, useCallback } from "react";
import { ContainerType } from "../pages/imagePacker/ImagePacker";
import { ImageData } from "../components/ResizingWindow";
import { positionImages } from "../pages/imagePacker/utils";

interface UseResizeImageProps {
    images: ImageData[];
    container: ContainerType;
    setImages: (images: ImageData[]) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const useResizeImage = ({
    images,
    container,
    setImages,
    containerRef,
}: UseResizeImageProps) => {
    const [localImages, setLocalImages] = useState<ImageData[]>(images);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [maxY, setMaxY] = useState(0);

    // for preventive page scrolling while resizing in mobile
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
    const updateImageSize = (
        clientX: number,
        clientY: number
    ): ImageData[] | null => {
        const selectedImage = localImages.find((img) => img.id === selectedId);
        if (selectedImage && containerRef.current) {
            const aspectRatio = selectedImage.w / selectedImage.h;
            const mouseX = clientX / container.scaleFactor;
            const mouseY = clientY / container.scaleFactor; // Assuming you want to scale Y as well

            const rect = containerRef.current.getBoundingClientRect();

            let newWidth = Math.max(
                50,
                mouseX - rect.left / container.scaleFactor - selectedImage.x
            );
            // calculate distance between mouse and image's right edge
            const distBetweenMouseAndRightEdge =
                mouseX -
                rect.left / container.scaleFactor -
                selectedImage.x -
                selectedImage.w;

            // account for the distance between the mouse (on the handle) and the right edge of the image
            // newWidth -= distBetweenMouseAndRightEdge + 1;

            // console.log(mouseX, rect.left, selectedImage.x, newWidth);
            let newHeight = newWidth / aspectRatio;

            // Constrain newWidth and newHeight to not exceed the container's dimensions
            if (newWidth > container.w) {
                newWidth = container.w;
                newHeight = newWidth / aspectRatio;
            }
            if (newHeight > container.h) {
                newHeight = container.h;
                newWidth = newHeight * aspectRatio;
            }

            const updatedImages = localImages.map((img) =>
                img.id === selectedId
                    ? { ...img, w: newWidth, h: newHeight }
                    : img
            );

            return updatedImages;
        }
        return null;
    };

    const handleResize = (clientX: number, clientY: number) => {
        if (isResizing && selectedId) {
            const updatedImages = updateImageSize(clientX, clientY);
            if (updatedImages) {
                const repositionedImages = positionImages(
                    updatedImages,
                    container
                )._localImages;
                const repositionedImage = repositionedImages.find(
                    (img) => img.id === selectedId
                );
                const originalImage = localImages.find(
                    (img) => img.id === selectedId
                );

                if (
                    originalImage &&
                    repositionedImage &&
                    originalImage.y !== repositionedImage.y
                ) {
                    setIsResizing(false);
                    setSelectedId(null);
                }
                setLocalImages(repositionedImages);
                // Update maxY if needed
                const newMaxY = repositionedImages.reduce(
                    (acc, img) => Math.max(acc, img.y + img.h),
                    0
                );
                setMaxY(newMaxY);
            }
        }
    };

    // // Function to handle mouse down event
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

    const handleMouseMove = (e: MouseEvent) => {
        handleResize(e.clientX, e.clientY);
    };

    // Touch move event handler
    const handleTouchMove = (e: globalThis.TouchEvent) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleResize(touch.clientX, touch.clientY);
        }
    };

    // Function to handle mouse up event
    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        setImages(localImages);
    }, [localImages, setImages]);

    // Effect for adding event listeners
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp, handleTouchMove]);

    return {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        setSelectedId,
        setIsResizing,
        selectedId,
        setMaxY,
    };
};

export default useResizeImage;
