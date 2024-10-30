import { createRef, useRef, useState } from 'react'
import FileDropArea from '../pack/components/FileDropArea'
import { ImageBox } from '../pack/Pack';
import SettingsPanel from '../pack/components/SettingsPanel';
import { useAppSelector } from '@/redux/hooks';
import FreeFormWindow from './components/freeFormWindow/FreeFormWindow';
import { useScaleFactor } from '@/hooks/useScaleFactor';
import PageStage from '../pack/components/PageStage';
import Konva from 'konva';

const FreeForm = () => {
    const { inResizeMode, container } = useAppSelector((state) => state.main);
    const [boxes, setBoxes] = useState<ImageBox[][]>([]);
    const [images, setImages] = useState<ImageBox[]>([]);
    const stageRefs = boxes.map(() => createRef<Konva.Stage>());
    const containerWrapper = useRef<HTMLDivElement>(null);

    const updateScaleFactor = useScaleFactor(containerWrapper);


    return (
        <div className="flex flex-col px-2 py-10 sm:px-10">
            <div className="flex flex-col items-center justify-center mt-5 text-center">
                <h1 className="mb-2 text-xl font-bold text-secondary-900 sm:text-2xl">
                    FreeForm Mode
                </h1>
                <p className="sm:text-lg">Freely arrange the images on the paper for printing</p>
                <FileDropArea
                    images={images}
                    setImages={setImages}
                />
                <SettingsPanel freeform />

                {inResizeMode && images?.length > 0 && (
                    <FreeFormWindow setImages={setImages} images={images} />
                )}
                <div
                    ref={containerWrapper}
                    className="flex flex-wrap w-full items-center justify-center mx-auto   max-w-[1050px] gap-y-10 gap-x-5 "
                    style={{ overscrollBehavior: "auto" }}
                >
                    {boxes &&
                        boxes.map((boxSet, index) => (
                            <PageStage
                                key={index}
                                boxSet={boxSet}
                                stageRef={stageRefs}
                                index={index}
                            />
                        ))}
                </div>


            </div>
        </div>
    )
}

export default FreeForm