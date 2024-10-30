import LabelInput from "../LabelInput";
import { setContainer, setShowBorder } from "../../redux/features/slices/mainSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

type ResizeWindowSettingsProps = {
    showMarginControls: boolean;
    setShowMarginControls: React.Dispatch<React.SetStateAction<boolean>>;
    freeform?: boolean
};

const ResizeWindowSettings = ({
    showMarginControls,
    setShowMarginControls,
    freeform
}: ResizeWindowSettingsProps) => {
    const dispatch = useAppDispatch();
    const { container, showBorder } = useAppSelector((state) => state.main);

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 wrap ">
            {
                !freeform && <>
                    <button
                        onClick={() => setShowMarginControls(!showMarginControls)}
                        className="px-2 py-2   text-sm w-[150px] text-black bg-slate-100 rounded  hover:bg-slate-200 shadow"
                    >
                        {showMarginControls ? "Hide Margins" : "Show Margins"}
                    </button>

                    <LabelInput
                        type="number"
                        label="Padding"
                        min={0}
                        max={30}
                        value={container.padding}
                        onChange={(e) => {
                            let padding = parseInt(e.target.value, 10);
                            if (isNaN(padding)) padding = 0;
                            dispatch(
                                setContainer({
                                    ...container,
                                    padding,
                                })
                            );
                        }}
                    />
                </>

            }


            <button
                onClick={() => {
                    dispatch(setShowBorder(!showBorder));
                }}
                className="px-2 py-2   text-sm w-[150px] text-black bg-slate-100 rounded  hover:bg-slate-200 shadow"
            >
                {showBorder ? "Hide Border" : "Show Border"}
            </button>
        </div>
    )
}

export default ResizeWindowSettings