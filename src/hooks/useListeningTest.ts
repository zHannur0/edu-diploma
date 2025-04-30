import { AnswerTest, QuestionListening } from "@/types/Sections";
import {AttemptListeningTest, ListeningAttempt} from "@/types/Attempts";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
    useGetListeningAttemptQuery,
    useGetListeningQuery,
    useSubmitListeningMutation,
} from "@/store/api/generalEnglishApi";

interface UseListeningTestReturn {
    userAnswers: AnswerTest[];
    currentPage: number;
    questionsPerPage: number;
    currentDisplayData?: (QuestionListening | AttemptListeningTest)[];
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
    isReviewMode: boolean;
    attemptData?: ListeningAttempt | null;
}

const useListeningTest = (): UseListeningTestReturn => {
    const { module } = useParams();
    const [userAnswers, setUserAnswers] = useState<AnswerTest[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [submissionError, setSubmissionError] = useState(false);
    const [internalIsLoading, setInternalIsLoading] = useState(false);

    const questionsPerPage = 3;

    const { data: questions, isLoading: isLoadingQuestions } = useGetListeningQuery(Number(module), {
        skip: !Number(module)
    });

    const { data: attempt, isLoading: isLoadingAttempt, isSuccess: isAttemptLoaded } = useGetListeningAttemptQuery(
        { id: Number(module)},
        { skip: !Number(module) }
    );

    const isReviewMode = isAttemptLoaded && !!attempt;

    useEffect(() => {
        if (isReviewMode || !questions) return;

        const savedAnswers = sessionStorage.getItem('userAnswersListening');
        let initialAnswers: AnswerTest[];

        if (savedAnswers) {
            try {
                const parsedAnswers = JSON.parse(savedAnswers) as AnswerTest[];
                const questionIds = new Set(questions.map(q => q.id));
                const validAnswers = parsedAnswers.filter(
                    answer => questionIds.has(answer.question_id) && answer.option_id !== null && answer.option_id !== undefined
                );

                const validAnswerMap = new Map(validAnswers.map(a => [a.question_id, a.option_id]));
                initialAnswers = questions.map(q => ({
                    question_id: q.id,
                    option_id: validAnswerMap.get(q.id) ?? null
                }));

            } catch (error) {
                console.log('Error restoring listening progress:', error);
                initialAnswers = questions.map((q) => ({ question_id: q.id, option_id: null }));
                sessionStorage.removeItem('userAnswersListening');
            }
        } else {
            initialAnswers = questions.map((q) => ({ question_id: q.id, option_id: null }));
        }
        setUserAnswers(initialAnswers);

    }, [questions, isReviewMode]);

    const setAnswer = (questionId: number, optionId: number) => {
        if (isReviewMode) return;

        const nextAnswers = userAnswers.map(ua =>
            ua.question_id === questionId
                ? { ...ua, option_id: optionId }
                : ua
        );
        setUserAnswers(nextAnswers);
        sessionStorage.setItem('userAnswersListening', JSON.stringify(nextAnswers));
    };

    const currentDisplayData = useMemo(() => {
        const sourceData = isReviewMode ? attempt?.test : questions;
        if (!sourceData) return undefined;
        const startIndex = currentPage * questionsPerPage;
        return sourceData.slice(startIndex, startIndex + questionsPerPage);
    }, [questions, attempt, isReviewMode, currentPage, questionsPerPage]);


    const totalPages = useMemo(() => {
        const totalQuestionsCount = isReviewMode ? attempt?.test?.length : questions?.length;
        return Math.ceil((totalQuestionsCount || 0) / questionsPerPage);
    }, [questions, attempt, isReviewMode, questionsPerPage]);


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

    const answeredQuestionsCount = useMemo(() => {
        return userAnswers.filter(ua => ua.option_id !== null).length;
    }, [userAnswers]);

    const totalQuestionsCount = useMemo(() => {
        return questions?.length ?? 0;
    }, [questions]);


    const progress = !isReviewMode && totalQuestionsCount > 0
        ? Math.round((answeredQuestionsCount / totalQuestionsCount) * 100)
        : (isReviewMode ? 100 : 0);

    const isTestCompleted = !isReviewMode && totalQuestionsCount > 0 && answeredQuestionsCount === totalQuestionsCount;

    const [submitListening, { isSuccess: isSubmitSuccess }] = useSubmitListeningMutation();

    const handleSubmit = async () => {
        if (isReviewMode || !isTestCompleted) return;

        setInternalIsLoading(true);
        setSubmissionError(false);
        try {
            await submitListening({
                id: Number(module),
                data: { options: userAnswers.filter(ua => ua.option_id !== null) } // Отправляем только отвеченные
            }).unwrap();

            sessionStorage.removeItem('userAnswersListening');

        } catch (error) {
            console.error('Error submitting listening test:', error);
            setSubmissionError(true);
        } finally {
            setInternalIsLoading(false);
        }
    };

    const isLoading = isLoadingQuestions || isLoadingAttempt || internalIsLoading;
    const isError = submissionError;


    return {
        userAnswers,
        currentPage,
        questionsPerPage,
        currentDisplayData,
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
        isSuccess: isSubmitSuccess,
        isReviewMode,
        attemptData: attempt,
    };
}

export default useListeningTest;