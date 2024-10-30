import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { ImageBox } from "@/pages/pack/Pack";
import { positionImages } from "@/pages/pack/components/resizingWindow/utils";
import {
    positionNewImages,
    resizeImages,
} from "@/pages/freeform/components/freeFormWindow/utils";
import { getPhotoSizeInPixels, PhotoSizeDefinition } from "@/data/paperSizes";

interface UseFreeFormProps {
    containerRef: React.RefObject<HTMLDivElement>;
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const useFreeForm = ({ containerRef, images, setImages }: UseFreeFormProps) => {
    const { container, filesChangedFlag, startingMaxWidthFactor } =
        useAppSelector((state) => state.main);
    const [localImages, setLocalImages] = useState<ImageBox[]>(images);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [startingDistFromRightEdge, setStartingDistFromRightEdge] =
        useState(0);
    const [isResizing, setIsResizing] = useState(false);

    const [maxY, setMaxY] = useState(container.h);
    const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

    const setImageToPresetSize = useCallback(
        (imageId: string, photoSize: PhotoSizeDefinition) => {
            const selectedImage = localImages.find((img) => img.id === imageId);
            if (!selectedImage) return;

            const { width: targetWidthInPixels } = getPhotoSizeInPixels(
                photoSize,
                container
            );

            // Calculate new height maintaining aspect ratio
            const aspectRatio = selectedImage.w / selectedImage.h;
            const newHeight = targetWidthInPixels / aspectRatio;

            const updatedImages = localImages.map((img) =>
                img.id === imageId
                    ? { ...img, w: targetWidthInPixels, h: newHeight }
                    : img
            );

            handleResizeImages(updatedImages);
        },
        [localImages, container.paperSize]
    );

    useEffect(() => {
        // set the image urls ( this is done so that we don't have to re-render the images when resizing)
        if (!images.length) {
            setLocalImages([]);
        }
        const newImageUrls = new Map<string, string>();
        images.forEach((image) => {
            if (image.file) {
                newImageUrls.set(image.id, URL.createObjectURL(image.file));
            }
        });
        setImageUrls(newImageUrls);

        // position the images in the container
        const { _maxY, _localImages } = positionNewImages(
            images,
            container,
            startingMaxWidthFactor
        );

        setMaxY(Math.max(container.h, _maxY));
        setLocalImages(_localImages);

        // we need filesChangedFlag here because we need to call this effect whenever the files
        // change,  but we can't use images.length because there is a useEffect down below with container
        // as a dependency and that will run after this and the images will not be positioned with startingMaxWidthFactor
        // therefore we use filesChangedFlag as a dependency here.
        // whenever the files change, we are updating filesChangedFlag in a setTimeout so that it runs after
        // the useEffect with container as a dependency
    }, [images.length, filesChangedFlag]);

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
    ): ImageBox[] | null => {
        const selectedImage = localImages.find((img) => img.id === selectedId);
        if (selectedImage && containerRef.current) {
            const aspectRatio = selectedImage.w / selectedImage.h;
            let mouseX = clientX / container.scaleFactor;

            const rect = containerRef.current.getBoundingClientRect();

            mouseX -= rect.left / container.scaleFactor;
            let newWidth = Math.max(50, mouseX - selectedImage.x);

            // account for the distance between the mouse (on the handle) and the right edge of the image
            newWidth += startingDistFromRightEdge;
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

            // Constrain newWidth and newHeight to not exceed the container's bounds
            if (newWidth + selectedImage.x > container.w) {
                newWidth = container.w - selectedImage.x;
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

    const handleResizeImages = (updatedImages: ImageBox[]) => {
        console.log("reposition images");
        const resizedImages = resizeImages(
            updatedImages,
            container
        )._localImages;

        setLocalImages(resizedImages);
        // Update maxY if needed
        const newMaxY = resizedImages.reduce(
            (acc, img) => Math.max(acc, img.y + img.h),
            0
        );
        setMaxY(Math.max(container.h, newMaxY) + 200);
    };

    const handleResize = (clientX: number, clientY: number) => {
        if (isResizing && selectedId) {
            const updatedImages = updateImageSize(clientX, clientY);
            if (updatedImages) {
                handleResizeImages(updatedImages);
            }
        }
    };

    const handleMouseDown = (e: any, imgData: ImageBox) => {
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
            console.log("handleMouseDown ", distBetweenMouseAndRightEdge);

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

    const handleTouchMove = (e: globalThis.TouchEvent) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleResize(touch.clientX, touch.clientY);
        }
    };

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        setImages(localImages);
    }, [localImages]);

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

    useLayoutEffect(() => {
        console.log("container changed");
        const repositionedImages = positionNewImages(
            localImages,
            container
        )._localImages;
        setLocalImages(repositionedImages);
    }, [container]);

    return {
        localImages,
        setLocalImages,
        imageUrls,
        handleMouseDown,
        selectedId,
        setMaxY,
        maxY,
        setImageToPresetSize,
    };
};

export default useFreeForm;
