import { cn } from "@/lib/utils";
import { ImageBox } from "@/pages/pack/Pack";
import { useAppSelector } from "@/redux/hooks";
import React from "react";

interface PageEndIndicatorsProps {
    maxY: number;
    localImages?: ImageBox[]
}

const PageEndIndicators: React.FC<PageEndIndicatorsProps> = ({ maxY, localImages }) => {
    const { container } = useAppSelector((state) => state.main);
    const containerHeight = container.h;
    const scaleFactor = container.scaleFactor;
    const indicators = [];

    for (let i = 1; i * containerHeight * scaleFactor < maxY * scaleFactor; i++) {
        // check if any image coincides with the indicator line, if it does then 
        // add property collision to the indicator object
        const collision = localImages?.find((img) => {
            return img.y * scaleFactor < i * containerHeight * scaleFactor && (img.y + img.h) * scaleFactor > i * containerHeight * scaleFactor
        });

        indicators.push({
            position: i * containerHeight * scaleFactor,
            collision,
        });
    }


    return (
        <>
            {indicators.map((indicator, index) => (
                <div
                    key={index}
                    className={cn("absolute w-full ",
                        indicator.collision ? "bg-red-400" : "bg-gray-300"
                    )}
                    style={{
                        top: indicator.position,
                        height: 1,

                    }}
                >
                    <p className="absolute text-[8px] opacity-50 -top-3 right-1 select-none">
                        {indicator.collision ? "Image will be cut off" : `Page ${index + 1} end`}
                    </p>
                </div>
            ))}
        </>
    );
};

export default PageEndIndicators;
