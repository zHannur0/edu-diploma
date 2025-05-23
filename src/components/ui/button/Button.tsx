import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    width?: number;
    height?: number;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, width, height = 48, className, style, ...props }) => {
    return (
        <button
            {...props}
            style={{ width: width ?? "100%", height, ...style }}
            className={`flex rounded-xl items-center justify-center bg-[#7B68EE] border border-[#7B68EE] py-2 px-6 font-semibold cursor-pointer text-white ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;