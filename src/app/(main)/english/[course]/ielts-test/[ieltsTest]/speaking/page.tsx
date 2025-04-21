"use client";

import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { useParams, useRouter } from "next/navigation";
import useVoiceRecorder from "@/hooks/useVoiceRecorder";
import { useModalLogic } from "@/hooks/useModalLogic";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import {useGetIeltsSpeakingQuery, useSubmitIeltsSpeakingMutation} from "@/store/api/ieltsApi";
import {IeltsSpeakingQuestion } from "@/types/Ielts";
import SpeakingPart1Content from "@/app/(main)/english/[course]/ielts-test/components/SpeakingPart1Content";
import SpeakingPart2Content from "@/app/(main)/english/[course]/ielts-test/components/SpeakingPart2Content";
import SpeakingPart3Content from "@/app/(main)/english/[course]/ielts-test/components/SpeakingPart3Content";
import AudioRecorderControls from "@/app/(main)/english/[course]/ielts-test/components/AudioRecorderControls";
import Button from "@/components/ui/button/Button";

type AnswersState = { [questionId: number]: string };
type QuestionIndicesState = { [part: number]: number };

interface CueCardData {
    topic: string;
    points: string[];
    questionId: number;
}


export default function IeltsSpeakingPage() {
    const { ieltsTest: ieltsTestParam, course } = useParams();
    const ieltsTestId = Number(ieltsTestParam);
    const router = useRouter();
    const modalLogic = useModalLogic();
    const voiceRecorder = useVoiceRecorder();

    const [currentPart, setCurrentPart] = useState<number>(1);
    const [answers, setAnswers] = useState<AnswersState>({});
    const [questionIndices, setQuestionIndices] = useState<QuestionIndicesState>({ 1: 0, 3: 0 });
    // --- НОВОЕ: Состояние для отслеживания запроса на остановку ---
    const [stopRequestedForQuestionId, setStopRequestedForQuestionId] = useState<number | null>(null);


    const { data: speakingPartsData, isLoading: isLoadingData, error: loadingError } = useGetIeltsSpeakingQuery(ieltsTestId, {
        skip: !ieltsTestId,
    });

    const [submitSpeaking, { isLoading: isSubmitting }] = useSubmitIeltsSpeakingMutation();

    const currentPartData = useMemo(() =>
            speakingPartsData?.find(part => part.part === currentPart),
        [speakingPartsData, currentPart]
    );

    const currentQuestions = useMemo(() =>
            currentPartData?.speaking_questions || [],
        [currentPartData]
    );

    const activeQuestionIndex = useMemo(() =>
            (currentPart === 1 || currentPart === 3) ? questionIndices[currentPart] : 0,
        [currentPart, questionIndices]
    );

    const activeQuestion = useMemo(() =>
            currentQuestions?.[activeQuestionIndex],
        [currentQuestions, activeQuestionIndex]
    );

    // Функция isPartCompleted остается без изменений
    const isPartCompleted = useCallback((partNumber: number): boolean => {
        const partData = speakingPartsData?.find(p => p.part === partNumber);
        if (!partData) return false;
        const questions = partData.speaking_questions;
        if (!questions || questions.length === 0) return true;

        if (partNumber === 1 || partNumber === 3) {
            const lastQuestionIndex = questions.length - 1;
            const lastQuestion = questions[lastQuestionIndex];
            return questionIndices[partNumber] >= lastQuestionIndex && (answers[lastQuestion?.id]?.trim()?.length || 0) > 0;
        } else if (partNumber === 2) {
            const part2QuestionId = questions[0]?.id;
            return !!part2QuestionId && (answers[part2QuestionId]?.trim()?.length || 0) > 0;
        }
        return false;
    }, [speakingPartsData, questionIndices, answers]);

    // useEffect для сохранения промежуточного транскрипта остается
    useEffect(() => {
        if (voiceRecorder.isRecording && activeQuestion?.id) {
            if (voiceRecorder.transcript && voiceRecorder.transcript.trim().length > 0) {
                setAnswers(prev => ({
                    ...prev,
                    [activeQuestion.id]: voiceRecorder.transcript
                }));
            }
        }
    }, [voiceRecorder.transcript, voiceRecorder.isRecording, activeQuestion?.id]);


    // --- НОВЫЙ useEffect для обработки ЗАВЕРШЕНИЯ записи и перехода ---
    useEffect(() => {
        if (!voiceRecorder.isRecording && stopRequestedForQuestionId !== null && voiceRecorder.transcript) {
            console.log(`Effect triggered: Recording stopped for question ${stopRequestedForQuestionId}`);

            const questionIdThatStopped = stopRequestedForQuestionId;
            const finalTranscript = (voiceRecorder.transcript || "").trim();
            console.log(`Final transcript captured: "${finalTranscript}"`);
            console.log(voiceRecorder.transcript);
            if (finalTranscript.length > 0) {
                setAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [questionIdThatStopped]: finalTranscript
                }));
                console.log(`Saved final transcript for question ${questionIdThatStopped}`);
            } else {
                console.log(`Final transcript for question ${questionIdThatStopped} is empty.`);
            }


            const currentPartQuestions = speakingPartsData?.find(p => p.part === currentPart)?.speaking_questions || [];
            const stoppedQuestionIndex = currentPartQuestions.findIndex(q => q.id === questionIdThatStopped);
            const isLastQuestionOfPart = (currentPart === 1 || currentPart === 3) &&
                stoppedQuestionIndex !== -1 &&
                stoppedQuestionIndex >= currentPartQuestions.length - 1;
            const nextPartNumber = currentPart + 1;
            const nextPartExists = speakingPartsData?.some(p => p.part === nextPartNumber);
            const part3Exists = speakingPartsData?.some(p => p.part === 3);

            let nextActionTaken = false;

            if (currentPart === 1 || currentPart === 3) {
                if (isLastQuestionOfPart) {
                    if (nextPartExists) {
                        console.log(`Transitioning from Part ${currentPart} to Part ${nextPartNumber}`);
                        handlePartChange(nextPartNumber); // Переход на след. часть
                        nextActionTaken = true;
                    } else {
                        console.log("End of test or next part missing after Part", currentPart);
                    }
                } else if (stoppedQuestionIndex !== -1) {
                    const nextIndex = stoppedQuestionIndex + 1;
                    console.log(`Transitioning from question index ${stoppedQuestionIndex} to ${nextIndex} in Part ${currentPart}`);
                    setQuestionIndices(prev => ({ ...prev, [currentPart]: nextIndex })); // Переход на след. вопрос
                    nextActionTaken = true;
                }
            } else if (currentPart === 2) {
                if (part3Exists) {
                    console.log("Transitioning from Part 2 to Part 3");
                    handlePartChange(3); // Переход на часть 3
                    nextActionTaken = true;
                } else {
                    console.log("Part 3 missing after Part 2.");
                }
            }

            if (nextActionTaken) { // Очищаем только если был какой-то переход
                voiceRecorder.setTranscript(""); // Используем функцию очистки из хука
                console.log("Cleared transcript in hook for next question/part.");
            }

            setStopRequestedForQuestionId(null);
            console.log("Reset stop request.");
        }
    }, [
        voiceRecorder.isRecording,
        stopRequestedForQuestionId,
        voiceRecorder.transcript,
        voiceRecorder.setTranscript,
        currentPart,
        speakingPartsData,
        setQuestionIndices,
        answers // Добавляем answers, так как isPartCompleted от него зависит
    ]);


    // --- НОВАЯ Функция для кнопки Stop ---
    const requestStopRecordingAndTransition = () => {
        // Запрашиваем остановку только если идет запись и есть активный вопрос
        if (voiceRecorder.isRecording && activeQuestion) {
            console.log(`Requesting stop for question ${activeQuestion.id}`);
            setStopRequestedForQuestionId(activeQuestion.id); // Устанавливаем ID вопроса для useEffect
            voiceRecorder.stopRecording(); // Вызываем остановку в хуке
        } else {
            console.warn("Stop requested but not recording or no active question.");
        }
    };


    // handlePartChange остается для ручного перехода (в основном назад)
    // Оборачиваем в useCallback, так как используется в useEffect
    const handlePartChange = useCallback((partNumber: number) => {
        if (partNumber === currentPart) return;

        // Проверка при ручном переходе вперед
        if (partNumber > currentPart) {
            if (!isPartCompleted(currentPart)) {
                console.log(`Manual transition blocked: Part ${currentPart} not completed`);
                return;
            }
        }

        // Если запись идет при ручном переходе, останавливаем ее, но НЕ инициируем авто-переход
        if (voiceRecorder.isRecording) {
            setStopRequestedForQuestionId(null); // Отменяем запрос на авто-переход
            voiceRecorder.stopRecording();
            // Здесь не сохраняем транскрипт принудительно, полагаемся на сохранение в useEffect
        }
        voiceRecorder.setTranscript(""); // Очищаем транскрипт для новой части
        setCurrentPart(partNumber);
    }, [currentPart, isPartCompleted, voiceRecorder.isRecording, voiceRecorder.stopRecording, voiceRecorder.setTranscript, activeQuestion?.id]); // Добавили зависимости


    // handleSubmitSpeaking остается почти без изменений, проверяет areAllPartsCompleted
    const handleSubmitSpeaking = async () => {
        const allPartsCompleted = speakingPartsData?.every(part => isPartCompleted(part.part)) ?? false;
        if (!allPartsCompleted) {
            console.log("Cannot submit, not all parts completed");
            return;
        }
        if (!speakingPartsData || isSubmitting || voiceRecorder.isRecording) {
            console.log("Submit blocked: submitting, loading, recording, or no data");
            return;
        }

        const allQuestions = speakingPartsData.flatMap(part => part.speaking_questions);
        const payloadData = {
            speakings: allQuestions.map(q => ({
                answer: answers[q.id]?.trim() || "",
                speaking_id: q.id,
            })),
        };
        console.log("Submitting payload:", payloadData); // Логируем перед отправкой

        try {
            await submitSpeaking({ id: ieltsTestId, data: payloadData }).unwrap();
            modalLogic.showSuccess();
        } catch (e) {
            console.error("Failed to submit speaking:", e);
            modalLogic.showError();
        }
    };

    const handleSuccessRedirect = () => {
        router.push(`/english/${course || 'default-course'}`);
    };

    // parseCueCardData остается без изменений
    const parseCueCardData = (question?: IeltsSpeakingQuestion): CueCardData | null => {
        if (!question || currentPart !== 2) return null;
        return {
            topic: question.question || "Describe...",
            points: question.additional_information?.split('\n').filter(p => p.trim()) || [],
            questionId: question.id,
        };
    };

    const cueCardDataForPart2 = useMemo(() =>
            parseCueCardData(currentQuestions?.[0]),
        [currentQuestions, currentPart]
    );


    const partTitles: { [key: number]: string } = {
        1: "Part 1: Interview",
        2: "Part 2: Long Turn",
        3: "Part 3: Discussion",
    };

    // renderPartContent остается без изменений (кроме удаления ненужных пропсов)
    const renderPartContent = () => {
        if (isLoadingData) return <p className="text-center">Loading questions...</p>;
        if (loadingError) return <p className="text-center text-red-500">Failed to load questions.</p>;
        if (!currentPartData) return <p className="text-center">No data for this part.</p>;

        switch (currentPart) {
            case 1:
                return <SpeakingPart1Content
                    questions={currentQuestions}
                    currentIndex={questionIndices[1]}
                    activeQuestionId={activeQuestion?.id}
                />;
            case 2:
                return <SpeakingPart2Content
                    cueCardData={cueCardDataForPart2}
                    activeQuestionId={activeQuestion?.id}
                    startRecording={voiceRecorder.startRecording}
                    stopRecording={requestStopRecordingAndTransition}
                    isRecording={voiceRecorder.isRecording}
                />;
            case 3:
                return <SpeakingPart3Content
                    questions={currentQuestions}
                    currentIndex={questionIndices[3]}
                    topic={speakingPartsData?.find(p => p.part === 2)?.speaking_questions?.[0]?.question || "Related Topic"}
                    activeQuestionId={activeQuestion?.id}
                />;
            default:
                return <p>Select a part</p>;
        }
    };

    // areAllPartsCompleted остается без изменений
    const areAllPartsCompleted = useMemo(() =>
            speakingPartsData?.every(part => isPartCompleted(part.part)) ?? false,
        [speakingPartsData, isPartCompleted]
    );

    const isAudioControlDisabled = !activeQuestion || isSubmitting || isLoadingData || stopRequestedForQuestionId !== null; // Блокируем во время обработки остановки

    return (
        <div className="w-full min-h-screen bg-[#EEF4FF] flex flex-col py-12 items-center px-4">
            <div className="w-full max-w-[900px] flex flex-col gap-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-3xl font-semibold text-[#737B98]">IELTS Speaking</p>
                </div>

                {/* Part Navigation */}
                {speakingPartsData && speakingPartsData.length > 0 && (
                    <div className="w-full grid grid-cols-3 gap-4 mb-6">
                        {speakingPartsData.map((part) => {
                            const isEnabled = part.part <= currentPart || isPartCompleted(part.part - 1);
                            return (
                                <button
                                    key={part.part}
                                    disabled={!isEnabled}
                                    className={`text-center py-2 px-4 border border-[#737B98] rounded-lg transition-colors duration-200 ${
                                        part.part === currentPart
                                            ? "bg-white text-[#333] font-semibold ring-2 ring-blue-500"
                                            : isEnabled
                                                ? "bg-transparent text-[#737B98] hover:bg-white hover:text-[#333] cursor-pointer"
                                                : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                    }`}
                                    onClick={() => isEnabled && handlePartChange(part.part)}
                                >
                                    Part {part.part}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content Area */}
                <div className="w-full p-6 flex flex-col bg-white items-start rounded-2xl gap-5 shadow-md min-h-[450px]">
                    <h2 className="text-xl font-bold text-gray-800 self-center mb-4">
                        {partTitles[currentPart] || `Part ${currentPart}`}
                    </h2>
                    <div className="w-full flex-grow min-h-[250px]">
                        {renderPartContent()}
                    </div>
                    {/* --- ИЗМЕНЕНО: Передаем requestStopRecordingAndTransition как stopRecording --- */}
                    <div className="w-full mt-6 border-t pt-6">
                        <AudioRecorderControls
                            isRecording={voiceRecorder.isRecording}
                            startRecording={voiceRecorder.startRecording}
                            stopRecording={requestStopRecordingAndTransition} // Передаем новую функцию запроса остановки
                            disabled={isAudioControlDisabled}
                        />
                        {stopRequestedForQuestionId !== null && <p className="text-center text-sm text-blue-500 mt-2">Processing answer...</p>}
                    </div>
                </div>

                {/* Submit Button */}
                {speakingPartsData && speakingPartsData.length > 0 && (
                    <div className="w-full flex justify-end mt-6">
                        <Button
                            onClick={handleSubmitSpeaking}
                            disabled={isSubmitting || isLoadingData || voiceRecorder.isRecording || !areAllPartsCompleted || stopRequestedForQuestionId !== null}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!areAllPartsCompleted ? "Complete all parts first" : ""}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Speaking Test"}
                        </Button>
                    </div>
                )}

            </div>

            {/* Modals */}
            {modalLogic.showSuccessModal && (
                <SuccessModal
                    message="Your speaking answers have been submitted successfully!"
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