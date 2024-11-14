import { ImageBox } from "@/pages/pack/Pack";
import Button from "../Button";
import { printPages } from "@/utils";
import { useAppSelector } from "@/redux/hooks";

interface PrintButtonProps {
    boxes: ImageBox[][];
}


const PrintButton = ({ boxes }: PrintButtonProps) => {
    const { container } = useAppSelector((state) => state.main);

    const handlePrint = async () => {
        await printPages({ boxes, container });
    }

    return (
        <Button
            onClick={handlePrint}
            className="bg-purple-500 hover:bg-purple-600"
        >
            Print
        </Button>
    );
};

export default PrintButton;
