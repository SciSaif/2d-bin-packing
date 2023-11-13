import React from "react";
import { ContainerType, Margin } from "../../../Home";
import useMargin from "../../../../../hooks/useMargin";

interface Props {
    container: ContainerType;
    handleMarginDragStart: (
        e:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.TouchEvent<HTMLDivElement>,
        side: keyof Margin
    ) => void;
}

const MarginHandles = ({ container, handleMarginDragStart }: Props) => {
    return (
        <>
            {/* left margin handle  */}
            <div
                className="absolute w-5 h-5 -translate-x-1/2 bg-blue-500 cursor-pointer -top-5"
                style={{
                    left: container.margin.left * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "left")}
                onTouchStart={(e) => handleMarginDragStart(e, "left")}
            ></div>
            {/* right margin handle  */}
            <div
                className="absolute w-5 h-5 translate-x-1/2 bg-blue-500 cursor-pointer -top-5 "
                style={{
                    right: container.margin.right * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "right")}
                onTouchStart={(e) => handleMarginDragStart(e, "right")}
            ></div>
            {/* top margin handle  */}
            <div
                className="absolute w-5 h-5 -translate-y-1/2 bg-blue-500 cursor-pointer -right-5 "
                style={{
                    top: container.margin.top * container.scaleFactor,
                }}
                onMouseDown={(e) => handleMarginDragStart(e, "top")}
                onTouchStart={(e) => handleMarginDragStart(e, "top")}
            ></div>

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
        </>
    );
};

export default MarginHandles;
