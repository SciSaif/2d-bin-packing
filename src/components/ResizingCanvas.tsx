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
    images: ImageData[];
    maxY: number;
    setMaxY: (maxY: number) => void;
    uploadedFiles: { id: string; file: File }[];
    setImages: (images: ImageData[]) => void;
}

const ResizingDiv: React.FC<Props> = ({
    containerWidth,
    images,
    maxY,
    setMaxY,
    uploadedFiles,
    setImages,
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
        // e.preventDefault();

        const clientX =
            (e as React.TouchEvent<HTMLDivElement>).touches?.[0]?.clientX ||
            (e as React.MouseEvent<HTMLDivElement>).clientX;
        const clientY =
            (e as React.TouchEvent<HTMLDivElement>).touches?.[0]?.clientY ||
            (e as React.MouseEvent<HTMLDivElement>).clientY;

        const rect = (e.target as HTMLDivElement).getBoundingClientRect();

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
            const mouseX = clientX;
            const mouseY = clientY;

            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = mouseX - rect.left - selectedImage.x;
            const newHeight = newWidth / aspectRatio;

            const updatedImages = [...localImages];
            const index = updatedImages.findIndex(
                (img) => img.id === selectedId
            );
            if (index !== -1) {
                updatedImages[index] = {
                    ...updatedImages[index],
                    w: newWidth,
                    h: newHeight,
                };
                setLocalImages(updatedImages);
            }
        }
    };

    // const handleMouseUp = () => {
    //     setIsResizing(false);
    //     setSelectedId(null);
    //     setImages(localImages);
    // };
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
                width: containerWidth,
                height: maxY + 5,
                border: "1px solid black",
                position: "relative",
            }}
            className="bg-white"
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
                            top: imgData.y,
                            width: imgData.w,
                            height: imgData.h,
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
                                    width: 10,
                                    height: 10,
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
