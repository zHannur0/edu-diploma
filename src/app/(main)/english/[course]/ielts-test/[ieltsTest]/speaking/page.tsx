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
import AudioRecorderControls from "@/app/(main)/english/[course]/ielts-test/components/AudioRecorderControls"; // Assuming correct path
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
    const [score, setScore] = useState<number | null>(null);

    const [currentPart, setCurrentPart] = useState<number>(1);
    const [answers, setAnswers] = useState<AnswersState>({});
    const [questionIndices, setQuestionIndices] = useState<QuestionIndicesState>({ 1: 0, 3: 0 });
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

    const isPartCompleted = useCallback((partNumber: number): boolean => {
        const partData = speakingPartsData?.find(p => p.part === partNumber);
        if (!partData) return false;
        const questions = partData.speaking_questions;
        if (!questions || questions.length === 0) return true;

        if (partNumber === 1 || partNumber === 3) {
            const lastQuestionIndex = questions.length - 1;
            const lastQuestion = questions[lastQuestionIndex];
            if (!lastQuestion) return questionIndices[partNumber] >= questions.length;
            return questionIndices[partNumber] > lastQuestionIndex || (questionIndices[partNumber] === lastQuestionIndex && !!answers[lastQuestion.id]?.trim());
        } else if (partNumber === 2) {
            const part2QuestionId = questions[0]?.id;
            return !!part2QuestionId && !!answers[part2QuestionId]?.trim();
        }
        return false;
    }, [speakingPartsData, questionIndices, answers]);

    useEffect(() => {
        if (voiceRecorder.isRecording && activeQuestion?.id) {
            if (voiceRecorder.transcript) {
                setAnswers(prev => ({
                    ...prev,
                    [activeQuestion.id]: voiceRecorder.transcript
                }));
            }
        }
    }, [voiceRecorder.transcript, voiceRecorder.isRecording, activeQuestion?.id]);

    // Wrapped handlePartChange in useCallback to ensure stable reference if used in deps
    const handlePartChangeCallback = useCallback((partNumber: number, triggeredProgrammatically: boolean = false) => {
        setCurrentPart(prevCurrentPart => {
            if (partNumber === prevCurrentPart) return prevCurrentPart;

            if (!triggeredProgrammatically && partNumber > prevCurrentPart) {
                if (!isPartCompleted(prevCurrentPart)) {
                    console.log(`Manual transition blocked: Part ${prevCurrentPart} not completed`);
                    return prevCurrentPart;
                }
            }

            if (voiceRecorder.isRecording) {
                voiceRecorder.stopRecording();
            }
            setStopRequestedForQuestionId(null);
            voiceRecorder.setTranscript("");

            return partNumber;
        });
    }, [isPartCompleted, voiceRecorder.isRecording, voiceRecorder.stopRecording, voiceRecorder.setTranscript]); // Added missing deps

    useEffect(() => {
        // Process stop only when recording has actually stopped and a stop was requested
        if (!voiceRecorder.isRecording && stopRequestedForQuestionId !== null) {
            const questionIdThatStopped = stopRequestedForQuestionId;
            const finalTranscript = (voiceRecorder.transcript || "").trim();

            setAnswers(prevAnswers => {
                if (finalTranscript.length > 0) {
                    return { ...prevAnswers, [questionIdThatStopped]: finalTranscript };
                }
                return prevAnswers;
            });

            const partDataWhereStopOccurred = speakingPartsData?.find(p => p.speaking_questions.some(q => q.id === questionIdThatStopped));
            const partNumberWhereStopOccurred = partDataWhereStopOccurred?.part;

            if (!partNumberWhereStopOccurred) {
                console.error("Could not determine part number for stopped question:", questionIdThatStopped);
                setStopRequestedForQuestionId(null); // Reset request even if part not found
                return;
            }

            const currentPartQuestions = partDataWhereStopOccurred?.speaking_questions || [];
            const stoppedQuestionIndex = currentPartQuestions.findIndex(q => q.id === questionIdThatStopped);

            let nextActionTaken = false;

            if (partNumberWhereStopOccurred === 1 || partNumberWhereStopOccurred === 3) {
                const isLastQuestionOfPart = stoppedQuestionIndex >= 0 && stoppedQuestionIndex >= currentPartQuestions.length - 1;
                if (isLastQuestionOfPart) {
                    const nextPartNumber = partNumberWhereStopOccurred + 1;
                    const nextPartExists = speakingPartsData?.some(p => p.part === nextPartNumber);
                    if (nextPartExists) {
                        handlePartChangeCallback(nextPartNumber, true); // Используем стабильный колбэк
                        nextActionTaken = true;
                    } else {
                        if (stoppedQuestionIndex >= 0) {
                            const finalIndex = stoppedQuestionIndex + 1;
                            setQuestionIndices(prev => ({ ...prev, [partNumberWhereStopOccurred]: finalIndex }));
                            console.log(`Stop Effect: Last question of Part ${partNumberWhereStopOccurred}. Set index to ${finalIndex}.`);
                            nextActionTaken = true; // Действие выполнено
                        } else {
                            console.log(`Stop Effect: Last question of Part ${partNumberWhereStopOccurred}, but index was invalid?`);
                            // nextActionTaken остается false
                        }
                        // --- КОНЕЦ ИЗМЕНЕНИЯ ---
                    }
                } else if (stoppedQuestionIndex >= 0) { // Для не-последних вопросов
                    const nextIndex = stoppedQuestionIndex + 1;
                    setQuestionIndices(prev => ({ ...prev, [partNumberWhereStopOccurred]: nextIndex }));
                    nextActionTaken = true;
                }
            } else if (partNumberWhereStopOccurred === 2) {
                const part3Exists = speakingPartsData?.some(p => p.part === 3);
                if (part3Exists) {
                    handlePartChangeCallback(3, true);
                    nextActionTaken = true;
                } else {
                    if (stoppedQuestionIndex >= 0) {
                        console.log("Stop Effect: End of Part 2, no Part 3 exists.");
                    }
                }
            }

            if (nextActionTaken) {
                voiceRecorder.setTranscript("");
            }

            setStopRequestedForQuestionId(null);
        }
    }, [
        voiceRecorder.isRecording,
        stopRequestedForQuestionId,
        voiceRecorder.transcript,
        speakingPartsData,
        handlePartChangeCallback, // Убедись, что handlePartChange обернут в useCallback и добавлен сюда
        voiceRecorder.setTranscript // Убедись, что setTranscript от хука стабилен или добавлен сюда
    ]);


    const requestStopRecordingAndTransition = useCallback(() => {
        // Add log here
        console.log("Requesting stop. isRecording:", voiceRecorder.isRecording, "activeQuestionId:", activeQuestion?.id);
        if (voiceRecorder.isRecording && activeQuestion?.id) {
            setStopRequestedForQuestionId(activeQuestion.id);
            voiceRecorder.stopRecording();
        }
    }, [voiceRecorder.isRecording, voiceRecorder.stopRecording, activeQuestion?.id]);


    const handleSubmitSpeaking = async () => {
        if (!speakingPartsData || isSubmitting || voiceRecorder.isRecording || stopRequestedForQuestionId !== null) {
            console.log("Submit blocked: submitting, loading, recording, pending stop, or no data");
            return;
        }

        const allQuestions = speakingPartsData.flatMap(part => part.speaking_questions);
        const payloadData = {
            speakings: allQuestions.map(q => ({
                answer: answers[q.id]?.trim() || "",
                speaking_id: q.id,
            })),
        };
        console.log("Submitting payload:", payloadData);

        try {
            const res = await submitSpeaking({ id: ieltsTestId, data: payloadData }).unwrap();
            setScore(res.score);
            modalLogic.showSuccess();
        } catch (e) {
            console.log("Failed to submit speaking:", e);
            modalLogic.showError();
        }
    };

    const handleSuccessRedirect = () => {
        router.push(`/english/${course || 'default-course'}`);
    };

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
                const part2Key = currentPartData.id ? `part-2-${currentPartData.id}` : `part-2`;
                return <SpeakingPart2Content
                    key={part2Key}
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

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const isSuccessModalBeingShown = modalLogic.showSuccessModal;
            const hasUnsavedProgress = Object.keys(answers).length > 0 && !isSuccessModalBeingShown;

            if (hasUnsavedProgress) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [answers, modalLogic.showSuccessModal]);

    const areAllPartsCompleted = useMemo(() =>
            speakingPartsData?.every(part => isPartCompleted(part.part)) ?? false,
        [speakingPartsData, isPartCompleted]
    );

    const isAudioControlDisabled = !activeQuestion || isSubmitting || isLoadingData || stopRequestedForQuestionId !== null;

    // Add log here before rendering controls
    console.log("Rendering AudioControls:", {
        isRecording: voiceRecorder.isRecording,
        isDisabled: isAudioControlDisabled,
        activeQuestionId: activeQuestion?.id,
        currentPart: currentPart,
        questionIndex: currentPart === 1 ? questionIndices[1] : (currentPart === 3 ? questionIndices[3] : 'N/A'),
        stopRequested: stopRequestedForQuestionId
    });

    return (
        <div className="w-full min-h-screen bg-[#EEF4FF] flex flex-col py-12 items-center px-4">
            <div className="w-full max-w-[900px] flex flex-col gap-6">

                <div className="flex justify-between items-center mb-4">
                    <p className="text-3xl font-semibold text-[#737B98]">IELTS Speaking</p>
                </div>

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
                                            ? "bg-white text-[#333] font-semibold ring-2 ring-[#7B68EE]"
                                            : isEnabled
                                                ? "bg-transparent text-[#737B98] hover:bg-white hover:text-[#333] cursor-pointer"
                                                : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                    }`}
                                    onClick={() => isEnabled && handlePartChangeCallback(part.part)} // Use callback
                                >
                                    Part {part.part}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="w-full p-6 flex flex-col bg-white items-start rounded-2xl gap-5 shadow-md min-h-[450px]">
                    <h2 className="text-xl font-bold text-gray-800 self-center mb-4">
                        {partTitles[currentPart] || `Part ${currentPart}`}
                    </h2>
                    <div className="w-full flex-grow min-h-[250px]">
                        {renderPartContent()}
                    </div>
                    <div className="w-full mt-6 border-t pt-6">
                        <AudioRecorderControls
                            isRecording={voiceRecorder.isRecording}
                            startRecording={voiceRecorder.startRecording} // Assumed stable from hook
                            stopRecording={requestStopRecordingAndTransition} // useCallback ensures stability
                            disabled={isAudioControlDisabled}
                        />
                        {stopRequestedForQuestionId !== null && <p className="text-center text-sm text-[#7B68EE] mt-2">Processing answer...</p>}
                    </div>
                </div>

                {speakingPartsData && speakingPartsData.length > 0 && (
                    <div className="w-full flex justify-end mt-6">
                        <Button
                            onClick={handleSubmitSpeaking}
                            disabled={isSubmitting || isLoadingData || voiceRecorder.isRecording || stopRequestedForQuestionId !== null}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!areAllPartsCompleted ? "Complete all parts first" : ""}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Speaking Test"}
                        </Button>
                    </div>
                )}

            </div>

            {modalLogic.showSuccessModal && (
                <SuccessModal
                    message={`Сіз сәтті тапсырдыңыз! Сіздің бағаңыз ${score}`}
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