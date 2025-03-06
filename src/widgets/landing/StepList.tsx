import {steps} from "@/config/steps";
import Image from "next/image";

const StepList = () => {
    return (
        <div className="grid grid-cols-5 items-center w-full max-w-[1011px] mb-[120px]">
            {
                steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-11">
                        <Image src={step.icon} alt={"icon"} height={87} width={105} className={"h-[87px] w-auto"}/>
                        <p className="text-sm text-[#363E4A]  text-center">
                            {step.title}
                        </p>
                    </div>
                ))
            }
        </div>
    )
}

export default StepList