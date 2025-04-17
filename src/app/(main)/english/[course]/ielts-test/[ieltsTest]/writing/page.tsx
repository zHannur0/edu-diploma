"use client";

import { useParams } from "next/navigation";
import { useGetIeltsWritingQuery } from "@/store/api/ieltsApi";
import { useState, useEffect } from "react";
import IeltsWritingCard from "@/app/(main)/english/[course]/ielts-test/components/IeltsWritingCard";

// Таймер
const Timer = () => {
    const [time, setTime] = useState(3600); // 59 минут и 59 секунд
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (intervalId) return; // Если таймер уже существует, не запускаем новый
        const id = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);
        setIntervalId(id); // Сохраняем id интервала для его очистки
    };

    const stopTimer = () => {
        if (intervalId) {
            clearInterval(intervalId); // Очищаем таймер при размонтировании
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

        // Очищаем таймер при размонтировании компонента
        return () => {
            stopTimer();
        };
    }, []); // Таймер запускается только при монтировании компонента

    return <span className={"text-[#F5443A]"}>{formatTime(time)}</span>;
};

export default function IeltsWritingPage() {
    const { ieltsTest } = useParams();
    const [currentRound, setCurrentRound] = useState<number>(0);

    // Запрос к API для получения данных о письмах
    const { data: writings } = useGetIeltsWritingQuery(Number(ieltsTest), {
        skip: !ieltsTest,
    });

    // Функция для выбора текущего раунда
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
