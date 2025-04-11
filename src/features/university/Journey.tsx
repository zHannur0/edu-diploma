import {journey} from "@/config/journey";
import Image from "next/image";

const Journey = () => {
    return (
        <div className="w-full flex flex-col items-center gap-6 mb-30">
            <p className="text-3xl font-bold">
                Сапарыңыздың қысқаша көрінісі
            </p>
            <div className="grid grid-cols-4 items-center  gap-6  mb-40">
                {journey.map((step, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex flex-col items-center text-center max-w-[250px]">
                            <Image src={step.icon} alt={step.title} className="w-12 h-12 mb-4" width={50} height={50}/>
                            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                        {
                            index !== journey.length - 1 && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="12" viewBox="0 0 180 12"
                                     fill="none">
                                    <mask id="path-1-inside-1_446_2680" fill="white">
                                        <path d="M174.942 0L180 5.65686L174.942 11.3137L169.884 5.65686L174.942 0Z"/>
                                    </mask>
                                    <path
                                        d="M180 5.65686L181.333 7.14779L182.666 5.65686L181.333 4.16592L180 5.65686ZM173.609 1.49093L178.667 7.14779L181.333 4.16592L176.275 -1.49093L173.609 1.49093ZM178.667 4.16592L173.609 9.82278L176.275 12.8047L181.333 7.14779L178.667 4.16592Z"
                                        fill="#D81B60" mask="url(#path-1-inside-1_446_2680)"/>
                                    <line x1="178.826" y1="5.9" x2="0.000213623" y2="5.9" stroke="#D81B60"
                                          strokeWidth="1.8"/>
                                </svg>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>

    );
};

export default Journey;