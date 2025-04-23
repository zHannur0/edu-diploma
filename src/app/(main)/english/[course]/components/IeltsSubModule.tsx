import React, { useState } from "react";
import { IeltsSubModule } from "@/types/Ielts";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation"; // Иконки

interface IeltsSubModuleProps extends IeltsSubModule {
    index: number;
}

const SectionIcon = ({ name, image }: { name: string, image: string }) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName === 'reading') return <Image src={image} alt={name} width={36} height={35}/>;
    if (lowerCaseName === 'listening') return <Image src={image} alt={name} width={36} height={35}/>;
    if (lowerCaseName === 'writing') return <Image src={image} alt={name} width={36} height={35}/>;
    if (lowerCaseName === 'speaking') return <Image src={image} alt={name} width={36} height={35}/>;
    return null;
};

const testSections = [
    {
        name: "Reading",
        image: "/icon/sections/reading.svg"
    },
    {
        name: "Listening",
        image: "/icon/sections/listening.svg"
    },
    {
        name: "Writing",
        image: "/icon/sections/writing.svg"
    },
    {
        name: "Speaking",
        image: "/icon/sections/speaking.svg"
    }
]

const IeltsSubModuleCard: React.FC<IeltsSubModuleProps> = ({index, tests, title }) => {
    const {course} = useParams();
    const [openSections, setOpenSections] = useState<boolean>(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
            <div
                className="w-full flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setOpenSections(!openSections)}
            >
                <p className="font-medium text-gray-700">
                    {index}. {title}
                </p>
                {openSections
                    ? <FaChevronUp className="text-gray-500" />
                    : <FaChevronDown className="text-gray-500" />
                }
            </div>

            {openSections && (
                <div className="px-4 pt-2 pb-4 border-t border-gray-200 bg-white">
                    {/*<p className="text-sm font-semibold text-gray-600 mb-3">Тесттер:</p>*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tests && tests.length > 0 ? (
                            tests.map((test) => (
                                <div key={test.id}>
                                    <p className="text-sm font-semibold text-gray-600 mb-3">{test.name}</p>
                                    {
                                        testSections.map((section, i) => (
                                            <Link key={test.id + 100001 + i}
                                                  href={`/english/${course}/ielts-test/${test.id}/${section.name.toLowerCase()}`}
                                                  className="flex items-center gap-3 px-2 rounded-md mb-3 transition-colors"
                                            >
                                                <SectionIcon name={section.name.toLowerCase()} image={section.image} />
                                                <span className="font-medium">{section.name}</span>
                                            </Link>
                                        ))
                                    }
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 col-span-2">Секции не найдены для этого подмодуля.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IeltsSubModuleCard;