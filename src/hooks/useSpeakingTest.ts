import {AnswerSpeaking, SpeakingQuestion} from "@/types/Sections";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "next/navigation";
import {useGetSpeakingQuery, useSubmitSpeakingMutation} from "@/store/api/generalEnglishApi";

interface UseSpeakingTestReturn {
    questions?: SpeakingQuestion[];
    userAnswers: AnswerSpeaking[];
    currentPage: number;
    questionsPerPage: number;
    currentQuestions?: SpeakingQuestion[];
    isLoading: boolean;
    isError: boolean;
    progress: number;

    setAnswer: (speaking_id: number, text: string) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    goToPage: (page: number) => void;
    canGoNext: boolean;
    canGoPrev: boolean;
    isTestCompleted: boolean;
    handleSubmit: () => Promise<void>;
}

const useSpeakingTest = (): UseSpeakingTestReturn => {
    const {module} = useParams();
    const [userAnswers, setUserAnswers] = useState<AnswerSpeaking[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const questionsPerPage = 3;

    const {data: questions} = useGetSpeakingQuery(Number(module));

    const currentQuestions = useMemo(() => {
        const startIndex = currentPage * questionsPerPage;
        return questions?.slice(startIndex, startIndex + questionsPerPage);
    }, [questions, currentPage, questionsPerPage]);


    useEffect(() => {
        if (questions) {
            setUserAnswers(questions.map((q) => ({
                speaking_id: q.id,
                text: ""
            })));
        }
    }, [questions]);

    console.log(userAnswers)

    const setAnswer = (speaking_id: number, text: string) => {
        setUserAnswers(prev =>
            prev.map(ua =>
                ua.speaking_id === speaking_id
                    ? { ...ua, text: text }
                    : ua
            )
        );
        sessionStorage.setItem('userAnswersSpeaking', JSON.stringify(
            userAnswers.map(ua =>
                ua.speaking_id === speaking_id
                    ? { ...ua, text: text }
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

    const answeredQuestions = userAnswers.filter(ua => ua.text).length;

    const progress = questions && questions?.length > 0
        ? Math.round((answeredQuestions / questions?.length) * 100)
        : 0;

    const isTestCompleted = userAnswers.every(ua => ua.text !== undefined);

    const [submitSpeaking] = useSubmitSpeakingMutation();

    const handleSubmit = async () => {
        if (!isTestCompleted) {
            return;
        }

        try {
            setIsLoading(true);
            await submitSpeaking({
                id: Number(module),
                data: {answers: userAnswers}
            }).unwrap();

            sessionStorage.removeItem('userAnswersSpeaking');

            setIsLoading(false);

        } catch (error) {
            console.log('Error submitting test:', error);
            setIsError(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const savedAnswers = sessionStorage.getItem('userAnswersSpeaking');
        if (savedAnswers && questions && questions.length > 0) {
            try {
                const parsedAnswers = JSON.parse(savedAnswers);
                const validAnswers = parsedAnswers.filter(
                    (answer: AnswerSpeaking) => questions.some(q => q.id === answer.speaking_id)
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
        handleSubmit
    };
}

export default useSpeakingTest;