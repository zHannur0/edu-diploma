// src/app/(main)/listening/[course]/ielts-test/components/QuestionDisplay.tsx

"use client";

import React from 'react';
import { QuestionIelts, OptionIelts } from "@/types/Ielts";

type ReadingAnswersState = { [questionId: number]: string | number | null };

interface QuestionDisplayProps {
    questions: QuestionIelts[];
    answers: ReadingAnswersState;
    onAnswerChange: (questionId: number, answer: string | number | null) => void;
}

export default function QuestionDisplay({ questions, answers, onAnswerChange }: QuestionDisplayProps) {

    const renderQuestionInput = (question: QuestionIelts) => {
        const currentAnswer = answers[question.id];

        switch (question.question_type) {
            case 'OPTIONS':
                if (Array.isArray(question.options) && question.options.length > 0 && typeof question.options[0] === 'object') {
                    const options = question.options as OptionIelts[];
                    return (
                        <div className="flex flex-col gap-2 mt-2">
                            {options.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        value={option.id}
                                        checked={currentAnswer === option.id}
                                        onChange={(e) => onAnswerChange(question.id, Number(e.target.value))}
                                        className="form-radio h-4 w-4 text-[#7B68EE]"
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
                                <label key={index} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        // Используем сам текст как значение? Или индекс? Пока текст.
                                        value={optionText}
                                        checked={currentAnswer === optionText}
                                        onChange={(e) => onAnswerChange(question.id, e.target.value)}
                                        className="form-radio h-4 w-4 text-[#7B68EE]"
                                    />
                                    <span className="text-sm text-gray-700">{optionText}</span>
                                </label>
                            ))}
                        </div>
                    );
                }
                return <p className="text-red-500 text-xs mt-1">Invalid options format for OPTIONS type.</p>;

            case 'FILL':
                return (
                    <input
                        type="text"
                        value={typeof currentAnswer === 'string' ? currentAnswer : ""}
                        onChange={(e) => onAnswerChange(question.id, e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7B68EE] focus:border-[#7B68EE] sm:text-sm"
                        placeholder="Type your answer here"
                    />
                );

            case 'SELECT_INSERT':
                if (question.options) {
                    // const isObjectOptions = typeof question.options === 'object';
                    const optionsList = question.options as OptionIelts;
                    console.log(question.options)
                    return (
                        <select
                            value={currentAnswer ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                const answerValue = value ? Number(value) : null;
                                onAnswerChange(question.id, answerValue);
                            }}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7B68EE] focus:border-[#7B68EE] sm:text-sm bg-white"
                        >
                            <option value="">-- Select Answer --</option>
                            {optionsList.options?.map((option, index) => {
                                const value = (option as string);
                                const text = (option as string);
                                return <option key={index} value={value}>{text}</option>;
                            })}
                        </select>
                    );
                }
                return <p className="text-red-500 text-xs mt-1">Invalid options format for SELECT type.</p>;

            default:
                return <p className="text-red-500 text-xs mt-1">Unsupported question type: {question.question_type}</p>;
        }
    };

    return (
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md h-full max-h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800 text-center sticky top-0 bg-white py-2 -mt-5 md:-mt-6">Questions</h2>
            {questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-4">
                    <p className="text-sm font-medium text-gray-800 mb-1">Question {index + 1}</p>
                    <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: question.question_content }}
                    />
                    {renderQuestionInput(question)}
                </div>
            ))}
            {questions.length === 0 && (
                <p className="text-center text-gray-500">No questions available for this passage.</p>
            )}
        </div>
    );
}