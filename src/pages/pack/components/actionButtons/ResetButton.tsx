import Button from "../../../../components/Button";
import { resetState } from "../../../../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { clearFileInput } from "../../../../utils";
import { ImageBox } from "../../Pack";

type ResetButtonProps = {
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
    updateScaleFactor: () => void;
};

const ResetButton = ({
    setImages,
    setBoxes,
    updateScaleFactor,
}: ResetButtonProps) => {
    const dispatch = useAppDispatch();

    const reset = () => {
        setImages([]);
        setBoxes([]);
        dispatch(resetState());
        updateScaleFactor();
        clearFileInput();
    };

    return (
        <Button onClick={reset} className="bg-green-500 hover:bg-green-600">
            Reset
        </Button>
    );
};

export default ResetButton;
