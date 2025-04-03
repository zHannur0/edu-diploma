"use client"

import Image from "next/image";
import {Module} from "@/types/Course";
import {useParams, useRouter} from "next/navigation";
import {useRef} from "react";

const SideModules = ({modules}: {modules: Module[]}) => {
    const {course, module} = useParams();
    const router = useRouter();
    const scrollableDivRef = useRef<HTMLDivElement | null>(null); // Создаем ссылку на блок с контентом

    const scrollToTop = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = 0; // Прокручиваем блок на верх
        }
    };

    return(
       <div className="w-full flex flex-col gap-2 p-4 bg-white rounded-[30px] h-[330px]">
           <div className="flex justify-between">
                <h3>Модуль</h3>
               <Image src={"/icon/up.svg"} alt={"up"} height={24} width={24} onClick={scrollToTop} className="cursor-pointer"/>
           </div>
           <div className="flex flex-col w-full overflow-y-auto max-h-[260px] " ref={scrollableDivRef}>
               {
                   modules?.map((moduleItem, index) => (
                       <div key={moduleItem.id} className={`w-full p-4 flex justify-between text-sm ${moduleItem.is_completed ? "text-[#7D7D7D]" : "text-black"}`}
                            onClick={() => router.push(`/english/${course}/${moduleItem.id}/reading`)}

                       >
                           <p className={`${moduleItem.id === Number(module) ? "text-[#7B68EE]" : moduleItem.is_completed ? "text-[#7D7D7D]" : "text-black"} cursor-pointer` }>
                               {`Сабақ №${index + 1} - "${moduleItem.name}"`}
                           </p>
                           {
                               moduleItem.is_completed && (
                                   <div className={`flex gap-2`}>
                                       {moduleItem.total_score}
                                       <Image src={"/icon/check.svg"} alt={"up"} height={24} width={24}/>
                                   </div>
                               )
                           }

                       </div>
                   ))
               }
           </div>
       </div>
    );
}

export default SideModules;