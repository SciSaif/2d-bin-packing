import React, { useState, useEffect } from "react";
import { ContainerType, Margin } from "../pages/home/ImagePacker";
import { positionImages } from "../pages/home/utils";
import { ImageData } from "../components/ResizingWindow";

interface UseMarginProps {
    container: ContainerType;
    setContainer: (container: ContainerType) => void;
    containerRef: React.RefObject<HTMLDivElement>;
    localImages: ImageData[];
    setLocalImages: any;
    setMaxY: any;
}

const useMargin = ({
    container,
    setContainer,
    containerRef,
    localImages,
    setLocalImages,
    setMaxY,
}: UseMarginProps) => {
    const [isDraggingMargin, setIsDraggingMargin] = useState(false);
    const [draggingMargin, setDraggingMargin] = useState<keyof Margin | "">("");

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
    };

    // for preventive page scrolling while resizing in mobile
    useEffect(() => {
        const preventDefaultWhenResizing = (e: globalThis.TouchEvent) => {
            if (isDraggingMargin) {
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
    }, [isDraggingMargin]);

    const handleMarginDragStart = (e: any, side: keyof Margin) => {
        setDraggingMargin(side);
        setIsDraggingMargin(true);
    };

    const handleMarginDrag = (e: any) => {
        if (!isDraggingMargin || !containerRef.current) return;

        const clientX = e.type.includes("touch")
            ? e.touches[0].clientX
            : e.clientX;

        const clientY = e.type.includes("touch")
            ? e.touches[0].clientY
            : e.clientY;

        const rect = containerRef.current.getBoundingClientRect();

        let newMargin: number;
        switch (draggingMargin) {
            case "top":
                newMargin = clientY - rect.top;
                break;
            case "right":
                newMargin = rect.right - clientX;
                break;
            case "bottom":
                newMargin = rect.bottom - clientY;
                break;
            case "left":
                newMargin = clientX - rect.left;
                break;
            default:
                newMargin = 0;
                break;
        }

        // Constrain the margin value
        newMargin = Math.max(0, newMargin);
        newMargin = Math.min(newMargin, 150); // Assuming a minimum container width
        newMargin = Math.round(newMargin);

        setContainer({
            ...container,
            margin: {
                ...container.margin,
                [draggingMargin]: newMargin / container.scaleFactor,
            },
        });
    };

    const handleMarginDragEnd = () => {
        setIsDraggingMargin(false);
    };

    useEffect(() => {
        if (!isDraggingMargin) return;
        const { _localImages, _maxY } = positionImages(localImages, container);
        setLocalImages(_localImages);
        setMaxY(_maxY);
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

    return { handleMarginChange, handleMarginDragStart, isDraggingMargin };
};

export default useMargin;
