// Page.tsx
import React from "react";
import { ImageBox } from "../pages/pack/Pack";
import { useAppSelector } from "@/redux/hooks";

interface PageProps {
    boxSet: ImageBox[];
    index: number

}

const Page: React.FC<PageProps> = ({ boxSet, index }) => {
    const { container, imagesLoaded, showBorder } = useAppSelector((state) => state.main);
    const scaleFactor = container.scaleFactor;


    return (
        <div
            className="border box-content border-gray-400 shadow"
        >

            <div
                id={`page-${index}`}
                className="relative bg-white "
                style={{
                    width: `${container.w * scaleFactor}px`,
                    height: `${container.h * scaleFactor}px`,
                }}
            >
                {imagesLoaded && boxSet.map((box) => {

                    return (
                        box.imageElement && (
                            <img
                                key={box.id}
                                src={box.imageElement?.src}
                                alt=""
                                style={{
                                    position: "absolute",
                                    top: `${box.y * scaleFactor}px`,
                                    left: `${box.x * scaleFactor}px`,
                                    width: `${(box.rotated ? box.h : box.w) * scaleFactor}px`,
                                    height: `${(box.rotated ? box.w : box.h) * scaleFactor}px`,
                                    transform: box.rotated ? `rotate(-90deg) translateX(-${box.h * scaleFactor}px)` : "none",
                                    transformOrigin: "top left",
                                    border: showBorder ? "1px solid black" : "none",
                                }}
                            />
                        )
                    )
                })}
            </div>
        </div>

    );
};

export default Page;
