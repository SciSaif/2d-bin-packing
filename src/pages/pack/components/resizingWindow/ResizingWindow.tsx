import React, { useState } from "react";
import useResizeImage from "../../../../hooks/useImageResizer";

import MarginHandles from "./components/MarginHandles";

import { useAppSelector } from "../../../../redux/hooks";

import ResizeAnchor from "./components/ResizeAnchor";
import { ImageBox } from "../../Pack";
import MarginInputs from "./components/MarginInputs";
import ResizeWindowSettings from "./components/ResizeWindowSettings";
import Options from "./components/Options";

interface Props {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const ResizingWindow: React.FC<Props> = ({ images, setImages }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container, showBorder } = useAppSelector((state) => state.main);

    const {
        localImages,
        maxY,
        handleMouseDown,
        setLocalImages,
        imageUrls,
        selectedId,
        setMaxY,
    } = useResizeImage({
        containerRef,
        images,
        setImages,
    });

    return (
        <div className="flex flex-col items-center justify-center w-full pt-5 border-t">
            <div className="mb-4">
                <p className="text-sm text-center text-gray-600">
                    Click on the image and use the resize handle to resize the
                    images. Take reference from the A4 paper width below and
                    decide what size you want each image to be.
                </p>
            </div>

            <ResizeWindowSettings
                showMarginControls={showMarginControls}
                setShowMarginControls={setShowMarginControls}
            />

            {showMarginControls && <MarginInputs localImages={localImages} setLocalImages={setLocalImages} setMaxY={setMaxY} />}

            <div
                ref={containerRef}
                style={{
                    width: container.w * container.scaleFactor,
                    height: (maxY + 5) * container.scaleFactor,
                    border: "1px solid black",
                    position: "relative",
                }}
                className="mt-10 bg-white shadow-xl"
            >

                {/* Paper width indicator */}
                <div className="absolute flex flex-row items-center w-full h-10 -top-12 ">
                    <div className="w-full h-[1px] bg-gray-500 relative ">
                        <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -left-[6px]"></div>
                    </div>
                    <div className="px-2 text-sm text-center whitespace-nowrap ">
                        {container.paperSize.name} Paper Width
                    </div>
                    <div className="w-full h-[1px] bg-gray-500 relative">
                        <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -right-[6px]"></div>
                    </div>
                </div>

                {showMarginControls && (
                    <MarginHandles
                        localImages={localImages}
                        setLocalImages={setLocalImages}
                        setMaxY={setMaxY}
                        containerRef={containerRef}
                    />

                )}

                {/* page end indicator */}
                {maxY > container.h * container.scaleFactor && (
                    <div
                        className="absolute w-full bg-gray-300 "
                        style={{
                            top: container.h * container.scaleFactor,
                            height: 1,
                        }}
                    >
                        <p className="absolute text-[8px] opacity-50 -top-3 right-1">
                            Page End
                        </p>
                    </div>
                )}

                {localImages.map((imgData) => {
                    const imageUrl = imageUrls.get(imgData.id) || "";

                    return (
                        <div
                            key={imgData.id}
                            data-id={imgData.id}
                            style={{
                                position: "absolute",
                                left: imgData.x * container.scaleFactor,
                                top: imgData.y * container.scaleFactor,
                                width: imgData.w * container.scaleFactor,
                                height: imgData.h * container.scaleFactor,
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: "cover",
                                border:
                                    selectedId === imgData.id
                                        ? "2px solid blue"
                                        : showBorder
                                            ? "1px solid black"
                                            : "none",
                            }}
                            onMouseDown={(e) => handleMouseDown(e, imgData)}
                            onTouchStart={(e) => handleMouseDown(e, imgData)}
                        >
                            {selectedId === imgData.id && <Options id={imgData.id} images={images} setImages={setImages} />}
                            {selectedId === imgData.id && <ResizeAnchor />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResizingWindow;
