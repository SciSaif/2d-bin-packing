import Konva from "konva";
import Button from "../../../components/Button";
import { handlePrintMultipleStages } from "../utils";
import { Stage } from "konva/lib/Stage";

type PrintButtonProps = {
    stageRefs: React.RefObject<Stage>[];
};

const PrintButton = ({ stageRefs }: PrintButtonProps) => {
    if (!stageRefs.length) return null;

    return (
        <Button
            onClick={() =>
                handlePrintMultipleStages(stageRefs.map((ref) => ref.current))
            }
            className="bg-purple-500 hover:bg-purple-600"
        >
            Print
        </Button>
    );
};

export default PrintButton;
