"use client";

import { useParams } from "next/navigation";
import { useGetIeltsWritingQuery } from "@/store/api/ieltsApi";
import { useState } from "react";
import IeltsWritingCard from "@/app/(main)/english/[course]/ielts-test/components/IeltsWritingCard";
import Timer from "@/components/Timer";

export default function IeltsWritingPage() {
    const { ieltsTest } = useParams();
    const [currentRound, setCurrentRound] = useState<number>(0);

    const { data: writings } = useGetIeltsWritingQuery(Number(ieltsTest), {
        skip: !ieltsTest,
    });

    const handleRoundClick = (index: number) => {
        setCurrentRound(index);
    };

    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col py-12 items-center">
            <div className="flex justify-between items-center">
                <p className="text-3xl font-semibold mb-4 text-[#737B98]">Time left: <Timer timeProp={3600}/></p>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
                {writings?.map((writing, i) => (
                    <div
                        key={writing.id}
                        className={`cursor-pointer text-center py-2 px-4 border border-[#737B98] rounded-lg hover:bg-white ${i === currentRound ? "bg-white":"bg-transparent"}`}
                        onClick={() => handleRoundClick(i)}
                    >
                        Part {i + 1}
                    </div>
                ))}
            </div>
                {writings && writings[currentRound] ? (
                    <IeltsWritingCard writing={writings[currentRound]} />
                ) : (
                    <p>No writing data available</p>
                )}
        </div>
    );
}
