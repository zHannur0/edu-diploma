import React from "react";
import {Module} from "@/types/Course";
import ModuleCard from "@/app/(main)/english/[course]/components/Module";

interface CourseModulesProps {
    lastModule: string;
    lastModuleId: number;
    modules: Module[];
}

const CourseModules: React.FC<CourseModulesProps> = ({modules, lastModuleId}) => {
    return (
        <div className="w-full p-8 bg-white rounded-xl">
            {
                modules?.map((module,index) => (
                    <ModuleCard id={module.id}
                                key={module.id}
                                name={module.name}
                                sections={module.sections}
                                total_score={module.total_score}
                                is_completed={module.is_completed}
                                is_disabled={lastModuleId < module.id}
                                index={index+1}
                    />
                ))
            }
        </div>
    )
}

export default CourseModules;