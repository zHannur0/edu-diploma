"use client"

import React, { TextareaHTMLAttributes, useRef, useState, useEffect } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    iconStart?: string;
    iconEnd?: string;
    label?: string;
    placeholder?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, placeholder, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleBlur = () => {
        setIsFocused(false);
        if (textareaRef.current) {
            setHasContent(textareaRef.current.value.trim().length > 0);
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Сбросим высоту перед расчётом
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем новую высоту
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    return (
        <div className={`relative w-full flex items-start gap-2 rounded-[14px] px-4 py-[10px] border ${isFocused ? "border-[#7B68EE]" : "border-[#E6E8EA]"}`}>
            {label && (isFocused || hasContent) && (
                <label className="absolute left-3 top-0 -translate-y-1/2 px-2 text-[#546173] text-xs bg-white transition-all px-[6px] rounded-2xl">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                ref={textareaRef}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onInput={handleInput}
                placeholder={placeholder}
                className="w-full border-none outline-none focus:outline-none min-h-[100px] resize-none text-sm"
            />
        </div>
    );
};

export default Textarea;
