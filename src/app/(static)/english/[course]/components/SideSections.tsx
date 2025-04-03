"use client"
import Image from "next/image";
import {useParams, usePathname, useRouter} from "next/navigation";
import React from "react";

const tasks = [
    {
        icon: '/icon/sections/reading.svg',
        title: 'Reading',
        subtitle: 'True or False/ Don’t given/ Feeling ....',
        color: 'bg-blue-500',
        done: true,
    },
    {
        icon: '/icon/sections/writing.svg',
        title: 'Writing',
        subtitle: 'Choose topic',
        color: 'bg-orange-400',
        done: false,
    },
    {
        icon: '/icon/sections/listening.svg',
        title: 'Listening',
        subtitle: 'Voice',
        color: 'bg-red-500',
        done: false,
    },
    {
        icon: '/icon/sections/speaking.svg',
        title: 'Speaking',
        subtitle: 'Voice',
        color: 'bg-green-500',
        done: false,
    },
    {
        icon: '/icon/sections/finish.svg',
        title: 'Finish',
        subtitle: '',
        color: 'bg-purple-400',
        done: false,
    },
];

const SideSections = () => {
    const pathname = usePathname();
    const {course} = useParams();
    const router = useRouter();

    return(
        <div className="w-full p-4 bg-[#F7F6F9] rounded-[30px] rounded-3xl">
            <h3 className="font-bold mb-4">
                Sections
            </h3>
            <div className="flex flex-col w-full p-2 rounded-[30px] bg-white gap-2">
                {tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between cursor-pointer"  onClick={() => router.push(`/english/${course}/${task.title.toLowerCase()}`)}>
                        <div className="flex items-center gap-4">
                            <Image src={task.icon} alt={task.title} width={48} height={48}/>
                            <div>
                                <p className="font-bold text-black">{task.title}</p>
                                {task.subtitle && (
                                    <p className="text-[#737B98] text-sm">{task.subtitle}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            {pathname.includes(task.title.toLowerCase()) ? (
                                    <Image src={"/icon/checkoutIcon.svg"} alt={"up"} height={16} width={16} className="w-4 h-4"/>
                            ) : (
                                <div className="w-4 h-4 rounded-sm bg-[#EFF4FF]"/>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SideSections;