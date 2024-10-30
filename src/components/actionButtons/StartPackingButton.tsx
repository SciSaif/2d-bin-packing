import React from "react";
import Button from "../Button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    setInResizeMode,
    setIsPacking,
    setPackingProgress,
} from "../../redux/features/slices/mainSlice";
import { ImageBox } from "../../pages/pack/Pack";
import { createWorkerInstance } from "../../workerUtils";


type StartPackingButtonsProps = {
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
    images: ImageBox[];
};

const StartPackingButton = ({ setBoxes, images }: StartPackingButtonsProps) => {
    const dispatch = useAppDispatch();
    const { container, packingFactor, algorithm } = useAppSelector((state) => state.main);

    const startPacking = async () => {
        dispatch(setIsPacking(true));
        dispatch(setInResizeMode(false));

        try {
            const workerInstance = createWorkerInstance();

            // Set up a message handler for the worker
            workerInstance.addEventListener('message', (event) => {
                if (event.data.type === 'progress') {
                    console.log(event.data.progress);
                    dispatch(setPackingProgress(Number(event.data.progress)));
                } else if (event.data.type === 'complete') {
                    const packedBoxes = event.data.result;
                    setBoxes(packedBoxes);
                    dispatch(setIsPacking(false));
                    dispatch(setPackingProgress(0));
                } else if (event.data.type === 'error') {
                    console.error(event.data.error);
                    dispatch(setIsPacking(false));
                }
            });

            // Start the packing process
            workerInstance.postMessage({
                type: 'start', payload: {
                    images, container, options: {
                        packingFactor, algorithm
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }

    };
    return (
        <Button
            onClick={() => startPacking()}
            className="px-8 py-2 font-bold text-white transition duration-200 border-2 border-transparent rounded-md bg-secondary-700 w-fit hover:bg-white hover:text-secondary-700 hover:border-secondary-700"
        >
            Start packing
        </Button>
    );
};

export default StartPackingButton;
