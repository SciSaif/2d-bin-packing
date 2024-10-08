/// <reference lib="webworker" />

import {
    efficientPackingProps,
    efficientPacking as efficientPack,
} from "@/algorithms/efficient";
import { Algorithm } from "@/redux/features/slices/mainSlice";

declare const self: DedicatedWorkerGlobalScope;

const efficientPacking = async (data: efficientPackingProps) => {
    return await efficientPack(data);
};

self.addEventListener("message", (event) => {
    if (event.data.type === "start") {
        const algorithm: Algorithm = event.data.payload.options.algorithm;
        if (algorithm === "efficient") {
            efficientPacking(event.data.payload)
                .then((result) => {
                    self.postMessage({ type: "complete", result });
                })
                .catch((error) => {
                    self.postMessage({ type: "error", error: error.message });
                });
        }
    }
});
