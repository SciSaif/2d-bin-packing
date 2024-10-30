import { InformationCircleIcon } from '@heroicons/react/24/outline'
import LabelInput from '../LabelInput'
import { Margin, setContainer } from '../../redux/features/slices/mainSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ImageBox } from '../../pages/pack/Pack';
import { positionImages } from '../utils/resizingWindowUtils';

type MarginInputsProps = {
    localImages: ImageBox[];
    setLocalImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
    setMaxY: React.Dispatch<React.SetStateAction<number>>;
}

const MarginInputs = ({
    localImages,
    setLocalImages,
    setMaxY
}: MarginInputsProps) => {
    const dispatch = useAppDispatch();
    const { container } = useAppSelector((state) => state.main);

    const handleMarginChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        side: keyof Margin
    ) => {
        const newMarginValue = parseInt(e.target.value, 10);
        const newContainer = {
            ...container,
            margin: {
                ...container.margin,
                [side]: isNaN(newMarginValue) ? 0 : newMarginValue,
            },
        };

        dispatch(setContainer(newContainer));

        const { _localImages, _maxY } = positionImages(
            localImages,
            newContainer
        );
        setLocalImages(_localImages);
        setMaxY(Math.max(container.h, _maxY));
    };

    return (
        <div className="flex flex-col items-center justify-center w-full mb-10 border-t  border-b gap-y-2 max-w-[450px]">
            {/* margin controls */}
            <div className="flex flex-row text-sm text-center text-gray-500 gap-x-2">
                <InformationCircleIcon className="w-10 h-10 mr-1" />
                <p>
                    Most browser's print feature also allows you to set
                    custom margins. You can leave the margins at 0 if
                    you want.
                </p>
            </div>

            <div className="mr-1">Margin: </div>
            <div className="grid w-full grid-cols-2 gap-1 md:grid-cols-4">
                <LabelInput
                    type="number"
                    label="top"
                    value={container.margin.top}
                    onChange={(e) => handleMarginChange(e, "top")}
                />
                <LabelInput
                    type="number"
                    label="left"
                    value={container.margin.left}
                    onChange={(e) => handleMarginChange(e, "left")}
                />
                <LabelInput
                    type="number"
                    label="right"
                    value={container.margin.right}
                    onChange={(e) => handleMarginChange(e, "right")}
                />

                <LabelInput
                    type="number"
                    label="bottom"
                    value={container.margin.bottom}
                    onChange={(e) => handleMarginChange(e, "bottom")}
                />
            </div>
        </div>
    )
}

export default MarginInputs