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
            label={typeLabel === 1 ? "Password" : "Repeat Password"}
            placeholder={typeLabel === 1 ? "Password" : "Repeat Password"}
            {...props}
        />
    );
};

export default PasswordInput;
