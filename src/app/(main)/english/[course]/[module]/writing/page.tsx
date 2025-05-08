"use client"

import WritingCard from "@/app/(main)/english/[course]/[module]/components/WritingCard";
import { useGetWritingQuery, useGetWritingAttemptQuery } from "@/store/api/generalEnglishApi";
import { useParams } from "next/navigation";
import { WritingAttempt } from "@/types/Attempts";

export default function WritingPage() {
    const { module } = useParams();
    const moduleId = Number(module);

    const { data: writingData, isLoading: isLoadingTask } = useGetWritingQuery(moduleId, {
        skip: !moduleId,
    });

    const { data: attemptData, isLoading: isLoadingAttempt, isSuccess: isAttemptLoaded, refetch: refetchAttempt } = useGetWritingAttemptQuery({ id: moduleId }, {
        skip: !moduleId,
    });
    const isReviewMode = isAttemptLoaded && !!attemptData && !!attemptData.writing && !!attemptData.writing.user_text;
    const isLoading = (isLoadingTask && !writingData) || (isLoadingAttempt && !attemptData && !writingData); // Уточненная логика загрузки

    const handleSuccessfulSubmit = () => {
        refetchAttempt();
    };

    return (
        <div className="w-full bg-[#EEF4FF] px-4 py-8 md:px-8 md:py-12 flex flex-col min-h-screen">
            {!isLoading && writingData && (
                <WritingCard
                    writing={writingData}
                    isReviewMode={isReviewMode}
                    attemptData={attemptData as WritingAttempt}
                    onSuccessfulSubmit={handleSuccessfulSubmit}
                />
            )}
            {!isLoading && !writingData && (
                <div className="text-center text-gray-500">Не удалось загрузить задание.</div>
            )}
        </div>
    );
}