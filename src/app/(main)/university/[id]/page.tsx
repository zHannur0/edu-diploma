import Wrapper from "@/components/layout/Wrapper";

export default function ProgramDetailPage() {
    const reviews = [
        { id: 1, stars: 5, name: "A K.", date: "October 17, 2023", text: "Great program, challenging but rewarding. Loved the flexibility..." },
        { id: 2, stars: 4, name: "John D.", date: "September 05, 2023", text: "Good content overall, although some modules were quite demanding..." },
        { id: 3, stars: 5, name: "Sarah L.", date: "August 21, 2023", text: "Excellent support from tutors and a very relevant curriculum for healthcare management." },
    ];

    return (
        <Wrapper>
            <div className="mb-2 text-sm text-gray-500">
                IU International University of Applied Sciences
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">
                MBA Health Care Management
            </h1>

            {/* Hero секция с фоном и карточкой */}
            <div className="relative w-full h-[400px] bg-cover bg-center bg-no-repeat bg-[url('/img/university_building_placeholder.jpg')] rounded-2xl mb-12 md:mb-20">
                {/* Карточка с информацией поверх фона */}
                <div className="absolute bottom-[-40px] md:bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1000px] bg-white p-6 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Левая часть карточки - Key Summary */}
                        <div className="md:col-span-2">
                            <h3 className="font-semibold mb-2 text-lg">Key Summary</h3>
                            <p className="text-sm text-gray-700 mb-4">
                                Healthcare is a dynamic industry driven by medical and technological advancements, significant [...] demographic shifts, and evolving healthcare regulations. The curriculum includes advanced business administration knowledge, specific insights into economics, finance, and marketing within the healthcare sector. Graduates will be equipped to handle diverse responsibilities such as product management, hospital administration, quality assurance, health-IT systems, or other healthcare-related organizations... [More text placeholder]
                            </p>
                            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300">
                                Apply Now
                            </button>
                        </div>

                        {/* Правая часть карточки - Ключевые данные */}
                        <div className="md:col-span-1 space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                {/* <IconComponent name="duration" className="w-5 h-5 text-gray-600"/> */}
                                <span>Icon</span> {/* Замените на иконку */}
                                <div>
                                    <div className="font-medium">Duration</div>
                                    <div>1.5 - 3 Years</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <IconComponent name="credits" className="w-5 h-5 text-gray-600"/> */}
                                <span>Icon</span> {/* Замените на иконку */}
                                <div>
                                    <div className="font-medium">Credits</div>
                                    <div>90 ECTS</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <IconComponent name="tuition" className="w-5 h-5 text-gray-600"/> */}
                                <span>Icon</span> {/* Замените на иконку */}
                                <div>
                                    <div className="font-medium">Tuition Fee</div>
                                    <div>€ 10,017 / per year*</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <IconComponent name="language" className="w-5 h-5 text-gray-600"/> */}
                                <span>Icon</span> {/* Замените на иконку */}
                                <div>
                                    <div className="font-medium">Language</div>
                                    <div>English</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <IconComponent name="intake" className="w-5 h-5 text-gray-600"/> */}
                                <span>Icon</span> {/* Замените на иконку */}
                                <div>
                                    <div className="font-medium">Intake</div>
                                    <div>Anytime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Секция с основным контентом (после сдвига из-за карточки) */}
            <div className="pt-16 md:pt-24 mb-12"> {/* Добавлен отступ сверху */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Левая колонка */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">What does it mean to study at IU Online?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Study programme taught in English.</li>
                            <li>IU provides all of the study material digitally.</li>
                            <li>A mix of online tutorials and optional on-campus meetings (2-3 days per semester) in Germany.</li>
                            <li>{"Lots of online options to learn such as IU's online campus, podcasts, vodcasts, learning app IU Learn, and vodcasts."}</li>
                        </ul>
                    </div>
                    {/* Правая колонка */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Why IU?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Maximum flexibility: Adapt studying to your schedule (Full-time/Part-time, start when you want).</li>
                            <li>International environment [...] develop intercultural skills.</li>
                            <li>Explore extra study options in Germany (up to 20 hours job week while studying).</li>
                            <li>Gain practical experience [...] with case studies, project work & virtual labs.</li>
                            <li>Extensive online library [...] will provide high-quality academic resources & study script access.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Секция Академические требования */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-xl mb-12">
                <h2 className="text-2xl font-bold mb-6">Academic Requirements</h2>
                <div className="space-y-4 text-gray-700">
                    <div>
                        <h3 className="font-semibold mb-1">Degree Requirements:</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                            <li>Completed undergraduate degree from a publicly recognised university/higher education institution.</li>
                            <li>{`At least a "Satisfactory" or Grade C equivalent in your undergraduate study.`}</li>
                            <li>You will need to have achieved minimum of 210 ECTS credits to begin your 60 ECTS MBA [...]</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Work Experience:</h3>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                            <li>You will need to have at least one year of professional work experience before starting an MBA programme (achieved after previous studies).</li>
                            <li>For MBA programmes, you will also need to have completed a second year of professional work experience before graduating.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">English Level:</h3>
                        <p className="text-sm mb-2">
                            If you cannot meet the English level requirements, we offer the free-of-charge IU English language course. This is available to you if you meet the other admission requirements.
                            If English is your native language or you graduated from an English-speaking school/university, you do not have to prove your English skills.
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                            <li>TOEFL (min. 80 points) or</li>
                            <li>IELTS (min. Level 6.0) or</li>
                            <li>Duolingo English test (min. 95 points) or</li>
                            <li>Cambridge Certificate (min. B grade overall) or</li>
                            <li>PTE Academic (min. 59 points) or</li>
                            <li>Equivalent proof</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Секция Отзывы */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Feedback</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center mb-2">
                                {/* Placeholder for Stars */}
                                <div className="flex text-yellow-400 mr-2">
                                    {[...Array(review.stars)].map((_, i) => <span key={i}>★</span>)}
                                    {[...Array(5 - review.stars)].map((_, i) => <span key={i} className="text-gray-300">★</span>)}
                                </div>
                            </div>
                            <p className="text-sm text-gray-800 mb-2">{review.text}</p>
                            <p className="text-xs text-gray-500">{review.name} - {review.date}</p>
                        </div>
                    ))}
                </div>
            </div>

        </Wrapper>
    );
}