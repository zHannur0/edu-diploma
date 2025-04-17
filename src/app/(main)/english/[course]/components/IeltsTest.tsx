import React from "react";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {IeltsTests} from "@/types/Ielts";

const IeltsTest:React.FC<IeltsTests> = ({name, id}) => {
    const {course} = useParams();
    const router = useRouter();

    const handleClick = () => {
        router.push(`/english/${course}/ielts-test/${id}/reading`);
    }

    return (
        <div
            className="w-full flex justify-between items-center px-4 pb-1 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex gap-2 items-center">
                <Image src={"/icon/test.svg"} alt={name} width={36} height={35}/>
                <p className="font-bold">
                    {name}
                </p>
            </div>
        </div>
    )
}

export default IeltsTest;