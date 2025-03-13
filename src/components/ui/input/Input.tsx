"use client"

import React from "react"
import {useState} from "react";
import Image from "next/image";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    iconStart?: string;
    iconEnd?: string;
    label?: string;
    placeholder?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({label, iconStart, iconEnd, placeholder, ...props}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    return (
        <div className={`relative w-full flex items-center gap-2 max-w-[520px] rounded-[14px] px-4 py-[10px] border ${isFocused ? "border-[#7B68EE]" : "border-[#E6E8EA]"}`}>
            {
                label && (
                    <label
                        className="absolute left-3 top-0 -translate-y-1/2 px-2 text-[#546173] text-xs bg-white transition-all px-[6px] rounded-2xl"
                    >
                        {label}
                    </label>
                )
            }
            {
                iconStart && (
                    <Image src={iconStart} alt={"iconStart"} width={24} height={24} className={"w-6 h-6"}/>
                )
            }
            <input
                {...props}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(value !== "")}
                placeholder={placeholder}
                className="w-full border-none outline-none focus:outline-none h-full text-sm"
            />
            {
                iconEnd && (
                    <Image src={iconEnd} alt={"iconEnd"} width={24} height={24} className={"w-6 h-6"}/>
                )
            }
        </div>
    );
}

export default Input;

