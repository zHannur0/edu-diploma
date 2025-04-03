import { OptionTest } from "@/types/Sections";
import Image from "next/image";
import React, { useState, useRef } from "react";

interface ListeningCardProps {
    number: number;
    question: string;
    options: OptionTest[];
    context: string;
}

const ListeningCard = ({ number, question, options, context }: ListeningCardProps) => {
    const [selected, setSelected] = useState<number | null>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
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
            <div className="p-2 flex gap-3 mb-13 items-center bg-[#F7F6F9] rounded-[28px] ">
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] p-[10px]" onClick={playAudio}>
                    <Image src={"/icon/play_sound.svg"} alt={"play"} width={40} height={40} />
                </div>
                <p>{context}</p>
            </div>
            <audio ref={audioRef} src={question}/>
            <div className="w-full flex justify-between gap-4">
                {
                    options.map((option, index) => (
                        <div key={index} className="flex justify-between items-center w-full max-w-[268px] bg-[#F7F6F9] p-3 rounded-2xl" onClick={() => setSelected(option.id)}>
                            <p>
                                {option.option}
                            </p>
                            <div className="p-3 rounded-2xl bg-white">
                                {option.id === selected ? (
                                    <Image src={"/icon/checkoutIcon.svg"} alt={"up"} height={16} width={16} className="w-4 h-4" />
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
