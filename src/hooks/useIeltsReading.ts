import {useEffect, useMemo, useState} from "react";
import {useParams} from "next/navigation";
import {useSubmitReadingMutation} from "@/store/api/generalEnglishApi";
import {QuestionIelts} from "@/types/Ielts";
import {useGetIeltsReadingQuery} from "@/store/api/ieltsApi";

interface AnswerTest {
    question_id: number;
    option_id?: number | null;
    text_answer?: string;
    selected_options?: string[];
}

interface UseReadingTestReturn {
    questions?: QuestionIelts[];
    userAnswers: AnswerTest[];
    currentPage: number;
    questionsPerPage: number;
    currentQuestions?: QuestionIelts[];
    isLoading: boolean;
    isError: boolean;
    progress: number;
    isSuccess: boolean;

    setAnswer: (questionId: number, optionId: number) => void;
    setTextAnswer: (questionId: number, text: string) => void;
    setSelectedOptions: (questionId: number, options: string[]) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    goToPage: (page: number) => void;
    canGoNext: boolean;
    canGoPrev: boolean;
    isTestCompleted: boolean;
    handleSubmit: () => Promise<void>;
}

const useIeltsReadingTest = (): UseReadingTestReturn => {
    const {module} = useParams();
    const [userAnswers, setUserAnswers] = useState<AnswerTest[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const questionsPerPage = 2;

    const {data: reading} = useGetIeltsReadingQuery(Number(module));

    const currentQuestions = useMemo(() => {
        const startIndex = currentPage * questionsPerPage;
        return reading?.questions?.slice(startIndex, startIndex + questionsPerPage);
    }, [reading, currentPage, questionsPerPage]);

    useEffect(() => {
        if (reading && reading?.questions) {
            setUserAnswers(reading?.questions.map((q) => {
                switch (q.question_type) {
                    case 'OPTIONS':
                        return {
                            question_id: q.id,
                            option_id: null
                        };
                    case 'FILL_BLANK':
                        return {
                            question_id: q.id,
                            text_answer: ''
                        };
                    case 'SELECT_INSERT_ANSWER':
                        return {
                            question_id: q.id,
                            selected_options: []
                        };
                    default:
                        return {
                            question_id: q.id,
                            option_id: null
                        };
                }
            }));
        }
    }, [reading]);

    const setAnswer = (questionId: number, optionId: number) => {
        setUserAnswers(prev =>
            prev.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, option_id: optionId }
                    : ua
            )
        );
        saveAnswersToSession();
    };

    // Обработчик для вопросов типа FILL_BLANK
    const setTextAnswer = (questionId: number, text: string) => {
        setUserAnswers(prev =>
            prev.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, text_answer: text }
                    : ua
            )
        );
        saveAnswersToSession();
    };

    // Обработчик для вопросов типа SELECT_INSERT_ANSWER
    const setSelectedOptions = (questionId: number, options: string[]) => {
        setUserAnswers(prev =>
            prev.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, selected_options: options }
                    : ua
            )
        );
        saveAnswersToSession();
    };

    // Вспомогательная функция для сохранения ответов в sessionStorage
    const saveAnswersToSession = () => {
        sessionStorage.setItem('userAnswersReading', JSON.stringify(userAnswers));
    };

    const totalPages = Math.ceil((reading?.questions?.length || 0) / questionsPerPage);
    const canGoNext = currentPage < totalPages - 1;
    const canGoPrev = currentPage > 0;

    const goToNextPage = () => {
        if (canGoNext) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const goToPrevPage = () => {
        if (canGoPrev) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        }
    };

    // Проверяем завершенность теста
    const isAnswerComplete = (answer: AnswerTest, question?: QuestionIelts): boolean => {
        if (!question) return false;

        switch (question.question_type) {
            case 'OPTIONS':
                return answer.option_id !== null && answer.option_id !== undefined;
            case 'FILL_BLANK':
                return !!answer.text_answer && answer.text_answer.trim() !== '';
            case 'SELECT_INSERT_ANSWER':
                return !!answer.selected_options && answer.selected_options.length > 0;
            default:
                return false;
        }
    };

    // Подсчет количества отвеченных вопросов
    const answeredQuestions = reading?.questions ? userAnswers.filter((ua, index) =>
        isAnswerComplete(ua, reading?.questions[index])
    ).length : 0;

    const progress = reading?.questions && reading?.questions?.length > 0
        ? Math.round((answeredQuestions / reading?.questions?.length) * 100)
        : 0;

    const isTestCompleted = reading?.questions ? userAnswers.every((ua, index) =>
        isAnswerComplete(ua, reading?.questions[index])
    ) : false;

    const [submitReading, {isSuccess}] = useSubmitReadingMutation();

    const handleSubmit = async () => {
        if (!isTestCompleted) {
            return;
        }

        try {
            setIsLoading(true);
            await submitReading({
                id: Number(module),
                data: {options: userAnswers}
            }).unwrap();

            sessionStorage.removeItem('userAnswersReading');

            setIsLoading(false);
        } catch (error) {
            console.log('Error submitting test:', error);
            setIsError(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const savedAnswers = sessionStorage.getItem('userAnswersReading');
        if (savedAnswers && reading?.questions && reading?.questions.length > 0) {
            try {
                const parsedAnswers = JSON.parse(savedAnswers);
                const validAnswers = parsedAnswers.filter(
                    (answer: AnswerTest) => reading?.questions.some(q => q.id === answer.question_id)
                );

                if (validAnswers.length > 0) {
                    setUserAnswers(validAnswers);
                }
            } catch (error) {
                console.log('Error restoring progress:', error);
            }
        }
    }, [reading]);

    return {
        questions: reading?.questions,
        userAnswers,
        currentPage,
        questionsPerPage,
        currentQuestions,
        isLoading,
        isError,
        progress,
        setAnswer,
        setTextAnswer,
        setSelectedOptions,
        goToNextPage,
        goToPrevPage,
        goToPage,
        canGoNext,
        canGoPrev,
        isTestCompleted,
        handleSubmit,
        isSuccess
    };
}

export default useIeltsReadingTest;