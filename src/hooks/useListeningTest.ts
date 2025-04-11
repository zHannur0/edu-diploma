import {AnswerTest, QuestionListening} from "@/types/Sections";
import {useEffect, useMemo, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {
    useGetListeningQuery,
    useSubmitListeningMutation,
} from "@/store/api/generalEnglishApi";

interface UseListeningTestReturn {
    questions?: QuestionListening[];
    userAnswers: AnswerTest[];
    currentPage: number;
    questionsPerPage: number;
    currentQuestions?: QuestionListening[];
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
}

const useReadingTest = (): UseListeningTestReturn => {
    const {course, module} = useParams();
    const router = useRouter();
    const [userAnswers, setUserAnswers] = useState<AnswerTest[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const questionsPerPage = 3;

    const {data: questions} = useGetListeningQuery(Number(module));

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

        sessionStorage.setItem('userAnswersListening', JSON.stringify(
            userAnswers.map(ua =>
                ua.question_id === questionId
                    ? { ...ua, option_id: optionId }
                    : ua
            )
        ));
    };

    const totalPages =  Math.ceil((questions?.length || 0) / questionsPerPage);
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

    const [submitListening, {isSuccess}] = useSubmitListeningMutation();

    const handleSubmit = async () => {
        if (!isTestCompleted) {
            return;
        }

        try {
            setIsLoading(true);
            await submitListening({
                id: Number(module),
                data: {options: userAnswers}
            }).unwrap();

            sessionStorage.removeItem('userAnswersListening');

            setIsLoading(false);

            router.push(`/english/${course}/${module}/speaking`);

        } catch (error) {
            console.log('Error submitting test:', error);
            setIsError(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const savedAnswers = sessionStorage.getItem('userAnswersListening');
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
        handleSubmit,
        isSuccess
    };
}

export default useReadingTest;