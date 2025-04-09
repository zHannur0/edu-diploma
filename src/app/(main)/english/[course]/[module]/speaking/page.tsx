"use client"
import SpeakingCard from "@/app/(main)/english/[course]/[module]/components/SpeakingCard";
import {useEffect, useState} from "react";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import useSpeakingTest from "@/hooks/useSpeakingTest";

export default function SpeakingPage() {
    const [startIndex, setStartIndex] = useState(1);

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
    } = useSpeakingTest();

    useEffect(() => {
        if (currentPage === 0) {
            setStartIndex(1)
        } else {
            setStartIndex(currentPage * questionsPerPage + 1)
        }
    }, [currentPage]);

    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col gap-9">
            {
                currentQuestions?.map((speaking, index) => (
                    <SpeakingCard key={speaking.id} id={speaking.id} number={startIndex + index} context={speaking.context} setAnswer={setAnswer}
                                  userAnswers={userAnswers}/>
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