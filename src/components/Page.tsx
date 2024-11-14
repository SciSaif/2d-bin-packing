// Page.tsx
import React from "react";
import { ImageBox } from "../pages/pack/Pack";
import { useAppSelector } from "@/redux/hooks";

interface PageProps {
    boxSet: ImageBox[];

}

const Page: React.FC<PageProps> = ({ boxSet }) => {
    const { container, imagesLoaded, showBorder } = useAppSelector((state) => state.main);
    const scaleFactor = container.scaleFactor;


    return (
        <div
            className="relative bg-white border border-gray-400 shadow"
            style={{
                width: `${container.w * scaleFactor}px`, // Adjust based on desired page width
                height: `${container.h * scaleFactor}px`, // Adjust based on desired page height
            }}
        >
            {imagesLoaded && boxSet.map((box) => {
                if (box.rotated) {
                    console.log(box);
                }
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
    );
};

export default Page;
