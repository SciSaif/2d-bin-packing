import React, { useEffect, useRef, useState } from "react";
import { pack } from "./binPacking";
import { test1 } from "./binPacking/testcases";

interface Box {
    // img: HTMLImageElement;
    w: number;
    h: number;
    x: number;
    y: number;
    color?: string;
}

// function to get a random number between a range ( must be a whole number)
const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const App: React.FC = () => {
    const [boxes, setBoxes] = useState<Box[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(500);
    const [containerHeight, setContainerHeight] = useState<number>(500);
    const [numberOfBoxes, setNumberOfBoxes] = useState<number>(10);
    const [rangeW, setRangeW] = useState<[number, number]>([50, 50]);
    const [rangeH, setRangeH] = useState<[number, number]>([50, 50]);

    const goo = () => {
        // clear the canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // generate random boxes
        const randomBoxes: [number, number][] = [];
        for (let i = 0; i < numberOfBoxes; i++) {
            const w = randomRange(rangeW[0], rangeW[1]);
            const h = randomRange(rangeH[0], rangeH[1]);
            randomBoxes.push([w, h]);
        }

        const packedBoxes = pack(randomBoxes, [
            containerWidth,
            containerHeight,
        ]);

        setBoxes(packedBoxes);
    };

    useEffect(() => {
        if (boxes) {
            console.log("boxes", boxes);
            const boxesCopy = [...boxes];
            // apply random colors to each box
            boxesCopy.forEach((box) => {
                box.color = `#${Math.floor(Math.random() * 16777215).toString(
                    16
                )}`;
            });

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw the bounding box around the canvas
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            //  display each box in the boxes array , only show the borders of the boxes
            boxesCopy.forEach((box) => {
                // ctx.strokeStyle = box.color || "black";
                // ctx.strokeRect(box.x, box.y, box.w, box.h); // change fillRect to strokeRect

                //fill
                ctx.fillStyle = box.color || "black";
                ctx.fillRect(box.x, box.y, box.w, box.h);
            });
        }
    }, [boxes]);
    console.log("hi");

    return (
        <div className="px-2 py-2 flex flex-col gap-2">
            <h1 className="text-3xl text-cyan-500 mb-2 border-b pb-2 font-bold">
                Bin Packing
            </h1>
            <div className="flex flex-row gap-2 items-center">
                <label>Number of Boxes:</label>
                <input
                    type="number"
                    className="border border-gray-400 rounded-md px-2 py-1"
                    value={numberOfBoxes}
                    onChange={(e) => setNumberOfBoxes(+e.target.value)}
                />
            </div>

            <div className="flex flex-row gap-2 items-center">
                <label>Container dimensions:</label>
                <input
                    type="number"
                    className="border border-gray-400 rounded-md px-2 py-1"
                    value={containerWidth}
                    onChange={(e) => setContainerWidth(+e.target.value)}
                />
                <input
                    type="number"
                    className="border border-gray-400 rounded-md px-2 py-1"
                    value={containerHeight}
                    onChange={(e) => setContainerHeight(+e.target.value)}
                />
            </div>
            <div className="flex flex-row gap-2 items-center">
                <label>Width Range:</label>
                <input
                    type="number"
                    className="border border-gray-400 rounded-md px-2 py-1"
                    value={rangeW[0]}
                    onChange={(e) => setRangeW([+e.target.value, rangeW[1]])}
                />
                <input
                    className="border border-gray-400 rounded-md px-2 py-1"
                    type="number"
                    value={rangeW[1]}
                    onChange={(e) => setRangeW([rangeW[0], +e.target.value])}
                />
            </div>

            <div className="flex flex-row gap-2 items-center">
                <label>Height Range:</label>
                <input
                    type="number"
                    className="border border-gray-400 rounded-md px-2 py-1"
                    value={rangeH[0]}
                    onChange={(e) => setRangeH([+e.target.value, rangeH[1]])}
                />
                <input
                    type="number"
                    className="border border-gray-400 rounded-md px-2 py-1"
                    value={rangeH[1]}
                    onChange={(e) => setRangeH([rangeH[0], +e.target.value])}
                />
            </div>

            <button
                onClick={goo}
                className="w-fit px-10 py-2 rounded shadow text-white bg-cyan-500 hover:bg-cyan-600"
            >
                Gooo
            </button>
            <canvas
                ref={canvasRef}
                width={containerWidth}
                height={containerHeight}
                style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                }}
                className="w-fit"
            ></canvas>

            <footer className="mt-10 border-t ">
                <div className="text-center text-gray-500 text-sm">
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

export default App;
