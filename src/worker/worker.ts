/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { packBoxes as pack, PackBoxesProps } from "../pages/pack/packUtils";

export const packBoxes = async (data: PackBoxesProps) => {
    return await pack(data);
};

self.addEventListener('message', (event) => {
    if (event.data.type === 'start') {
        packBoxes(event.data.payload).then((result) => {
            self.postMessage({ type: 'complete', result });
        }).catch((error) => {
            self.postMessage({ type: 'error', error: error.message });
        });
    }
});
