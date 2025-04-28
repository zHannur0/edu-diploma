"use client"

import React, {InputHTMLAttributes, useRef} from "react"
import {useState} from "react";
import Image from "next/image";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    iconStart?: string | React.ReactNode;
    iconEnd?: string | React.ReactNode;
    label?: string;
    placeholder?: string;
    type?: string;
    validate?: boolean;
    onIconEndClick?: () => void;
}

const renderIcon = (icon: string | React.ReactNode | undefined, altText: string = "icon") => {
    if (!icon) return null;
    // Если это строка, используем next/image (предполагаем, что это путь)
    if (typeof icon === 'string') {
        return <Image src={icon} alt={altText} width={24} height={24} className="w-6 h-6 flex-shrink-0" />;
    }
    // Иначе рендерим как React узел (компонент lucide-react)
    // Оборачиваем в span для выравнивания и размера, если нужно
    return <span className="flex items-center justify-center w-6 h-6 flex-shrink-0">{icon}</span>;
};

const Input: React.FC<InputProps> = ({label, iconStart, iconEnd, placeholder, value, onChange, onIconEndClick, ...props}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = () => {
        setIsFocused(false);
        if (inputRef.current) {
            setHasContent(inputRef.current.value.trim().length > 0);
        }
    };

    return (
        <div className={`relative bg-white h-11 w-full flex items-center gap-2 rounded-[14px] px-4 py-[10px] border ${isFocused ? "border-[#7B68EE]" : "border-[#E6E8EA]"}`}>
            {
                label && (isFocused || hasContent)  ? (
                    <label
                        className="absolute left-3 top-0 -translate-y-1/2 px-2 text-[#546173] text-xs bg-white transition-all px-[6px] rounded-2xl"
                    >
                        {label}
                    </label>
                ) : null
            }
            {renderIcon(iconStart, "iconStart")}
            <input
                {...props}
                ref={inputRef}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full border-none outline-none focus:outline-none h-full text-sm"
            />
            {iconEnd && (
                <button
                    type="button"
                    onClick={onIconEndClick}
                    className={"p-0 border-none bg-transparent cursor-pointer flex-shrink-0"}
                    aria-label="Toggle password visibility" // Можно сделать более специфичным в PasswordInput
                    data-testid="icon-end-button"
                >
                    {renderIcon(iconEnd, "iconEnd")}
                </button>
            )}
        </div>
    );
}

export default Input;

