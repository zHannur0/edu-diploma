
"use client";

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from "next/navigation";
import {ListeningSubmit, useGetIeltsListeningQuery, useSubmitIeltsListeningMutation} from "@/store/api/ieltsApi";
import { useModalLogic } from "@/hooks/useModalLogic";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import AudioPlayer from "@/app/(main)/english/[course]/ielts-test/components/AudioPlayer"; // Путь к новому компоненту
import IeltsListeningPart from "@/app/(main)/english/[course]/ielts-test/components/IeltsListeningPart"; // Путь к новому компоненту
import Button from "@/components/ui/button/Button";

type ListeningAnswersState = { [questionId: number]: string | number | null };

export default function IeltsListeningPage() {
    const { ieltsTest: ieltsTestParam, course } = useParams();
    const ieltsTestId = Number(ieltsTestParam);
    const router = useRouter();
    const modalLogic = useModalLogic();

    const [answers, setAnswers] = useState<ListeningAnswersState>({});
    const [currentAudioPartIndex, setCurrentAudioPartIndex] = useState<number>(0); // Индекс текущего аудиофайла для воспроизведения
    const [hasPlaybackStarted, setHasPlaybackStarted] = useState<boolean>(false); // Началось ли воспроизведение вообще
    const [playbackFinished, setPlaybackFinished] = useState<boolean>(false); // Завершено ли проигрывание *всех* частей

    const audioPlayerRef = useRef<{ getCurrentTime: () => number }>(null); // Ref для доступа к методам плеера, если нужно

    const { data: listeningParts, isLoading: isLoadingData, error: loadingError } = useGetIeltsListeningQuery(ieltsTestId, {
        skip: !ieltsTestId,
    });

    const [submitListening, { isLoading: isSubmitting }] = useSubmitIeltsListeningMutation();

    const currentAudioUrl = useMemo(() =>
            listeningParts?.[currentAudioPartIndex]?.audio_file || null,
        [listeningParts, currentAudioPartIndex]
    );

    const handleAnswerChange = useCallback((questionId: number, answer: string | number | null) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    }, []);

    const handleAudioEnded = useCallback(() => {
        const nextPartIndex = currentAudioPartIndex + 1;
        if (listeningParts && nextPartIndex < listeningParts.length) {
            // Есть следующая часть аудио, переключаемся
            console.log(`Audio Part ${currentAudioPartIndex + 1} ended, loading Part ${nextPartIndex + 1}`);
            setCurrentAudioPartIndex(nextPartIndex);
        } else {
            // Это была последняя часть аудио
            console.log("All audio parts finished.");
            setPlaybackFinished(true);
        }
    }, [currentAudioPartIndex, listeningParts]);

    const handlePlaybackStart = useCallback(() => {
        // Фиксируем, что воспроизведение началось (чтобы нельзя было начать заново)
        if (!hasPlaybackStarted) {
            setHasPlaybackStarted(true);
        }
    }, [hasPlaybackStarted]);


    const handleSubmitListening = async () => {
        if (!listeningParts || isSubmitting || !playbackFinished) {
            console.log("Submit blocked: No data, submitting, or playback not finished.");
            // Возможно, стоит разрешить отправку и до конца проигрывания? Уточни правила.
            // Если да, убери проверку !playbackFinished
            return;
        }

        const formattedSubmissions: {
            listening_id: number;
            options: { option_id: number; question_id: number }[];
            fills: { question_id: number; answer: string[] }[];
            // Добавить selects если нужно
        }[] = [];

        listeningParts.forEach(part => {
            const partSubmission: {
                listening_id: number;
                options: { option_id: number; question_id: number }[];
                fills: { question_id: number; answer: string[] }[];
            } = {
                listening_id: part.id,
                options: [],
                fills: [],
            };

            part.questions.forEach(q => {
                const answer = answers[q.id];
                if (answer !== undefined && answer !== null) {
                    if (q.question_type === 'OPTIONS' && typeof answer === 'number') {
                        partSubmission.options.push({ question_id: q.id, option_id: answer });
                    } else if (q.question_type === 'FILL' && typeof answer === 'string') {
                        partSubmission.fills.push({ question_id: q.id, answer: [answer] });
                    } else if (q.question_type === 'SELECT_INSERT') {
                        console.warn(`Submit logic for SELECT_INSERT_ANSWER (QID: ${q.id}) not implemented.`);
                    }
                }
            });

            // Добавляем данные для части, только если были ответы (или всегда?)
            if (partSubmission.options.length > 0 || partSubmission.fills.length > 0) {
                formattedSubmissions.push(partSubmission);
            }
        });

        // Обертка в финальный формат { data: ListeningSubmit[] }
        // Если API ожидает массив ListeningSubmit[], то data = [{ listenings: formattedSubmissions }] ?
        // Если API ожидает ТОЛЬКО массив listenings, то data = formattedSubmissions ?
        // Это КРАЙНЕ ВАЖНО уточнить. Пока предположим, что ожидает [{ listenings: [...] }]
        const payloadData: ListeningSubmit[] = [{ listenings: formattedSubmissions }];

        console.log("Submitting Listening Payload:", JSON.stringify(payloadData, null, 2));

        try {
            await submitListening({ id: ieltsTestId, data: payloadData }).unwrap();
            modalLogic.showSuccess();
        } catch (e) {
            console.error("Failed to submit listening:", e);
            modalLogic.showError();
        }
    };


    const handleSuccessRedirect = () => {
        router.push(`/english/${course || 'default-course'}`);
    };


    return (
        <div className="w-full min-h-screen bg-[#EEF4FF] flex flex-col py-12 px-4 md:px-8">
            {/* Header */}
            <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center mb-6 flex-wrap gap-4">
                <p className="text-3xl font-semibold text-[#737B98]">IELTS Listening</p>
                <div className="flex items-center gap-6">
                    <Button
                        onClick={handleSubmitListening}
                        disabled={isSubmitting || isLoadingData || !playbackFinished}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                        title={!playbackFinished ? "Wait for audio to finish" : ""}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Listening Test"}
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-[1000px] mx-auto mb-8 sticky top-4 z-10">
                {currentAudioUrl && !playbackFinished && (
                    <AudioPlayer
                        ref={audioPlayerRef}
                        audioUrl={currentAudioUrl}
                        onEnded={handleAudioEnded}
                        onPlay={handlePlaybackStart}
                        disableSeekBack={hasPlaybackStarted}
                        disableReplay={hasPlaybackStarted}
                        key={currentAudioUrl}
                    />
                )}
                {playbackFinished && (
                    <p className="text-center font-semibold text-green-600 bg-white p-3 rounded-lg shadow">Audio playback finished. Check your answers and submit.</p>
                )}
                {isLoadingData && (
                    <p className="text-center">Loading audio...</p>
                )}
                {loadingError && (
                    <p className="text-center text-red-500">Failed to load audio information.</p>
                )}
            </div>

            <div className="w-full max-w-[1000px] mx-auto flex-grow bg-white p-5 md:p-8 rounded-xl shadow-md overflow-y-auto max-h-[calc(100vh-250px)]">
                {isLoadingData && <p className="text-center">Loading questions...</p>}
                {loadingError && <p className="text-center text-red-500">Failed to load questions.</p>}
                {!isLoadingData && !loadingError && listeningParts && listeningParts.length > 0 && (
                    <div className="flex flex-col gap-8">
                        {listeningParts.map((part, index) => (
                            <IeltsListeningPart
                                key={part.id}
                                partData={part}
                                answers={answers}
                                onAnswerChange={handleAnswerChange}
                                isActive={index === currentAudioPartIndex && !playbackFinished}
                            />
                        ))}
                    </div>
                )}
                {!isLoadingData && (!listeningParts || listeningParts.length === 0) && (
                    <p className="text-center text-gray-500">No listening parts found for this test.</p>
                )}
            </div>

            {modalLogic.showSuccessModal && (
                <SuccessModal
                    message="Your listening answers have been submitted successfully!"
                    onOk={handleSuccessRedirect}
                    onClose={modalLogic.onSuccessModalClose}
                />
            )}
            {modalLogic.showErrorModal && (
                <ErrorModal
                    message="Failed to submit your answers. Please try again."
                    onClose={modalLogic.onErrorModalClose}
                />
            )}
        </div>
    );
}