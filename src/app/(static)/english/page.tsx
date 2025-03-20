"use client"
import {useAuth} from "@/hooks/useAuth";
import Wrapper from "@/components/layout/Wrapper";
import CourseCard from "@/app/(static)/english/components/CourseCard";
import {useState} from "react";
import CourseCardBig from "@/app/(static)/english/components/CourseCardBig";

const courses = [
    {
        id: 1,
        title: "General English",
        modules: 12,
        level: "Начальный",
        progress: 44,
        image: "/images/general-english.jpg",
    },
    {
        id: 2,
        title: "Gra",
        modules: 4,
        level: "Начальный",
        progress: 44,
        image: "/images/gra.jpg",
    },
    {
        id: 3,
        title: "IELTS",
        modules: 4,
        level: "Начальный",
        progress: 44,
        image: "/images/ielts.jpg",
    },
    {
        id: 4,
        title: "TOEFL",
        modules: 4,
        level: "Начальный",
        progress: 44,
        image: "/images/toefl.jpg",
    },
];


export default function EnglishPage() {
    const {isAuthenticated} = useAuth();
    const [curr, setCurr] = useState<{
        id: number;
        title: string;
        modules: number;
        progress: number;
        image: string;
        level: string;
    }>();

    return (
        <Wrapper isLoading={
            isAuthenticated === null
        }>
            <div className="flex w-full items-start py-12 min-h-screen">
                {
                    curr && (
                        <CourseCardBig/>
                    )
                }
                <div className="w-full flex gap-6 flex-wrap">
                    {
                        courses.filter((course) => course.id !== curr?.id).map((course) => (
                            <CourseCard key={course.id} id={course.id} title={course.title} modules={course.modules}
                                        level={course.level} progress={course.progress} image={course.image}
                                        handleClick={() => setCurr(course)}
                            />
                        ))
                    }
                </div>
            </div>

        </Wrapper>
    );
}