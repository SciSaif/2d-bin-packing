import LabelInput from "../../../components/LabelInput";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    setContainer,
    setStartingMaxWidthFactor,
} from "../../../redux/features/slices/mainSlice";
import LabelSelectInput from "../../../components/LabelSelect";
import { paperSizes } from "../../../data/paperSizes";

const SettingsPanel = () => {
    const dispatch = useAppDispatch();
    const { startingMaxWidthFactor, container, inResizeMode } = useAppSelector(
        (state) => state.main
    );

    if (!inResizeMode) return null;

    return (
        <div className="flex justify-center gap-2">
            <LabelInput
                type="number"
                label="Initial max width %"
                labelClassName="min-w-[150px]"
                wrapperClassName="max-w-[250px]"
                min={10}
                max={100}
                value={startingMaxWidthFactor * 100}
                onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (isNaN(value)) value = 0;

                    dispatch(setStartingMaxWidthFactor(value / 100));
                }}
            />

            <LabelSelectInput
                label="Paper"
                options={Object.values(paperSizes).map(({ name }) => ({
                    value: name,
                    label: name,
                }))}
                value={container.paperSize.name}
                onChange={(e) => {
                    const selectedPaperSizeName = e.target.value;
                    const selectedPaperSize = paperSizes[selectedPaperSizeName];

                    if (selectedPaperSize) {
                        const newContainer = {
                            ...container,
                            paperSize: selectedPaperSize,
                            w: selectedPaperSize.width * 2,
                            h: selectedPaperSize.height * 2,
                        };

                        dispatch(setContainer(newContainer));
                    }
                }}
            />
        </div>
    );
};

export default SettingsPanel;
