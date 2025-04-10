"use client"
import Wrapper from "@/components/layout/Wrapper";
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

const nav = [
    {
        id: 1,
        link: "/english",
        title: "Ағылшын үйрену"
    },
    {
        id: 2,
        link: "/",
        title: "Университет"
    },
    {
        id: 3,
        link: "/",
        title: "AI көмекші бот"
    }
]

const Header = () => {
    const router = useRouter();
    const pathname= usePathname();
    const {isAuthenticated} = useAuth();

    const handleNavigateProfile = () => {
        if(pathname.includes("profile")){
            router.push("/login");
        } else {
            router.push("/profile");
        }
    }

    return (
            <Wrapper>
                <div className="flex justify-between items-center w-full py-3">
                    <div className="flex gap-[55px] items-center">
                        <div className="flex gap-2" onClick={() => router.push("/")}>
                            <Image src={"/icon/logo.svg"} alt={"logo"} height={24} width={24}/>
                            <Image src={"/icon/name.svg"} alt={"logo"} height={15} width={70}/>
                        </div>
                        <div className="flex gap-8">
                            {
                                nav.map((navigation) => (
                                    <Link key={navigation.id} href={navigation.link}>
                                        {navigation.title}
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex gap-8 items-center">
                        {
                            isAuthenticated ? (
                                <div className="bg-[#7B68EE] text-white px-11 py-3 rounded-xl" onClick={handleNavigateProfile}>
                                    {pathname.includes("profile") ? "Шығу" : "Профиль"}
                                </div>
                                ) : (
                                <button className="bg-[#7B68EE] text-white px-11 py-3 rounded-xl" onClick={() => router.push("/login")}>
                                    Тіркелу
                                </button>
                            )
                        }
                    </div>
                </div>
            </Wrapper>
    )
}

export default Header