import {AnswerTest, QuestionReading} from "@/types/Sections";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "next/navigation";
import {useGetReadingAttemptQuery, useGetReadingQuery, useSubmitReadingMutation} from "@/store/api/generalEnglishApi";
import {ReadingAttempt, AttemptReadingTest} from "@/types/Attempts";

interface UseReadingTestReturn {
    questions?: QuestionReading[];
    userAnswers: AnswerTest[];
    currentPage: number;
    questionsPerPage: number;
    currentQuestions?: QuestionReading[];
    isLoading: boolean;
    isError: boolean;
    progress: number;
    isSuccess: boolean;

    setAnswer: (questionId: number, optionId: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    goToPage: (page: number) => void;
    canGoNext: boolean;
    canGoPrev: boolean;
    isTestCompleted: boolean;
    handleSubmit: () => Promise<void>;

    currentDisplayData?: QuestionReading[] | AttemptReadingTest[];
    attemptData?: ReadingAttempt;
    isReviewMode: boolean;
}

const useReadingTest = (): UseReadingTestReturn => {
    const {module} = useParams();
    const [userAnswers, setUserAnswers] = useState<AnswerTest[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const questionsPerPage = 2;

    const {data: questions} = useGetReadingQuery(Number(module));
    const { data: attempt , isSuccess: isAttemptLoaded } = useGetReadingAttemptQuery(
        { id: Number(module), section_name: "READING" },
        { skip: !Number(module) }
    );

    const isReviewMode = isAttemptLoaded && !!attempt && attempt.score > 0;


    const currentQuestions = useMemo(() => {
        const startIndex = currentPage * questionsPerPage;
        return questions?.slice(startIndex, startIndex + questionsPerPage);
    }, [questions, currentPage, questionsPerPage]);

    const currentDisplayData = useMemo(() => {
        const sourceData = isReviewMode ? attempt?.test : questions;
        if (!sourceData) return undefined;
        const startIndex = currentPage * questionsPerPage;
        return sourceData.slice(startIndex, startIndex + questionsPerPage);
    }, [questions, attempt, isReviewMode, currentPage, questionsPerPage]);

    const isTestCompleted = !isReviewMode && userAnswers.every(ua => ua.option_id !== null);

    useEffect(() => {
        if (questions) {
            setUserAnswers(questions.map((q) => ({
                question_id: q.id,
                option_id: null
            })));
        }
    }, [questions]);

    const setAnswer = (questionId: number, optionId: number) => {
        if (isReviewMode) return;
        setUserAnswers(prev =>
            prev.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, option_id: optionId }
                    : ua
            )
        );

        sessionStorage.setItem('userAnswersReading', JSON.stringify(
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

    const [submitReading, {isSuccess}] = useSubmitReadingMutation();

    const handleSubmit = async () => {

        if (isReviewMode || !isTestCompleted) {
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
        if (isReviewMode || !questions) return;
        const savedAnswers = sessionStorage.getItem('userAnswersReading');
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
                console.log('Error restoring progress:', error);
            }
        }
    }, [questions]);

    return {
        attemptData: attempt,
        questions,
        userAnswers,
        currentDisplayData,
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
        handleSubmit,
        isSuccess,
        isReviewMode,
    };
}

export default useReadingTest;