"use client";

import { useParams } from "next/navigation";
import { useGetIeltsWritingQuery } from "@/store/api/ieltsApi";
import { useState, useEffect } from "react";
import IeltsWritingCard from "@/app/(main)/english/[course]/ielts-test/components/IeltsWritingCard";

const Timer = () => {
    const [time, setTime] = useState(3600);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (intervalId) return;
        const id = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);
        setIntervalId(id);
    };

    const stopTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        startTimer();

        return () => {
            stopTimer();
        };
    }, []);

    return <span className={"text-[#F5443A]"}>{formatTime(time)}</span>;
};

export default function IeltsWritingPage() {
    const { ieltsTest } = useParams();
    const [currentRound, setCurrentRound] = useState<number>(0);

    const { data: writings } = useGetIeltsWritingQuery(Number(ieltsTest), {
        skip: !ieltsTest,
    });

    const handleRoundClick = (index: number) => {
        setCurrentRound(index);
    };

    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col py-12 items-center">
            <div className="flex justify-between items-center">
                <p className="text-3xl font-semibold mb-4 text-[#737B98]">Time left: <Timer /></p>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
                {writings?.map((writing, i) => (
                    <div
                        key={writing.id}
                        className={`cursor-pointer text-center py-2 px-4 border border-[#737B98] rounded-lg hover:bg-white ${i === currentRound ? "bg-white":"bg-transparent"}`}
                        onClick={() => handleRoundClick(i)}
                    >
                        Part {i + 1}
                    </div>
                ))}
            </div>
                {writings && writings[currentRound] ? (
                    <IeltsWritingCard writing={writings[currentRound]} />
                ) : (
                    <p>No writing data available</p>
                )}
        </div>
    );
}
