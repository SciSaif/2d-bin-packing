import React from "react";
import { ImageBox } from "../../Pack";
import { useAppDispatch } from "../../../../redux/hooks";
import Button from "../../../../components/Button";
import {
    setImagesLoaded,
    setInResizeMode,
    setIsResizingAgain,
} from "../../../../redux/features/slices/mainSlice";

type ResizeButtonProps = {
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
};

const ResizeButton = ({ setBoxes }: ResizeButtonProps) => {
    const dispatch = useAppDispatch();
    return (
        <Button
            onClick={() => {
                dispatch(setIsResizingAgain(true));
                dispatch(setInResizeMode(true));
                dispatch(setImagesLoaded(false));
                setBoxes([]);
            }}
            className="bg-yellow-500 hover:bg-yellow-600"
        >
            Resize images
        </Button>
    );
};

export default ResizeButton;
