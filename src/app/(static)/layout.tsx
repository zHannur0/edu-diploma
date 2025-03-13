import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BasicLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return <section className="min-h-[100vh] relative flex flex-col items-center font-Montserrat">
        <Header />
        {children}
        <Footer/>
    </section>
}