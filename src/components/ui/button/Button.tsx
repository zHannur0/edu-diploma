import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    width?: number;
    height?: number;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ label, width, height = 48, ...props }) => {
    return (
        <button
            {...props}
            style={{ width: width ?? "100%", height }}
            className={`flex rounded-xl items-center justify-center bg-[#7B68EE] py-2 px-6 text-white font-semibold `}
        >
            {label}
        </button>
    );
};

export default Button;
