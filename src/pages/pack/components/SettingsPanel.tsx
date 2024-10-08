import LabelInput from "../../../components/LabelInput";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    setAlgorithm,
    setContainer,
    setPackingFactor,
    setStartingMaxWidthFactor,
} from "../../../redux/features/slices/mainSlice";
import LabelSelectInput from "../../../components/LabelSelect";
import { paperSizes } from "../../../data/paperSizes";
import { packingFactors } from "../../../data/packingFactors";

const SettingsPanel = () => {
    const dispatch = useAppDispatch();
    const { startingMaxWidthFactor, container, inResizeMode, packingFactor, algorithm } =
        useAppSelector((state) => state.main);

    if (!inResizeMode) return null;

    return (
        <div className="flex flex-wrap justify-center gap-2">
            <LabelInput
                type="number"
                label="Initial max width %"
                labelClassName="min-w-[140px]"
                wrapperClassName="max-w-[230px]"
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
                label="Packing Efficiency"
                options={packingFactors.map(
                    ({ name, value }) => ({
                        label: name,
                        value,
                    })
                )}
                labelClassName="min-w-[90px]"
                wrapperClassName="max-w-[220px]"
                className="w-[50px]"
                value={packingFactor}
                onChange={(e) => {
                    const selectedPackingFactor = e.target.value;
                    dispatch(setPackingFactor(Number(selectedPackingFactor)));
                }}
            />
            <LabelSelectInput
                label="Algorithm"
                options={[{
                    label: "Efficient",
                    value: "efficient",
                }, {
                    label: "Simple",
                    value: "simple",
                }
                ]}
                labelClassName="min-w-[60px]"
                wrapperClassName="max-w-[170px] "
                className="w-[85px] "
                value={algorithm}
                onChange={(e) => {
                    const selectedAlgorithm = e.target.value as 'simple' | 'efficient';
                    dispatch(setAlgorithm(selectedAlgorithm));
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
                className="w-[50px] "

            />
        </div>
    );
};

export default SettingsPanel;
