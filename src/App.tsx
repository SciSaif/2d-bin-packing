import React, { useEffect, useRef, useState } from "react";
import { pack } from "./binPacking";
import { test1 } from "./binPacking/testcases";
const containerWidth = 500;
const containerHeight = 500;
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

    const goo = () => {
        // clear the canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // generate random boxes
        const randomBoxes: [number, number][] = [];
        for (let i = 0; i < 41; i++) {
            const w = randomRange(50, 100);
            const h = randomRange(100, 200);
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

            // put a bounding box around the canvas
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
        <div>
            <button onClick={goo}>Gooo</button>
            <canvas
                ref={canvasRef}
                width={containerWidth}
                height={containerHeight}
            ></canvas>
        </div>
    );
};

export default App;
