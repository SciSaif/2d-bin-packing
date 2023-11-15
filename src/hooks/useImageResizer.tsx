import React, { useState, useEffect, useCallback } from "react";
import { ImageData } from "../pages/home/components/resizingWindow/ResizingWindow";
import { positionImages } from "../pages/home/components/resizingWindow/utils";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ImageBox } from "../pages/home/Home";

interface UseResizeImageProps {
    containerRef: React.RefObject<HTMLDivElement>;
    startWithMaxHalfWidth?: boolean;
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const useResizeImage = ({
    containerRef,
    images,
    setImages,
}: UseResizeImageProps) => {
    const {
        container,
        filesUpdatedFlag,
        isResizingAgain,
        startingMaxWidthFactor,
    } = useAppSelector((state) => state.main);

    const [localImages, setLocalImages] = useState<ImageData[]>(images);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [maxY, setMaxY] = useState(0);
    const [startingDistFromRightEdge, setStartingDistFromRightEdge] =
        useState(0);
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
            isResizingAgain ? undefined : startingMaxWidthFactor
        );

        setMaxY(_maxY);
        setLocalImages(_localImages);
    }, [filesUpdatedFlag]);

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
            let mouseX = clientX / container.scaleFactor;
            let mouseY = clientY / container.scaleFactor; // Assuming you want to scale Y as well
            // console.log("clientX", clientX);

            const rect = containerRef.current.getBoundingClientRect();

            mouseX -= rect.left / container.scaleFactor;
            // console.log(mouseX, rect.left, selectedImage.x);

            let newWidth = Math.max(50, mouseX - selectedImage.x);

            // account for the distance between the mouse (on the handle) and the right edge of the image
            newWidth += startingDistFromRightEdge;

            // console.log(newWidth);

            // console.log(mouseX, rect.left, selectedImage.x, newWidth);
            let newHeight = newWidth / aspectRatio;

            // Constrain newWidth and newHeight to not exceed the container's dimensions and account for the margin
            if (
                newWidth >
                container.w - container.margin.left - container.margin.right
            ) {
                newWidth =
                    container.w -
                    container.margin.left -
                    container.margin.right;
                newHeight = newWidth / aspectRatio;
            }
            if (
                newHeight >
                container.h - container.margin.top - container.margin.bottom
            ) {
                newHeight =
                    container.h -
                    container.margin.top -
                    container.margin.bottom;
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

    const repositionImages = (updatedImages: ImageData[]) => {
        const repositionedImages = positionImages(
            updatedImages,
            container
        )._localImages;
        const repositionedImage = repositionedImages.find(
            (img) => img.id === selectedId
        );
        const originalImage = localImages.find((img) => img.id === selectedId);

        // If the image's y value has changed, it means has changed shelf
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
    };

    const handleResize = (clientX: number, clientY: number) => {
        // console.log("handleResize clientX", clientX);

        if (isResizing && selectedId) {
            const updatedImages = updateImageSize(clientX, clientY);
            if (updatedImages) {
                repositionImages(updatedImages);
            }
        }
    };

    // // Function to handle mouse down event
    const handleMouseDown = (
        // e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        e: any,
        imgData: ImageData
    ) => {
        if (
            e.target instanceof HTMLElement &&
            e.target.classList.contains("resize-handle")
        ) {
            const clientX = e.clientX || e.touches[0].clientX;

            let mouseX = clientX / container.scaleFactor;

            const rect = containerRef.current?.getBoundingClientRect();

            if (!rect) return;

            mouseX -= rect.left / container.scaleFactor;

            // calculate the distance between the mouse and the right edge of the image
            const distBetweenMouseAndRightEdge = imgData.x + imgData.w - mouseX;

            // set the state
            setStartingDistFromRightEdge(distBetweenMouseAndRightEdge);

            setIsResizing(true);
            setSelectedId(imgData.id);

            return;
        }

        if (selectedId !== imgData.id) {
            setSelectedId(imgData.id);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        // console.log("e.clientX", e.clientX);

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
    }, [localImages]);

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

    useEffect(() => {
        repositionImages(localImages);
    }, [container]);

    // // function to resize every image that is larger in width than the given width to the given width
    // const resizeImagesWithMaxWidth = () => {
    //     // startingMaxWidthFactor
    //     const updatedImages = localImages.map((img) => {
    //         if (img.w > container.w * startingMaxWidthFactor) {
    //             const newHeight =
    //                 (container.w * startingMaxWidthFactor) / img.w;
    //             return {
    //                 ...img,
    //                 w: container.w * startingMaxWidthFactor,
    //                 h: newHeight,
    //             };
    //         }
    //         return img;
    //     });

    //     repositionImages(updatedImages);
    // };

    return {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        setSelectedId,
        setIsResizing,
        selectedId,
        imageUrls,
        setMaxY,
        // resizeImagesWithMaxWidth,
    };
};

export default useResizeImage;
