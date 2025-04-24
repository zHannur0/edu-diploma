"use client"
import Wrapper from "@/components/layout/Wrapper";
import Image from "next/image";
import Link from "next/link";
import {useAuth} from "@/hooks/useAuth";

const Hero = () => {
    const {isAuthenticated} = useAuth();
    return (
        <Wrapper>
            <div className="w-full h-[552px] bg-[#7B68EE] pb-0 pt-13 px-7 grid grid-cols-2 items-end mt-5 mb-[120px] rounded-[26px]">
                <div className="flex flex-col justify-between text-white h-full">
                    <div>
                        <h1 className="font-bold leading-normal text-[32px] mb-5">
                            AqylShyn’ – сізге арналған ең тиімді инновациялық платформа!
                        </h1>
                        <p className="w-[70%]">
                            Ағылшын тілін үйрену арқылы шетелдік жоғары оқу орындары туралы ақпаратты қазақ тілінде ұсынатын жасанды интеллект негізіндегі иновациялық шешім.
                        </p>
                    </div>

                    <div className="py-8 px-6 max-w-[291px] bg-white/10 backdrop-blur-md rounded-[16px]  mb-[48px]">
                        <p className="text-lg mb-[60px]">
                            Ағылшын деңгейіңізді анықтау үшін тесттен өтіңіз!
                        </p>
                        <Link href={"/english"} className="font-bold w-full p-2 rounded-4xl text-sm flex items-center justify-center bg-[#363E4A]">
                            {isAuthenticated ? "Оқуды жалғастыру" : "Өз деңгейіңізді анықтаңыз"}
                        </Link>
                    </div>
                </div>
                <Image src={"/img/HeroInfo.png"} alt={"info"} width={702} height={499} className={"h-[500px]"}/>
            </div>
        </Wrapper>
    )
}

export default Hero;