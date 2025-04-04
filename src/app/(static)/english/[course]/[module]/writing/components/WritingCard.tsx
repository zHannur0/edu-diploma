"use client"
import React, {ChangeEvent, useEffect, useState} from "react";
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";
import {Writing} from "@/types/Sections";
import {useSubmitWritingMutation} from "@/store/api/generalEnglishApi";
import {useParams} from "next/navigation";

const WritingCard = ({writing}: {writing: Writing}) => {
    const {module} = useParams();
    const [writingAnswer, setWritingAnswer] = useState<string>("")

    const [submitWriting] = useSubmitWritingMutation();

    useEffect(() => {
        const writingAns = sessionStorage.getItem("writingAnswer");
        setWritingAnswer(String(writingAns));
    }, [])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setWritingAnswer(value)
        sessionStorage.setItem("writingAnswer", value);
    }

    const handleSubmit = async () => {
        try {
            await submitWriting({
                id: Number(module),
                data: {writing: {
                    text: writingAnswer
                }}
            }).unwrap();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl gap-3">
            <div className="flex flex-col gap-3">
                <p className="font-bold">
                    Writing
                </p>
                <p className="text-sm text-[#737B98] font-medium">
                    {writing?.writing?.[0]?.title}
                </p>
                <p className="text-xs text-[#737B98]">
                    {writing?.writing?.[0]?.requirements}
                </p>
            </div>
            <TextArea onChange={handleChange} value={writingAnswer} />
            <div className="flex justify-end w-full">
                <Image src={"/icon/send.svg"} alt={"send"} width={40} height={40} onClick={handleSubmit}/>
            </div>
        </div>
    )
}

export default WritingCard;