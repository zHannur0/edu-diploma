import Image from "next/image";

interface CardProps {
    imageUrl: string;
    title: string;
    description: string;
    duration: string;
    studyMode: string;
    language: string;
    type: string;
}


const UnivercityCard = ({
                            imageUrl,
                            title,
                            description,
                            duration,
                            studyMode,
                            language,
                            type
                        }: CardProps) => {
    return (
        <div className="bg-[#EEF4FF] rounded-[4px] p-3 w-full max-w-[325px]">
            <img className="w-full h-[230px] object-cover rounded-[8px]" src={imageUrl} alt={title}/>
            <div>
                <h3 className="text-[20px] font-semibold text-[#D32F2F] w-full mb-2">{title}</h3>
                <div className="flex items-center w-full gap-2 font-semibold">
                    <div className="flex items-center">
                        <Image src={"/icon/time.svg"} alt={"time"} width={16} height={16}/>
                        <span>• {type}</span>
                    </div>
                    <div className="flex items-center">
                        <Image src={"/icon/gadget.svg"} alt={"gadget"} width={16} height={16}/>
                        <span>• {duration}</span>
                    </div>
                </div>
                <div className="flex items-center w-full gap-2 mt-2 font-semibold">
                    <div className="flex items-center">
                        <Image src={"/icon/day.svg"} alt={"day"} width={16} height={16}/>
                        <span>• {studyMode}</span>
                    </div>
                    <div className="flex items-center">
                        <Image src={"/icon/global.svg"} alt={"global"} width={16} height={16}/>
                        <span>• {language}</span>
                    </div>
                </div>
                <p className="text-[#616161] mt-2 text-sm">{description}</p>
            </div>
        </div>
    );
}

export default UnivercityCard;