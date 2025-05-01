"use client";

import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import { useParams, useRouter } from "next/navigation";
import { useGetIeltsReadingQuery, useSubmitIeltsReadingMutation } from "@/store/api/ieltsApi";
import { useModalLogic } from "@/hooks/useModalLogic";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import PassageDisplay from "@/app/(main)/english/[course]/ielts-test/components/PassageDisplay";
import QuestionDisplay from "@/app/(main)/english/[course]/ielts-test/components/QuestionDisplay";
import Button from "@/components/ui/button/Button";
import Timer from "@/components/Timer";

type ReadingAnswersState = { [questionId: number]: string | number | null | string[] };


export default function IeltsReadingPage() {
    const { ieltsTest: ieltsTestParam, course } = useParams();
    const ieltsTestId = Number(ieltsTestParam);
    const router = useRouter();
    const modalLogic = useModalLogic();

    const [score, setScore] = useState<number | null>(null);

    const [currentPassageIndex, setCurrentPassageIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<ReadingAnswersState>({});

    const submitReadingRef = useRef<(() => Promise<void>) | undefined>(undefined);

    const { data: readingPassages, isLoading: isLoadingData, error: loadingError } = useGetIeltsReadingQuery(ieltsTestId, {
        skip: !ieltsTestId,
    });

    const [submitReading, { isLoading: isSubmitting }] = useSubmitIeltsReadingMutation();

    const currentPassage = useMemo(() =>
            readingPassages?.[currentPassageIndex],
        [readingPassages, currentPassageIndex]
    );

    const handlePassageChange = (index: number) => {
        setCurrentPassageIndex(index);
    };

    const handleAnswerChange = useCallback((questionId: number, answer: string | number | null | string[]) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    }, []);

    const handleSubmitReading = useCallback(async () => {
        if (!readingPassages || isSubmitting) return;

        const payloadData: {
            readings: {
                reading_id: number;
                options: {
                    option_id: number;
                    question_id: number;
                }[];
                fills: {
                    question_id: number;
                    answer: string[];
                }[];
                selects: {
                    question_id: number;
                    answer: string;
                }[];
            }[]
        } = { readings: [] };

        readingPassages.forEach(passage => {
            const passageAnswers = {
                reading_id: passage.id,
                options: [] as { option_id: number; question_id: number }[],
                fills: [] as { question_id: number; answer: string[] }[],
                selects: [] as { question_id: number; answer: string }[],
            };

            passage.questions.forEach(q => {
                const answer = answers[q.id];
                if (answer !== undefined && answer !== null) {
                    if (q.question_type === 'OPTIONS') {
                        passageAnswers.options.push({ question_id: q.id, option_id: Number(answer) });
                    } else if (q.question_type === 'FILL') {
                        if (Array.isArray(answer) && answer.every(item => typeof item === 'string')) {
                            passageAnswers.fills.push({ question_id: q.id, answer: answer });
                        } else if (typeof answer === 'string') {
                            passageAnswers.fills.push({ question_id: q.id, answer: [answer] });
                        } else {
                            console.warn(`Invalid answer type for FILL question ${q.id}: expected string or string[], got ${typeof answer}`);
                        }
                    } else if (q.question_type === 'SELECT_INSERT') {
                        if (typeof answer === 'string') {
                            passageAnswers.selects.push({ question_id: q.id, answer: answer });
                        } else {
                            console.warn(`Invalid answer type for SELECT question ${q.id}: expected number, got ${typeof answer}`);
                        }
                    }
                }
            });

            payloadData.readings.push(passageAnswers);
        });

        console.log("Submitting Reading Payload:", JSON.stringify(payloadData, null, 2));

        try {
            const res = await submitReading({ id: ieltsTestId, data: payloadData }).unwrap();
            setScore(res?.score || null);
            modalLogic.showSuccess();
        } catch (e) {
            console.log("Failed to submit reading:", e);
            modalLogic.showError();
        }
    }, [readingPassages, isSubmitting, ieltsTestId, answers, submitReading, modalLogic]);

    submitReadingRef.current = handleSubmitReading;

    const stableTimerEndHandler = useCallback(() => {
        submitReadingRef.current?.();
    }, []);

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

    const memoizedTimer = useMemo(() => {
        return <Timer timeProp={3600} onTimerEnd={stableTimerEndHandler} />;
    }, [stableTimerEndHandler]);

    return (
        <div className="w-full min-h-screen bg-[#EEF4FF] flex flex-col py-12 px-4 md:px-8">
            <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center mb-6 flex-wrap gap-4">
                <p className="text-3xl font-semibold text-[#737B98]">IELTS Reading</p>
                <div className="flex items-center gap-6">
                    <p className="text-xl font-semibold text-[#737B98]">
                        Time left: {memoizedTimer}
                    </p>
                    <Button
                        onClick={handleSubmitReading}
                        disabled={isSubmitting || isLoadingData}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Reading Test"}
                    </Button>
                </div>
            </div>

            {readingPassages && readingPassages.length > 0 && (
                <div className="w-full max-w-[1400px] mx-auto flex justify-center gap-4 mb-6 flex-wrap">
                    {readingPassages.map((passage, index) => (
                        <button
                            key={passage.id}
                            className={`text-center py-2 px-5 border border-[#737B98] rounded-lg transition-colors duration-200 ${
                                index === currentPassageIndex
                                    ? "bg-white text-[#333] font-semibold ring-1 ring-[#7B68EE]"
                                    : "bg-transparent text-[#737B98] hover:bg-white hover:text-[#333] cursor-pointer"
                            }`}
                            onClick={() => handlePassageChange(index)}
                        >
                            Passage {passage.passage_number || index + 1}
                        </button>
                    ))}
                </div>
            )}

            <div className="w-full max-w-[1400px] mx-auto flex-grow flex flex-col md:flex-row gap-6 md:gap-8">
                {isLoadingData && <p className="text-center w-full">Loading reading passages...</p>}
                {loadingError && <p className="text-center text-red-500 w-full">Failed to load passages.</p>}
                {!isLoadingData && !loadingError && currentPassage && (
                    <>
                        <div className="w-full md:w-1/2 lg:w-7/12">
                            <PassageDisplay
                                title={currentPassage.title}
                                content={currentPassage.content}
                            />
                        </div>

                        <div className="w-full md:w-1/2 lg:w-5/12">
                            <QuestionDisplay
                                questions={currentPassage.questions}
                                answers={answers}
                                onAnswerChange={handleAnswerChange}
                            />
                        </div>
                    </>
                )}
                {!isLoadingData && !currentPassage && readingPassages && (
                    <p className="text-center w-full">Passage data is available but could not be displayed.</p>
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