"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";
import CustomLink from "@/components/ui/link/CustomLink";

const AuthHeader = () => {
    const pathname = usePathname();

    return (
        <div className="flex justify-between items-center">
            <Image src={"/icon/logo.svg"} alt={"logo"} width={24} height={24}/>
            {
                !pathname.includes("login") && (
                    <CustomLink href={"/login"} label={"Кіру"} />
                )
            }
        </div>
    );
}

export default AuthHeader;