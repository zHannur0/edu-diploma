"use client"
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Wrapper from "@/components/layout/Wrapper";
import CourseCard from "@/app/(main)/english/components/CourseCard";
import CourseCardBig from "@/app/(main)/english/components/CourseCardBig";
import { useGetCoursesQuery } from "@/store/api/courseApi";
import TrialTestModal from "@/app/(main)/english/components/TrialTestModal";
import {useRouter} from "next/navigation";

export default function EnglishPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false);

    const { data: coursesData } = useGetCoursesQuery();

    const handleCourseClick = (courseId: number) => {
        const selectedCourse = coursesData?.find(course => course.id === courseId);

        if (selectedCourse?.has_level_define && !selectedCourse?.trial_passed) {
            setIsTrialModalOpen(true);
        }

        setSelectedCourseId(courseId);
    };

    const handleCloseModal = () => {
        setSelectedCourseId(null);
        setIsTrialModalOpen(false);
    };

    return (
        <Wrapper isLoading={isAuthenticated === null}>
            <div className="relative flex w-full py-12 min-h-screen">
                {
                    !isAuthenticated && (
                        <div className="fixed w-full flex items-center flex-col left-0 p-6">
                            {/* max-w-sm mx-auto ортаға келтіреді */}
                            <svg className="mx-auto h-12 w-12 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                            </svg>
                            <p className="text-base font-semibold text-gray-700">
                                Өтінемін тіркеліңіз
                            </p>
                            <p className="text-sm text-gray-500 mt-1 mb-3">
                                Сайттың толық мүмкіндіктерін пайдалану үшін тіркелу қажет.
                            </p>
                            <button className="bg-[#7B68EE] text-white px-11 py-3 rounded-xl"
                                    onClick={() => router.push("/login")}>
                                Тіркелу
                            </button>
                        </div>

                    )
                }
                {selectedCourseId && (
                    <div>
                        {isTrialModalOpen ? (
                            <TrialTestModal
                                course_id={selectedCourseId}
                                onClose={handleCloseModal}
                            />
                        ) : (
                            <CourseCardBig course_id={selectedCourseId}/>
                        )}
                    </div>
                )}
                <div className="w-full flex gap-6 flex-wrap">
                    {coursesData?.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.name}
                            modules={course.modules_count}
                            image="/img/DefaultCourse.png"
                            trial_passed={!!course.trial_passed || !course.has_level_define}
                            progress={course.user_progress}
                            handleClick={() => handleCourseClick(course.id)}
                            isSelected={course.id === selectedCourseId}
                        />
                    ))}
                </div>
            </div>
        </Wrapper>
    );
}