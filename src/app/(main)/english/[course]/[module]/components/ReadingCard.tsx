import {AnswerTest, OptionTest} from "@/types/Sections";
import Image from "next/image";
import React from "react";

interface ReadingCardProps {
    id: number;
    number: number;
    context: string;
    image: string;
    source: string;
    options: OptionTest[];
    setAnswer: (question_id: number, optionId: number) => void;
    userAnswers: AnswerTest[];
    question: string;
}
const ReadingCard = ({id, number, question, context, options, source, image, setAnswer, userAnswers}: ReadingCardProps) => {
    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl">
            <div className="flex gap-3 mb-10 items-start w-full">
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] flex items-center justify-center h-11 w-11">
                    {number < 10 && 0}{number}
                </div>
                <div className="flex flex-col gap-3">
                    <p className="font-bold">
                        Reading
                    </p>
                    <p className="text-sm text-[#737B98]">
                        {question}
                    </p>
                </div>
            </div>
            <div className="flex gap-10 mb-10 w-full">
                {
                    image && (
                        <Image src={image} alt={source} width={300} height={170} className="min-w-[300px] h-[170px]"/>
                    )
                }
                <p  className="text-sm text-[#737B98]">
                    {context}
                </p>
            </div>
            <div className="w-full flex justify-between gap-4">
                {
                    options.map((option, index) => (
                        <div key={index}
                             className="flex justify-between items-center w-full max-w-[268px] bg-[#F7F6F9] p-2 rounded-2xl"
                             onClick={() => {
                                 setAnswer(id, option.id)
                             }}>
                            <p>
                                {option.option}
                            </p>
                            <div className="p-3 rounded-2xl bg-white">
                                {option.id === userAnswers?.filter((answer) => answer.question_id === id)?.[0]?.option_id ? (
                                    <Image src={"/icon/checkoutIcon.svg"} alt={"up"} height={16} width={16}
                                           className="min-w-4 h-4"/>
                                ) : (
                                    <div className="w-4 h-4 rounded-sm bg-[#EFF4FF]"/>
                                )}
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ReadingCard;