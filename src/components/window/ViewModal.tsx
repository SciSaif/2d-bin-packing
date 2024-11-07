import { useAppSelector } from '@/redux/hooks';
import { ImageBox } from '../../pages/pack/Pack';
import 'react-image-crop/dist/ReactCrop.css'

type ViewModalProps = {
    images: ImageBox[];
    id: string;
    close: () => void;
    imageUrl: string;

}

const ViewModal = (
    { images, id, close, imageUrl }: ViewModalProps
) => {
    const { container, showBorder } = useAppSelector((state) => state.main);
    const imgData = images.find((image) => image.id === id);
    if (!imgData) return null;

    const adjustedScaleFactor = container.scaleFactor * 0.8;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div
                className="p-4 bg-white rounded shadow-lg"
                style={{
                    maxWidth: '90vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <h1 className="mb-5 text-lg font-semibold">Image size compared to paper size</h1>
                <div
                    style={{
                        width: container.w * adjustedScaleFactor,
                        minWidth: container.w * adjustedScaleFactor,
                        height: container.h * adjustedScaleFactor,
                        minHeight: container.h * adjustedScaleFactor,
                        maxWidth: container.w * adjustedScaleFactor,
                        maxHeight: container.h * adjustedScaleFactor,
                        border: "1px solid black",
                        position: "relative",
                        overflow: "hidden",

                    }}
                    className="bg-white shadow-xl "
                >
                    <div
                        key={imgData.id}
                        data-id={imgData.id}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: (imgData.rotated ? imgData.h : imgData.w) * adjustedScaleFactor,
                            height: (imgData.rotated ? imgData.w : imgData.h) * adjustedScaleFactor,
                            transform: imgData.rotated ? ` rotate(-90deg) translate(-${imgData.h * adjustedScaleFactor}px,0) ` : "none",
                            transformOrigin: "top left",
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: "cover",
                            border:
                                showBorder
                                    ? "1px solid black"
                                    : "none",

                        }}

                    >
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={close}
                        className="px-4 py-2 mr-2 bg-gray-200 rounded"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );


}

export default ViewModal