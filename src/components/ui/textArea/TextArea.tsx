"use client";

import React, { TextareaHTMLAttributes, useRef, useState } from "react";
import Image from "next/image";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    iconStart?: string;
    iconEnd?: string;
    label?: string;
    placeholder?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, iconStart, iconEnd, placeholder, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleBlur = () => {
        setIsFocused(false);
        if (textareaRef.current) {
            setHasContent(textareaRef.current.value.trim().length > 0);
        }
    };

    return (
        <div className={`relative w-full flex items-start gap-2 max-w-[520px] rounded-[14px] px-4 py-[10px] border ${isFocused ? "border-[#7B68EE]" : "border-[#E6E8EA]"}`}>
            {label && (isFocused || hasContent) && (
                <label className="absolute left-3 top-0 -translate-y-1/2 px-2 text-[#546173] text-xs bg-white transition-all px-[6px] rounded-2xl">
                    {label}
                </label>
            )}
            {iconStart && (
                <Image src={iconStart} alt="iconStart" width={24} height={24} className="w-6 h-6" />
            )}
            <textarea
                {...props}
                ref={textareaRef}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full border-none outline-none focus:outline-none h-[100px] resize-none text-sm"
            />
            {iconEnd && (
                <Image src={iconEnd} alt="iconEnd" width={24} height={24} className="w-6 h-6" />
            )}
        </div>
    );
};

export default Textarea;
