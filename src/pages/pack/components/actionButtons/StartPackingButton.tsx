import React from "react";
import Button from "../../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
    setInResizeMode,
    setIsPacking,
} from "../../../../redux/features/slices/mainSlice";
import { ImageBox } from "../../Pack";
import { workerInstance } from "../../../../workerUtils";

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
        <Button onClick={() => startPacking()} className="">
            Start packing
        </Button>
    );
};

export default StartPackingButton;
