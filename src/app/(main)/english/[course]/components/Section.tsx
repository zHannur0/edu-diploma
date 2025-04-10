import {Section as SectionBase} from "@/types/Course";
import React from "react";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";

interface SectionProps extends SectionBase{
    name: string;
    image: string;
    module_id: number;
}

const Section:React.FC<SectionProps> = ({name, image, score, already_passed, module_id, has_section, max_score}) => {
    const {course} = useParams();
    const router = useRouter();
    const handleClick = () => {
        router.push(`/english/${course}/${module_id}/` + name.toLowerCase());
    }

    if (!has_section) {
        return null;
    }

    return (
        <div
            className="w-full flex justify-between items-center px-4 py-2 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex gap-2 items-center">
                <Image src={image} alt={name} width={36} height={35}/>
                <p className="font-bold">
                    {name}
                </p>
            </div>
            {
                already_passed && (
                    <div className="flex gap-2">
                        <p>
                            {score} / {name === "Writing" ? 100 : max_score}
                        </p>
                        <Image src={"/icon/is_completed.svg"} alt={"done?"} width={24} height={24}/>
                    </div>
                )
            }
        </div>
    )
}

export default Section;