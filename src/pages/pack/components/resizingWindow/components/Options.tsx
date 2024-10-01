import { Crop } from "lucide-react";
import Button from "../../../../../components/Button";
import { useState } from "react";
import CropModal from "./CropModal";
import { ImageBox } from "../../../Pack";

type OptionsProps = {
    id: string;
    images: ImageBox[];
    setImages: React.Dispatch<React.SetStateAction<ImageBox[]>>;
}

const Options = (
    { id, images, setImages }: OptionsProps
) => {
    const [showCropModal, setShowCropModal] = useState(false);
    return (
        <div
            style={{
                position: "absolute",
                left: -2,
                top: -30,
                height: 25,
            }}
            className="options    rounded   md:w-[16px] md:h-[16px] "
        >
            {/* crop button */}
            <Button
                className="flex items-center justify-center h-full text-sm text-black bg-white border shadow hover:bg-slate-200"
                onClick={() => setShowCropModal(true)}
            >
                <Crop size={16} /> crop

            </Button>
            {
                showCropModal && <CropModal id={id} images={images} setImages={setImages} close={() => setShowCropModal(false)}/>
            }

        </div>
    )
}

export default Options