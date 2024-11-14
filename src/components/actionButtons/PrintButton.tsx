import Button from "../Button";

type PrintButtonProps = {
    stageRefs: any
};

const PrintButton = ({ stageRefs }: PrintButtonProps) => {
    if (!stageRefs.length) return null;

    return (
        <Button
            // onClick={() =>
            //     // handlePrintMultipleStages(stageRefs.map((ref) => ref.current))
            // }
            className="bg-purple-500 hover:bg-purple-600"
        >
            Print
        </Button>
    );
};

export default PrintButton;
