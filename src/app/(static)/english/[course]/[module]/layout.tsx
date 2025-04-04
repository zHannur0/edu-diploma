"use client"
import Wrapper from "@/components/layout/Wrapper";
import SideSections from "@/app/(static)/english/[course]/components/SideSections";
import SideModules from "@/app/(static)/english/[course]/components/SideModules";
import {Module} from "@/types/Course";
import {useParams} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import {useGetModulesQuery} from "@/store/api/generalEnglishApi";

export default function SectionLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const {course} = useParams();
    const { isAuthenticated } = useAuth();
    const { data: modulesData, isLoading } = useGetModulesQuery(Number(course));

    return <div className="w-full bg-[#EEF4FF] flex justify-center">
        <Wrapper isLoading={isAuthenticated === null || isLoading}>
            <div className="w-full grid grid-cols-[70%_30%] gap-5 py-12 items-start">
                <>
                    {children}
                </>
                <div className="w-full flex flex-col gap-2">
                    <SideSections/>
                    <SideModules modules={modulesData?.modules as Module[]}/>
                </div>
            </div>
        </Wrapper>
    </div>
}