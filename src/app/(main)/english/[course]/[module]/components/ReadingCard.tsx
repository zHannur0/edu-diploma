import { AnswerTest, OptionTest } from "@/types/Sections";
import Image from "next/image";
import React from "react";
import { AttemptOption } from "@/types/Attempts"; // Убедись, что этот тип импортирован правильно

interface ReadingCardProps {
    id: number;
    number: number;
    context: string;
    image: string | null;
    source: string;
    question: string;

    options: OptionTest[];
    userAnswers: AnswerTest[];
    setAnswer: (question_id: number, optionId: number) => void;

    isReviewMode?: boolean;
    reviewOptions?: AttemptOption[];
}

const ReadingCard = ({
                         id,
                         number,
                         question,
                         context,
                         options,
                         source,
                         image,
                         setAnswer,
                         userAnswers,
                         isReviewMode = false,
                         reviewOptions = [],
                     }: ReadingCardProps) => {

    const cardIsDisabled = isReviewMode;

    return (
        <div className="w-full p-4 md:p-6 flex flex-col bg-white items-start rounded-2xl shadow-md mb-6"> {/* Добавил отступы и тень */}
            <div className="flex gap-4 mb-6 md:mb-8 items-start w-full">
                <div className="font-bold text-lg rounded-full bg-[#EFF4FF] text-[#7B68EE] flex items-center justify-center h-10 w-10 md:h-11 md:w-11 flex-shrink-0">
                    {number < 10 ? `0${number}` : number}
                </div>
                <div className="flex flex-col gap-1 pt-1">
                    <p className="font-semibold text-base md:text-lg text-gray-800">
                        Reading Task #{number}
                    </p>
                    <p className="text-sm text-[#737B98]">
                        {question}
                    </p>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 mb-8 w-full items-start">
                {image && (
                    <div className="w-full xl:w-auto xl:max-w-xs flex-shrink-0">
                        <Image
                            src={image}
                            alt={source || 'Reading context image'}
                            width={300}
                            height={170}
                            className="w-full h-auto object-cover rounded-lg shadow-sm"
                            priority={number <= 2}
                        />
                    </div>
                )}
                <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: context || "" }} />
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {
                    (isReviewMode ? reviewOptions : options).map((optionData, index) => {

                        const optionId = (optionData as OptionTest).id ?? (optionData as AttemptOption).id ?? index;
                        const optionText = optionData.option;

                        let optionContainerClasses = "bg-[#F7F6F9] border border-transparent";
                        let indicatorElement: React.ReactNode = <div className="w-4 h-4 rounded-sm bg-[#dbeafe]" />;
                        let optionTextClasses = "text-gray-800"; // Стили текста по умолчанию

                        if (isReviewMode) {
                            const reviewOpt = optionData as AttemptOption; // Приводим тип
                            const chosen = reviewOpt.is_chosen;
                            const correct = reviewOpt.is_correct;

                            if (chosen && correct) {
                                optionContainerClasses = "bg-green-50 border-2 border-green-500 ring-1 ring-green-500";
                                indicatorElement = <div className="w-4 h-4 rounded-full bg-green-500" title="Correct and chosen" />; // Зеленый кружок
                                optionTextClasses = "text-green-800 font-semibold";
                            } else if (chosen && !correct) {
                                optionContainerClasses = "bg-red-50 border-2 border-red-400 ring-1 ring-red-400";
                                indicatorElement = <div className="w-4 h-4 rounded-full bg-red-500" title="Incorrect and chosen" />; // Красный кружок
                                optionTextClasses = "text-red-800 font-semibold";
                            } else if (!chosen && correct) {
                                optionContainerClasses = "bg-white border-2 border-green-500";
                                indicatorElement = <div className="w-4 h-4 rounded-full border-2 border-green-500" title="Correct answer" />; // Зеленое кольцо
                                optionTextClasses = "text-gray-700";
                            } else {
                                optionContainerClasses = "bg-gray-100 border border-gray-200 opacity-60";
                                indicatorElement = <div className="w-4 h-4 rounded-sm bg-gray-300" title="Incorrect answer" />; // Серый квадрат
                                optionTextClasses = "text-gray-500";
                            }
                        }
                        else {
                            const testOpt = optionData as OptionTest; // Приводим тип
                            const isSelected = userAnswers?.find(answer => answer.question_id === id)?.option_id === testOpt.id;

                            if (isSelected) {
                                optionContainerClasses = "bg-indigo-100 border-2 border-indigo-500 ring-1 ring-indigo-500";
                                indicatorElement = <div className="w-4 h-4 rounded-full bg-indigo-500" title="Your selection" />; // Синий кружок
                                optionTextClasses = "text-indigo-800 font-semibold";
                            } else {
                                optionContainerClasses = "bg-[#F0F4FF] border border-transparent hover:border-indigo-300"; // Легкий ховер
                                indicatorElement = <div className="w-4 h-4 rounded-sm bg-indigo-200" />; // Светло-синий квадрат
                                optionTextClasses = "text-gray-800";
                            }
                        }

                        return (
                            <div
                                key={optionId}
                                className={`flex justify-between items-center w-full p-3 rounded-2xl transition-all duration-150 ${optionContainerClasses} ${cardIsDisabled ? 'cursor-default' : 'cursor-pointer'}`}
                                onClick={!cardIsDisabled ? () => setAnswer(id, optionId) : undefined}
                            >
                                <p className={`text-sm flex-grow mr-3 ${optionTextClasses}`}>
                                    {optionText}
                                </p>
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-white bg-opacity-50">
                                    {indicatorElement}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ReadingCard;