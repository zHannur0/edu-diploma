"use client"
import Wrapper from "@/components/layout/Wrapper";
import SideBarFilter from "@/app/(main)/university/components/SideBarFilter";
import {Suspense} from "react";
import {useFilters} from "@/hooks/useFilter";
import {useGetUniversitiesQuery} from "@/store/api/universityApi";
import UniversityCard from "@/app/(main)/university/components/UnivercityCard";

export default function AllUniversityPage() {
    const {filters} = useFilters();

    const {data: universities} = useGetUniversitiesQuery(filters);
    return (
        <Suspense>
        <Wrapper>
            <div className="flex flex-col w-full h-full py-12">
                <div className="w-full flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold">
                        Университеттер тізімі
                    </h2>
                    {/*<div className="flex items-center gap-2">*/}
                    {/*    <Image src={"/icon/refresh.svg"} alt={"time"} width={18} height={18} className="min-w-5"/>*/}
                    {/*    <Image src={"/icon/actions.svg"} alt={"time"} width={16} height={16}/>*/}
                    {/*    <div*/}
                    {/*        className="flex items-center justify-center gap px-4 py-2 rounded-xl bg-[#2E79EA] text-white">*/}
                    {/*        <Image src={"/icon/plus.svg"} alt={"time"} width={16} height={16}/>*/}
                    {/*        Filter*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className="flex gap-10 w-full items-start">
                    <SideBarFilter/>
                    <div>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                            {universities && universities.map((university) => (
                                <UniversityCard
                                    id={university.id}
                                    key={university.id}
                                    imageUrl={university.image}
                                    title={university.name}
                                    description={university.description}
                                    duration={university.duration}
                                    studyMode={university.pace}
                                    language={university.languages}
                                    type={university.location}
                                    isFavorite={university.is_favorite}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
        </Suspense>
    )
}