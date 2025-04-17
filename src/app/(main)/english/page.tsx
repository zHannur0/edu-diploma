"use client"
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Wrapper from "@/components/layout/Wrapper";
import CourseCard from "@/app/(main)/english/components/CourseCard";
import CourseCardBig from "@/app/(main)/english/components/CourseCardBig";
import { useGetCoursesQuery } from "@/store/api/courseApi";
import TrialTestModal from "@/app/(main)/english/components/TrialTestModal";

export default function EnglishPage() {
    const { isAuthenticated } = useAuth();
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