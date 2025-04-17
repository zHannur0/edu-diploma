"use client"

import {useGetIeltsTestsQuery} from "@/store/api/ieltsApi";
import {useParams} from "next/navigation";

export default function IeltsReadingPage() {
    const {ieltsTest} = useParams();
    const {data: ielts} = useGetIeltsTestsQuery(Number(ieltsTest));
    console.log(ielts)
    return (
        <div className="w-full h-full py-12">
            <div className="">
                <h2 className="font-medium mb-2">
                    Part 1
                </h2>
                <p className="text-sm">
                    Read the following text and answer the questions 1-13
                </p>
            </div>
            {/*{*/}
            {/*    ielts?.readings?.map((reading) => (*/}
            {/*        <div key={reading.id} className="w-full flex bg-white rounded-2xl p-4 h-full">*/}
            {/*            <div className="w-full max-w-[500px] overflow-y-auto">*/}
            {/*                <h3 className="text-2xl font-medium mb-3 text-center">*/}
            {/*                    {reading.title || ""}*/}
            {/*                </h3>*/}
            {/*                <p className="text-justify">*/}
            {/*                    {reading.content || ""}*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*            <div className="w-full p-6">*/}
            {/*                {*/}
            {/*                    reading.questions?.map((question, index) => (*/}
            {/*                        <div key={question.id}>*/}
            {/*                            {question.question_content}*/}
            {/*                        </div>*/}
            {/*                    ))*/}
            {/*                }*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))*/}
            {/*}*/}

        </div>
    );
}