import React, { useEffect, useRef, useState } from "react";
import { UnpackedRect } from "../binPacking/configuration";
import { pack } from "../binPacking";

interface Box {
    // img: HTMLImageElement;
    id: string;
    w: number;
    h: number;
    x: number;
    y: number;
    rotated: boolean;
    color?: string;
}

// function to get a random number between a range ( must be a whole number)
const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const AlgoTest: React.FC = () => {
    const [containerWidth, setContainerWidth] = useState<number>(1000);
    const [boxes, setBoxes] = useState<Box[][]>([]);
    const [canvasRefs, setCanvasRefs] = useState<
        React.RefObject<HTMLCanvasElement>[]
    >([]);

    const [containerHeight, setContainerHeight] = useState<number>(1500);
    const [numberOfBoxes, setNumberOfBoxes] = useState<number>(10);
    const [rangeW, setRangeW] = useState<[number, number]>([50, 700]);
    const [rangeH, setRangeH] = useState<[number, number]>([50, 700]);

    const goo = async () => {
        // clear the canvas
        // const canvas = canvasRef.current;
        // if (!canvas) return;
        // const ctx = canvas.getContext("2d");
        // if (!ctx) return;
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        // // // generate random boxes
        const randomBoxes: UnpackedRect[] = [];
        for (let i = 0; i < numberOfBoxes; i++) {
            const w = randomRange(rangeW[0], rangeW[1]);
            const h = randomRange(rangeH[0], rangeH[1]);
            randomBoxes.push({ w, h, id: i.toString() });
        }

        // const packedBoxes = pack(randomBoxes, {
        //     w: containerWidth,
        //     h: containerHeight,
        // });

        // setBoxes(packedBoxes);
        let remainingRectangles = randomBoxes;
        const allPackedBoxes: Box[][] = [];

        while (remainingRectangles.length > 0) {
            const { packed_rectangles, unpacked_rectangles } = await pack(
                remainingRectangles,
                {
                    w: containerWidth,
                    h: containerHeight,
                }
            );

            allPackedBoxes.push(packed_rectangles);
            remainingRectangles = unpacked_rectangles;
        }

        setBoxes(allPackedBoxes);
        setCanvasRefs(
            allPackedBoxes.map(() => React.createRef<HTMLCanvasElement>())
        );
    };

    useEffect(() => {
        boxes.forEach((boxSet, canvasIndex) => {
            // apply random colors to each box
            boxSet.forEach((box) => {
                box.color = `#${Math.floor(Math.random() * 16777215).toString(
                    16
                )}`;
            });

            const canvas = canvasRefs[canvasIndex].current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw the bounding box around the canvas
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            boxSet.forEach((box) => {
                //fill
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = box.color || "black";
                ctx.fillRect(box.x, box.y, box.w, box.h);

                // also draw the borders
                ctx.strokeStyle = "red";
                ctx.strokeRect(box.x, box.y, box.w, box.h);
                ctx.globalAlpha = 1;
            });
        });
    }, [boxes, canvasRefs]);

    // useEffect(() => {
    //     if (boxes) {
    //         console.log("boxes", boxes);
    //         const boxesCopy = [...boxes];

    //         // apply random colors to each box
    // boxesCopy.forEach((box) => {
    //     box.color = `#${Math.floor(Math.random() * 16777215).toString(
    //         16
    //     )}`;
    // });

    //         const canvas = canvasRef.current;
    //         if (!canvas) return;
    //         const ctx = canvas.getContext("2d");
    //         if (!ctx) return;
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);

    //         // Redraw the bounding box around the canvas
    //         ctx.strokeStyle = "black";
    //         ctx.strokeRect(0, 0, canvas.width, canvas.height);

    //         //  display each box in the boxes array , only show the borders of the boxes
    //         boxesCopy.forEach((box) => {
    //             //fill
    //             ctx.globalAlpha = 0.5;
    //             ctx.fillStyle = box.color || "black";
    //             ctx.fillRect(box.x, box.y, box.w, box.h);

    //             // also draw the borders
    //             ctx.strokeStyle = "red";
    //             ctx.strokeRect(box.x, box.y, box.w, box.h);
    //             ctx.globalAlpha = 1;
    //         });
    //     }
    // }, [boxes]);

    return (
        <div className="flex flex-col gap-2 px-2 py-2">
            <h1 className="pb-2 mb-2 text-3xl font-bold border-b text-cyan-500">
                Bin Packing
            </h1>
            <div className="flex flex-row items-center gap-2">
                <label>Number of Boxes:</label>
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={numberOfBoxes}
                    onChange={(e) => setNumberOfBoxes(+e.target.value)}
                />
            </div>

            <div className="flex flex-row items-center gap-2">
                <label>Container dimensions:</label>
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={containerWidth}
                    onChange={(e) => setContainerWidth(+e.target.value)}
                />
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={containerHeight}
                    onChange={(e) => setContainerHeight(+e.target.value)}
                />
            </div>
            <div className="flex flex-row items-center gap-2">
                <label>Width Range:</label>
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={rangeW[0]}
                    onChange={(e) => setRangeW([+e.target.value, rangeW[1]])}
                />
                <input
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    type="number"
                    value={rangeW[1]}
                    onChange={(e) => setRangeW([rangeW[0], +e.target.value])}
                />
            </div>

            <div className="flex flex-row items-center gap-2">
                <label>Height Range:</label>
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={rangeH[0]}
                    onChange={(e) => setRangeH([+e.target.value, rangeH[1]])}
                />
                <input
                    type="number"
                    className="px-2 py-1 border border-gray-400 rounded-md"
                    value={rangeH[1]}
                    onChange={(e) => setRangeH([rangeH[0], +e.target.value])}
                />
            </div>

            <button
                onClick={goo}
                className="px-10 py-2 text-white rounded shadow w-fit bg-cyan-500 hover:bg-cyan-600"
            >
                Gooo
            </button>
            {boxes.map((boxSet, index) => (
                <canvas
                    key={index}
                    ref={canvasRefs[index]}
                    width={containerWidth}
                    height={containerHeight}
                    style={{
                        width: `${containerWidth}px`,
                        height: `${containerHeight}px`,
                    }}
                    className="w-fit"
                ></canvas>
            ))}
            {/* <canvas
                ref={canvasRef}
                width={containerWidth}
                height={containerHeight}
                style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                }}
                className="w-fit"
            ></canvas> */}

            <footer className="mt-10 border-t ">
                <div className="text-sm text-center text-gray-500">
                    <p>
                        Made with{" "}
                        <span role="img" aria-label="heart">
                            ❤️
                        </span>{" "}
                        by saifullah rahman (sciSaif)
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AlgoTest;
