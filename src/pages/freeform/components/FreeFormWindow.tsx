import PageEndIndicators from "@/components/PageEndIndicators";
import PageWidthIndicator from "@/components/PageWidthIndicator";
import useFreeForm from "@/hooks/useFreeForm";
import Options from "@/components/window/Options";
import ResizeAnchor from "@/components/window/ResizeAnchor";
import ResizeWindowSettings from "@/components/window/ResizeWindowSettings";
import { ImageBox } from "@/pages/pack/Pack";
import { useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import RotateButton from "@/components/window/RotateButton";


interface Props {
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const FreeFormWindow: React.FC<Props> = ({ images, setImages }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [showMarginControls, setShowMarginControls] = useState(false);
    const { container, showBorder } = useAppSelector((state) => state.main);
    const { localImages, imageUrls, handleMouseDown, selectedId, maxY, setImageToPresetSize, rotateImage } = useFreeForm({
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
                freeform
            />

            <div
                ref={containerRef}
                style={{
                    width: container.w * container.scaleFactor + 2,
                    height: (maxY + 5) * container.scaleFactor,
                    border: "1px solid black",
                    position: "relative",
                }}
                className="mt-10 bg-white shadow-xl"
            >
                <PageWidthIndicator />

                <PageEndIndicators maxY={maxY} localImages={localImages} />
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
                                border:
                                    selectedId === imgData.id
                                        ? "2px solid blue"
                                        : showBorder
                                            ? "1px solid black"
                                            : "none",
                                zIndex: selectedId === imgData.id ? 1 : 0,
                                cursor: "grab",
                                boxSizing: "content-box",
                            }}
                            onMouseDown={(e) => handleMouseDown(e, imgData)}
                            onTouchStart={(e) => handleMouseDown(e, imgData)}
                        >
                            <div
                                key={imgData.id}
                                data-id={imgData.id}
                                style={{

                                    width: (imgData.rotated ? imgData.h : imgData.w) * container.scaleFactor,
                                    height: (imgData.rotated ? imgData.w : imgData.h) * container.scaleFactor,
                                    transform: imgData.rotated ? ` rotate(-90deg) translate(-${imgData.h * container.scaleFactor}px,0) ` : "none",
                                    transformOrigin: "top left",
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: "cover",
                                    zIndex: -1,
                                    cursor: "grab",
                                }}
                                onMouseDown={(e) => handleMouseDown(e, imgData)}
                                onTouchStart={(e) => handleMouseDown(e, imgData)}

                            >

                            </div>
                            {selectedId === imgData.id && <Options id={imgData.id} images={images} setImages={setImages} imageUrl={imageUrl} setImageToPresetSize={setImageToPresetSize} />}
                            {selectedId === imgData.id && <ResizeAnchor />}
                            {selectedId === imgData.id && <RotateButton rotateImage={rotateImage} />}
                        </div>

                    );
                })}
            </div>


        </div>
    );
};

export default FreeFormWindow;


