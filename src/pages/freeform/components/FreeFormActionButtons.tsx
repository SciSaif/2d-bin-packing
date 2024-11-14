import { useAppSelector } from "../../../redux/hooks";
import { ImageBox } from "@/pages/pack/Pack";
import ResetButton from "@/components/actionButtons/ResetButton";
import SaveAsPdfButton from "@/components/actionButtons/SaveAsPDFButton";
import ResizeButton from "@/components/actionButtons/ResizeButton";
import ShowFreeFormResult from "@/components/actionButtons/ShowFreeFormResult";
import PrintButton from "@/components/actionButtons/PrintButton";



type ActionButtonsProps = {
    setBoxes: React.Dispatch<React.SetStateAction<ImageBox[][]>>;
    boxes: ImageBox[][];
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    updateScaleFactor: () => void;
};

const FreeFormActionButtons = ({
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
                    {
                        <div className="hidden md:flex">

                            <PrintButton boxes={boxes} />
                        </div>
                    }
                    <ResizeButton setBoxes={setBoxes} />
                </>
            )}
            {inResizeMode && images.length > 0 && (
                <ShowFreeFormResult setBoxes={setBoxes} images={images} />
            )}
            {images.length > 0 && (
                <ResetButton
                    setBoxes={setBoxes}
                    setImages={setImages}
                    updateScaleFactor={updateScaleFactor}
                />
            )}
        </div>
    );
};

export default FreeFormActionButtons;
