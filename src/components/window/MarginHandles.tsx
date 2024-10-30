import React from "react";
import { Margin } from "../../redux/features/slices/mainSlice";
import { useAppSelector } from "../../redux/hooks";
import MarginHandleIcon from "../../assets/MarginHandleIcon";
import useMargin from "../../hooks/useMargin";
import { ImageBox } from "../../pages/pack/Pack";

interface Props {
    localImages: ImageBox[];
    setLocalImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    setMaxY: React.Dispatch<React.SetStateAction<number>>
    containerRef: React.RefObject<HTMLDivElement>;

}

const MarginHandles = ({ localImages, setLocalImages, setMaxY, containerRef }: Props) => {
    const { container } = useAppSelector((state) => state.main);
    const { handleMarginDragStart } = useMargin({
        localImages,
        setLocalImages,
        setMaxY,
        containerRef,
    });

    return (
        <>
            {/* left margin handle  */}
            <div
                className="absolute w-5 h-5 -translate-x-1/2 cursor-pointer -top-6"
                style={{
                    left: container.margin.left * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "left")}
                onTouchStart={(e) => handleMarginDragStart(e, "left")}
            >
                <MarginHandleIcon />
            </div>
            {/* right margin handle  */}
            <div
                className="absolute w-5 h-5 translate-x-1/2 cursor-pointer -top-6 "
                style={{
                    right: container.margin.right * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "right")}
                onTouchStart={(e) => handleMarginDragStart(e, "right")}
            >
                <MarginHandleIcon />
            </div>
            {/* top margin handle  */}
            <div
                className="absolute w-5 h-5 -translate-y-1/2 cursor-pointer -right-5 "
                style={{
                    top: container.margin.top * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "top")}
                onTouchStart={(e) => handleMarginDragStart(e, "top")}
            >
                <MarginHandleIcon className="rotate-90" />
            </div>

            {/* bottom margin handle  */}
            <div
                className="absolute w-5 h-5 translate-y-1/2 cursor-pointer -right-5"
                style={{
                    bottom: container.margin.bottom * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "bottom")}
                onTouchStart={(e) => handleMarginDragStart(e, "bottom")}
            >
                <MarginHandleIcon className="rotate-90" />
            </div>

            {/* margin lines */}
            <div
                className="absolute top-0 w-full bg-gray-200"
                style={{
                    height: container.margin.top * container.scaleFactor,
                }}
            ></div>
            <div
                className="absolute left-0 h-full bg-gray-200"
                style={{
                    width: container.margin.left * container.scaleFactor,
                }}
            ></div>

            <div
                className="absolute right-0 h-full bg-gray-200"
                style={{
                    width: container.margin.right * container.scaleFactor,
                }}
            ></div>

            <div
                className="absolute bottom-0 w-full bg-gray-200"
                style={{
                    height: container.margin.bottom * container.scaleFactor,
                }}
            ></div>
        </>
    );
};

export default MarginHandles;
