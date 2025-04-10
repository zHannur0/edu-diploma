"use client"

import Wrapper from "@/components/layout/Wrapper";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import ProfileInfoForm from "@/app/(main)/profile/components/ProfileInfoForm";
import MyAchievments from "@/app/(main)/profile/components/MyAchievments";

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated !== null && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    return (
            <div className="w-full bg-[#EEF4FF] flex flex-col gap-5">
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
                            <div className="w-full p-8">

                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl">
                            <h2 className="font-semibold text-[22px]e">
                                Прогресс
                            </h2>
                            <div className="w-full p-8">

                            </div>
                        </div>
                    </div>
                </Wrapper>

            </div>
    )
}