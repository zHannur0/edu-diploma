import React from "react";
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";

const WritingCard = () => {
    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl">
            <div className="flex flex-col gap-3">
                <p className="font-bold">
                    Writing
                </p>
                <p className="text-sm text-[#737B98]">
                    Голос
                </p>
            </div>
            <TextArea/>
            <div className="flex justify-end w-full">
                <Image src={"/icon/send.svg"} alt={"send"} width={40} height={40} />
            </div>
        </div>
    )
}

export default WritingCard;