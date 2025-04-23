"use client"

import Wrapper from "@/components/layout/Wrapper";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import ProfileInfoForm from "@/app/(main)/profile/components/ProfileInfoForm";
import MyAchievments from "@/app/(main)/profile/components/MyAchievments";
import {useGetCourseProgressQuery} from "@/store/api/proileApi";
import CustomLink from "@/components/ui/link/CustomLink";
import Button from "@/components/ui/button/Button";
import {useGetFavoritesQuery} from "@/store/api/favoritesApi";
import UnivercityCard from "@/app/(main)/university/components/UnivercityCard";

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated !== null && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    const {data: userProgress} = useGetCourseProgressQuery();
    const {data: favorites} = useGetFavoritesQuery();
    return (
            <div className="w-full bg-[#EEF4FF] flex flex-col gap-5 py-8">
                <Wrapper>
                    <h1 className="font-bold text-[32px] mb-8">
                        Менің парақшам
                    </h1>
                    <div className="w-full gap-7 grid grid-cols-[60%_40%]">
                        <ProfileInfoForm/>
                        <MyAchievments/>

                        <div className="bg-white p-8 rounded-xl">
                            <h2 className="font-semibold text-[22px]e">
                                Таңдаулы
                            </h2>
                            <div className="w-full p-8 grid grid-cols-2 gap-6">
                                {
                                    favorites?.map((favorite) => (
                                        <UnivercityCard
                                            key={favorite.id}
                                            id={favorite.university.id}
                                            imageUrl={favorite.university.image}
                                            title={favorite.university.name}
                                            description={favorite.university.description}
                                            duration={favorite.university.duration}
                                            studyMode={favorite.university.pace}
                                            language={favorite.university.languages}
                                            type={favorite.university.location}
                                            isFavorite={true}
                                        />
                                    ))
                                }
                            </div>
                            <div className={"w-full px-8"}>
                                <Button
                                    disabled={!userProgress?.course_id}
                                    onClick={() => router.push(`/university/all`)}
                                    className={"bg-transparent"}
                                    style={{color: "#7B68EE"}}
                                >
                                    Университеттер тізіміне өту
                                </Button>
                            </div>

                        </div>
                        <div className="bg-white p-8 rounded-xl max-h-75">
                            <div className="mb-5">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[#7D7D7D] text-sm">Прогресс</p>
                                    <h3 className="text-[#242424] font-medium">{userProgress?.progress_percentage?.toFixed(1) || 0}%</h3>
                                </div>
                                <progress
                                    value={(userProgress?.progress_percentage || 0) / 100}
                                    className="w-full h-6 rounded-xl appearance-none"
                                />
                            </div>

                            {
                                userProgress?.last_module ? (
                                    <>
                                        <div className="mb-4">
                                            <p className="text-black mb-2">Сіздің тоқтаған бөліміңіз:</p>
                                            <CustomLink
                                                href={`/english/${userProgress?.course_id}/${userProgress?.last_module || "#"}`}
                                                label={userProgress?.last_module_name || "Аяқталмаған бөлім"}/>
                                        </div>

                                        <Button
                                            disabled={!userProgress?.course_id}
                                            onClick={() => router.push(`/english/${userProgress?.course_id}`)}
                                            className={"bg-transparent"}
                                            style={{color: "#7B68EE"}}
                                        >
                                            Оқуды жалғастыру
                                        </Button>
                                    </>
                                ) : (
                                    <p>
                                        Сізде әзірге ешқандай прогресс жоқ(
                                    </p>
                                )
                            }

                        </div>
                    </div>
                </Wrapper>

            </div>
    )
}