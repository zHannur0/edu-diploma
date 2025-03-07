import Wrapper from "@/components/layout/Wrapper";
import Image from "next/image";

const Advantages = () => {
    return (
        <Wrapper>
            <div className="w-full flex gap-4 mb-[140px]">
                <div className="flex flex-col items-center justify-between rounded-2xl bg-[#7B68EE] pt-13 px-13 text-center gap-12 overflow-hidden ">
                    <h2 className="font-bold leading-normal text-[28px] text-white">
                        Әр секциядан тақырыпқа тест талдау мүмкіндігі
                    </h2>
                    <Image src={"/img/SectionsBg.png"} alt={"sections"} height={420} width={700}
                           className="min-w-[700px]"/>
                </div>
                <div className="flex flex-col items-center justify-between rounded-2xl bg-[#7B68EE] pt-13 px-13 text-center gap-12 overflow-hidden ">
                    <h2 className="font-bold leading-normal text-[28px] text-white">
                        Знаете ваш заработок за
                        любой период
                    </h2>
                    <Image src={"/img/SectionsBg.png"} alt={"sections"} height={420} width={700}
                           className="min-w-[700px]"/>
                </div>
            </div>
        </Wrapper>
    )
}

export default Advantages;