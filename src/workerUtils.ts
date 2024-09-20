import { endpointSymbol } from "vite-plugin-comlink/symbol";
import { packBoxes } from "./worker/worker";

let workerInstance = new ComlinkWorker<typeof import("./worker/worker")>(
    new URL("./worker/worker", import.meta.url)
);

// function to create a worker instance
export function createWorkerInstance() {
    // terminate the previous worker instance
    terminateWorkerInstance();
    workerInstance = new ComlinkWorker<typeof import("./worker/worker")>(
        new URL("./worker/worker", import.meta.url)
    );
    return workerInstance[endpointSymbol];
}

export function terminateWorkerInstance() {
    workerInstance[endpointSymbol].terminate();
}
