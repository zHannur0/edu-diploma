import Input, { InputProps } from "@/components/ui/input/Input";
import React from "react";

interface PasswordInputProps extends InputProps {
    typeLabel?: number;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ typeLabel = 1, ...props }) => {
    return (
        <Input
            iconEnd="/icon/auth/closed.svg"
            type="password"
            label={typeLabel === 1 ? "Құпия сөз" : "Құпия сөзді қайта теріңіз"}
            placeholder={typeLabel === 1 ? "Құпия сөз" : "Құпия сөзді қайта теріңіз"}
            {...props}
        />
    );
};

export default PasswordInput;
