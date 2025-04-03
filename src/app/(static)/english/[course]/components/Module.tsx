import React, {useState} from "react";
import {Module as ModulePropsBase} from "@/types/Course";
import Image from "next/image";
import Section from "@/app/(static)/english/[course]/components/Section";

interface ModuleProps extends ModulePropsBase {
    is_disabled?: boolean;
    index: number;
}

const getSectionName = (key: string) => {
    switch (key) {
        case "writing": return "Writing";
        case "speaking": return "Speaking";
        case "reading": return "Reading";
        case "listening": return "Listening";
    }
}

const sectionImages = [
    "/icon/sections/reading.svg",
    "/icon/sections/listening.svg",
    "/icon/sections/writing.svg",
    "/icon/sections/speaking.svg",
]

const ModuleCard:React.FC<ModuleProps> = ({index, name, sections, total_score, is_completed, is_disabled, id}) => {
    const [openSections, setOpenSections] = useState<boolean>(false);
    const sectionEntries = Object.entries(sections).sort((a, b) => {
        const order = ["reading", "listening", "writing", "speaking"];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
    });

    return (
        <>
            <div className={`w-full flex justify-between items-center p-4 ${is_disabled ? "cursor-not-allowed bg-[#F7F6F9]" : "cursor-pointer bg-white"}`} onClick={() => {
                if(!is_disabled) setOpenSections(!openSections)
            }}>
                <p className="font-medium">
                    {index}. {name}
                </p>
                <div className="flex gap-2">
                    {
                        is_completed && (
                            <>
                                <p className="text-[#7D7D7D]">
                                    {total_score}
                                </p>
                                <Image src={"/icon/is_completed.svg"} alt={"done?"} width={24} height={24}/>
                            </>
                        )
                    }
                    <Image src={"/icon/arrow.svg"} alt={"done?"} width={24} height={24}/>
                </div>
            </div>
            {
                openSections && (
                    <>
                        {sectionEntries.map(([key, section], index) => (
                                <Section key={key}
                                         name={getSectionName(key) || ""}
                                         has_section={section.has_section}
                                         image={sectionImages[index]}
                                         already_passed={section.already_passed}
                                         score={section.score}
                                         module_id={id}
                                />
                        ))}
                    </>
                )
            }
        </>

    )
}

export default ModuleCard;