"use client"

import { Eye, EyeOff } from 'lucide-react';
import Input, { InputProps } from "@/components/ui/input/Input";
import React, { useState } from "react";

interface PasswordInputProps extends Omit<InputProps, 'type' | 'iconEnd' | 'onIconEndClick'> {
    typeLabel?: number;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ typeLabel = 1, ...props }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    const currentIcon = isPasswordVisible
        ? <Eye size={20} strokeWidth={1.5} className="text-[#7D7C81]" />
        : <EyeOff size={20} strokeWidth={1.5} className="text-[#7D7C81]" />;
    
    const currentType = isPasswordVisible ? "text" : "password";

    return (
        <Input
            iconEnd={currentIcon}
            type={currentType}
            label={typeLabel === 1 ? "Құпия сөз" : "Құпия сөзді қайта теріңіз"}
            placeholder={typeLabel === 1 ? "Құпия сөз" : "Құпия сөзді қайта теріңіз"}
            onIconEndClick={togglePasswordVisibility} // Передаем функцию для клика
            {...props}
        />
    );
};

export default PasswordInput;