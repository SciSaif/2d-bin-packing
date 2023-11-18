import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import React from "react";
import { twMerge } from "tailwind-merge";

const MarginHandleIcon = ({ className }: { className?: string }) => {
    return (
        <div
            className={twMerge(
                "flex flex-col items-center justify-center",
                className
            )}
        >
            <div className="w-[14px] h-[10px] bg-blue-700 rounded-t"></div>
            <ChevronDoubleDownIcon className="w-5 h-5 -mt-[4px] text-blue-700" />
        </div>
    );
};

export default MarginHandleIcon;
