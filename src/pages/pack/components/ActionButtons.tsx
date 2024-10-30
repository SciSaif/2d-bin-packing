import { Stage } from "konva/lib/Stage";
import SaveAsPdfButton from "./actionButtons/SaveAsPDFButton";
import { ImageBox } from "../Pack";
import { useAppSelector } from "../../../redux/hooks";
import ResetButton from "./actionButtons/ResetButton";
import StartPackingButton from "./actionButtons/StartPackingButton";
import ResizeButton from "./actionButtons/ResizeButton";
import StopButton from "./actionButtons/StopButton";


type ActionButtonsProps = {
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
    boxes: ImageBox[][];
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    updateScaleFactor: () => void;
};

const ActionButtons = ({
    boxes,
    setBoxes,
    images,
    setImages,
    updateScaleFactor,
}: ActionButtonsProps) => {
    const { inResizeMode, isPacking } = useAppSelector((state) => state.main);
    return (
        <div className="flex flex-wrap justify-center w-full gap-2 py-2 mt-5 mb-5 ">
            {boxes.length > 0 && (
                <>
                    <SaveAsPdfButton boxes={boxes} />
                    <ResizeButton setBoxes={setBoxes} />
                </>
            )}
            {inResizeMode && images.length > 0 && (
                <StartPackingButton setBoxes={setBoxes} images={images} />
            )}
            {!isPacking && images.length > 0 && (
                <ResetButton
                    setBoxes={setBoxes}
                    setImages={setImages}
                    updateScaleFactor={updateScaleFactor}
                />
            )}
            {isPacking && <StopButton />}
        </div>
    );
};

export default ActionButtons;
