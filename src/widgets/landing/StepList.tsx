import {steps} from "@/config/steps";
import Image from "next/image";
import Wrapper from "@/components/layout/Wrapper";

const StepList = () => {
    return (
        <Wrapper>
            <div className="w-full flex flex-col items-center gap-[66px]  mb-[110px]">
                <div className="grid grid-cols-5 items-center w-full">
                    {
                        steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-11">
                                <Image src={step.icon} alt={"icon"} height={87} width={105}
                                       className={"h-[87px] w-auto"}/>
                                <p className="text-sm text-[#363E4A]  text-center w-[143px]">
                                    {step.title}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <button className="bg-[#FB9130] rounded-[50px] py-4 px-13 text-white font-bold">
                    Өз деңгейінді анықта
                </button>
            </div>
        </Wrapper>
)
}

export default StepList