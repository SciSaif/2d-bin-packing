// worker instance
export const workerInstance = new ComlinkWorker<typeof import("./sw/worker")>(
    new URL("./sw/worker", import.meta.url)
);
