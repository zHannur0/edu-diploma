import {features} from "@/config/features";
import Image from "next/image";

const WhyUs = () => {
    return (
        <div className="flex flex-wrap gap-6 w-full max-w-[1011px] mb-[120px]">

            {features.map((feature) => (
                <div className="w-[321px] h-[320px] flex flex-col items-center px-4 pt-11 pb-13 gap-4 bg-[#EEF4FF] rounded-[26px] text-center" key={feature.id}>
                    <Image src={feature.icon} alt={"icon"} className={""} height={78} width={78}/>
                    <h3 className={"text-lg font-bold"}>
                        {feature.title}
                    </h3>
                    <p className="text-base text-[#7D7C81]">
                        {feature.description}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default WhyUs
