
"use client";

import React from 'react';
// import Button from "@/components/ui/button/Button";
import {IeltsSpeakingQuestion} from "@/types/Ielts";

interface SpeakingPart1ContentProps {
    questions: IeltsSpeakingQuestion[];
    currentIndex: number;
    // onNextQuestion: () => void;
    activeQuestionId?: number;

}

export default function SpeakingPart1Content({ questions, currentIndex, activeQuestionId }: SpeakingPart1ContentProps) {

    const currentQuestion = questions[currentIndex];

    return (
        <div className="flex flex-col justify-between h-full gap-4 text-sm text-[#555C77]">
            <div>
                <p className="font-medium text-base text-[#333] mb-2">Instructions:</p>
                <p className='mb-6'>Answer the questions about familiar topics.</p>

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

            {/*{currentQuestion && (*/}
            {/*    <div className="flex justify-end mt-6">*/}
            {/*        <Button*/}
            {/*            disabled={isLastQuestion}*/}
            {/*            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"*/}
            {/*        >*/}
            {/*            {isLastQuestion ? "End of Part 1" : "Next Question"}*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}