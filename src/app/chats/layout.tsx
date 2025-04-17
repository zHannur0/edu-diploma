import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BasicLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return <section>
        <Header />
        {children}
    </section>
}