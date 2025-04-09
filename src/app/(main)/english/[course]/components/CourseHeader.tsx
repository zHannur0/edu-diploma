import React from "react";

interface CourseHeaderProps {
    course_name: string;
    description: string;
}

const CourseHeader:React.FC<CourseHeaderProps> = ({course_name, description}) => {
    return (
        <div className="p-6 bg-white rounded-xl w-full">
            <h2 className="text-3xl font-bold mb-5">
                {course_name}
            </h2>
            <p className="text-xs text-[#7D7D7D] mb-2">
                Курс жайлы
            </p>
            <p>
                {description}
            </p>
        </div>
    )
}

export default CourseHeader;