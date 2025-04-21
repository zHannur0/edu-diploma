// src/app/(main)/listening/[course]/ielts-test/[ieltsTest]/speaking/components/SpeakingPart3Content.tsx

"use client";

import React from 'react';
import {IeltsSpeakingQuestion} from "@/types/Ielts";
// import Button from "@/components/ui/button/Button";

interface SpeakingPart3ContentProps {
    questions: IeltsSpeakingQuestion[];
    currentIndex: number;
    // onNextQuestion: () => void;
    topic: string;
    activeQuestionId?: number;
}

export default function SpeakingPart3Content({ questions, currentIndex, topic, activeQuestionId }: SpeakingPart3ContentProps) {

    const currentQuestion = questions[currentIndex];
    // const isLastQuestion = currentIndex >= questions.length - 1;

    return (
        <div className="flex flex-col justify-between h-full gap-4 text-sm text-[#555C77]">
            <div>
                <p className="font-medium text-base text-[#333] mb-2">Instructions:</p>
                <p className='mb-4'>{"Now we'll discuss more general questions related to the topic:"} <span className='font-medium'>{topic}</span></p>

                {currentQuestion ? (
                    <div className={`p-6 bg-gray-50 rounded-lg min-h-[100px] flex items-center justify-center text-center shadow-inner ${currentQuestion.id === activeQuestionId ? 'ring-2 ring-blue-300' : ''}`}>
                        <p className="text-lg font-semibold text-gray-700">
                            {currentQuestion.question}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">No more questions in this part.</p>
                )}
            </div>

            {/*{currentQuestion && (*/}
            {/*    <div className="flex justify-end mt-6">*/}
            {/*        <Button*/}
            {/*            onClick={onNextQuestion}*/}
            {/*            disabled={isLastQuestion}*/}
            {/*            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"*/}
            {/*        >*/}
            {/*            {isLastQuestion ? "End of Part 3" : "Next Question"}*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}