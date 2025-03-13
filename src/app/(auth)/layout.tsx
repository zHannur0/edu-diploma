import Image from "next/image";
import AuthHeader from "@/app/(auth)/components/AuthHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
            <div className="flex flex-col w-1/2 bg-[#EEF4FF] h-screen p-12">
                <AuthHeader/>
                <div className="flex items-center  w-full h-full">
                    {children}
                </div>
            </div>
            <div className="w-1/2 rounded-tl-2xl rounded-bl-2xl bg-[#7B68EE] h-screen flex justify-end items-end">
                <Image
                    src="/img/AuthPhoto.png"
                    alt="Platform preview"
                    width={900}
                    height={700}
                    className="max-w-[80%] max-h-[80%] rounded-tl-lg "
                />
            </div>
        </div>
    );
}
