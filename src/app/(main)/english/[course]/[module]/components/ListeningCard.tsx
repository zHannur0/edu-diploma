import { AnswerTest, OptionTest } from "@/types/Sections";
import { AttemptOption } from "@/types/Attempts";
import Image from "next/image";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { FaStop } from "react-icons/fa";
import { formatTime } from "@/utils/audio";

interface ListeningCardProps {
    id: number;
    number: number;
    question: string; // Audio URL
    options: OptionTest[];
    context?: string;
    setAnswer: (question_id: number, optionId: number) => void;
    userAnswers: AnswerTest[];
    isReviewMode?: boolean;
    reviewOptions?: AttemptOption[];
}

const ListeningCard = ({
                           id,
                           number,
                           question: audioUrl,
                           options,
                           context,
                           setAnswer,
                           userAnswers,
                           isReviewMode = false,
                           reviewOptions = [],
                       }: ListeningCardProps) => {

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);

    const cardIsDisabled = isReviewMode;

    const fullAudioUrl = useMemo(() => {
        if (!audioUrl) return '';
        if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
            return audioUrl;
        }
        return `https://api.aqylshyn.kz/media/${audioUrl}`;
    }, [audioUrl]);


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsMetadataLoaded(true);
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);

        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setIsMetadataLoaded(false);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [fullAudioUrl]);


    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio || !isMetadataLoaded) return;

        if (isPlaying) {
            audio.pause();
        } else {
            if (audio.currentTime === audio.duration) {
                audio.currentTime = 0;
                setCurrentTime(0);
            }
            audio.play().catch(error => console.error("Audio play failed:", error));
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio || !isMetadataLoaded) return;
        const newTime = parseFloat(event.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div className="w-full p-4 md:p-6 flex flex-col bg-white items-start rounded-2xl shadow-md mb-6">
            <div className="flex gap-4 mb-6 items-start w-full">
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] text-[#7B68EE] flex items-center justify-center h-10 w-10 md:h-11 md:w-11 flex-shrink-0">
                    {number < 10 ? `0${number}` : number}
                </div>
                <div className="flex flex-col gap-1 pt-1">
                    <p className="font-semibold text-base md:text-lg text-gray-800">
                        Listening Task #{number}
                    </p>
                    {context && (
                        <p className="text-sm text-[#737B98]">
                            {context}
                        </p>
                    )}
                </div>
            </div>

            <div
                className="p-2 flex items-center gap-5 mb-8 bg-[#F7F6F9] rounded-[28px] w-full cursor-pointer"
                onClick={togglePlayPause}
            >
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] p-[10px] flex items-center justify-center w-[60px] h-[60px] flex-shrink-0">
                    {
                        !isPlaying ? (
                            <Image src={"/icon/play_sound.svg"} alt={"play"} width={40} height={40} className="w-10 h-10" />
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center">
                                <FaStop className="w-5 h-5 text-red-500"/>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col w-full h-full justify-center gap-1 pr-4">
                    <input
                        type="range"
                        min="0"
                        max={duration || 1}
                        value={currentTime}
                        step="0.1"
                        onChange={handleSeek}
                        onClick={(e) => e.stopPropagation()} // Предотвращаем всплытие клика с ползунка
                        disabled={!isMetadataLoaded || !fullAudioUrl}
                        className={`w-full h-1.5 rounded-full appearance-none ${!isMetadataLoaded || !fullAudioUrl ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-200 hover:bg-indigo-300 cursor-pointer'}`}
                        // Добавь стили для кастомного thumb если нужно, как было у тебя
                        // className="w-full appearance-none h-2 rounded-full bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-moz-range-thumb]:bg-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 w-full mt-1">
                        <span>{isMetadataLoaded ? formatTime(currentTime) : '0:00'}</span>
                        <span>{isMetadataLoaded ? formatTime(duration) : '0:00'}</span>
                    </div>
                </div>
            </div>

            {fullAudioUrl && <audio ref={audioRef} src={fullAudioUrl} preload="metadata" />}

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {
                    (isReviewMode ? reviewOptions : options).map((optionData, index) => {
                        const optionId = (optionData as OptionTest).id ?? (optionData as AttemptOption).id ?? index;
                        const optionText = optionData.option;

                        let optionContainerClasses = "bg-[#F7F6F9] border border-transparent";
                        let indicatorElement: React.ReactNode = <div className="w-4 h-4 rounded-sm bg-[#dbeafe]" />;
                        let optionTextClasses = "text-gray-800";

                        if (isReviewMode) {
                            const reviewOpt = optionData as AttemptOption;
                            const chosen = reviewOpt.is_chosen;
                            const correct = reviewOpt.is_correct;

                            if (chosen && correct) {
                                optionContainerClasses = "bg-green-50 border-2 border-green-500 ring-1 ring-green-500";
                                indicatorElement = <div className="w-4 h-4 rounded-full bg-green-500" title="Correct and chosen" />;
                                optionTextClasses = "text-green-800 font-semibold";
                            } else if (chosen && !correct) {
                                optionContainerClasses = "bg-red-50 border-2 border-red-400 ring-1 ring-red-400";
                                indicatorElement = <div className="w-4 h-4 rounded-full bg-red-500" title="Incorrect and chosen" />;
                                optionTextClasses = "text-red-800 font-semibold";
                            } else if (!chosen && correct) {
                                optionContainerClasses = "bg-white border-2 border-green-500";
                                indicatorElement = <div className="w-4 h-4 rounded-full border-2 border-green-500" title="Correct answer" />;
                                optionTextClasses = "text-gray-700";
                            } else {
                                optionContainerClasses = "bg-gray-100 border border-gray-200 opacity-60";
                                indicatorElement = <div className="w-4 h-4 rounded-sm bg-gray-300" title="Incorrect answer" />;
                                optionTextClasses = "text-gray-500";
                            }
                        } else {
                            const testOpt = optionData as OptionTest;
                            const isSelected = userAnswers?.find(answer => answer.question_id === id)?.option_id === testOpt.id;

                            if (isSelected) {
                                optionContainerClasses = "bg-indigo-100 border-2 border-indigo-500 ring-1 ring-indigo-500";
                                indicatorElement = <div className="w-4 h-4 rounded-full bg-indigo-500" title="Your selection" />;
                                optionTextClasses = "text-indigo-800 font-semibold";
                            } else {
                                optionContainerClasses = "bg-[#F0F4FF] border border-transparent hover:border-indigo-300";
                                indicatorElement = <div className="w-4 h-4 rounded-sm bg-indigo-200" />;
                                optionTextClasses = "text-gray-800";
                            }
                        }

                        return (
                            <div
                                key={optionId}
                                className={`flex justify-between items-center w-full p-3 rounded-lg transition-all duration-150 ${optionContainerClasses} ${cardIsDisabled ? 'cursor-default' : 'cursor-pointer'}`}
                                onClick={!cardIsDisabled ? () => setAnswer(id, optionId) : undefined}
                            >
                                <p className={`text-sm flex-grow mr-3 ${optionTextClasses}`}>
                                    {optionText}
                                </p>
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-white bg-opacity-50">
                                    {indicatorElement}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ListeningCard;