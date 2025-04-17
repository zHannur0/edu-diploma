"use client"
import Wrapper from "@/components/layout/Wrapper";
import {useAuth} from "@/hooks/useAuth";

export default function IeltsLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const { isAuthenticated } = useAuth();

    return (
        <div className="w-full bg-[#EEF4FF] flex justify-center h-screen">
            <Wrapper isLoading={isAuthenticated === null}>
                {children}
            </Wrapper>
        </div>
    )
}