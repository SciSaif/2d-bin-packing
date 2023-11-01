import React, { TouchEvent, useEffect, useState } from "react";

interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
}

interface Props {
    containerWidth: number;
    containerHeight: number;
    images: ImageData[];
    maxY: number;
    setMaxY: (maxY: number) => void;
    uploadedFiles: { id: string; file: File }[];
    setImages: (images: ImageData[]) => void;
    scaleFactor: number;
}

const ResizingDiv: React.FC<Props> = ({
    containerWidth,
    containerHeight,
    images,
    maxY,
    setMaxY,
    uploadedFiles,
    setImages,
    scaleFactor,
}) => {
    const [selectedId, setSelectedId] = useState<null | string>(null);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [localImages, setLocalImages] = useState<ImageData[]>(images);
    const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        const newImageUrls = new Map<string, string>();
        uploadedFiles.forEach((file) => {
            newImageUrls.set(file.id, URL.createObjectURL(file.file));
        });
        setImageUrls(newImageUrls);
    }, [uploadedFiles]);

    useEffect(() => {
        setLocalImages(images);
    }, [images]);

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

            updateImageSize(clientX, clientY);
        }
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
        if (isResizing && selectedId && e.touches.length > 0) {
            // e.preventDefault();
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;

            updateImageSize(clientX, clientY);
        }
    };

    const updateImageSize = (clientX: number, clientY: number) => {
        const selectedImage = localImages.find((img) => img.id === selectedId);
        if (selectedImage && containerRef.current) {
            const aspectRatio = selectedImage.w / selectedImage.h;
            const mouseX = clientX / scaleFactor;
            const mouseY = clientY;

            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = mouseX - rect.left - selectedImage.x;
            const newHeight = newWidth / aspectRatio;

            if (newWidth > containerWidth || newHeight > containerHeight) {
                return;
            }

            const updatedImages = [...localImages];
            const index = updatedImages.findIndex(
                (img) => img.id === selectedId
            );
            let accumulatedHeight = 0;
            if (index !== -1) {
                updatedImages[index] = {
                    ...updatedImages[index],
                    w: newWidth,
                    h: newHeight,
                };

                // Reposition images below the resized image
                accumulatedHeight = updatedImages[index].y + newHeight;
                for (let i = index + 1; i < updatedImages.length; i++) {
                    updatedImages[i].y = accumulatedHeight + 5;
                    accumulatedHeight += updatedImages[i].h + 5;
                }

                setLocalImages(updatedImages);
            }

            // Update maxY if needed
            const newMaxY = accumulatedHeight > maxY ? accumulatedHeight : maxY;
            setMaxY(newMaxY);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setImages(localImages);
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
                width: containerWidth * scaleFactor,
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

export default ResizingDiv;
