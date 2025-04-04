import {AnswerTest, QuestionReading} from "@/types/Sections";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "next/navigation";
import {useGetReadingQuery, useSubmitReadingMutation} from "@/store/api/generalEnglishApi";

interface UseReadingTestReturn {
    questions?: QuestionReading[];
    userAnswers: AnswerTest[];
    currentPage: number;
    questionsPerPage: number;
    currentQuestions?: QuestionReading[];
    isLoading: boolean;
    isError: boolean;
    progress: number;

    setAnswer: (questionId: number, optionId: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    goToPage: (page: number) => void;
    canGoNext: boolean;
    canGoPrev: boolean;
    isTestCompleted: boolean;
    handleSubmit: () => Promise<void>;
}

const useReadingTest = (): UseReadingTestReturn => {
    const [userAnswers, setUserAnswers] = useState<AnswerTest[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const questionsPerPage = 2;

    const {module} = useParams();

    const {data: questions} = useGetReadingQuery(Number(module));

    const currentQuestions = useMemo(() => {
        const startIndex = currentPage * questionsPerPage;
        return questions?.slice(startIndex, startIndex + questionsPerPage);
    }, [questions, currentPage, questionsPerPage]);


    useEffect(() => {
        if (questions) {
            setUserAnswers(questions.map((q) => ({
                question_id: q.id,
                option_id: null
            })));
        }
    }, [questions]);

    const setAnswer = (questionId: number, optionId: number) => {
        setUserAnswers(prev =>
            prev.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, option_id: optionId }
                    : ua
            )
        );

        localStorage.setItem('userAnswers', JSON.stringify(
            userAnswers.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, option_id: optionId }
                    : ua
            )
        ));
    };

    const totalPages = Math.ceil((questions?.length || 0) / questionsPerPage);
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

    const answeredQuestions = userAnswers.filter(ua => ua.option_id).length;

    const progress = questions && questions?.length > 0
        ? Math.round((answeredQuestions / questions?.length) * 100)
        : 0;

    const isTestCompleted = userAnswers.every(ua => ua.option_id !== undefined);

    const [submitReading] = useSubmitReadingMutation();

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

            localStorage.removeItem('userAnswers');

            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting test:', error);
            setIsError(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const savedAnswers = localStorage.getItem('userAnswers');
        if (savedAnswers && questions && questions.length > 0) {
            try {
                const parsedAnswers = JSON.parse(savedAnswers);
                const validAnswers = parsedAnswers.filter(
                    (answer: AnswerTest) => questions.some(q => q.id === answer.question_id)
                );

                if (validAnswers.length > 0) {
                    setUserAnswers(validAnswers);
                }
            } catch (error) {
                console.error('Error restoring progress:', error);
            }
        }
    }, [questions]);

    return {
        questions,
        userAnswers,
        currentPage,
        questionsPerPage,
        currentQuestions,
        isLoading,
        isError,
        progress,
        setAnswer,
        goToNextPage,
        goToPrevPage,
        goToPage,
        canGoNext,
        canGoPrev,
        isTestCompleted,
        handleSubmit
    };
}

export default useReadingTest;