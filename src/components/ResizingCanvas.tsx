import React, { useEffect, useRef } from "react";

interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
}

interface Props {
    containerWidth: number;
    images: ImageData[];
    maxY: number;
    uploadedFiles: { id: string; file: File }[];
    setImages: (images: ImageData[]) => void;
}

const ResizingCanvas = ({
    containerWidth,
    images,
    maxY,
    uploadedFiles,
    setImages,
}: Props) => {
    const resizingCanvasRef = useRef<HTMLCanvasElement>(null);

    let isResizing = false;
    let resizingImageIndex = -1;
    let lastMouseX = 0;
    let tempImages = [...images];
    let throttleTimeout: any = null;

    const handleMouseDown = (e: MouseEvent) => {
        if (!resizingCanvasRef.current) return;

        const rect = resizingCanvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (let i = 0; i < tempImages.length; i++) {
            const img = tempImages[i];
            if (
                mouseX > img.x + img.w - 50 &&
                mouseX < img.x + img.w &&
                mouseY > img.y + img.h - 50 &&
                mouseY < img.y + img.h
            ) {
                isResizing = true;
                resizingImageIndex = i;
                lastMouseX = mouseX;
                break;
            }
        }
    };
    useEffect(() => {
        if (images.length === 0) return;
        showResizingCanvas();
    }, [images]);
    const handleMouseMove = (e: MouseEvent) => {
        if (
            !resizingCanvasRef.current ||
            !isResizing ||
            resizingImageIndex === -1
        )
            return;

        if (throttleTimeout) return; // Skip this move event if we're throttling

        throttleTimeout = setTimeout(() => {
            throttleTimeout = null; // Allow the next move event to be processed
        }, 16); // Approximately 60fps

        const rect = resizingCanvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        const img = tempImages[resizingImageIndex];
        const deltaX = mouseX - lastMouseX;
        const newWidth = img.w + deltaX;
        const newHeight = newWidth * (img.h / img.w); // maintain aspect ratio

        tempImages[resizingImageIndex] = { ...img, w: newWidth, h: newHeight };

        // Reposition images below the resized image
        let yOffset = newHeight - img.h;
        for (let i = resizingImageIndex + 1; i < tempImages.length; i++) {
            tempImages[i] = { ...tempImages[i], y: tempImages[i].y + yOffset };
        }

        lastMouseX = mouseX;

        requestAnimationFrame(showResizingCanvas);
    };

    const handleMouseUp = () => {
        if (isResizing) {
            setImages(tempImages);
            showResizingCanvas(); // Redraw the entire canvas
        }
        isResizing = false;
        resizingImageIndex = -1;
    };

    const drawImage = (rect: ImageData) => {
        if (!resizingCanvasRef.current) return;
        const ctx = resizingCanvasRef.current.getContext("2d");
        if (!ctx) return;

        const image = uploadedFiles.find((file) => file.id === rect.id);
        if (image) {
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
            };
            img.src = URL.createObjectURL(image.file);
        }
    };

    useEffect(() => {
        tempImages = [...images];
    }, [images]);

    useEffect(() => {
        const canvas = resizingCanvasRef.current;
        if (canvas) {
            canvas.addEventListener("mousedown", handleMouseDown);
            canvas.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener("mousedown", handleMouseDown);
                canvas.removeEventListener("mousemove", handleMouseMove);
            }
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [images]);

    const showResizingCanvas = () => {
        if (!resizingCanvasRef.current) return;
        const ctx = resizingCanvasRef.current.getContext("2d");
        if (!ctx) return;

        resizingCanvasRef.current.height = maxY + 5;
        ctx.clearRect(0, 0, containerWidth, maxY + 5);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, containerWidth, maxY + 5);

        tempImages.forEach(drawImage);
    };

    return (
        <div>
            <canvas
                ref={resizingCanvasRef}
                width={containerWidth}
                className="border border-gray-400 shadow w-fit"
            ></canvas>
        </div>
    );
};

export default ResizingCanvas;
