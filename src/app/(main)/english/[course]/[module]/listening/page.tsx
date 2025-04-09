"use client"
import useListeningTest from "@/hooks/useListeningTest";
import ListeningCard from "@/app/(main)/english/[course]/[module]/components/ListeningCard";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import {useEffect, useState} from "react";
import ListeningCardSkeleton from "@/components/ui/sceletons/ListeningCardSceleton";

export default function ListeningPage() {
    const [startIndex, setStartIndex] = useState(1);

    const {
        currentQuestions,
        goToNextPage,
        goToPrevPage,
        canGoNext,
        canGoPrev,
        currentPage,
        questionsPerPage,
        setAnswer,
        handleSubmit,
        userAnswers
    } = useListeningTest();

    useEffect(() => {
        if (currentPage === 0) {
            setStartIndex(1)
        } else {
            setStartIndex(currentPage + questionsPerPage)
        }
    }, [currentPage]);

    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col gap-9">
            {
                !currentQuestions && Array.from({ length: questionsPerPage }, (_, index) =>(
                    <ListeningCardSkeleton key={index}/>
                ))
            }
            {
                currentQuestions && currentQuestions?.map((currentQuestion, index) => (
                    <ListeningCard key={currentQuestion.id}
                                   id={currentQuestion.id}
                                   number={startIndex + index}
                                   question={currentQuestion.audio_question}
                                   options={currentQuestion.options}
                                   context={currentQuestion.context}
                                   setAnswer={setAnswer}
                                   userAnswers={userAnswers}
                    />
                ))
            }
            <div className="w-full flex justify-between font-['Inter']">
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
                    onClick={canGoNext ? goToNextPage : handleSubmit}
                    width={155}
                >
                    <p>{canGoNext ? "Келесі" : "Аяқтау"}</p>
                    <Image src={"/icon/next.svg"} alt={"next"} width={24} height={24}/>
                </Button>
            </div>
        </div>
    );
}