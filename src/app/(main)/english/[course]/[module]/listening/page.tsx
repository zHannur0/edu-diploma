"use client"

import useListeningTest from "@/hooks/useListeningTest"; // Используем правильный хук
import ListeningCard from "@/app/(main)/english/[course]/[module]/components/ListeningCard"; // Убедись, что путь верный
import ListeningCardSkeleton from "@/components/ui/sceletons/ListeningCardSceleton"; // Убедись, что путь верный
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { useEffect, useState } from "react";
import { useModalLogic } from "@/hooks/useModalLogic";
import SuccessModal from "@/components/modal/SuccessModal";
import ErrorModal from "@/components/modal/ErrorModal";
import { useParams, useRouter } from "next/navigation";
import { QuestionListening } from "@/types/Sections";
import {AttemptListeningTest} from "@/types/Attempts"; // Убедись, что тип верный

export default function ListeningPage() {
    const { course, module } = useParams();
    const router = useRouter();
    const [startIndex, setStartIndex] = useState(1);
    const modalLogic = useModalLogic();

    const {
        currentDisplayData,
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
        isLoading,
        isReviewMode,
    } = useListeningTest();

    useEffect(() => {
        if (isSuccess) {
            modalLogic.showSuccess();
        }
        if (isError) {
            modalLogic.showError();
        }
    }, [isSuccess, isError]);

    useEffect(() => {
        if (currentPage === 0) {
            setStartIndex(1);
        } else {
            // Исправлена логика startIndex для пагинации
            setStartIndex(currentPage * questionsPerPage + 1);
        }
    }, [currentPage, questionsPerPage]);

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
        <div className="w-full min-h-screen bg-[#EEF4FF] px-4 py-8 md:px-8 md:py-12 flex flex-col gap-6 md:gap-9 pb-20">

            {isLoading && !currentDisplayData?.length && (
                Array.from({ length: questionsPerPage > 0 ? questionsPerPage : 2 }, (_, index) => (
                    <ListeningCardSkeleton key={`skeleton-${index}`} />
                ))
            )}

            {!isLoading && currentDisplayData && currentDisplayData.map((currentData, index) => {
                const questionId = currentData.id;
                const commonProps = {
                    id: questionId,
                    number: startIndex + index,
                    question: (currentData as QuestionListening | AttemptListeningTest).audio_question || '', // Берем URL аудио
                    context: (currentData as QuestionListening | AttemptListeningTest).context, // Контекст, если есть
                };

                return isReviewMode ? (
                    <ListeningCard
                        {...commonProps}
                        key={questionId}
                        isReviewMode={true}
                        reviewOptions={(currentData as AttemptListeningTest).options}
                        options={[]}
                        userAnswers={[]}
                        setAnswer={() => {}}
                    />
                ) : (
                    <ListeningCard
                        {...commonProps}
                        key={questionId}
                        isReviewMode={false}
                        options={(currentData as QuestionListening).options}
                        userAnswers={userAnswers}
                        setAnswer={setAnswer}
                        reviewOptions={[]}
                    />
                );
            })}

            {!isLoading && currentDisplayData && currentDisplayData.length > 0 && (
                <div className="w-full flex justify-between">
                    {
                        canGoPrev ? (
                            <Button
                                className="gap-2 py-4 px-8 border border-[#7B68EE] rounded-[10px] font-medium text-[#7B68EE] bg-transparent"
                                onClick={goToPrevPage}
                                style={{color: "#7B68EE"}}
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
            )}

            {modalLogic.showSuccessModal && (
                <SuccessModal
                    onOk={() => {
                        // Реши, что делать после успеха (переход на speaking, перезагрузка для ревью?)
                        // modalLogic.onSuccessModalClose();
                        // window.location.reload(); // Для ревью
                        router.push(`/english/${course}/${module}/speaking`); // Как было
                    }}
                    onClose={modalLogic.onSuccessModalClose}
                    title="Тест аяқталды!"
                    message="Нәтижелеріңіз сәтті жіберілді."
                />
            )}
            {modalLogic.showErrorModal && (
                <ErrorModal
                    onClose={modalLogic.onErrorModalClose}
                    title="Қате пайда болды"
                    message="Тест нәтижелерін жіберу кезінде қате шықты. Қайталап көріңіз."
                />
            )}
        </div>
    );
}