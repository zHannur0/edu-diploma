"use client"

import Image from "next/image";
import React from "react";
import {useGetModuleQuery} from "@/store/api/generalEnglishApi";
import {useParams, useRouter} from "next/navigation";
import {getSectionName, sectionImages} from "@/config/sections";

export default function FinishPage() {
    const router = useRouter();
    const {module, course} = useParams();

    const {data: moduleData} = useGetModuleQuery(Number(module), {skip: !module});

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="w-full max-w-[720px] flex flex-col items-center gap-8 p-4 bg-white rounded-3xl">
                <div
                    className="w-30 h-30 mx-auto mb-4 bg-[#7B68EE] rounded-full flex items-center justify-center">
                    <Image src={"/icon/cup.svg"} alt="trophy" width={40} height={40}/>
                </div>
                <div className="flex flex-col items-center p-2 gap-3 bg-[#F7F6F9] rounded-3xl w-full max-w-[340px]">
                    <h3>
                        Сіздің ұпайыңыз
                    </h3>
                    <div className="flex items-center justify-center w-full max-w-[300px] bg-[#F5443A] rounded-xl p-4 text-white">
                        {moduleData?.total_score.score}
                    </div>
                </div>
                <div className="w-full grid grid-cols-4 gap-2 p-4 bg-[#F7F6F9] rounded-3xl">
                    {
                        Object.entries(moduleData?.sections || {}).sort((a, b) => {
                            const order = ["reading", "listening", "writing", "speaking"];
                            return order.indexOf(a[0]) - order.indexOf(b[0]);
                        }).map(([key, section], index) => (
                            <div key={index} className="h-[135px] w-full bg-white rounded-2xl p-4 flex flex-col gap-5">
                                <div className="flex items-start justify-between">
                                    <Image src={sectionImages[index]} alt={key} width={36} height={35}/>
                                    <div className="w-8 h-8 flex justify-center items-center bg-[#F7F6F9] rounded-[10px] cursor-pointer"
                                         onClick={() => router.push(`/english/${course}/${module}/${key.toLowerCase()}`)}
                                    >
                                        <Image src="/icon/nextBlack.svg" alt={key} width={12} height={12} className="w-4 h-4"/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-medium text-sm">
                                        {getSectionName(key)}
                                    </p>
                                    <p className="text-sm text-[#7D7C81]">
                                        {section.score}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
