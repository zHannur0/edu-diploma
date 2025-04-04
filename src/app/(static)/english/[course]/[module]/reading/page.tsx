"use client"

import useReadingTest from "@/hooks/useReadingTest";
import {useEffect, useState} from "react";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import ReadingCard from "@/app/(static)/english/[course]/[module]/reading/components/ReadingCard";

export default function ReadingPage() {
    const [startIndex, setStartIndex] = useState(1);

    const {
        currentQuestions,
        goToNextPage,
        goToPrevPage,
        userAnswers,
        setAnswer,
        canGoNext,
        canGoPrev,
        currentPage,
        questionsPerPage,
        handleSubmit
    } = useReadingTest();

    useEffect(() => {
        if (currentPage === 0) {
            setStartIndex(1)
        } else {
            setStartIndex(currentPage * questionsPerPage + 1)
        }
    }, [currentPage]);

    console.log(userAnswers);
    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col gap-9">
            {
                currentQuestions?.map((currentQuestion, index) => (
                    <ReadingCard key={currentQuestion.id}
                                 id={currentQuestion.id}
                                 number={startIndex + index}
                                 context={currentQuestion.context}
                                 options={currentQuestion.options}
                                 source={currentQuestion.source}
                                 image={currentQuestion.image}
                                 setAnswer={setAnswer}
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