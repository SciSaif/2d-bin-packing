import { useAppSelector } from "@/redux/hooks";
import React from "react";

interface PageEndIndicatorsProps {
    maxY: number;
}

const PageEndIndicators: React.FC<PageEndIndicatorsProps> = ({ maxY }) => {
    const { container } = useAppSelector((state) => state.main);
    const containerHeight = container.h;
    const scaleFactor = container.scaleFactor;
    const indicators = [];

    for (let i = 1; i * containerHeight * scaleFactor < maxY * scaleFactor; i++) {
        indicators.push(i * containerHeight * scaleFactor);
    }

    return (
        <>
            {indicators.map((position, index) => (
                <div
                    key={index}
                    className="absolute w-full bg-gray-300"
                    style={{
                        top: position,
                        height: 1,
                    }}
                >
                    <p className="absolute text-[8px] opacity-50 -top-3 right-1">
                        Page End
                    </p>
                </div>
            ))}
        </>
    );
};

export default PageEndIndicators;
