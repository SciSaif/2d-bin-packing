/// <reference lib="webworker" />

import { ImageBox } from "../pages/home/Home";
import { packBoxes } from "../pages/home/utils";
import { ContainerType } from "../redux/features/slices/mainSlice";

declare const self: DedicatedWorkerGlobalScope;

export const packBoxesInWorker = async (data: {
    images: ImageBox[];
    container: ContainerType;
}) => {
    return await packBoxes(data);
};
