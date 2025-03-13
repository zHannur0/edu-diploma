import Link from "next/link";
import React from "react";

interface CustomLinkProps {
    href: string;
    label: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, label }) => {
    return (
        <Link href={href} title={label} className="font-medium text-[#7B68EE] text-base hover:underline">
            {label}
        </Link>
    );
};

export default CustomLink;
