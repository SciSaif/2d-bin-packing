// ImageStage.tsx
import React from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import { ImageBox } from "../pages/pack/Pack";
import Konva from "konva";
import { useAppSelector } from "../redux/hooks";

interface StageProps {
    boxSet: ImageBox[];
    stageRef: React.RefObject<Konva.Stage>[];
    index: number;
}

const PageStage: React.FC<StageProps> = ({ boxSet, stageRef, index }) => {
    const { container, imagesLoaded, showBorder } = useAppSelector(
        (state) => state.main
    );

    return (
        <Stage
            ref={stageRef[index]}
            width={container.w * container.scaleFactor}
            height={container.h * container.scaleFactor}
            className="bg-white border border-gray-400 shadow w-fit"
            style={{ touchAction: "auto" }}
            preventDefault={false}
        >
            <Layer preventDefault={false}>
                {boxSet.map((box) => (
                    <React.Fragment key={box.id}>
                        {imagesLoaded && (
                            <>
                                <KonvaImage
                                    preventDefault={false}
                                    x={box.x * container.scaleFactor}
                                    y={box.y * container.scaleFactor}
                                    width={
                                        (box.rotated ? box.h : box.w) *
                                        container.scaleFactor
                                    }
                                    height={
                                        (box.rotated ? box.w : box.h) *
                                        container.scaleFactor
                                    }
                                    image={box.imageElement}
                                    rotation={box.rotated ? -90 : 0}
                                    offsetX={
                                        box.rotated
                                            ? box.h * container.scaleFactor
                                            : 0
                                    }
                                />
                                {/* Show border if showBorder is true */}
                                {showBorder && (
                                    <Rect
                                        preventDefault={false}
                                        x={box.x * container.scaleFactor}
                                        y={box.y * container.scaleFactor}
                                        width={
                                            (box.rotated ? box.h : box.w) *
                                            container.scaleFactor
                                        }
                                        height={
                                            (box.rotated ? box.w : box.h) *
                                            container.scaleFactor
                                        }
                                        stroke="black"
                                        strokeWidth={0.5}
                                        rotation={box.rotated ? -90 : 0}
                                        offsetX={
                                            box.rotated
                                                ? box.h * container.scaleFactor
                                                : 0
                                        }
                                    />
                                )}
                            </>
                        )}
                    </React.Fragment>
                ))}
            </Layer>
        </Stage>
    );
};

export default PageStage;
