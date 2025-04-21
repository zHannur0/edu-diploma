import Image from "next/image";
import Link from "next/link";

const nav = [
    {
        id: 1,
        link: "/listening",
        title: "Ағылшын үйрену"
    },
    {
        id: 2,
        link: "/university",
        title: "Университет"
    },
    {
        id: 3,
        link: "/chats",
        title: "AI көмекші бот"
    }
]

const socials = [
    "/icon/socialMedia/letter.svg",
    "/icon/socialMedia/whatsapp.svg",
    "/icon/socialMedia/insta.svg",
]

const Footer = () => {
    return (
        <div className="w-full bg-[#EEF4FF] pt-16 flex flex-col gap-12 items-center">
            <Image src={"/icon/name.svg"} alt={"name"} height={24} width={110} className={"w-[110px] h-6"}/>
            <div className="flex gap-8">
                {
                    nav.map((navigation) => (
                        <Link key={navigation.id} href={navigation.link}>
                            {navigation.title}
                        </Link>
                    ))
                }
            </div>
            <div className="flex w-full pt-8 pb-18 px-12 justify-between border-t border-[#1A1E18]">
                <p className=" text-[#7D7C81]">
                    © 2025 AqulShyn’ <br/>
                    Все права защищены.
                </p>
                <div className="flex gap-7 items-center">
                    {
                        socials.map((social, i) => (
                            <Link key={i} href={"/"}>
                                <Image src={social} alt={"social"} height={24} width={24}/>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Footer;