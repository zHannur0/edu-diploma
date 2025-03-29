import {Section as SectionBase} from "@/types/Course";
import React from "react";
import Image from "next/image";

interface SectionProps extends SectionBase{
    name: string;
    image: string;
}

const Section:React.FC<SectionProps> = ({name, image, score, already_passed}) => {
    return (
        <div className="w-full flex justify-between items-center px-4 py-2 cursor-pointer">
            <div className="flex gap-2 items-center">
                <Image src={image} alt={name} width={36} height={35}/>
                <p className="font-bold">
                    {name}
                </p>
            </div>
            {
                already_passed && (
                    <>
                        <p>
                            {score}
                        </p>
                        <Image src={"/icon/is_completed.svg"} alt={"done?"} width={24} height={24}/>
                    </>
                )
            }
        </div>
    )
}

export default Section;