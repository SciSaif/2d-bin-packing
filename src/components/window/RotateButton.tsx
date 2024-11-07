import { RotateCcwSquare } from "lucide-react";

type RotateButtonProps = {
    rotateImage: () => void;
};


const RotateButton = ({ rotateImage }: RotateButtonProps) => {
    return (
        <div
            className=" w-[60px] p-1 select-none h-[25px] flex right-1/2 top-[-30px] md:top-[-20px] gap-1 hover:bg-slate-100 justify-center items-center  md:w-[60px] md:h-[18px]   cursor-pointer bg-white border-slate-200 border text-black rounded-lg translate-x-1/2"
            style={{
                position: "absolute",
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
