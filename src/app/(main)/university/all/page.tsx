"use client"
import Wrapper from "@/components/layout/Wrapper";
import UnivercityCard from "@/app/(main)/university/components/UnivercityCard";
import Image from "next/image";
import SideBarFilter from "@/app/(main)/university/components/SideBarFilter";

const courses = [
    {
        imageUrl: "https://example.com/image1.jpg",
        title: "MBA Health Care Management",
        description:
            "This Certificate in Health and Social Care is focused on two things. It provides a valuable introduction to learning in higher education and also provides an authoritative overview of...",
        duration: "2 years",
        studyMode: "Distance Learning",
        language: "English",
        type: "Full time",
    },
    {
        imageUrl: "https://example.com/image2.jpg",
        title: "MBA Business Administration",
        description:
            "This course focuses on leadership, business strategy, and entrepreneurship, preparing you for senior management positions in a variety of industries.",
        duration: "2 years",
        studyMode: "Full time",
        language: "English",
        type: "Full time",
    },
    {
        imageUrl: "https://example.com/image3.jpg",
        title: "MSc Data Science",
        description:
            "This master's program offers in-depth study of machine learning, artificial intelligence, and big data technologies.",
        duration: "1 year",
        studyMode: "Distance Learning",
        language: "English",
        type: "Part time",
    },
    // Добавьте еще 7 объектов с нужными данными...
];

export default function AllUniversityPage() {
    return (
        <Wrapper>
            <div className="flex flex-col w-full h-full py-12">
                <div className="w-full flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold">
                        Университеттер тізімі
                    </h2>
                    <div className="flex items-center gap-2">
                        <Image src={"/icon/refresh.svg"} alt={"time"} width={18} height={18} className="min-w-5"/>
                        <Image src={"/icon/actions.svg"} alt={"time"} width={16} height={16}/>
                        <div
                            className="flex items-center justify-center gap px-4 py-2 rounded-xl bg-[#2E79EA] text-white">
                            <Image src={"/icon/plus.svg"} alt={"time"} width={16} height={16}/>
                            Filter
                        </div>
                    </div>
                </div>
                <div className="flex gap-10 w-full">
                    <SideBarFilter/>
                    <div>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                            {courses.map((course, index) => (
                                <UnivercityCard
                                    key={index}
                                    imageUrl={course.imageUrl}
                                    title={course.title}
                                    description={course.description}
                                    duration={course.duration}
                                    studyMode={course.studyMode}
                                    language={course.language}
                                    type={course.type}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}