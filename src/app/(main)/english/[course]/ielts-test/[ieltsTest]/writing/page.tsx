"use client";

import { useParams, useRouter } from "next/navigation"; // Добавили useRouter
import { useGetIeltsWritingQuery, useSubmitIeltsWritingMutation } from "@/store/api/ieltsApi"; // Предполагаем, что мутация здесь
import { useState, useEffect } from "react";
import IeltsWritingCard from "@/app/(main)/english/[course]/ielts-test/components/IeltsWritingCard";
import Timer from "@/components/Timer";
import SuccessModal from "@/components/modal/SuccessModal"; // Перенесли модалки сюда
import ErrorModal from "@/components/modal/ErrorModal";
import { useModalLogic } from "@/hooks/useModalLogic";
import Button from "@/components/ui/button/Button";

type WritingAnswers = {
    [key: number]: string;
};

export default function IeltsWritingPage() {
    const { ieltsTest, course } = useParams();
    const router = useRouter();
    const modalLogic = useModalLogic();

    const [currentRound, setCurrentRound] = useState<number>(0);
    const [answers, setAnswers] = useState<WritingAnswers>({});

    const { data: writings, isLoading } = useGetIeltsWritingQuery(Number(ieltsTest), {
        skip: !ieltsTest,
    });
    console.log(writings)

    const [submitWriting, { isLoading: isSubmitting }] = useSubmitIeltsWritingMutation();

    useEffect(() => {
        const savedAnswers = sessionStorage.getItem(`ieltsAnswers_${ieltsTest}`);
        if (savedAnswers) {
            try {
                setAnswers(JSON.parse(savedAnswers));
            } catch (e) {
                console.log("Failed to parse saved answers:", e);
                sessionStorage.removeItem(`ieltsAnswers_${ieltsTest}`); // Очистить некорректные данные
            }
        }
    }, [ieltsTest]);

    const handleAnswerChange = (writingId: number, value: string) => {
        setAnswers(prevAnswers => {
            const newAnswers = {
                ...prevAnswers,
                [writingId]: value,
            };
            sessionStorage.setItem(`ieltsAnswers_${ieltsTest}`, JSON.stringify(newAnswers));
            return newAnswers;
        });
    };

    const handleRoundClick = (index: number) => {
        setCurrentRound(index);
    };

    const handleSubmitAll = async () => {
        if (!writings) return;

        const payload = {
            writings: writings.map(writing => ({
                answer: answers[writing.id] || "",
                writing_id: writing.id,
            })),
        };

        try {
            await submitWriting({ id: Number(ieltsTest), data: payload }).unwrap();

            modalLogic.showSuccess();
            sessionStorage.removeItem(`ieltsAnswers_${ieltsTest}`);
        } catch (e) {
            console.error("Failed to submit writing:", e);
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

    const currentWritingData = writings?.[currentRound];

    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col py-12 items-center px-4">
            <div className="w-full max-w-[1100px] mb-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-3xl font-semibold text-[#737B98]">IELTS Writing</p>
                    <p className="text-xl font-semibold text-[#737B98]">
                        Time left: <Timer timeProp={3600} />
                    </p>
                </div>

                {writings && writings.length > 1 && (
                    <div className="w-full grid grid-cols-2 gap-4 mb-6">
                        {writings.map((writing, i) => (
                            <div
                                key={writing.id}
                                className={`cursor-pointer text-center py-2 px-4  rounded-lg transition-colors duration-200 ${
                                    i === currentRound
                                        ? "bg-white text-[#333] font-semibold border border-[#7B68EE]" 
                                        : "bg-transparent text-[#737B98] border border-[#737B98] hover:bg-white hover:text-[#333]"
                                }`}
                                onClick={() => handleRoundClick(i)}
                            >
                                Part {i + 1}
                            </div>
                        ))}
                    </div>
                )}

                {isLoading && <p>Loading writing task...</p>}
                {!isLoading && currentWritingData ? (
                    <IeltsWritingCard
                        writing={currentWritingData}
                        answer={answers[currentWritingData.id] || ""}
                        onAnswerChange={handleAnswerChange}
                    />
                ) : (
                    !isLoading && <p>No writing data available for this task.</p>
                )}

                {writings && writings.length > 0 && (
                    <div className="w-full flex justify-end mt-6">
                        <Button
                            onClick={handleSubmitAll}
                            disabled={isSubmitting || isLoading}
                            className="bg-[#7B68EE] text-white font-bold py-2 px-6 rounded-lg"
                        >
                            {isSubmitting ? "Submitting..." : "Submit All Parts"}
                        </Button>
                    </div>
                )}
            </div>

            {modalLogic.showSuccessModal && (
                <SuccessModal
                    message="Сіз сәтті тапсырдыңыз!"
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