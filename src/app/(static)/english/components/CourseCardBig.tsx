import Button from "@/components/ui/button/Button";
import React from "react";
import { useGetCourseQuery } from "@/store/api/courseApi";
import { motion } from "framer-motion";
import {redirect} from "next/navigation";

interface CourseCardBigProps {
    course_id: number;
    width?: number;
}

const CourseCardBig: React.FC<CourseCardBigProps> = ({ course_id, width }) => {
    const { data: course, isLoading, error } = useGetCourseQuery(course_id);

    if (isLoading || error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 w-full flex flex-col mr-6 shadow shadow-sm rounded-xl animate-pulse bg-white"
                style={{
                    maxWidth: width ? width : 515,
                }}
            >
                <div className="w-full h-45 mb-5 rounded-xl bg-gray-300"></div>

                {[...Array(5)].map((_, index) => (
                    <div key={index} className="mb-4">
                        <div className="h-4 w-1/3 bg-gray-300 mb-2"></div>
                        <div className="h-6 w-2/3 bg-gray-300"></div>
                    </div>
                ))}

                <div className="h-10 w-full bg-gray-300 rounded-full"></div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 flex flex-col mr-6 shadow shadow-sm rounded-xl bg-white"
            style={{
                minWidth: width ? width : 515,
            }}
        >
            <div
                className="w-full h-45 mb-5 rounded-xl p-4 flex items-center text-2xl font-bold text-white"
                style={{
                    background: "linear-gradient(102deg, #A697FF 0%, #7B68EE 100%)",
                }}
            >
                {course?.name || "Курс атауы"}
            </div>

            {[
                { label: "Курс атауы", value: course?.name },
                {
                    label: "Деңгей анықтау",
                    value: course?.has_level_define ? "Бар" : "Жоқ"
                },
                {
                    label: "Өту уақыты",
                    value: `${course?.duration} сағат`
                },
                {
                    label: "Прогресс",
                    value: `${course?.user_progress}%`
                }
            ].map(({ label, value }) => (
                <div key={label} className="mb-5">
                    <p className="text-[#7D7D7D] text-sm mb-2">{label}</p>
                    <h3 className="text-[#242424] font-medium">{value}</h3>
                </div>
            ))}

            <div className="mb-4">
                <p className="text-black mb-2">Сіздің тоқтаған бөліміңіз:</p>
                <h3 className="text-[#0375DF]">
                    {course?.last_module_name || "Аяқталмаған бөлім"}
                </h3>
            </div>

            <Button
                label={course?.trial_passed ? "Оқуды жалғастыру" : "Өз деңгейіңізді анықтаңыз"}
                disabled={!course}
                onClick={() => redirect(`/english/${course_id}`)}
            />
        </motion.div>
    );
};

export default CourseCardBig;