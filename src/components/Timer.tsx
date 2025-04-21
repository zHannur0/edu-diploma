"use client"

import {useEffect, useState, useRef, useCallback} from "react"; // Добавили useRef и useCallback

// --- ШАГ 1: Определяем интерфейс для пропсов ---
interface TimerProps {
    timeProp: number;
    onTimerEnd?: () => void; // Объявляем onTimerEnd как опциональную функцию
}

// --- Используем интерфейс TimerProps ---
const Timer = ({ timeProp, onTimerEnd }: TimerProps) => {
    const [time, setTime] = useState(timeProp);
    // Используем useRef для хранения ID интервала, чтобы не вызывать лишние ререндеры state
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Оборачиваем в useCallback, чтобы функция не пересоздавалась без необходимости
    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []); // Пустой массив зависимостей

    // Оборачиваем в useCallback
    const startTimer = useCallback(() => {
        stopTimer(); // Сначала останавливаем предыдущий таймер, если он был
        intervalRef.current = setInterval(() => {
            setTime((prevTime) => {
                const nextTime = prevTime - 1;
                // --- ШАГ 2: Проверяем, закончилось ли время ---
                if (nextTime <= 0) {
                    stopTimer(); // Останавливаем таймер
                    if (onTimerEnd) { // Если колбэк передан
                        console.log("Timer finished, calling onTimerEnd.");
                        onTimerEnd(); // Вызываем его!
                    }
                    return 0; // Возвращаем 0, чтобы время не ушло в минус
                }
                return nextTime; // Уменьшаем время
            });
        }, 1000);
    }, [stopTimer, onTimerEnd]); // Добавляем onTimerEnd в зависимости

    // Форматирование времени можно вынести за компонент, если он не использует state/props
    const formatTime = (timeValue: number): string => {
        if (timeValue < 0) timeValue = 0; // На случай если начальное значение < 0
        const minutes = Math.floor(timeValue / 60);
        const seconds = timeValue % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // useEffect для запуска/остановки и сброса при изменении timeProp
    useEffect(() => {
        setTime(timeProp); // Устанавливаем начальное/обновленное время
        startTimer(); // Запускаем таймер

        // Функция очистки при размонтировании или изменении зависимостей
        return () => {
            stopTimer();
        };
        // Перезапускаем эффект при изменении timeProp или функции startTimer
    }, [timeProp, startTimer, stopTimer]);

    return <span className={"text-[#F5443A]"}>{formatTime(time)}</span>;
};

export default Timer;