// src/app/(main)/listening/[course]/ielts-test/[ieltsTest]/speaking/components/SpeakingPart3Content.tsx

"use client";

import React from 'react';
import {IeltsSpeakingQuestion} from "@/types/Ielts";

interface SpeakingPart3ContentProps {
    questions: IeltsSpeakingQuestion[];
    currentIndex: number;
    topic: string;
    activeQuestionId?: number;
}

export default function SpeakingPart3Content({ questions, currentIndex, topic, activeQuestionId }: SpeakingPart3ContentProps) {

    const currentQuestion = questions[currentIndex];

    return (
        <div className="flex flex-col justify-between h-full gap-4 text-sm text-[#555C77]">
            <div>
                <p className="font-medium text-base text-[#333] mb-2">Instructions:</p>
                <p className='mb-4'>{"Now we'll discuss more general questions related to the topic:"} <span className='font-medium'>{topic}</span></p>

                {currentQuestion ? (
                    <div className={`p-6 bg-gray-50 rounded-lg min-h-[100px] flex items-center justify-center text-center shadow-inner ${currentQuestion.id === activeQuestionId ? 'ring-2 ring-[#7B68EE]' : ''}`}>
                        <p className="text-lg font-semibold text-gray-700">
                            {currentQuestion.question}
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">No more questions in this part.</p>
                )}
            </div>
        </div>
    );
}