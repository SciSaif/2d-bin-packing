// import React, { useEffect, useState, useRef } from "react";
// import {
//     Stage,
//     Layer,
//     Rect,
//     Image as KonvaImage,
//     Transformer,
// } from "react-konva";

// interface ImageData {
//     id: string;
//     w: number;
//     h: number;
//     x: number;
//     y: number;
// }

// interface Props {
//     containerWidth: number;
//     scaleFactor: number;
//     images: ImageData[];
//     maxY: number;
//     setMaxY: (maxY: number) => void;
//     uploadedFiles: { id: string; file: File }[];
//     setImages: (images: ImageData[]) => void;
// }

// const ResizingCanvas: React.FC<Props> = ({
//     containerWidth,
//     images,
//     maxY,
//     setMaxY,
//     uploadedFiles,
//     scaleFactor,
//     setImages,
// }) => {
//     const [selectedId, setSelectedId] = useState<null | string>(null);
//     const transformerRef = useRef<any>(null);
//     const [loadedImages, setLoadedImages] = useState<
//         Map<string, HTMLImageElement>
//     >(new Map());

//     const handleSelect = (id: string) => {
//         setSelectedId(id);
//     };
//     useEffect(() => {
//         uploadedFiles.forEach((file) => {
//             if (!loadedImages.has(file.id)) {
//                 const imageObj = new window.Image();
//                 imageObj.onload = () => {
//                     setLoadedImages((prev) =>
//                         new Map(prev).set(file.id, imageObj)
//                     );
//                 };
//                 imageObj.src = URL.createObjectURL(file.file);
//             }
//         });
//     }, [uploadedFiles, loadedImages]);
//     useEffect(() => {
//         if (transformerRef.current && selectedId) {
//             const selectedNode = transformerRef.current
//                 .getStage()
//                 .findOne(`#${selectedId}`);
//             transformerRef.current.nodes([selectedNode]);
//             transformerRef.current.getLayer().batchDraw();
//         }
//     }, [selectedId]);

//     return (
//         <Stage width={containerWidth} height={maxY + 5} className="">
//             <Layer>
//                 <Rect
//                     x={0}
//                     y={0}
//                     // width={containerWidth}
//                     // height={maxY + 5}
//                     width={containerWidth * scaleFactor}
//                     height={(maxY + 5) * scaleFactor}
//                     stroke="black"
//                     fill="white"
//                 />
//                 {images.map((imgData, index) => {
//                     const imageFile = uploadedFiles.find(
//                         (file) => file.id === imgData.id
//                     );
//                     const imageObj = new window.Image();
//                     if (imageFile) {
//                         imageObj.src = URL.createObjectURL(imageFile.file);
//                     }

//                     return (
//                         <React.Fragment key={index}>
//                             <KonvaImage
//                                 id={imgData.id}
//                                 // x={imgData.x}
//                                 // y={imgData.y}
//                                 // width={imgData.w}
//                                 // height={imgData.h}
//                                 x={imgData.x * scaleFactor}
//                                 y={imgData.y * scaleFactor}
//                                 width={imgData.w * scaleFactor}
//                                 height={imgData.h * scaleFactor}
//                                 image={loadedImages.get(imgData.id)}
//                                 onClick={() => handleSelect(imgData.id)}
//                                 onTap={() => handleSelect(imgData.id)}
// onTransformEnd={(e) => {
//     const node = e.target;
//     const scaleX = node.scaleX();
//     const scaleY = node.scaleY();

//     // Adjust the width and height based on the scale
//     // let updatedWidth = Math.max(
//     //     5,
//     //     node.width() * scaleX
//     // );
//     // let updatedHeight = Math.max(
//     //     5,
//     //     node.height() * scaleY
//     // );
//     let updatedWidth = Math.max(
//         5,
//         (node.width() * scaleX) / scaleFactor
//     );
//     let updatedHeight = Math.max(
//         5,
//         (node.height() * scaleY) / scaleFactor
//     );

//     // if the width is more than the container width, set the width to the container width
//     if (updatedWidth > containerWidth) {
//         updatedWidth = containerWidth;
//         updatedHeight =
//             (updatedWidth / node.width()) *
//             node.height();
//     }

//     const deltaHeight =
//         updatedHeight - imgData.h; // Calculate the change in height

//     const updatedImages = [...images];
//     updatedImages[index] = {
//         ...imgData,
//         x: node.x() / scaleFactor,
//         y: node.y() / scaleFactor,
//         w: updatedWidth,
//         h: updatedHeight,
//     };

//     let currentTotalHeight = 0;
//     updatedImages.forEach((img) => {
//         currentTotalHeight += img.h;
//     });

//     // Adjust the maxY if the total height of all images is greater than the current maxY
//     if (currentTotalHeight > maxY) {
//         setMaxY(
//             currentTotalHeight +
//                 updatedImages.length * 5 +
//                 5
//         );
//     }

//     // Adjust the y position of all images below the resized image
//     for (
//         let i = index + 1;
//         i < updatedImages.length;
//         i++
//     ) {
//         updatedImages[i].y += deltaHeight;
//     }

//     setImages(updatedImages);

//     // Reset the scale
//     node.scaleX(1);
//     node.scaleY(1);
// }}
//                             />
//                             {selectedId === imgData.id && (
//                                 <Transformer
//                                     ref={transformerRef}
//                                     enabledAnchors={[
//                                         "bottom-right",
//                                         "bottom-center",
//                                         "middle-right",
//                                     ]}
//                                     rotateEnabled={false}
//                                     borderStrokeWidth={4}
//                                     anchorSize={15}
//                                 />
//                             )}
//                         </React.Fragment>
//                     );
//                 })}
//             </Layer>
//         </Stage>
//     );
// };

// export default ResizingCanvas;

import React, { useEffect, useState } from "react";

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
        e: React.MouseEvent<HTMLDivElement>,
        imgData: ImageData
    ) => {
        e.preventDefault();
        setIsResizing(true);
        setSelectedId(imgData.id);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing && selectedId) {
            const selectedImage = localImages.find(
                (img) => img.id === selectedId
            );
            if (selectedImage && containerRef.current) {
                const aspectRatio = selectedImage.w / selectedImage.h;
                const mouseX = e.clientX;
                const mouseY = e.clientY;

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
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setSelectedId(null);
        setImages(localImages);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
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
                            overflow: "hidden",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, imgData)}
                    >
                        {selectedId === imgData.id && (
                            <div
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    bottom: 0,
                                    width: 10,
                                    height: 10,
                                    backgroundColor: "blue",
                                    cursor: "se-resize",
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
