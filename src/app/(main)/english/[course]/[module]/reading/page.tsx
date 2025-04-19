"use client"

import useReadingTest from "@/hooks/useReadingTest";
import {useEffect, useState} from "react";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import ReadingCard from "@/app/(main)/english/[course]/[module]/components/ReadingCard";
import ReadingCardSceleton from "@/components/ui/sceletons/ReadingCardSceleton";
import SuccessModal from "@/components/modal/SuccessModal";
import {useParams, useRouter} from "next/navigation";
import {useModalLogic} from "@/hooks/useModalLogic";
import ErrorModal from "@/components/modal/ErrorModal";
import {AttemptTest} from "@/types/Attempts";
import {QuestionReading} from "@/types/Sections";

export default function ReadingPage() {
    const {course, module} = useParams();
    const router = useRouter();
    const [startIndex, setStartIndex] = useState(1);

    const modalLogic = useModalLogic();

    const {
        currentQuestions,
        goToNextPage,
        goToPrevPage,
        setAnswer,
        canGoNext,
        canGoPrev,
        currentPage,
        questionsPerPage,
        handleSubmit,
        userAnswers,
        isSuccess,
        isError,
        currentDisplayData,
        isReviewMode,
    } = useReadingTest();

    useEffect(() => {
        if (isSuccess) {
            modalLogic.showSuccess();
        }
        if (isError) {
            modalLogic.showError();
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (currentPage === 0) {
            setStartIndex(1)
        } else {
            setStartIndex(currentPage * questionsPerPage + 1)
        }
    }, [currentPage]);

    const handleRightButtonClick = () => {
        if (isReviewMode) {
            if (canGoNext) {
                goToNextPage();
            }
        } else {
            if (canGoNext) {
                goToNextPage();
            } else {
                handleSubmit();
            }
        }
    };

    const isRightButtonDisabled = isReviewMode && !canGoNext;

    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col gap-9">
            {
                !currentQuestions && Array.from({ length: questionsPerPage }, (_, index) =>(
                    <ReadingCardSceleton key={index}/>
                ))
            }
            {currentDisplayData && currentDisplayData.map((currentData, index) => {
                const questionId = currentData.id;

                const commonProps = {
                    id: questionId,
                    number: startIndex + index, // Номер вопроса
                    context: currentData.context,
                    image: currentData.image,
                    source: currentData.source,
                    question: currentData.question,
                };

                return isReviewMode ? (
                    <ReadingCard
                        {...commonProps}
                        isReviewMode={true}
                        key={questionId}
                        reviewOptions={(currentData as AttemptTest).options}
                        options={[]}
                        userAnswers={[]}
                        setAnswer={() => {}}
                    />
                ) : (
                    <ReadingCard
                        {...commonProps}
                        isReviewMode={false}
                        key={questionId}
                        options={(currentData as QuestionReading).options}
                        userAnswers={userAnswers}
                        setAnswer={setAnswer}
                        reviewOptions={[]}
                    />
                );
            })}
            <div className="w-full flex justify-between">
                {
                    canGoPrev ? (
                        <Button
                            className="gap-2 py-4 px-8 border border-[#7B68EE] rounded-[10px] font-medium text-[#7B68EE] bg-transparent"
                            onClick={goToPrevPage}
                            width={155}
                        >
                            <Image src={"/icon/back.svg"} alt={"back"} width={24} height={24}/>
                            <p>Артқа</p>
                        </Button>
                    ) : (<div></div>)
                }
                <Button
                    className="gap-2 py-4 px-8 text-white"
                    onClick={handleRightButtonClick}
                    disabled={isRightButtonDisabled}
                    width={155}
                >
                    <p>{canGoNext ? "Келесі" : "Аяқтау"}</p>
                    <Image src={"/icon/next.svg"} alt={"next"} width={24} height={24}/>
                </Button>
            </div>
            {
                modalLogic.showSuccessModal && (
                    <SuccessModal
                        onOk={() => router.push(`/english/${course}/${module}/writing`)}
                        onClose={modalLogic.onSuccessModalClose}
                    />
                )
            }
            {
                modalLogic.showErrorModal && (
                    <ErrorModal
                        onClose={modalLogic.onErrorModalClose}
                    />
                )
            }
        </div>
    );
}