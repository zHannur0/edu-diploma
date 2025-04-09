import ModalCard from "@/components/modal/ModalCard";
import React, { useState } from "react";
import { useFinishTrialTestMutation, useGetTrialTestQuery } from "@/store/api/generalEnglishApi";
import { Answer } from "@/types/Answer";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/ui/textArea/TextArea";
import Image from "next/image";

interface TrialTestModalProps {
    course_id: number;
    onClose: () => void;
}

const TrialTestModal: React.FC<TrialTestModalProps> = ({ course_id, onClose }) => {
    const { data: trialQuestions } = useGetTrialTestQuery(course_id);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [sendAnswer, { isLoading }] = useFinishTrialTestMutation();
    const [result, setResult] = useState<null | string>(null);

    const handleSelectOption = (question_id: number, option_id: number) => {
        setAnswers((prev) => [
            ...prev.filter((a) => a.question_id !== question_id),
            { question_id, option_id },
        ]);
    };

    const handleTextAnswer = (question_id: number, text_answer: string) => {
        setAnswers((prev) => [
            ...prev.filter((a) => a.question_id !== question_id),
            { question_id, text_answer },
        ]);
    };

    const handleSubmit = async () => {
        try {
            const response = await sendAnswer({
                id: course_id,
                data: {
                    answers: answers,
                },
            }).unwrap();

            if (response) {
                setResult(response.score);
            }
        } catch (err) {
            console.log("Ошибка отправки ответов:", err);
        }
    };

    return (
        <ModalCard onClose={onClose}>
            <div className="w-full text-[#3B3E4B]">
                {
                    !result && (
                        <>
                            <h2 className="text-[20px] font-medium mb-3">Деңгей анықтайтын тест</h2>
                            <p className="text-xs mb-9">Бұл Тесттер сіздің жауаптарыңызды анықтау арқылы, деңгейіңізді
                                нақтылайтын болады</p>
                            <div className="w-full flex flex-col gap-9">
                                {trialQuestions?.map((question, index) => (
                                    <div key={question.id}>
                                        <h3 className="font-medium mb-2">
                                            {index + 1}. {question.question}
                                        </h3>
                                        {question.question_type === "SINGLE_CHOICE" && (
                                            <div className="flex flex-col gap-2">
                                                {question.options.map((answer) => (
                                                    <label key={answer.id} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`question-${answer.id}`}
                                                            value={answer.id}
                                                            onChange={() => handleSelectOption(question.id, answer.id)}
                                                        />
                                                        {answer.option}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {question.question_type === "TEXT_ANSWER" && (
                                            <TextArea
                                                placeholder="Жауапты еңгізіңіз"
                                                className="border p-2 rounded-md w-full"
                                                onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}


                                {!result && (
                                    <div className="w-full flex justify-center">
                                        <Button onClick={handleSubmit} disabled={isLoading} width={134} height={44}>
                                            {isLoading ? "Жіберілуде" : "Тексеру"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                        </>
                    )
                }

                {result && (
                    <div className="w-full text-center flex flex-col items-center">
                        <div
                            className="w-30 h-30 mx-auto mb-4 bg-[#7B68EE] rounded-full flex items-center justify-center">
                            <Image src={"/icon/cup.svg"} alt="trophy" width={40} height={40}/>
                        </div>
                        <p className="text-xl font-medium mb-4">Тест қорытындысы бойынша</p>
                        <p className="text-sm mb-4">
                            {result}/{trialQuestions?.length}, сенің деңгейің: <span className="font-bold">{result}</span>
                        </p>
                        <Button width={300} height={44} onClick={onClose}>
                            OK
                        </Button>
                    </div>
                )}
            </div>
        </ModalCard>
    );
};

export default TrialTestModal;
