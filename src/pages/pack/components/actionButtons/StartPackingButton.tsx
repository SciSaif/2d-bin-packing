import React from "react";
import Button from "../../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    setInResizeMode,
    setIsPacking,
} from "../../../../redux/features/slices/mainSlice";
import { ImageBox } from "../../Pack";
import { workerInstance } from "../../../../workerUtils";
import { releaseProxy } from "comlink";

type StartPackingButtonsProps = {
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
    images: ImageBox[];
};

const StartPackingButton = ({ setBoxes, images }: StartPackingButtonsProps) => {
    const dispatch = useAppDispatch();
    const { container } = useAppSelector((state) => state.main);

    const startPacking = async () => {
        dispatch(setIsPacking(true));
        dispatch(setInResizeMode(false));
        let packedBoxes: ImageBox[][] = [];

        // terminate worker after 5 seconds
        setTimeout(() => {
            workerInstance[releaseProxy]();
        }, 5000);
        try {
            packedBoxes = await workerInstance.packBoxes({ images, container });
        } catch (error) {
            console.error(error);
        }
        console.log("setting is packing to false");
        dispatch(setIsPacking(false));
        setBoxes(packedBoxes);
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
