"use client"
import React, { ChangeEvent } from "react"; // Убрали useState, useEffect
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";
import { IeltsWriting } from "@/types/Ielts";

interface IeltsWritingCardProps {
    writing: IeltsWriting;
    answer: string; // Принимаем текущий ответ
    onAnswerChange: (writingId: number, value: string) => void; // Принимаем функцию обратного вызова
}

const IeltsWritingCard = ({ writing, answer, onAnswerChange }: IeltsWritingCardProps) => {

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onAnswerChange(writing.id, e.target.value);
    };

    return (
        <div className="w-full p-6 flex flex-col bg-white items-start rounded-2xl gap-5 shadow-md min-h-[400px]">
            <div className="flex flex-col gap-3 w-full">
                <p className="text-xl font-bold text-gray-800">
                    {writing?.title || `Writing Task`}
                </p>
                {writing?.description && (
                    <p className=" text-black font-medium">
                        {writing.description}
                    </p>
                )}
                {writing?.context && (
                    <p className="text-sm text-[#737B98] font-medium">
                        {writing.context}
                    </p>
                )}
                {writing?.images && writing.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 my-3">
                        {writing.images.map((image, i) => (
                            <div key={image.id} className="relative w-[700px] h-[400px] overflow-hidden rounded-lg border">
                                <Image
                                    src={image?.image || "/img/ListUniversity.png"}
                                    alt={`Writing task image ${i + 1}`}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TextArea
                onChange={handleChange}
                value={answer}
                placeholder="Start writing your answer here..." // Добавил плейсхолдер
                className="w-full min-h-[250px] border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Добавил стили
            />

        </div>
    );
};

export default IeltsWritingCard;