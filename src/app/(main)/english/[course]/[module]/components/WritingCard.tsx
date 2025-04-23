"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";
import { WritingAttempt } from "@/types/Attempts"; // Используем тип из Attempts
import { useSubmitWritingMutation } from "@/store/api/generalEnglishApi";
import { useParams, useRouter } from "next/navigation";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import { useModalLogic } from "@/hooks/useModalLogic";
import {Writing} from "@/types/Sections";
import Button from "@/components/ui/button/Button";
import RenderFeedbackWithHighlight from "@/app/(main)/english/[course]/components/RenderFeedbackWithHighlight";

interface WritingCardProps {
    writing: Writing;
    isReviewMode?: boolean;
    attemptData?: WritingAttempt;
    onSuccessfulSubmit?: () => void;
}

const WritingCard = ({ writing, isReviewMode = false, attemptData, onSuccessfulSubmit }: WritingCardProps) => {
    const router = useRouter();
    const { course, module } = useParams();
    const [writingAnswer, setWritingAnswer] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const modalLogic = useModalLogic();

    const [submitWriting] = useSubmitWritingMutation();

    useEffect(() => {
        if (!isReviewMode) {
            const writingAns = sessionStorage.getItem("writingAnswer");
            setWritingAnswer(writingAns ?? "");
        }
    }, [isReviewMode]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setWritingAnswer(value);
        sessionStorage.setItem("writingAnswer", value);
    };

    const handleSubmit = async () => {
        if (!writingAnswer.trim() || isSubmitting || isReviewMode) return;

        setIsSubmitting(true);
        try {
            await submitWriting({
                id: Number(module),
                data: { writing: writingAnswer }
            }).unwrap();

            sessionStorage.removeItem("writingAnswer");
            modalLogic.showSuccess();

        } catch (e) {
            console.log(e);
            modalLogic.showError();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalOk = () => {
        modalLogic.onSuccessModalClose();
        if (onSuccessfulSubmit) {
            onSuccessfulSubmit();
        } else {
            window.location.reload();
        }
    };


    return (
        <div className="w-full p-4 flex flex-col bg-white items-start rounded-3xl gap-3">
            <div className="flex flex-col gap-3">
                <p className="font-bold">
                    Writing
                </p>
                <p className="text-sm text-[#737B98] font-medium">
                    {writing?.writing?.title}
                </p>
                <p className="text-xs text-[#737B98] whitespace-pre-line">
                    {writing?.writing?.requirements}
                </p>
            </div>

            {!isReviewMode ? (
                <>
                    <TextArea
                        onChange={handleChange}
                        value={writingAnswer || ""}
                        disabled={isSubmitting}
                        rows={10}
                        placeholder="Start writing..."
                        className="w-full"
                    />
                    <div className="flex justify-end w-full">
                        <Image
                            src={"/icon/send.svg"}
                            alt={"send"}
                            width={40}
                            height={40}
                            className={`cursor-pointer transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75'}`}
                            onClick={handleSubmit}
                        />
                    </div>
                </>
            ) : (
                attemptData && (
                    <div className="w-full flex flex-col gap-4 mt-2 pt-3 border-t border-gray-200">
                        {attemptData.score !== null && attemptData.score !== undefined && (
                            <p className="text-sm font-medium text-gray-800">
                                Баға (Score): <span className="font-bold text-[#7B68EE]">{attemptData.score}</span>
                            </p>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Сіздің жауабыңыз:</p>
                            <div className="text-sm p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-line">
                                {attemptData?.writing?.user_text || "Жауап жоқ"}
                            </div>
                        </div>
                        {attemptData?.writing?.ai_feedback && (
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">AI Кері байланыс:</p>
                                <div
                                    className="text-sm text-gray-800 whitespace-pre-line p-3 bg-green-50 rounded border border-green-200 prose prose-sm max-w-none">
                                    <RenderFeedbackWithHighlight htmlString={attemptData.writing.ai_feedback}/>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end w-full mt-2">
                            <Button
                                className="gap-2 py-4 px-8 text-white"
                                onClick={() => router.push(`/english/${course}/${module}/listening`)}
                                width={155}
                            >
                                <p>Келесі</p>
                                <Image src={"/icon/next.svg"} alt={"next"} width={24} height={24}/>
                            </Button>
                        </div>
                    </div>
                )
            )}

            {modalLogic.showSuccessModal && (
                <SuccessModal
                    onOk={handleModalOk}
                    onClose={modalLogic.onSuccessModalClose}
                />
            )}
            {modalLogic.showErrorModal && (
                <ErrorModal
                    onClose={modalLogic.onErrorModalClose}
                />
            )}
        </div>
    );
}

export default WritingCard;