"use client"
import React, {ChangeEvent, useEffect, useState} from "react";
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";
import {Writing} from "@/types/Sections";
import {useSubmitWritingMutation} from "@/store/api/generalEnglishApi";
import {useParams, useRouter} from "next/navigation";

const WritingCard = ({writing}: {writing: Writing}) => {
    const router = useRouter();
    const {course, module} = useParams();
    const [writingAnswer, setWritingAnswer] = useState<string>("Start writing")

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
                data: {writing: writingAnswer}
            }).unwrap();

            router.push(`/english/${course}/${module}/listening`);

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
                    {writing?.writing?.title}
                </p>
                <p className="text-xs text-[#737B98]">
                    {writing?.writing?.requirements}
                </p>
            </div>
            <TextArea onChange={handleChange} value={writingAnswer || ""} />
            <div className="flex justify-end w-full">
                <Image src={"/icon/send.svg"} alt={"send"} width={40} height={40} onClick={handleSubmit}/>
            </div>
        </div>
    )
}

export default WritingCard;