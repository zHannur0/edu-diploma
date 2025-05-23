import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {Suspense} from "react";

export default function BasicLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return <section className="min-h-screen relative flex flex-col items-center font-Montserrat">
        <Header />
        <Suspense>
            {children}
        </Suspense>
        <Footer />
    </section>
}