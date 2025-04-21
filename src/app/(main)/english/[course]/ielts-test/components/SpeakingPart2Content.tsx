"use client";

import React, { useState, useEffect, useRef } from 'react';

// --- НОВОЕ: Определяем фазы для Part 2 ---
type Part2Phase = 'preparing' | 'speaking' | 'finished';

interface CueCardData {
    topic: string;
    points: string[];
    questionId: number;
}

interface SpeakingPart2ContentProps {
    cueCardData: CueCardData | null;
    activeQuestionId?: number;
    startRecording: () => void; // Функция из родителя для начала записи
    stopRecording: () => void;  // Функция из родителя для остановки записи и перехода
    isRecording: boolean;       // Состояние записи из родителя
}

export default function SpeakingPart2Content({ cueCardData, activeQuestionId, startRecording, stopRecording, isRecording }: SpeakingPart2ContentProps) {
    const [phase, setPhase] = useState<Part2Phase>('preparing'); // Начинаем с подготовки
    const [prepTime, setPrepTime] = useState<number>(60); // 1 минута на подготовку
    const [speakTime, setSpeakTime] = useState<number>(120); // 2 минуты на говорение

    const prepIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const speakIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Функция для очистки интервалов
    const cleanupTimers = () => {
        if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
        if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
        prepIntervalRef.current = null;
        speakIntervalRef.current = null;
    };

    // --- НОВОЕ: Логика таймеров и смены фаз ---
    useEffect(() => {
        // Начинаем подготовку, только если есть данные карточки
        if (cueCardData && phase === 'preparing') {
            cleanupTimers(); // Очищаем старые таймеры на всякий случай
            setPrepTime(60); // Сброс времени подготовки
            prepIntervalRef.current = setInterval(() => {
                setPrepTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(prepIntervalRef.current!);
                        prepIntervalRef.current = null;
                        setPhase('speaking'); // Переходим в фазу говорения
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Запускаем запись и таймер говорения при переходе в фазу 'speaking'
        if (phase === 'speaking' && !isRecording) { // Проверяем, что запись еще не идет
            cleanupTimers();
            setSpeakTime(120); // Сброс времени говорения
            startRecording(); // Вызываем функцию старта записи из родителя
            speakIntervalRef.current = setInterval(() => {
                setSpeakTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(speakIntervalRef.current!);
                        speakIntervalRef.current = null;
                        setPhase('finished'); // Переходим в фазу завершения
                        // Не вызываем stopRecording здесь, пусть он вызовется из родителя при окончании записи
                        // или пусть родительский handleStopRecordingAndTransition сам проверит время?
                        // Лучше вызвать stopRecording, чтобы инициировать переход
                        // if (isRecording) { // Вызываем стоп, только если запись еще идет
                        //     stopRecording();
                        // }
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Если фаза завершена, и таймер еще активен, останавливаем его
        if (phase === 'finished' && speakIntervalRef.current) {
            cleanupTimers();
            // Если запись все еще идет по какой-то причине, останавливаем
            if (isRecording) {
                stopRecording();
            }
        }

        // Очистка таймеров при размонтировании компонента или смене cueCardData
        return cleanupTimers;

    }, [phase, cueCardData, startRecording, stopRecording, isRecording]); // Добавили isRecording в зависимости


    // --- НОВОЕ: Дополнительный useEffect для остановки, если время вышло, а запись еще идет ---
    useEffect(() => {
        if (phase === 'speaking' && speakTime <= 0 && isRecording) {
            console.log("Speaking time ended, stopping recording...");
            stopRecording(); // Останавливаем запись и инициируем переход
            setPhase('finished');
        }
    }, [speakTime, phase, isRecording, stopRecording]);


    // Форматирование времени для отображения
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex flex-col gap-4 text-sm text-[#555C77]">

            {/* Отображение инструкций и карточки */}
            {phase === 'preparing' && (
                <>
                    <p className="font-medium text-base text-[#333]">Instructions:</p>
                    <p>You have 1 minute to prepare your talk on the following topic. Make notes if you wish.</p>
                </>
            )}
            {phase === 'speaking' && (
                <>
                    <p className="font-medium text-base text-[#333]">Instructions:</p>
                    <p>Now speak about the topic for 1 to 2 minutes.</p>
                </>
            )}
            {phase === 'finished' && (
                <>
                    <p className="font-medium text-base text-[#333]">Part 2 Finished</p>
                    <p>Preparing to move to Part 3...</p>
                </>
            )}

            {cueCardData ? (
                <div className={`mt-4 p-4 border border-dashed border-[#737B98] rounded-lg bg-gray-50 transition-all duration-300 ${cueCardData.questionId === activeQuestionId ? 'ring-2 ring-blue-300' : ''} ${phase !== 'preparing' ? 'opacity-70' : ''}`}>
                    <p className="font-semibold text-base text-center mb-3">{cueCardData.topic}</p>
                    <p className="font-medium mb-2">You should say:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        {cueCardData.points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">Cue card data is not available.</p>
            )}

            {/* Отображение таймеров */}
            <div className={`mt-6 flex justify-around text-center transition-opacity duration-500 ${phase === 'finished' ? 'opacity-0' : 'opacity-100'}`}>
                {phase === 'preparing' && (
                    <div>
                        <p className="font-medium text-base text-[#333]">Preparation Time Left:</p>
                        <p className={`text-lg font-semibold ${prepTime <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>{formatTime(prepTime)}</p>
                    </div>
                )}
                {phase === 'speaking' && (
                    <div>
                        <p className="font-medium text-base text-[#333]">Speaking Time Left:</p>
                        <p className={`text-lg font-semibold ${speakTime <= 15 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>{formatTime(speakTime)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}