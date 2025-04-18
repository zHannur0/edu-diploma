"use client"

// import {useState} from "react";
import Timer from "@/components/Timer";
// import IeltsSpeakingCard from "@/app/(main)/english/[course]/ielts-test/components/IeltsSpeakingCard";

export default function IeltsSpeakingPage() {
     // const [part, setPart] = useState(1);


    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col py-12 items-center">
            <div className="flex justify-between items-center">
                <p className="text-3xl font-semibold mb-4 text-[#737B98]">Time left: <Timer timeProp={960}/></p>
            </div>
            {/*<div*/}
            {/*    className={`w-full mb-10 cursor-pointer text-center py-2 px-4 border border-[#737B98] rounded-lg hover:bg-white bg-white`}*/}
            {/*>*/}
            {/*    Part {part}*/}
            {/*</div>*/}

            {/*<IeltsSpeakingCard/>*/}
        </div>
    );
}