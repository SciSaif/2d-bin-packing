import { Stage } from "konva/lib/Stage";
import Button from "../../../../components/Button";
import { handlePrintMultipleStages } from "../../utils";

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
