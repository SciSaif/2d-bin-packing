import React, { InputHTMLAttributes, Ref, forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    labelClassName?: string;
    wrapperClassName?: string;
}

function LabelInput(
    {
        type,
        label,
        disabled,
        labelClassName,
        wrapperClassName,
        className,
        min,
        max,
        ...rest
    }: Props,
    ref: Ref<HTMLInputElement>
) {
    const id = useId();

    return (
        <label
            className={twMerge(
                "flex flex-row justify-center items-center  pl-2 bg-slate-100 text-black text-sm border rounded cursor-pointer ",
                wrapperClassName
            )}
        >
            <span
                className={twMerge(
                    "flex items-center h-full pr-2 text-sm border-r ",
                    labelClassName
                )}
            >
                {label}
            </span>
            <input
                min={min}
                max={max}
                type={type}
                id={id}
                placeholder={label}
                disabled={disabled}
                {...rest}
                className={twMerge(
                    `w-full
				   placeholder  placeholder-slate-300 text-black   pl-2 pr-1 py-2 bg-white
				  focus:outline-none
			
				  `,
                    disabled && "text-gray-500 ",
                    className
                )}
            />
        </label>
    );
}
export default LabelInput;
