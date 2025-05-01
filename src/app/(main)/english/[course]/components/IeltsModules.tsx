import React from "react";
import { useGetIeltsModulesQuery } from "@/store/api/ieltsApi";
import IeltsSubModuleCard from "@/app/(main)/english/[course]/components/IeltsSubModule";
import { IeltsModule } from "@/types/Ielts";
import {ArrowRight} from "lucide-react";

const IeltsModules = () => {
    const { data: ieltsModules, isLoading, isError } = useGetIeltsModulesQuery();

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Загрузка модулей...</div>; // Состояние загрузки
    }

    if (isError || !ieltsModules) {
        return <div className="p-8 text-center text-red-500">Не удалось загрузить модули.</div>; // Состояние ошибки
    }

    return (
        <div className="space-y-8">
            {ieltsModules.map((module: IeltsModule) => (
                <div key={module.id}
                     className="w-full p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex-grow">
                        <h3 className="font-semibold text-xl text-gray-800 mb-4">
                            {module.title || "IELTS Module"}
                        </h3>
                        <div className="space-y-2">
                            {module.sub_modules?.map((submodule, index) => (
                                <IeltsSubModuleCard
                                    key={submodule.id}
                                    id={submodule.id}
                                    index={index + 1}
                                    title={submodule.title}
                                    tests={submodule.tests}
                                />
                            ))}
                            {!module.sub_modules?.length && (
                                <p className="text-sm text-gray-500">Подмодули отсутствуют.</p>
                            )}
                        </div>
                    </div>

                </div>
            ))}
            <div className="w-full flex justify-center relative">
                <a
                    href="https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                    Осы батырманы басу арқылы шын Ielts емтиханына дайындалыңыз <ArrowRight className={"text-red-600"}/>
                </a>
            </div>

        </div>
    );
};

export default IeltsModules;