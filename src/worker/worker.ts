/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { packBoxes as pack, PackBoxesProps } from "../pages/pack/packUtils";

export const packBoxes = async (data: PackBoxesProps) => {
    return await pack(data);
};
