import React from "react";
import {useGetIeltsModulesQuery} from "@/store/api/ieltsApi";
import Image from "next/image";
import IeltsSubModuleCard from "@/app/(main)/english/[course]/components/IeltsSubModule";

const IeltsModules = () => {
    const {data: ieltsModules} = useGetIeltsModulesQuery();
    return (
        <div>
            <div className="w-full p-8 bg-white rounded-xl">
                {
                    ieltsModules?.map((module) => (
                            <div className="flex gap-6" key={module.id}>
                                <Image src={module?.cover || ""} alt={module?.title || ""} width={60}
                                       height={60}/>
                                <div>
                                    <h3 className="font-medium mb-3">
                                        {module?.title || ""}
                                    </h3>
                                    {
                                        module.sub_modules?.map((submodule, index) => (
                                            <IeltsSubModuleCard key={submodule.id} index={index + 1}
                                                                title={submodule.title} tests={submodule.tests}/>
                                        ))
                                    }
                                </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default IeltsModules;