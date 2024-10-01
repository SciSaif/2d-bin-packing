import { ArrowDownIcon, ArrowSmallDownIcon } from "@heroicons/react/24/outline";

const ResizeAnchor = () => {
    return (
        <div
            className="resize-handle w-[25px] h-[25px] text-blue-700  md:w-[16px] md:h-[16px] "
            style={{
                position: "absolute",
                right: 0,
                bottom: 0,

                backgroundColor: "white",
                cursor: "se-resize",
                border: "1px solid blue",
            }}
        >
            <div className="relative h-full pointer-events-none ">
                <ArrowDownIcon
                    strokeWidth={2}
                    className="rotate-[135deg] w-[16px] md:w-[10px] absolute top-[-1px] left-[-1px] "
                />
                <ArrowDownIcon
                    strokeWidth={2}
                    className="rotate-[-45deg] w-[16px] md:w-[10px] right-[-2px] bottom-[-2px] absolute  "
                />
            </div>
        </div>
    );
};

export default ResizeAnchor;
