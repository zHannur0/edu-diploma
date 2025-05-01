"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

type Part2Phase = 'preparing' | 'speaking' | 'finished';

interface CueCardData {
    topic: string;
    points: string[];
    questionId: number;
}

interface SpeakingPart2ContentProps {
    cueCardData: CueCardData | null;
    activeQuestionId?: number;
    startRecording: () => void;
    stopRecording: () => void;
    isRecording: boolean;
}

export default function SpeakingPart2Content({ cueCardData, activeQuestionId, startRecording, stopRecording }: SpeakingPart2ContentProps) {
    const [phase, setPhase] = useState<Part2Phase>('preparing');
    const [prepTime, setPrepTime] = useState<number>(60);
    const [speakTime, setSpeakTime] = useState<number>(120);
    console.log(startRecording)
    const prepIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const speakIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const stopInitiatedRef = useRef<boolean>(false);

    useEffect(() => {
        console.log(`SpeakingPart2Content MOUNTED. Initial phase: ${phase}`);
        return () => {
            console.log("SpeakingPart2Content UNMOUNTING.");
        };
    }, []);

    // Лог изменения cueCardData
    useEffect(() => {
        console.log("SpeakingPart2Content: cueCardData prop changed:", cueCardData);
    }, [cueCardData]);


    const cleanupTimers = useCallback(() => {
        // Добавим лог сюда, чтобы видеть когда таймеры чистятся
        console.log(`SpeakingPart2Content: cleanupTimers called. Current refs: prep=${!!prepIntervalRef.current}, speak=${!!speakIntervalRef.current}`);
        if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
        if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
        prepIntervalRef.current = null;
        speakIntervalRef.current = null;
    }, []);

    useEffect(() => {
        // Лог запуска основного эффекта
        console.log(`SpeakingPart2Content: Main effect run. Phase: ${phase}, CueCardData exists: ${!!cueCardData}`);

        if (phase === 'preparing' && cueCardData) {
            console.log("SpeakingPart2Content: Entering 'preparing' phase logic.");
            cleanupTimers(); // Очистка перед стартом
            setPrepTime(60);
            setSpeakTime(120);
            stopInitiatedRef.current = false;

            console.log("SpeakingPart2Content: Setting up PREP interval.");
            prepIntervalRef.current = setInterval(() => {
                setPrepTime((prevTime) => {
                    // Лог каждого тика таймера подготовки
                    console.log(`SpeakingPart2Content: Prep timer tick. Prev time: ${prevTime}`);
                    if (prevTime <= 1) {
                        // Лог момента перед сменой фазы
                        console.log("SpeakingPart2Content: Prep time finished. Preparing to set phase 'speaking'.");
                        cleanupTimers(); // Очистка текущего интервала
                        setPhase('speaking'); // <<<--- Попытка сменить фазу
                        // Лог сразу после вызова setPhase (но реальное изменение будет позже)
                        console.log("SpeakingPart2Content: setPhase('speaking') called.");
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (phase === 'speaking') {
            console.log("SpeakingPart2Content: Entering 'speaking' phase logic.");
            cleanupTimers(); // Очистка перед стартом
            setSpeakTime(120);

            console.log("SpeakingPart2Content: Calling parent startRecording().");
            startRecording();

            console.log("SpeakingPart2Content: Setting up SPEAK interval.");
            speakIntervalRef.current = setInterval(() => {
                setSpeakTime((prevTime) => {
                    if (prevTime <= 1) {
                        console.log("SpeakingPart2Content: Speak time finished. Preparing to set phase 'finished'.");
                        cleanupTimers();
                        if (!stopInitiatedRef.current) {
                            stopInitiatedRef.current = true;
                            console.log("SpeakingPart2Content: Calling parent stopRecording() due to speak timer end.");
                            stopRecording();
                        }
                        setPhase('finished');
                        console.log("SpeakingPart2Content: setPhase('finished') called.");
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            console.log(`SpeakingPart2Content: Main effect run, but phase is not 'preparing' or 'speaking' (Phase: ${phase}). Cleaning timers.`);
            cleanupTimers(); // На всякий случай чистим таймеры, если фаза другая
        }

        return () => {
            // Лог функции очистки эффекта
            console.log(`SpeakingPart2Content: Main effect CLEANUP executing. Phase was: ${phase}`);
            cleanupTimers();
        };
        // Оставляем зависимости как были в прошлый раз
    }, [phase, cueCardData, startRecording, stopRecording, cleanupTimers]);


    // Остальные useEffect и JSX без изменений...

    // --- JSX ---
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex flex-col gap-4 text-sm text-[#555C77]">
            {/* ... (весь JSX без изменений) ... */}
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
                    <p>Processing your answer, please wait...</p>
                </>
            )}

            {cueCardData ? (
                <div className={`mt-4 p-4 border border-dashed border-[#737B98] rounded-lg bg-gray-50 transition-all duration-300 ${cueCardData?.questionId === activeQuestionId ? 'ring-2 ring-[#7B68EE]' : ''} ${phase !== 'preparing' ? 'opacity-70' : ''}`}>
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

            <div className={`mt-6 flex justify-around text-center transition-opacity duration-500 ${phase === 'finished' ? 'opacity-50' : 'opacity-100'}`}>
                {phase === 'preparing' && (
                    <div>
                        <p className="font-medium text-base text-[#333]">Preparation Time Left:</p>
                        <p className={`text-lg font-semibold ${prepTime <= 10 ? 'text-red-600 animate-pulse' : 'text-[#7B68EE]'}`}>{formatTime(prepTime)}</p>
                    </div>
                )}
                {(phase === 'speaking' || (phase === 'finished' && speakTime > 0)) && (
                    <div>
                        <p className="font-medium text-base text-[#333]">Speaking Time Left:</p>
                        <p className={`text-lg font-semibold ${speakTime <= 15 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>{formatTime(speakTime)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}