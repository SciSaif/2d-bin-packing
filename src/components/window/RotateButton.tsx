import { RotateCcwSquare } from "lucide-react";

type RotateButtonProps = {
    rotateImage: () => void;
};


const RotateButton = ({ rotateImage }: RotateButtonProps) => {
    return (
        <div
            className=" w-[60px] select-none h-[25px] flex gap-1 hover:bg-slate-100 justify-center items-center  md:w-[60px] md:h-[16px]   cursor-pointer bg-white border-slate-200 border text-black rounded-lg translate-x-1/2"
            style={{
                position: "absolute",
                right: '50%',
                top: -20,
                zIndex: 40
            }}
            onClick={rotateImage}
        >
            <div className="">
                <RotateCcwSquare
                    size={12}
                    className="text-black/70"

                />

            </div>
            <p className="text-xs">rotate</p>
        </div>
    );
};

export default RotateButton;
