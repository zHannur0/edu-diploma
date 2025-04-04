"use client"
import WritingCard from "@/app/(static)/english/[course]/[module]/writing/components/WritingCard";
import {useGetWritingQuery} from "@/store/api/generalEnglishApi";
import {useParams} from "next/navigation";
import {Writing} from "@/types/Sections";

export default function WritingPage() {
    const {module} = useParams();

    const {data: writing} = useGetWritingQuery(Number(module), { skip: !module});


    return (
        <div className="w-full bg-[#EEF4FF] flex flex-col">
            <WritingCard writing={writing as Writing} />
        </div>
    );
}