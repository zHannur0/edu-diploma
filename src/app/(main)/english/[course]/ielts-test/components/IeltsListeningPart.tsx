// src/app/(main)/listening/[course]/ielts-test/components/IeltsListeningPart.tsx

"use client";

import React from 'react';
import { IeltsListening, QuestionIelts, OptionIelts as Option } from "@/types/Ielts"; // Переименовали OptionIelts в Option для удобства

type ListeningAnswersState = { [questionId: number]: string | number | null };

interface IeltsListeningPartProps {
    partData: IeltsListening;
    answers: ListeningAnswersState;
    onAnswerChange: (questionId: number, answer: string | number | null) => void;
    isActive: boolean; // Подсвечивать ли текущую часть
}

export default function IeltsListeningPart({ partData, answers, onAnswerChange, isActive }: IeltsListeningPartProps) {

    // Эта функция почти идентична той, что была в QuestionDisplay для Reading
    // Можно вынести в отдельный хелпер или компонент QuestionRenderer
    const renderQuestionInput = (question: QuestionIelts) => {
        const currentAnswer = answers[question.id];

        switch (question.question_type) {
            case 'OPTIONS':
                if (Array.isArray(question.options) && question.options.length > 0 && typeof question.options[0] === 'object') {
                    const options = question.options as Option[];
                    return (
                        <div className="flex flex-col gap-2 mt-2">
                            {options.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio" // Или checkbox если возможен мультивыбор? Уточни
                                        name={`question_${question.id}`}
                                        value={option.id}
                                        checked={currentAnswer === option.id}
                                        onChange={(e) => onAnswerChange(question.id, Number(e.target.value))}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">{option.option}</span>
                                </label>
                            ))}
                        </div>
                    );
                } else if (Array.isArray(question.options)) {
                    const options = question.options as string[];
                    return (
                        <div className="flex flex-col gap-2 mt-2">
                            {options.map((optionText, index) => (
                                <label key={index} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        value={optionText}
                                        checked={currentAnswer === optionText}
                                        onChange={(e) => onAnswerChange(question.id, e.target.value)}
                                        className="form-radio h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">{optionText}</span>
                                </label>
                            ))}
                        </div>
                    );
                }
                return <p className="text-red-500 text-xs mt-1">Invalid options format for OPTIONS.</p>;

            case 'FILL_BLANK':
                return (
                    <input
                        type="text"
                        value={typeof currentAnswer === 'string' ? currentAnswer : ""}
                        onChange={(e) => onAnswerChange(question.id, e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Type your answer"
                    />
                );

            case 'SELECT_INSERT_ANSWER':
                if (Array.isArray(question.options) && question.options.length > 0) {
                    const isObjectOptions = typeof question.options[0] === 'object';
                    const optionsList = question.options as (Option[] | string[]);
                    return (
                        <select
                            value={currentAnswer ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                const answerValue = isObjectOptions ? (value ? Number(value) : null) : (value || null);
                                onAnswerChange(question.id, answerValue);
                            }}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                        >
                            <option value="">-- Select --</option>
                            {optionsList.map((option, index) => {
                                const value = isObjectOptions ? (option as Option).id : (option as string);
                                const text = isObjectOptions ? (option as Option).option : (option as string);
                                return <option key={isObjectOptions ? (option as Option).id : index} value={value}>{text}</option>;
                            })}
                        </select>
                    );
                }
                return <p className="text-red-500 text-xs mt-1">Invalid options format for SELECT.</p>;

            default:
                // Добавим обработку неизвестного типа, чтобы TypeScript был доволен
                const exhaustiveCheck: never = question.question_type;
                return <p className="text-red-500 text-xs mt-1">Unsupported question type: {exhaustiveCheck}</p>;
        }
    };

    return (
        // Обертка для части с подсветкой активной части
        <div className={`border border-gray-200 rounded-lg p-4 md:p-6 transition-shadow duration-500 ${isActive ? 'shadow-lg border-blue-300' : 'shadow-sm'}`}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                {partData.part_label || `Part ${partData.part}`} {partData.title && `- ${partData.title}`}
            </h3>
            <div className="flex flex-col gap-5">
                {partData.questions.map((question, index) => (
                    <div key={question.id}>
                        {/* Контент вопроса */}
                        <div className="flex gap-2 items-baseline">
                            <span className="text-sm font-medium text-gray-800">{index + 1}.</span> {/* Нумерация вопросов внутри части */}
                            <div
                                className="text-sm text-gray-700 flex-1"
                                dangerouslySetInnerHTML={{ __html: question.question_content }}
                            />
                        </div>
                        {/* Поле для ответа */}
                        <div className="pl-5 mt-1"> {/* Небольшой отступ для поля ответа */}
                            {renderQuestionInput(question)}
                        </div>
                    </div>
                ))}
                {partData.questions.length === 0 && (
                    <p className="text-sm text-gray-500">No questions in this part.</p>
                )}
            </div>
        </div>
    );
}