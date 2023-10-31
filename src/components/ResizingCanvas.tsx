import React, { useEffect, useState, useRef } from "react";
import {
    Stage,
    Layer,
    Rect,
    Image as KonvaImage,
    Transformer,
} from "react-konva";

interface ImageData {
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
}

interface Props {
    containerWidth: number;
    scaleFactor: number;
    images: ImageData[];
    maxY: number;
    setMaxY: (maxY: number) => void;
    uploadedFiles: { id: string; file: File }[];
    setImages: (images: ImageData[]) => void;
}

const ResizingCanvas: React.FC<Props> = ({
    containerWidth,
    images,
    maxY,
    setMaxY,
    uploadedFiles,
    scaleFactor,
    setImages,
}) => {
    const [selectedId, setSelectedId] = useState<null | string>(null);
    const transformerRef = useRef<any>(null);
    const [loadedImages, setLoadedImages] = useState<
        Map<string, HTMLImageElement>
    >(new Map());

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };
    useEffect(() => {
        uploadedFiles.forEach((file) => {
            if (!loadedImages.has(file.id)) {
                const imageObj = new window.Image();
                imageObj.onload = () => {
                    setLoadedImages((prev) =>
                        new Map(prev).set(file.id, imageObj)
                    );
                };
                imageObj.src = URL.createObjectURL(file.file);
            }
        });
    }, [uploadedFiles, loadedImages]);
    useEffect(() => {
        if (transformerRef.current && selectedId) {
            const selectedNode = transformerRef.current
                .getStage()
                .findOne(`#${selectedId}`);
            transformerRef.current.nodes([selectedNode]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedId]);

    return (
        <Stage width={containerWidth} height={maxY + 5} className="">
            <Layer>
                <Rect
                    x={0}
                    y={0}
                    // width={containerWidth}
                    // height={maxY + 5}
                    width={containerWidth * scaleFactor}
                    height={(maxY + 5) * scaleFactor}
                    stroke="black"
                    fill="white"
                />
                {images.map((imgData, index) => {
                    const imageFile = uploadedFiles.find(
                        (file) => file.id === imgData.id
                    );
                    const imageObj = new window.Image();
                    if (imageFile) {
                        imageObj.src = URL.createObjectURL(imageFile.file);
                    }

                    return (
                        <React.Fragment key={index}>
                            <KonvaImage
                                id={imgData.id}
                                // x={imgData.x}
                                // y={imgData.y}
                                // width={imgData.w}
                                // height={imgData.h}
                                x={imgData.x * scaleFactor}
                                y={imgData.y * scaleFactor}
                                width={imgData.w * scaleFactor}
                                height={imgData.h * scaleFactor}
                                image={loadedImages.get(imgData.id)}
                                onClick={() => handleSelect(imgData.id)}
                                onTap={() => handleSelect(imgData.id)}
                                onTransformEnd={(e) => {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    // Adjust the width and height based on the scale
                                    // let updatedWidth = Math.max(
                                    //     5,
                                    //     node.width() * scaleX
                                    // );
                                    // let updatedHeight = Math.max(
                                    //     5,
                                    //     node.height() * scaleY
                                    // );
                                    let updatedWidth = Math.max(
                                        5,
                                        (node.width() * scaleX) / scaleFactor
                                    );
                                    let updatedHeight = Math.max(
                                        5,
                                        (node.height() * scaleY) / scaleFactor
                                    );

                                    // if the width is more than the container width, set the width to the container width
                                    if (updatedWidth > containerWidth) {
                                        updatedWidth = containerWidth;
                                        updatedHeight =
                                            (updatedWidth / node.width()) *
                                            node.height();
                                    }

                                    const deltaHeight =
                                        updatedHeight - imgData.h; // Calculate the change in height

                                    const updatedImages = [...images];
                                    updatedImages[index] = {
                                        ...imgData,
                                        x: node.x() / scaleFactor,
                                        y: node.y() / scaleFactor,
                                        w: updatedWidth,
                                        h: updatedHeight,
                                    };

                                    let currentTotalHeight = 0;
                                    updatedImages.forEach((img) => {
                                        currentTotalHeight += img.h;
                                    });

                                    // Adjust the maxY if the total height of all images is greater than the current maxY
                                    if (currentTotalHeight > maxY) {
                                        setMaxY(
                                            currentTotalHeight +
                                                updatedImages.length * 5 +
                                                5
                                        );
                                    }

                                    // Adjust the y position of all images below the resized image
                                    for (
                                        let i = index + 1;
                                        i < updatedImages.length;
                                        i++
                                    ) {
                                        updatedImages[i].y += deltaHeight;
                                    }

                                    setImages(updatedImages);

                                    // Reset the scale
                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                            />
                            {selectedId === imgData.id && (
                                <Transformer
                                    ref={transformerRef}
                                    enabledAnchors={[
                                        "bottom-right",
                                        "bottom-center",
                                        "middle-right",
                                    ]}
                                    rotateEnabled={false}
                                    borderStrokeWidth={4}
                                    anchorSize={15}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </Layer>
        </Stage>
    );
};

export default ResizingCanvas;
