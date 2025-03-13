"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthHeader = () => {
    const pathname = usePathname();

    return (
        <div className="flex justify-between items-center">
            <Image src={"/icon/logo.svg"} alt={"logo"} width={24} height={24}/>
            {
                !pathname.includes("login") && (
                    <Link href={"/login"} className="font-semibold">Log in</Link>
                )
            }
        </div>
    );
}

export default AuthHeader;