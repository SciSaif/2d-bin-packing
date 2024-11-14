import { useState } from "react";
import { ClipLoader } from "react-spinners";
import Button from "../Button";
import { ImageBox } from "../../pages/pack/Pack";
import { useAppSelector } from "../../redux/hooks";
import { saveAsPDF } from "@/utils";

interface SaveAsPdfButtonProps {
    boxes: ImageBox[][];
}

const SaveAsPdfButton = ({ boxes }: SaveAsPdfButtonProps) => {
    const [loadingPDF, setLoadingPDF] = useState(false);
    const { container } = useAppSelector((state) => state.main);

    const handlePdfSave = async () => {
        setLoadingPDF(true);
        await saveAsPDF({ boxes, container });
        setLoadingPDF(false);
    };

    return (
        <>
            {loadingPDF ? (
                <div className="flex flex-row items-center justify-center gap-2 px-2 py-2 text-white bg-green-500 hover:bg-green-600">
                    creating PDF
                    <ClipLoader color="white" size={16} />
                </div>
            ) : (
                <Button
                    onClick={handlePdfSave}
                    className="bg-green-500 hover:bg-green-600"
                >
                    Save as PDF
                </Button>
            )}
        </>
    );
};

export default SaveAsPdfButton;
