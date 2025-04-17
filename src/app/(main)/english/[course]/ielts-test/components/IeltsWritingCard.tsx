"use client"
import React, {ChangeEvent, useEffect, useState} from "react";
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";
import {useSubmitWritingMutation} from "@/store/api/generalEnglishApi";
import {useRouter} from "next/navigation";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import {useModalLogic} from "@/hooks/useModalLogic";
import {IeltsWriting} from "@/types/Ielts";

const IeltsWritingCard = ({writing}: {writing: IeltsWriting}) => {
    const router = useRouter();
    const [writingAnswer, setWritingAnswer] = useState<string>("Start writing");
    const modalLogic = useModalLogic();

    const [submitWriting] = useSubmitWritingMutation();

    useEffect(() => {
        const writingAns = sessionStorage.getItem("writingAnswer");
        setWritingAnswer(String(writingAns || ""));
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

            modalLogic.showSuccess();
            sessionStorage.removeItem("writingAnswer");
        } catch (e) {
            console.log(e);
            modalLogic.showError();
        }
    }

    return (
        <div className="w-full max-w-[1100px] p-4 flex flex-col bg-white items-start rounded-3xl gap-3">
            <div className="flex flex-col gap-3">
                <p className="font-bold">
                    Writing
                </p>
                <p className="text-sm text-[#737B98] font-medium">
                    {writing?.title}
                </p>
                <p className="text-xs text-[#737B98]">
                    {writing?.description}
                </p>
                {
                    writing?.images.map((image, i) => (
                        <Image key={i+12431} src={image} alt={`image-${i}`} width={300} height={170}/>
                    ))
                }
            </div>
            <TextArea onChange={handleChange} value={writingAnswer || ""} />
            <div className="flex justify-end w-full">
                <Image src={"/icon/send.svg"} alt={"send"} width={40} height={40} onClick={handleSubmit}/>
            </div>
            {
                modalLogic.showSuccessModal && (
                    <SuccessModal
                        onOk={() => router.push(`/english/2`)}
                        onClose={modalLogic.onSuccessModalClose}
                    />
                )
            }
            {
                modalLogic.showErrorModal && (
                    <ErrorModal
                        onClose={modalLogic.onErrorModalClose}
                    />
                )
            }
        </div>
    )
}

export default IeltsWritingCard;