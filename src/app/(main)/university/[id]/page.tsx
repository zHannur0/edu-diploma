"use client";

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useGetUniversityQuery } from "@/store/api/universityApi";
import { University } from "@/types/University"; // Типтерге жолды тексеріңіз
import Wrapper from "@/components/layout/Wrapper";
import {
    Globe,
    Clock,
    DollarSign,
    CalendarDays,
    BookOpen,
    Zap,
    GraduationCap,
    MapPin
} from 'lucide-react';

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-blue-600">{icon}</div>
        <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div> {/* Кіші әріппен жазуға болады */}
            <div className="font-medium text-sm">{value || '-'}</div>
        </div>
    </div>
);

// Тақырыбы бар мәтінді көрсетуге арналған компонент
const ContentSection: React.FC<{ title: string; content: string | null | undefined; className?: string }> = ({ title, content, className = "" }) => {
    if (!content) return null;
    return (
        <div className={className}>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: content }}>
                {/* Немесе қарапайым мәтін болса: <p className="text-gray-700 whitespace-pre-wrap">{content}</p> */}
            </div>
        </div>
    );
};


function ProgramDetailContent() {
    const params = useParams();
    const universityId = params?.id ? Number(params.id) : undefined;

    const { data: university, isLoading, isError } = useGetUniversityQuery(universityId!, {
        skip: universityId === undefined,
    });

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><p>Жүктелуде...</p></div>;
    }

    if (isError || !university) {
        return <div className="flex justify-center items-center min-h-[50vh]"><p>Мәліметтерді жүктеу мүмкін болмады немесе университет табылмады.</p></div>;
    }

    const formatDuration = (durationData: University['duration'] | null | undefined): string => {
        if (!durationData) return '-';
        // Қазақша жыл/ай атауларын қосуға болады
        return `${durationData.duration} ${durationData.prefix || ''}`.trim();
    }

    const formatArrayField = (items: Array<{ name: string }> | null | undefined): string => {
        if (!items || items.length === 0) return '-';
        return items.map(item => item.name).join(', ');
    }

    return (
        <>
            {/* Тақырып */}
            <div className="mb-2 text-sm text-gray-500">
                {university.location?.name || 'Университет атауы'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {university.name || 'Бағдарлама атауы'}
            </h1>
            <div className="mb-6 text-sm text-gray-600">
                <MapPin size={14} className="inline mr-1 mb-0.5" />
                {university.location?.name || 'Орналасқан жері көрсетілмеген'}
            </div>

            <div className={`relative w-full h-[350px] md:h-[450px] bg-cover bg-center bg-no-repeat rounded-2xl mb-12 md:mb-20 ${!university.image ? 'bg-gray-200' : ''}`}
                 style={{ backgroundImage: university.image ? `url(${university.image})` : 'none' }}>
                <div className="absolute bottom-[-40px] md:bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1000px] bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 md:gap-8">
                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Негізгі ақпарат</h3>
                            <p className="text-sm text-gray-700 mb-4 prose prose-sm max-w-none">
                                {university.key_summary || 'Негізгі ақпарат жоқ.'}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <DetailItem
                                icon={<Globe size={20} />}
                                label="Оқыту тілдері"
                                value={formatArrayField(university.languages)}
                            />
                            <DetailItem
                                icon={<Zap size={20} />}
                                label="Қарқын" // Немесе "Темп"
                                value={university.pace}
                            />
                            <DetailItem
                                icon={<DollarSign size={20} />}
                                label="Оқу ақысы"
                                value={university.tuition_fees}
                            />
                            <DetailItem
                                icon={<BookOpen size={20} />}
                                label="Оқу форматы"
                                value={formatArrayField(university.study_formats)}
                            />
                            <DetailItem
                                icon={<CalendarDays size={20} />}
                                label="Құжат қабылдау мерзімі"
                                value={university.application_deadline}
                            />
                            <DetailItem
                                icon={<Clock size={20} />}
                                label="Ұзақтығы"
                                value={formatDuration(university.duration)}
                            />
                            {university.degree_type && (
                                <DetailItem
                                    icon={<GraduationCap size={20} />}
                                    label="Дәреже түрі"
                                    value={university.degree_type.name}
                                />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 md:pt-24 space-y-12 mb-12">
                <ContentSection title="Кіріспе" content={university.introduction} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Мұнда оқу нені білдіреді?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                            {/* Бұл тізімдерді API-дан алуға болады немесе қазақшаға аудару керек */}
                            <li>Оқу бағдарламасы ағылшын тілінде оқытылады.</li>
                            <li>Барлық оқу материалдары цифрлық түрде ұсынылады.</li>
                            <li>Онлайн сабақтар мен Германиядағы кампустағы кездесулердің аралас түрі.</li>
                            <li>Оқуға арналған көптеген онлайн мүмкіндіктер: онлайн кампус, подкасттар, қолданбалар және т.б.</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Неге бұл бағдарламаны таңдау керек?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                            {/* Бұл тізімдерді API-дан алуға болады немесе қазақшаға аудару керек */}
                            <li>Максималды икемділік: оқуды кестеңізге бейімдеңіз.</li>
                            <li>Халықаралық орта және мәдениетаралық дағдыларды дамыту.</li>
                            <li>Қосымша оқу және жұмыс істеу мүмкіндіктерін зерттеңіз.</li>
                            <li>Кейс-стадилер мен жобалар арқылы практикалық тәжірибе алыңыз.</li>
                            <li>Кең ауқымды онлайн кітапхана және академиялық ресурстар.</li>
                        </ul>
                    </div>
                </div>


                {/* Академиялық талаптар */}
                {university.academic_requirements && (
                    <div className="bg-gray-50 p-6 md:p-8 rounded-xl">
                        <ContentSection title="Академиялық талаптар" content={university.academic_requirements} />
                    </div>
                )}

                {/* Стипендиялар және қаржыландыру */}
                {university.scholarships_funding && (
                    <div className="bg-blue-50 p-6 md:p-8 rounded-xl">
                        <ContentSection title="Стипендиялар және қаржыландыру" content={university.scholarships_funding} />
                    </div>
                )}

            </div>

            {/* Пікірлер бөлімі (қажет болса) */}
            {/*
             <div className="mb-12">
                 <h2 className="text-2xl font-bold mb-6">Пікірлер</h2>
                 ... (пікірлер коды) ...
             </div>
             */}
        </>
    );
}


export default function ProgramDetailPage() {
    return (
        <div className="w-full bg-[#EEF4FF] py-12 flex justify-center">
            <Wrapper>
                <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><p>Бет жүктелуде...</p></div>}>
                    <ProgramDetailContent />
                </Suspense>
            </Wrapper>
        </div>

    );
}