"use client"

import {useEffect, useState} from "react";

const Timer = ({timeProp}:{timeProp: number}) => {
    const [time, setTime] = useState(timeProp);
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

export default Timer;