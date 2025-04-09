"use client"

import Image from "next/image";
import React from "react";
import {useGetModuleQuery} from "@/store/api/generalEnglishApi";
import {useParams} from "next/navigation";
import {sectionImages} from "@/config/sections";

export default function FinishPage() {
    const {module} = useParams();

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
                    <div className="flex items-center justify-center w-full max-w-[300px] bg-[#F5443A] rounded-xl">
                        90
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 p-4 bg-[#F7F6F9] rounded-3xl">
                    {
                        Object.keys(moduleData?.sections || {}).map((section, index) => (
                            <div key={index} className="h-[135px] w-full bg-white rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <Image src={sectionImages[index]} alt={section} width={36} height={35}/>

                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
