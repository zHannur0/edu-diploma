import {AnswerTest, OptionTest} from "@/types/Sections";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {FaStop} from "react-icons/fa";
import {formatTime} from "@/utils/audio";

interface ListeningCardProps {
    id: number;
    number: number;
    question: string;
    options: OptionTest[];
    context: string;
    setAnswer: (question_id: number, optionId: number) => void;
    userAnswers: AnswerTest[];
}

const ListeningCard = ({ id, number, question, options, setAnswer, userAnswers }: ListeningCardProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const currTime = Number(sessionStorage.getItem(`listening-${id}`));
        if (audioRef.current) {
            audioRef.current.currentTime = currTime;
            setCurrentTime(currTime);
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            audio.addEventListener("timeupdate", () => {
                setCurrentTime(audio.currentTime);
                sessionStorage.setItem(`listening-${id}`, String(audio.currentTime))
            });

            audio.addEventListener("loadedmetadata", () => {
                setDuration(audio.duration);
            });
        }
    }, []);


    const playAudio = () => {
        if (audioRef.current) {
            if (isRecording) {
                audioRef.current.pause();
                setIsRecording(!isRecording);
            } else {
                if (currentTime < duration) {
                    audioRef.current.play();
                    setIsRecording(!isRecording);
                }
            }
        }
    };

    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl">
            <div className="flex gap-3 mb-6 items-start w-full">
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] flex items-center justify-center h-11 w-11">
                    {number < 10 && 0}{number}
                </div>
                <div className="flex flex-col gap-3">
                    <p className="font-bold">
                        Listening
                    </p>
                    <p className="text-sm text-[#737B98]">
                        Голос
                    </p>
                </div>
            </div>
            <div className="p-2 flex gap-5 mb-13 items-center bg-[#F7F6F9] rounded-[28px] w-full max-w-100" onClick={playAudio}>
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] p-[10px]">
                    {
                        !isRecording ? (
                            <Image src={"/icon/play_sound.svg"} alt={"play"} width={40} height={40} className="max-w-10 min-w-10 h-10"/>
                        ) : (
                            <div className="max-w-10 min-w-10 h-10 flex items-center justify-center">
                                <FaStop className="w-5 h-5 text-red-500"/>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col w-full h-full justify-center">
                    <progress
                        value={currentTime}
                        max={duration}
                        className="w-full h-2 bg-gray-200 rounded-full"
                        style={{pointerEvents: "none"}}
                    />
                    <div className="flex justify-between text-xs text-gray-500 w-full">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
                {/*<p>{context}</p>*/}
            </div>
            <audio ref={audioRef} src={`https://api.aqylshyn.kz/media/${question}`}/>
            <div className="w-full flex justify-between gap-4">
                {
                    options.map((option, index) => (
                        <div key={index}
                             className="flex justify-between items-center w-full max-w-[268px] bg-[#F7F6F9] p-3 rounded-2xl"
                             onClick={() => {
                                 setAnswer(id, option.id)
                             }}>
                            <p>
                            {option.option}
                            </p>
                            <div className="p-3 rounded-2xl bg-white">
                                {option.id === userAnswers.filter((item) => item.question_id === id)?.[0]?.option_id ? (
                                    <Image src={"/icon/checkoutIcon.svg"} alt={"up"} height={16} width={16} className="min-w-4 h-4" />
                                ) : (
                                    <div className="w-4 h-4 rounded-sm bg-[#EFF4FF]" />
                                )}
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ListeningCard;
