
"use client";

import React, {useState, useCallback, useRef, useEffect} from 'react';
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
    const [score, setScore] = useState<number | null>(null);

    const [answers, setAnswers] = useState<ListeningAnswersState>({});
    const [hasPlaybackStarted, setHasPlaybackStarted] = useState<boolean>(false); // Началось ли воспроизведение вообще
    const [playbackFinished, setPlaybackFinished] = useState<boolean>(false); // Завершено ли проигрывание *всех* частей

    const audioPlayerRef = useRef<{ getCurrentTime: () => number }>(null);

    const { data: listeningParts, isLoading: isLoadingData, error: loadingError } = useGetIeltsListeningQuery(ieltsTestId, {
        skip: !ieltsTestId,
    });

    const [submitListening, { isLoading: isSubmitting }] = useSubmitIeltsListeningMutation();

    const handleAnswerChange = useCallback((questionId: number, answer: string | number | null) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    }, []);

    const handleAudioEnded = useCallback(() => {
            setPlaybackFinished(true);
    }, []);

    const handlePlaybackStart = useCallback(() => {
        if (!hasPlaybackStarted) {
            setHasPlaybackStarted(true);
        }
    }, [hasPlaybackStarted]);


    const handleSubmitListening = async () => {
        if (!listeningParts || isSubmitting) {
            console.log("Submit blocked: No data, submitting, or playback not finished.");
            return;
        }

        const formattedSubmissions: {
            listening_id: number;
            options: { option_id: number; question_id: number }[];
            fills: { question_id: number; answer: string[] }[];
        }[] = [];

        listeningParts?.listening_parts?.forEach(part => {
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

            if (partSubmission.options.length > 0 || partSubmission.fills.length > 0) {
                formattedSubmissions.push(partSubmission);
            }
        });

        const payloadData: ListeningSubmit = { listenings: formattedSubmissions };

        console.log("Submitting Listening Payload:", JSON.stringify(payloadData, null, 2));

        try {
            const res = await submitListening({ id: ieltsTestId, data: payloadData }).unwrap();
            setScore(res?.score || null);

            modalLogic.showSuccess();
        } catch (e) {
            console.log("Failed to submit listening:", e);
            modalLogic.showError();
        }
    };

    useEffect(() => {
        console.log('EFFECT: Adding beforeunload listener. Current answers length:', Object.keys(answers).length, 'SuccessModal shown:', modalLogic.showSuccessModal);

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            console.log('EVENT: beforeunload triggered');

            const currentAnswersLength = Object.keys(answers).length;
            const isSuccessModalShown = modalLogic.showSuccessModal;
            const hasUnsavedProgress = currentAnswersLength > 0 && !isSuccessModalShown;

            console.log(`EVENT data: answers length = ${currentAnswersLength}, success modal shown = ${isSuccessModalShown}, should prevent? = ${hasUnsavedProgress}`);

            if (hasUnsavedProgress) {
                console.log('EVENT: Preventing unload and setting returnValue.');
                event.preventDefault();
                event.returnValue = '';
            } else {
                console.log('EVENT: Condition not met, allowing unload.');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('EFFECT: Removing beforeunload listener.');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [answers, modalLogic.showSuccessModal]);

    const handleSuccessRedirect = () => {
        router.push(`/english/${course || 'default-course'}`);
    };


    return (
        <div className="w-full min-h-screen bg-[#EEF4FF] flex flex-col py-12 px-4 md:px-8">
            <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center mb-6 flex-wrap gap-4">
                <p className="text-3xl font-semibold text-[#737B98]">IELTS Listening</p>
                <div className="flex items-center gap-6">
                    <Button
                        onClick={handleSubmitListening}
                        disabled={isSubmitting || isLoadingData}
                        className="bg-[#7B68EE] text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Listening Test"}
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-[1000px] mx-auto mb-8 sticky top-4 z-10">
                {listeningParts?.audio_file && !playbackFinished && (
                    <AudioPlayer
                        ref={audioPlayerRef}
                        audioUrl={listeningParts.audio_file}
                        onEnded={handleAudioEnded}
                        onPlay={handlePlaybackStart}
                        disableSeekBack={hasPlaybackStarted}
                        disableReplay={hasPlaybackStarted}
                        key={listeningParts.audio_file}
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
                {!isLoadingData && !loadingError && listeningParts && listeningParts?.listening_parts?.length > 0 && (
                    <div className="flex flex-col gap-8">
                        {listeningParts?.listening_parts?.map((part) => (
                            <IeltsListeningPart
                                key={part.id}
                                partData={part}
                                answers={answers}
                                onAnswerChange={handleAnswerChange}
                            />
                        ))}
                    </div>
                )}
                {!isLoadingData && (!listeningParts || listeningParts?.listening_parts?.length === 0) && (
                    <p className="text-center text-gray-500">No listening parts found for this test.</p>
                )}
            </div>

            {modalLogic.showSuccessModal && (
                <SuccessModal
                    message={`Cәтті тапсырдыңыз! Сіздің нәтижеңііз: ${score}/30`}
                    onOk={handleSuccessRedirect}
                    onClose={modalLogic.onSuccessModalClose}
                />
            )}
            {modalLogic.showErrorModal && (
                <ErrorModal
                    message="Қателік пайда болды. Қайталап көріңіз."
                    onClose={modalLogic.onErrorModalClose}
                />
            )}
        </div>
    );
}