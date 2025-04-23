import {AnswerSpeaking,} from "@/types/Sections";
import { FaMicrophone, FaStop } from "react-icons/fa";

import React, {useEffect} from "react";
import useVoiceRecorder from "@/hooks/useVoiceRecorder";

interface SpeakingCardProps {
    id: number;
    number: number;
    context: string;
    setAnswer: (speaking_id: number, text: string) => void;
    userAnswers: AnswerSpeaking[];
}

const SpeakingCard = ({id, number, context, setAnswer, userAnswers}: SpeakingCardProps) => {
    const { isRecording, startRecording, stopRecording, transcript } = useVoiceRecorder();

    useEffect(() => {
        if(transcript) setAnswer(id, transcript);
    }, [transcript]);

    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl">
            <div className="flex gap-3 mb-3 items-center w-full">
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] flex items-center justify-center h-11 w-11">
                    {number < 10 && 0}{number}
                </div>
                <div className="flex flex-col gap-">
                    <p className="font-bold">
                        Speaking
                    </p>
                    <p className="text-xs text-[#737B98] whitespace-pre-line">
                        Бұл бөлімде сіздің сөздерді дұрыс айта алуыңызды тексеретін боламыз. Сондықтан мұқият болыңыз!
                    </p>
                </div>
            </div>
            <div className="flex gap-10 mb-3 w-full justify-center">
                <p className="text-sm text-[#737B98]">
                    {context}
                </p>
            </div>
            <div className="w-full flex flex-col items-center gap-4 mb-2">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`mt-4 w-full max-w-[200px] h-16 flex items-center justify-center rounded-full 
                    ${isRecording ? "bg-red-500 animate-pulse" : "bg-blue-500"} text-white text-2xl shadow-lg`}
                    disabled={!isRecording && (!!userAnswers?.find(
                        (answer) => Number(answer.speaking_id) === Number(id)
                    )?.text || !!transcript)}
                >
                    {isRecording ? <FaStop/> : <FaMicrophone/>}
                </button>
                <p className="text-sm text-[#737B98]">
                    { userAnswers?.find(
                        (answer) => Number(answer.speaking_id) === Number(id)
                    )?.text ? String( userAnswers?.find(
                        (answer) => Number(answer.speaking_id) === Number(id)
                    )?.text) : transcript}
                </p>
            </div>
        </div>
    )
}

export default SpeakingCard;