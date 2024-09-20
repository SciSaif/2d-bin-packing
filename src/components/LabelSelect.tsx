import React, { SelectHTMLAttributes, Ref, forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
    value: string | number;
    label: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    labelClassName?: string;
    wrapperClassName?: string;
}

function LabelSelectInput({
    label,
    disabled,
    labelClassName,
    wrapperClassName,
    className,
    options,
    value,
    ...rest
}: Props) {
    const id = useId();
    const selectedLabel = options.find((option) => option.value === value)?.label;

    return (
        <label
            className={twMerge(
                "flex flex-row justify-center items-center pl-2 bg-slate-100 text-black text-sm border rounded cursor-pointer",
                wrapperClassName
            )}
        >
            <span
                className={twMerge(
                    "flex items-center h-full pr-2 text-sm border-r",
                    labelClassName
                )}
            >
                {label}
            </span>
            <select
                id={id}
                disabled={disabled}
                value={value}
                {...rest}
                className={twMerge(
                    `w-full
				   text-black   pl-2 pr-1 py-2 bg-white
				  focus:outline-none
				  `,
                    disabled && "text-gray-500 ",
                    className
                )}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
          
        </label>
    );
}

export default LabelSelectInput;
