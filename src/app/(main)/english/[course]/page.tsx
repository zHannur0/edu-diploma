"use client"

import {useAuth} from "@/hooks/useAuth";
import Wrapper from "@/components/layout/Wrapper";
import {useGetModulesQuery} from "@/store/api/generalEnglishApi";
import CourseCardBig from "@/app/(main)/english/components/CourseCardBig";
import {useParams} from "next/navigation";
import CourseHeader from "@/app/(main)/english/[course]/components/CourseHeader";
import CourseModules from "@/app/(main)/english/[course]/components/CourseModules";
import {Module} from "@/types/Course";
import {useGetCourseQuery} from "@/store/api/courseApi";
import IeltsModules from "@/app/(main)/english/[course]/components/IeltsModules";

export default function CoursePage() {
    const {course} = useParams();
    const { isAuthenticated } = useAuth();
    const { data: modulesData, isLoading } = useGetModulesQuery(Number(course));
    const { data: courseData} = useGetCourseQuery(Number(course));
    return (
        <div className="w-full bg-[#EEF4FF]">
            <Wrapper isLoading={isAuthenticated === null || isLoading}>
                <div className="flex justify-between py-12 items-start">
                    <CourseCardBig course_id={Number(course)} width={380}/>
                    <div className="w-full flex flex-col gap-6">
                        <CourseHeader course_name={courseData?.name || ""} description={courseData?.description || ""}/>
                        <h2 className="text-2xl font-semibold">Курс тақырыптары</h2>
                        {
                            Number(course) === 1 && <CourseModules modules={modulesData?.modules as Module[]} lastModule={modulesData?.last_module_name || ""} lastModuleId={modulesData?.last_module || 0}/>
                        }
                        {
                            Number(course) === 2 && <IeltsModules/>
                        }
                    </div>
                </div>
            </Wrapper>
        </div>

    );
}