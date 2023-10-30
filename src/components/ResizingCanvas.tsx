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
    images: ImageData[];
    maxY: number;
    uploadedFiles: { id: string; file: File }[];
    setImages: (images: ImageData[]) => void;
}

const ResizingCanvas: React.FC<Props> = ({
    containerWidth,
    images,
    maxY,
    uploadedFiles,
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
                    width={containerWidth}
                    height={maxY + 5}
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
                                x={imgData.x}
                                y={imgData.y}
                                width={imgData.w}
                                height={imgData.h}
                                image={loadedImages.get(imgData.id)}
                                onClick={() => handleSelect(imgData.id)}
                                onTap={() => handleSelect(imgData.id)}
                                onTransformEnd={(e) => {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    // Adjust the width and height based on the scale
                                    const updatedWidth = Math.max(
                                        5,
                                        node.width() * scaleX
                                    );
                                    const updatedHeight = Math.max(
                                        5,
                                        node.height() * scaleY
                                    );

                                    const deltaHeight =
                                        updatedHeight - imgData.h; // Calculate the change in height

                                    const updatedImages = [...images];
                                    updatedImages[index] = {
                                        ...imgData,
                                        x: node.x(),
                                        y: node.y(),
                                        w: updatedWidth,
                                        h: updatedHeight,
                                    };

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
                                <Transformer ref={transformerRef} />
                            )}
                        </React.Fragment>
                    );
                })}
            </Layer>
        </Stage>
    );
};

export default ResizingCanvas;
